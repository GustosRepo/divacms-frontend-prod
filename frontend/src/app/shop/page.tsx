"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { safeFetch } from "@/utils/api";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  quantity: number;
  brand_segment?: string;
  brandSegment?: string;
  brand?: string;
  categorySlug?: string; // added
  category_slug?: string; // backend snake
}

interface BrandConfig {
  slug: string;
  name: string;
  tagline: string;
  gradient: string;
  accent: string; // text color
  chip: string;   // badge style
}

type ExtendedProduct = Product & { _brand?: string; _categorySlug?: string };

const brandConfigs: BrandConfig[] = [
  {
    slug: "nails",
    name: "Diva Factory Nails",
    tagline: "Luxury press-on artistry.",
    gradient: "from-pink-100 via-purple-200 to-blue-200",
    accent: "text-pink-600",
    chip: "bg-pink-500/10 text-pink-600 border-pink-400/40"
  },
  {
    slug: "toys",
    name: "Diva Factory Toys",
    tagline: "Curated designer & vinyl collectibles.",
    gradient: "from-indigo-100 via-sky-200 to-teal-200",
    accent: "text-teal-600",
    chip: "bg-teal-500/10 text-teal-600 border-teal-400/40"
  },
  {
    slug: "accessories",
    name: "Diva Factory Boutique",
    tagline: "Finish every look with statement pieces.",
    gradient: "from-amber-100 via-orange-200 to-rose-200",
    accent: "text-amber-600",
    chip: "bg-amber-500/10 text-amber-600 border-amber-400/40"
  }
];

export default function Shop() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeBrand = (searchParams?.get("brand_segment") || "").toLowerCase();
  const activeCategory = (searchParams?.get("category_slug") || searchParams?.get("category") || "").toLowerCase();
  const initialPage = Number(searchParams?.get("page")) || 1;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialSearch = (searchParams?.get("q") || "");
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<number | null>(null);
  const [brandCategories, setBrandCategories] = useState<{ id:string; name:string; slug?:string; brand_segment?:string }[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const prevBrandRef = useRef<string | null>(null);
  const prevCatRef = useRef<string | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);

  // Reset page to 1 whenever brand or category changes
  useEffect(() => {
    setPage(1);
  }, [activeBrand, activeCategory]);

  useEffect(() => {
    let cancelled = false;

    // If brand/category changed while on a non-first page, reset page first and skip this fetch
    const brandChanged = prevBrandRef.current !== activeBrand;
    const catChanged = prevCatRef.current !== activeCategory;
    if ((brandChanged || catChanged) && page !== 1) {
      prevBrandRef.current = activeBrand;
      prevCatRef.current = activeCategory;
      setPage(1);
      return; // skip fetch; next effect run will fetch page 1
    }

    // Update refs for next run
    prevBrandRef.current = activeBrand;
    prevCatRef.current = activeCategory;

    // Abort any in-flight request before starting a new one
    fetchAbortRef.current?.abort();
    const controller = new AbortController();
    fetchAbortRef.current = controller;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (activeBrand) params.set('brand_segment', activeBrand);
    if (activeCategory) params.set('category_slug', activeCategory);
    params.set('limit', '20');
    params.set('page', String(page));
    if (debouncedSearch) params.set('q', debouncedSearch); // ← add this

    safeFetch(`/products${params.toString() ? `?${params.toString()}` : ''}`, { signal: controller.signal })
      .then(data => {
        if (cancelled) return;

        // Normalize common API response shapes
        let items: Product[] = [];
        let computedTotalPages = 1;

        if (Array.isArray(data)) {
          items = data as Product[];
        } else if (data && Array.isArray(data.products)) {
          items = data.products as Product[];
        } else if (data && Array.isArray(data.items)) {
          items = data.items as Product[];
        } else if (data && Array.isArray(data.data)) {
          items = data.data as Product[];
        } else {
          throw new Error("Invalid response shape: expected array or { products|items|data: [] }");
        }

  const num = (v: unknown) => (v === undefined || v === null ? 0 : Number(v));
        const meta = (data && (data.meta || data.pagination)) || {};

        const topTotal = num(data?.total ?? data?.count ?? data?.totalItems ?? data?.totalCount);
        const topLimit = num(data?.limit ?? data?.pageSize ?? data?.perPage) || 20;

        const nestedTotal = num(meta?.total ?? meta?.count ?? meta?.totalItems ?? meta?.totalCount);
        const nestedLimit = num(meta?.limit ?? meta?.pageSize ?? meta?.perPage);

        const explicitTotalPages = num(data?.totalPages ?? meta?.totalPages);

        if (explicitTotalPages > 0) {
          computedTotalPages = explicitTotalPages;
        } else {
          const total = nestedTotal || topTotal;
          const limit = nestedLimit || topLimit || 20;
          if (total > 0 && limit > 0) {
            computedTotalPages = Math.max(1, Math.ceil(total / limit));
          } else {
            computedTotalPages = items.length === limit ? (page + 1) : 1;
          }
        }

        const countFromApi = num(data?.totalProducts ?? data?.total ?? data?.count ?? data?.totalItems ?? data?.totalCount ?? meta?.total ?? meta?.count ?? meta?.totalItems ?? meta?.totalCount);
        const perPage = (nestedLimit || topLimit || 20);

        setTotalCount(countFromApi > 0 ? countFromApi : (explicitTotalPages > 0 ? explicitTotalPages * perPage : 0));
        setPageSize(perPage);

        console.log("shop pagination", { page, computedTotalPages, items: items.length, countFromApi, perPage, data });
        setProducts(items);
        setTotalPages(computedTotalPages);
      })
      .catch(err => {
        if (cancelled) return;
  if ((err as Error)?.name === 'AbortError') return; // ignore aborts
        setError((err as Error).message);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [activeBrand, activeCategory, page, debouncedSearch]);
  // Sync page state with URL query string
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('page', String(page));
    // Preserve current brand/category in URL
    if (activeBrand) params.set('brand_segment', activeBrand);
    else params.delete('brand_segment');
    if (activeCategory) params.set('category_slug', activeCategory);
    else params.delete('category_slug');
    if (debouncedSearch) params.set('q', debouncedSearch);
    else params.delete('q');
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeBrand, activeCategory, debouncedSearch]);

  // Reset pagination to page 1 whenever the debounced search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);


  useEffect(() => {
    if (!activeBrand) { setBrandCategories([]); return; }
    let cancelled = false;
    safeFetch(`/categories?brand_segment=${activeBrand}`)
      .then(data => { 
        if (!cancelled && Array.isArray(data)) {
          setBrandCategories(data);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [activeBrand]);

  const brandMeta = useMemo(() => brandConfigs.find(b => b.slug === activeBrand), [activeBrand]);
  const normalizedProducts = useMemo(() => products.map(p => ({ ...p, _brand: (p.brandSegment || p.brand_segment || p.brand || '').toLowerCase(), _categorySlug: (p.categorySlug || p.category_slug || '').toLowerCase() })), [products]);
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => setDebouncedSearch(search), 250);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [search]);

  const visibleProducts = normalizedProducts.filter(p => {
    if (activeBrand && p._brand !== activeBrand) return false;
    if (activeCategory && p._categorySlug !== activeCategory) return false;
    const q = debouncedSearch.toLowerCase();
    if (!q) return true;
    const titleMatch = p.title?.toLowerCase().includes(q);
    const descMatch = (p.description || "").toLowerCase().includes(q);
    return titleMatch || descMatch;
  });
  const trendingProducts = useMemo<ExtendedProduct[]>(() => {
    if (activeBrand) return [] as ExtendedProduct[];
    const sorted = [...(normalizedProducts as ExtendedProduct[])].sort((a,b) => (b.quantity - a.quantity) || (b.price - a.price));
    return sorted.slice(0,8);
  }, [normalizedProducts, activeBrand]);

  return (
    <div className="pt-28 pb-16 space-y-16 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
      {/* Sparkle Animation */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-pulse-sparkle absolute top-32 left-1/4 w-8 h-8 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-60" />
        <div className="animate-pulse-sparkle absolute top-1/2 left-2/3 w-6 h-6 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-40" />
        <div className="animate-pulse-sparkle absolute bottom-20 right-1/4 w-10 h-10 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-50" />
        <div className="animate-pulse-sparkle absolute bottom-10 left-1/3 w-7 h-7 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-30" />
      </div>
      {/* Brand Hub Section */}
      <section className="space-y-6">
        <h1 className="font-shuneva text-3xl md:text-4xl font-extrabold tracking-tight text-heading text-center">
          {brandMeta ? brandMeta.name : 'Explore Our Brand Segments'}
        </h1>
        <p className="font-shuneva text-center text-black  max-w-2xl mx-auto">
          {brandMeta ? brandMeta.tagline : 'Choose a brand to enter a tailored shopping experience.'}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {brandConfigs.map(cfg => {
            const active = cfg.slug === activeBrand;
            return (
              <Link
                key={cfg.slug}
                href={`/shop?brand_segment=${cfg.slug}&page=1`}
                className={`relative rounded-2xl overflow-hidden p-6 bg-gradient-to-br ${cfg.gradient} shadow transition group ${active ? 'ring-2 ring-offset-2 ring-white/60' : 'hover:shadow-xl'}`}
              >
                <div className="relative z-10">
                  <h3 className={`font-shuneva text-xl font-bold ${cfg.accent.replace('text-', 'group-hover:text-')}`}>{cfg.name.replace('Diva Factory ', '')}</h3>
                  <p className="font-shuneva mt-2 text-sm text-gray-700 font-medium">{cfg.tagline}</p>
                  <span className={`font-shuneva mt-4 inline-block text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full border ${cfg.chip}`}>{active ? 'Selected' : 'Enter'}</span>
                </div>
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/30 rounded-full blur-2xl" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hub Trending Section (only when no brand chosen) */}
      {!activeBrand && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-shuneva text-2xl font-bold text-heading">Trending Across All Brands</h2>
          </div>
          {loading && <p className="font-shuneva text-fg/80">Loading trending...</p>}
          {error && <p className="font-shuneva text-red-400">{error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
            {!loading && !error && trendingProducts.length === 0 && <p className="font-shuneva text-gray-300 col-span-full">No products yet.</p>}
            {trendingProducts.map(p => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="group bg-white rounded-lg p-4 shadow hover:shadow-lg transition relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-white/40"
              >
                <div className="font-shuneva absolute top-2 left-2 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/70 text-white">{p._brand || 'brand'}</div>
                <Image src={p.image ? (p.image.startsWith('http') ? p.image : `${process.env.NEXT_PUBLIC_API_URL}${p.image}`) : '/placeholder.jpg'} alt={p.title} width={400} height={400} className="rounded-md object-cover" />
                <h3 className="font-shuneva mt-2 font-semibold text-sm text-gray-900 line-clamp-1">{p.title}</h3>
                <p className="font-shuneva text-pink-600 font-bold text-sm mt-1">${p.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Brand Product Listing (only when brand selected) */}
      {activeBrand && (
        <section className="-mt-8">
          <div className="flex flex-wrap gap-3 mt-16">
            <Link href={`/shop?brand_segment=${activeBrand}&page=1`} className={`px-3 py-1 rounded-full text-xs font-semibold border ${!activeCategory ? 'bg-white/20 text-white' : 'bg-black/20 text-white/70 hover:text-white'}`}>All</Link>
            {brandCategories.map(cat => {
              const slug = (cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'));
              const selected = activeCategory === slug;
              return (
                <Link key={cat.id} href={`/shop?brand_segment=${activeBrand}&category_slug=${slug}&page=1`} className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${selected ? 'bg-white/30 text-white border-white/60' : 'bg-black/20 text-white/70 hover:text-white'}`}>{cat.name}</Link>
              );
            })}
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-heading">
              {brandMeta ? `${brandMeta.name.split(' ').slice(-1)[0]} Products` : 'Products'}{activeCategory && ` • ${activeCategory}`}
            </h2>
            <div className="flex flex-wrap gap-3 items-center">
              {activeCategory && (
                <Link href={`/shop?brand_segment=${activeBrand}&page=1`} className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded">Clear Category</Link>
              )}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 text-black bg-white/90"
                placeholder="Search products..."
                aria-label="Search products"
              />
              <Link href="/shop" className="text-xs text-white/70 hover:text-white underline">Back to Hub</Link>
            </div>
          </div>
          {/* Results summary */}
          {(!loading && !error) && (
            <div className="mt-3 text-sm text-white/80">
              {totalCount > 0 ? (
                <span>
                  Showing {(page - 1) * pageSize + 1}
                  –{Math.min(totalCount, (page - 1) * pageSize + visibleProducts.length)} of {totalCount} items
                </span>
              ) : (
                <span>Showing {visibleProducts.length} items</span>
              )}
            </div>
          )}
          {loading && <p className="text-lg text-fg text-center mt-6">Loading products...</p>}
          {error && <p className="text-red-400 text-center mt-6">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {!loading && !error && visibleProducts.length === 0 && <p className="text-gray-300 text-center col-span-full">No products found</p>}
            {visibleProducts.map(product => (
              product.quantity > 0 ? (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white rounded-lg p-4 shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-white/40"
                >
                  <Image src={product.image ? (product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`) : '/placeholder.jpg'} alt={product.title} width={500} height={500} className="rounded-lg object-cover" />
                  <h3 className="font-bold mt-2 text-black text-center">{product.title}</h3>
                  <p className="text-gray-500 text-center text-sm line-clamp-2">{product.description}</p>
                  <p className="font-bold mt-1 text-pink-600 text-center">${product.price.toFixed(2)}</p>
                  <p className={`text-center mt-2 text-gray-700`}>Stock: {product.quantity}</p>
                  {((product as ExtendedProduct)._brand) && <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400 text-center">{(product as ExtendedProduct)._brand}</p>}
                </Link>
              ) : (
                <article key={product.id} aria-hidden="true" className="bg-white rounded-lg p-4 shadow-lg opacity-60 pointer-events-none">
                  <Image src={product.image ? (product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`) : '/placeholder.jpg'} alt={product.title} width={500} height={500} className="rounded-lg object-cover" />
                  <h3 className="font-bold mt-2 text-black text-center">{product.title}</h3>
                  <p className="text-gray-500 text-center text-sm line-clamp-2">{product.description}</p>
                  <p className="font-bold mt-1 text-pink-600 text-center">${product.price.toFixed(2)}</p>
                  <p className="text-center mt-2 text-red-500 font-bold">Out of Stock</p>
                </article>
              )
            ))}
          </div>
          {/* Pagination Controls */}
          {(totalPages > 1 || page > 1) && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <span className="text-sm text-gray-600 px-2">Page {page}{totalPages > 1 ? ` of ${totalPages}` : ''}</span>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  className={`px-3 py-1 rounded font-semibold ${pg === page ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setPage(pg)}
                  disabled={pg === page}
                  aria-current={pg === page ? 'page' : undefined}
                >
                  {pg}
                </button>
              ))}
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}
      </div>
    </div>
  );
}