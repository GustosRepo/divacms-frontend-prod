"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface BestSellersProps {
  embedded?: boolean; // when true, omit outer section & heading (parent provides container/heading)
  limit?: number; // allow overriding number of items shown
}

export default function BestSellers({ embedded = false, limit = 1 }: BestSellersProps) {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await (await fetch(`/api/proxy/products/best-sellers`, { credentials: 'include' })).json();
        // Accept both { bestSellers: [...] } and direct array response
        if (Array.isArray(data)) {
          setBestSellers(data.slice(0, limit));
        } else if (Array.isArray(data.bestSellers)) {
          setBestSellers(data.bestSellers.slice(0, limit));
        } else {
          setError("No best-seller data found");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  const content = (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md">
        {/* Loading skeleton */}
        {loading && (
          <div className="animate-pulse grid gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="rounded-2xl h-72 bg-white/40 backdrop-blur-md border border-white/60 shadow-inner" />
            ))}
          </div>
        )}
        {error && !loading && (
          <p className="text-sm text-red-500 text-center mt-2">{error}</p>
        )}
        {!loading && !error && (
          bestSellers.length > 0 ? (
            <div className="grid gap-6">
              {bestSellers.map((product) => {
                let imgSrc;
                if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
                  imgSrc = product.image.startsWith('http')
                    ? product.image
                    : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`;
                } else {
                  imgSrc = '/placeholder.jpg';
                }
                return (
                  <div
                    key={product.id}
                    className="group relative rounded-3xl p-4 sm:p-5 bg-white/65 backdrop-blur-xl border border-white/80 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)] overflow-hidden transition hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.3)]"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.85),transparent_60%)]" />
                    <div className="relative flex flex-col md:flex-row gap-4 md:gap-6 items-center">
                      <div className="rounded-2xl overflow-hidden w-full md:w-1/2 aspect-[4/3] bg-gradient-to-br from-pink-100 via-rose-100 to-fuchsia-100 border border-pink-200 shadow-inner surface-card">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={product.title}
                            width={600}
                            height={450}
                            className="w-full h-full object-cover object-center mix-blend-normal"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-pink-400 text-sm">No Image</div>
                        )}
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="font-shuneva text-lg font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600">
                          {product.title}
                        </h3>
                        <p className="font-shuneva mt-2 text-xs sm:text-sm  line-clamp-4">{product.description}</p>
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                          <span className="font-shuneva inline-flex items-center justify-center px-4 py-2 rounded-full bg-pink-200/70 text-pink-800 text-sm font-semibold border border-pink-300 shadow-sm">
                            ${product.price.toFixed(2)}
                          </span>
                          <a
                            href={`/products/${product.id}`}
                            className="font-shuneva inline-flex justify-center px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-sm font-semibold shadow hover:shadow-lg transition border border-pink-400/50"
                          >
                            View Product
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[#222] dark:text-[#f3f3f7] text-sm text-center">No best-seller available</p>
          )
        )}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <section className="mt-16 pb-2 text-center px-4">
      <div className="relative rounded-3xl dark:bg-white/10 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] p-6 sm:p-10 max-w-2xl mx-auto overflow-hidden transition-colors">
        <h2 className="font-shuneva text-3xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 drop-shadow-sm">
          Best‑Selling Nails
        </h2>
        <p className="font-shuneva dark:text-pink-200 text-sm mt-2 max-w-xl mx-auto bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-600 drop-shadow-sm">
          Our most loved style – grab it before it sells out!
        </p>
        <div className="mt-8">{content}</div>
      </div>
    </section>
  );
}