"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { safeFetch } from "@/utils/api";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface ProductListProps {
  embedded?: boolean; // if true, suppress own heading container
  limit?: number; // customizable limit
}

export default function ProductList({ embedded = false, limit = 3 }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    safeFetch(`/products`).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
      .then((data) => {
        if (Array.isArray(data.products)) {
          setProducts(data.products.slice(0, limit));
        } else {
          setError("Invalid response from server");
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [limit]);

  const grid = (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-6xl">
        {loading && !error && (
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="rounded-3xl h-72 bg-white/50 backdrop-blur-md border border-white/70 shadow-inner animate-pulse" />
          ))
        )}
        {error && !loading && (
          <p className="col-span-full text-center text-sm text-red-500">{error}</p>
        )}
        {!loading && !error && (
          products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="group relative rounded-3xl overflow-hidden bg-white/65 backdrop-blur-xl border border-white/80 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.25)] transition hover:shadow-[0_10px_26px_-6px_rgba(0,0,0,0.28)] hover:-translate-y-0.5">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.85),transparent_60%)]" />
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-[#222] dark:text-[#f3f3f7] text-sm">No products available</p>
          )
        )}
      </div>
    </div>
  );

  if (embedded) return grid;

  return (
    <section className="mt-16 text-center px-4">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-gradient-hotpink drop-shadow-sm">
        Featured Nails
      </h2>
      <p className="font-display text-sm mt-2 max-w-xl mx-auto text-on-pastel-soft dark:text-on-pastel-soft">
        Explore our trending designs – hand‑picked for you!
      </p>
      {grid}
      <div className="mt-8">
        <Link
          href="/shop"
          className="font-shuneva inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 text-white px-7 py-3 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition border border-pink-400/40"
        >
          View All Products <span className="text-xs">→</span>
        </Link>
      </div>
    </section>
  );
}