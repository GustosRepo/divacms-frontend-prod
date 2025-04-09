"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string; // ✅ Image is optional
  quantity: number;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("📡 Fetching products from API...");
    fetch("http://localhost:3001/products")
      .then(async (res) => {
        console.log("🔍 API Response Status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        return res.json();
      })
      .then((data) => {
        console.log("✅ API Response Data:", data);

        if (data && Array.isArray(data.products)) {
          setProducts(data.products); // ✅ Corrected API response structure
        } else {
          throw new Error("Invalid response from server");
        }
      })
      .catch((error) => {
        console.error("❌ Fetch Error:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-16">
      <section className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-white text-center">
          Shop Our Nails 💅
        </h2>

        {/* 🔍 Search Bar */}
        <div className="flex justify-center mt-6">
          <input
            type="text"
            placeholder="Search nails..."
            className="px-4 py-2 rounded-lg text-black shadow-md w-full max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <p className="text-lg text-white text-center mt-4">Loading products...</p>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* 🛒 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`bg-white rounded-lg p-4 shadow-lg transition-transform ${
                  product.quantity === 0 ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                {/* 🔗 Disable click if out of stock */}
                {product.quantity > 0 ? (
                  <Link href={`/products/${product.id}`}>
                    <Image
                      src={
                        product.image
                          ? product.image.startsWith("http")
                            ? product.image
                            : `http://localhost:3001${product.image}`
                          : "/placeholder.jpg" // ✅ Fallback image
                      }
                      alt={product.title}
                      width={500}
                      height={500}
                      className="rounded-lg object-cover"
                    />
                  </Link>
                ) : (
                  <Image
                    src={
                      product.image
                        ? product.image.startsWith("http")
                          ? product.image
                          : `http://localhost:3001${product.image}`
                        : "/placeholder.jpg" // ✅ Fallback image
                    }
                    alt={product.title}
                    width={500}
                    height={500}
                    className="rounded-lg object-cover"
                  />
                )}

                {/* 🏷️ Product Details */}
                <h3 className="font-bold mt-2 text-black text-center">{product.title}</h3>
                <p className="text-gray-500 text-center">{product.description}</p>
                <p className="font-bold mt-1 text-pink-600 text-center">
                  ${product.price.toFixed(2)}
                </p>

                {/* 🔥 Stock Display */}
                <p
                  className={`text-center mt-2 ${
                    product.quantity > 0 ? "text-gray-700" : "text-red-500 font-bold"
                  }`}
                >
                  {product.quantity > 0 ? `Stock: ${product.quantity}` : "Out of Stock"}
                </p>
              </div>
            ))
          ) : (
            !loading && <p className="text-gray-400 text-center col-span-full">No products found</p>
          )}
        </div>
      </section>
    </div>
  );
}