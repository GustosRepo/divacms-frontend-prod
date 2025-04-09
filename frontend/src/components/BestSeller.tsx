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

export default function BestSellers() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/products/best-sellers")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.bestSellers)) {
          setBestSellers(data.bestSellers.slice(0, 1)); // ✅ Show only 1 Best-Seller
        } else {
          setError("Invalid response from server");
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="text-center mt-10">
      {/* 💖 Title - Centered */}
      <h2 className="text-3xl font-bold glitch text-white">
        💖 BEST-SELLING NAILS 💖
      </h2>
      <p className="text-gray-800 text-sm mt-2">
        Our most popular style - get yours before it sells out!
      </p>

      {/* ⏳ Loading State */}
      {loading && (
        <p className="text-lg  text-gray-900 tracking-widest animate-pulse mt-4">
          LOADING BEST SELLER...
        </p>
      )}

      {/* ❌ Error State */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* 🛍 Best-Selling Product (ONLY ONE) */}
      <div className="flex justify-center mt-6">
        <div className="max-w-md">
          {bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <div key={product.id} className="bg-white rounded-lg p-4 shadow-lg">
                <Image
                  src={
                    product.image.startsWith("http")
                      ? product.image
                      : `http://localhost:3001${product.image}`
                  }
                  alt={product.title}
                  width={400}
                  height={400}
                  className="rounded-lg object-cover"
                />
                <h3 className="font-bold mt-2">{product.title}</h3>
                <p className="text-gray-500">{product.description}</p>
                <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
              </div>
            ))
          ) : (
            !loading && <p className="text-gray-800">No best-seller available</p>
          )}
        </div>
      </div>
    </section>
  );
}