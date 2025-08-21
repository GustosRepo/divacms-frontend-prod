"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "../../../context/CartContext"; // Import Cart Context

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  brandSegment?: string;
  brand_segment?: string;
  categorySlug?: string;
  category_slug?: string;
};

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart(); // Use Cart Context
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-white text-center mt-6">Loading product...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">Error: {error}</p>;
  if (!product) return <p className="text-red-500 text-center mt-6">PRODUCT NOT FOUND.</p>;

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-8 py-10 pt-28 text-white">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Product Image with Hover Zoom */}
        <div className="relative group w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square flex items-center justify-center bg-gray-100 overflow-hidden">
          {(() => {
            const imgSrc = product.image
              ? (product.image.startsWith("http")
                  ? product.image
                  : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`)
              : "/placeholder.jpg"; // fallback
            return (
              <Image
                src={imgSrc}
                alt={product.title}
                width={400}
                height={400}
                className="rounded-lg shadow-lg object-cover w-full h-full transition-transform duration-300 transform group-hover:scale-110"
                priority
              />
            );
          })()}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 text-center md:text-left px-2">
          <h1 className="text-3xl md:text-4xl font-bold break-words">{product.title}</h1>
          {(product.brandSegment || product.brand_segment) && (
            <p className="mt-2 text-sm uppercase tracking-wide text-pink-300">Brand: {(product.brandSegment || product.brand_segment)}</p>
          )}
          {(product.categorySlug || product.category_slug) && (
            <p className="text-xs text-white/60 mt-1">Category: {(product.categorySlug || product.category_slug)}</p>
          )}
          <p className="text-base md:text-lg mt-2 break-words">{product.description}</p>
          <p className="text-xl md:text-2xl font-semibold text-pink-500 mt-4">${product.price.toFixed(2)}</p>

          {/* Product Features */}
          <ul className="mt-4 text-gray-300 text-sm space-y-2">
            <li>✅ Long-lasting wear</li>
            <li>✅ Reusable & easy to apply</li>
            <li>✅ Custom sizing available</li>
            <li>✅ Handmade with love 💖</li>
          </ul>

          {/* Quantity Selector */}
          <div className="flex flex-col sm:flex-row items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-3">
            <label className="text-lg">Quantity:</label>
            <select
              className="px-3 py-2 text-black rounded-lg bg-white shadow-md"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              aria-label="Select quantity"
            >
              {[...Array(10).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Add to Cart Button */}
          <button
            className="mt-6 bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition transform hover:scale-105 w-full sm:w-auto"
            onClick={() => addToCart({ ...product, quantity })}
            aria-label={`Add ${product.title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center">💖 Customer Reviews 💖</h2>
        <div className="mt-6 flex flex-col gap-6">
          <div className="bg-black/20 p-4 rounded-lg shadow-lg">
            <p className="text-lg">&quot;Absolutely love these nails! So easy to apply and lasted weeks!&quot;</p>
            <p className="text-sm text-gray-400 mt-2">⭐⭐⭐⭐⭐ - Emily R.</p>
          </div>
          <div className="bg-black/20 p-4 rounded-lg shadow-lg">
            <p className="text-lg">&quot;The quality is amazing! The cutest press-on nails ever!&quot;</p>
            <p className="text-sm text-gray-400 mt-2">⭐⭐⭐⭐⭐ - Sophia L.</p>
          </div>
        </div>
      </div>
    </div>
  );
}