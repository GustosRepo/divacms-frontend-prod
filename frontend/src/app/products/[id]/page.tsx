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

    fetch(`http://localhost:3001/products/${id}`)
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
    <div className="container mx-auto px-6 py-10 pt-24 text-white">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Product Image with Hover Zoom */}
        <div className="relative group">
          <Image
            src={
              product.image.startsWith("http")
                ? product.image
                : `http://localhost:3001${product.image}`
            }
            alt={product.title}
            width={500}
            height={500}
            className="rounded-lg shadow-lg object-cover transition-transform duration-300 transform group-hover:scale-110"
          />
        </div>

        {/* Product Details */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-lg mt-2">{product.description}</p>
          <p className="text-2xl font-semibold text-pink-500 mt-4">${product.price.toFixed(2)}</p>

          {/* Product Features */}
          <ul className="mt-4 text-gray-300 text-sm space-y-2">
            <li>✅ Long-lasting wear</li>
            <li>✅ Reusable & easy to apply</li>
            <li>✅ Custom sizing available</li>
            <li>✅ Handmade with love 💖</li>
          </ul>

          {/* Quantity Selector */}
          <div className="flex items-center mt-6 space-x-3">
            <label className="text-lg">Quantity:</label>
            <select
              className="px-3 py-2 text-black rounded-lg bg-white shadow-md"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
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
            className="mt-6 bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition transform hover:scale-105"
            onClick={() => addToCart({ ...product, quantity })}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center">💖 Customer Reviews 💖</h2>
        <div className="mt-6 space-y-6">
          <div className="bg-black/20 p-4 rounded-lg shadow-lg">
            <p className="text-lg">"Absolutely love these nails! So easy to apply and lasted weeks!"</p>
            <p className="text-sm text-gray-400 mt-2">⭐⭐⭐⭐⭐ - Emily R.</p>
          </div>
          <div className="bg-black/20 p-4 rounded-lg shadow-lg">
            <p className="text-lg">"The quality is amazing! The cutest press-on nails ever!"</p>
            <p className="text-sm text-gray-400 mt-2">⭐⭐⭐⭐⭐ - Sophia L.</p>
          </div>
        </div>
      </div>
    </div>
  );
}