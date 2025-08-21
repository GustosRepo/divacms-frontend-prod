"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

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
    name: "Diva Factory Accessories",
    tagline: "Finish every look with statement pieces.",
    gradient: "from-amber-100 via-orange-200 to-rose-200",
    accent: "text-amber-600",
    chip: "bg-amber-500/10 text-amber-600 border-amber-400/40"
  }
];

export default function Shop() {
  const searchParams = useSearchParams();
  const activeBrand = (searchParams?.get("brand_segment") || "").toLowerCase();
  // Accept both ?category_slug= and legacy ?category=
  const activeCategory = (searchParams?.get("category_slug") || searchParams?.get("category") || "").toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [brandCategories, setBrandCategories] = useState<{ id:string; name:string; slug?:string; brand_segment?:string }[]>([]);

  // Fetch products (refetch when brand/category changes so backend filters early)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (activeBrand) params.set('brand_segment', activeBrand);
    if (activeCategory) params.set('category_slug', activeCategory); // switched to category_slug
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products${params.toString() ? `?${params.toString()}` : ''}`)
      .then(async (res) => { if (!res.ok) throw new Error(`HTTP error ${res.status}`); return res.json(); })
      .then(data => { if (cancelled) return; if (data && Array.isArray(data.products)) setProducts(data.products); else throw new Error("Invalid response shape"); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeBrand, activeCategory]);

  // Fetch categories for active brand
  useEffect(() => {
    if (!activeBrand) { setBrandCategories([]); return; }
    let cancelled = false;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?brand_segment=${activeBrand}`)
      .then(r=>r.json())
      .then(data=>{ if(!cancelled && Array.isArray(data)) setBrandCategories(data); })
      .catch(()=>{});
    return ()=>{ cancelled=true; };
  }, [activeBrand]);

  // Derive brand meta
  const brandMeta = useMemo(() => brandConfigs.find(b => b.slug === activeBrand), [activeBrand]);

  // Normalize product brand
  const normalizedProducts = useMemo(() => products.map(p => ({ ...p, _brand: (p.brandSegment || p.brand_segment || p.brand || '').toLowerCase(), _categorySlug: (p.categorySlug || p.category_slug || '').toLowerCase() })), [products]);

  // Apply brand + category + search filter (brand/category already filtered at backend but keep safeguard)
  const visibleProducts = normalizedProducts.filter(p => {
    if (activeBrand && p._brand !== activeBrand) return false;
    if (activeCategory && p._categorySlug !== activeCategory) return false;
    return p.title.toLowerCase().includes(search.toLowerCase());
  });

  // Trending (hub view only): pick top 8 by (quantity desc then price desc)
  const trendingProducts = useMemo(() => {
    if (activeBrand) return [] as any[];
    const sorted = [...normalizedProducts].sort((a,b) => (b.quantity - a.quantity) || (b.price - a.price));
    return sorted.slice(0,8);
  }, [normalizedProducts, activeBrand]);

  return (
    <div className="pt-28 pb-16 space-y-16">
      {/* Brand Hub Section */}
      <section className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white text-center">
          {brandMeta ? brandMeta.name : 'Explore Our Brand Segments'}
        </h1>
        <p className="text-center text-white/80 max-w-2xl mx-auto">
          {brandMeta ? brandMeta.tagline : 'Choose a brand to enter a tailored shopping experience.'}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {brandConfigs.map(cfg => {
            const active = cfg.slug === activeBrand;
            return (
              <Link
                key={cfg.slug}
                href={`/shop${active ? '' : `?brand_segment=${cfg.slug}`}`}
                className={`relative rounded-2xl overflow-hidden p-6 bg-gradient-to-br ${cfg.gradient} shadow transition group ${active ? 'ring-2 ring-offset-2 ring-white/60' : 'hover:shadow-xl'}`}
              >
                <div className="relative z-10">
                  <h3 className={`text-xl font-bold ${cfg.accent.replace('text-', 'group-hover:text-')}`}>{cfg.name.replace('Diva Factory ', '')}</h3>
                  <p className="mt-2 text-sm text-gray-700 font-medium">{cfg.tagline}</p>
                  <span className={`mt-4 inline-block text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full border ${cfg.chip}`}>{active ? 'Selected' : 'Enter'}</span>
                </div>
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/30 rounded-full blur-2xl" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hub Trending Section (only when no brand chosen) */}
      {!activeBrand && (
        <section className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Trending Across All Brands</h2>
            <span className="text-xs text-white/50">Auto-sampled</span>
          </div>
          {loading && <p className="text-white/80">Loading trending...</p>}
          {error && <p className="text-red-400">{error}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
            {!loading && !error && trendingProducts.length === 0 && <p className="text-gray-300 col-span-full">No products yet.</p>}
            {trendingProducts.map(p => (
              <div key={p.id} className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition relative">
                <div className="absolute top-2 left-2 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/70 text-white">{p._brand || 'brand'}</div>
                <Link href={`/products/${p.id}`}>
                  <Image src={p.image ? (p.image.startsWith('http') ? p.image : `${process.env.NEXT_PUBLIC_API_URL}${p.image}`) : '/placeholder.jpg'} alt={p.title} width={400} height={400} className="rounded-md object-cover" />
                </Link>
                <h3 className="mt-2 font-semibold text-sm text-gray-900 line-clamp-1">{p.title}</h3>
                <p className="text-pink-600 font-bold text-sm mt-1">${p.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Brand Product Listing (only when brand selected) */}
      {activeBrand && (
        <section className="container mx-auto px-4 md:px-6 -mt-8">
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href={`/shop?brand_segment=${activeBrand}`} className={`px-3 py-1 rounded-full text-xs font-semibold border ${!activeCategory ? 'bg-white/20 text-white' : 'bg-black/20 text-white/70 hover:text-white'}`}>All</Link>
            {brandCategories.map(cat => {
              const slug = (cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'));
              const selected = activeCategory === slug;
              return (
                <Link key={cat.id} href={`/shop?brand_segment=${activeBrand}&category_slug=${slug}`} className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${selected ? 'bg-white/30 text-white border-white/60' : 'bg-black/20 text-white/70 hover:text-white'}`}>{cat.name}</Link>
              );
            })}
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-white">
              {brandMeta ? `${brandMeta.name.split(' ').slice(-1)[0]} Products` : 'Products'}{activeCategory && ` • ${activeCategory}`}
            </h2>
            <div className="flex flex-wrap gap-3 items-center">
              {activeCategory && (
                <Link href={`/shop?brand_segment=${activeBrand}`} className="text-xs bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded">Clear Category</Link>
              )}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 text-black bg-white/90"
                placeholder="Search products..."
              />
              <Link href="/shop" className="text-xs text-white/70 hover:text-white underline">Back to Hub</Link>
            </div>
          </div>
          {loading && <p className="text-lg text-white text-center mt-6">Loading products...</p>}
          {error && <p className="text-red-400 text-center mt-6">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
            {!loading && !error && visibleProducts.length === 0 && <p className="text-gray-300 text-center col-span-full">No products found</p>}
            {visibleProducts.map(product => (
              <div key={product.id} className={`bg-white rounded-lg p-4 shadow-lg transition-transform ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}>
                {product.quantity > 0 ? (
                  <Link href={`/products/${product.id}`}>
                    <Image src={product.image ? (product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`) : '/placeholder.jpg'} alt={product.title} width={500} height={500} className="rounded-lg object-cover" />
                  </Link>
                ) : (
                  <Image src={product.image ? (product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`) : '/placeholder.jpg'} alt={product.title} width={500} height={500} className="rounded-lg object-cover" />
                )}
                <h3 className="font-bold mt-2 text-black text-center">{product.title}</h3>
                <p className="text-gray-500 text-center text-sm line-clamp-2">{product.description}</p>
                <p className="font-bold mt-1 text-pink-600 text-center">${product.price.toFixed(2)}</p>
                <p className={`text-center mt-2 ${product.quantity > 0 ? 'text-gray-700' : 'text-red-500 font-bold'}`}>{product.quantity > 0 ? `Stock: ${product.quantity}` : 'Out of Stock'}</p>
                {(product as any)._brand && <p className="mt-2 text-[11px] uppercase tracking-wide text-gray-400 text-center">{(product as any)._brand}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}