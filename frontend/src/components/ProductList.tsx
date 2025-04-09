"use client";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.products)) {
          setProducts(data.products.slice(0, 3)); // ✅ Limit to 3 featured products
        } else {
          setError("Invalid response from server");
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mt-12 text-center">
      {/* 💖 Header */}
      <h2 className="text-3xl font-bold glitch text-white">✨ FEATURED NAILS ✨</h2>
      <p className="text-gray-800 text-sm mt-2">
        Explore our trending designs - handpicked for you!
      </p>

      {/* ⏳ Loading & Error States */}
      {loading && <p className="text-lg text-white tracking-widest animate-pulse mt-4">AND LOADING...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* 🛍 Product Grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full max-w-6xl">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            !loading && <p className="text-gray-400">No products available</p>
          )}
        </div>
      </div>

      {/* 🔗 View All Products Button */}
      <div className="mt-6">
        <a
          href="/shop"
          className="bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition transform hover:scale-105"
        >
          View All Products
        </a>
      </div>
    </section>
  );
}