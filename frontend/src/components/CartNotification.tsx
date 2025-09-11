"use client";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CartNotification() {
  const { cartNotification } = useCart();
  const router = useRouter();

  if (!cartNotification) return null;

  return (
    <div className="fixed bottom-24 right-24 bg-black/80 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in flex flex-col items-center justify-center space-y-2 z-[9999]">
      <p className="text-sm">🛒 Item added to cart!</p>
      
      {/* Go to Cart Button */}
      <button
        onClick={() => router.push("/cart")}
        className="bg-pink-500 hover:bg-pink-700 px-4 py-2 rounded-md text-sm"
      >
        Go to Cart
      </button>
    </div>
  );
}