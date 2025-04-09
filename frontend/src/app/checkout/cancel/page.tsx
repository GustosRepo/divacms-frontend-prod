"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Payment was canceled. No charges were made.");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg w-[500px]">
        <h1 className="text-3xl font-bold text-red-400">❌ Payment Canceled</h1>
        <p className="mt-4">Your payment was canceled. No charges were made.</p>

        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() => router.push("/checkout")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg"
          >
            Return to Checkout 🛒
          </button>

          <button
            onClick={() => router.push("/shop")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Continue Shopping 🛍️
          </button>
        </div>
      </div>
    </div>
  );
}