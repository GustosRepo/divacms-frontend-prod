"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
};

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, cartNotification } = useCart();
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
    <div className="container mx-auto px-6 py-10 text-white">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <Image
          src={product.image.startsWith("http") ? product.image : `http://localhost:3001${product.image}`}
          alt={product.title}
          width={500}
          height={500}
          className="rounded-lg shadow-lg object-cover"
        />

        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold">{product.title}</h1>
          <p className="text-lg mt-2">{product.description}</p>
          <p className="text-2xl font-semibold text-pink-500 mt-4">${product.price.toFixed(2)}</p>

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

      {/* ✅ Pop-up Notification */}
      {cartNotification && (
        <div className="fixed bottom-10 right-10 bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4 animate-fade-in">
          <span>🎉 Item added to cart!</span>
          <Link href="/cart">
            <button className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm">
              Go to Cart
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}