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
        <div className="w-full md:w-1/2 px-2">
          <div className="bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/10 rounded-xl p-6 shadow-xl backdrop-blur-md">
            <h1 className="font-shuneva text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-lg break-words">
              {product.title}
            </h1>

            {(product.brandSegment || product.brand_segment) && (
              <p className="font-shuneva mt-3 text-sm uppercase tracking-wide text-pink-200 drop-shadow-sm">
          Brand: <span className="font-bold text-pink-300">{product.brandSegment || product.brand_segment}</span>
              </p>
            )}

            {(product.categorySlug || product.category_slug) && (
              <p className="font-shuneva text-sm text-fuchsia-200 mt-1 drop-shadow-sm">
          Category: <span className="font-bold text-fuchsia-300">{product.categorySlug || product.category_slug}</span>
              </p>
            )}

            <p className="font-shuneva text-base md:text-lg mt-4 leading-relaxed text-white/90 drop-shadow-sm break-words">
              {product.description}
            </p>

            <p className="font-shuneva text-2xl md:text-3xl font-semibold text-rose-400 mt-6 drop-shadow-md">
              ${product.price.toFixed(2)}
            </p>

            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-3">
              <label className="font-shuneva text-lg text-white">Quantity:</label>
              <select
          className="px-3 py-2 text-black rounded-lg bg-white shadow-md font-shuneva"
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
              className="font-shuneva mt-6 bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition transform hover:scale-105 w-full sm:w-auto drop-shadow-lg"
              onClick={() => addToCart({ ...product, quantity })}
              aria-label={`Add ${product.title} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {/*
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
      */}
    </div>
  );
}