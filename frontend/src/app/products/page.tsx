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

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading product...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">Error: {error}</p>;
  if (!product) return <p className="text-red-500 text-center mt-6">PRODUCT NOT FOUND.</p>;

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-8 py-10 mt-28">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <Image
              src={product.image.startsWith("http") ? product.image : `${process.env.NEXT_PUBLIC_API_URL}${product.image}`}
              alt={product.title}
              width={400}
              height={400}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
              priority
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold break-words">{product.title}</h1>
          <p className="text-base md:text-lg mt-2 break-words">{product.description}</p>
          <p className="text-xl md:text-2xl font-semibold text-pink-500 mt-4">${product.price.toFixed(2)}</p>
          <div className="flex flex-col sm:flex-row items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-3">
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
          <button
            className="mt-6 bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition transform hover:scale-105 w-full sm:w-auto"
            onClick={() => addToCart({ ...product, quantity })}
            aria-label={`Add ${product.title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
      {cartNotification && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 animate-fade-in z-50">
          <span>🎉 Item added to cart!</span>
          <Link href="/cart">
            <button className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto">
              Go to Cart
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
