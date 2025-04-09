"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const sessionOrderId = searchParams.get("session_id");
    if (sessionOrderId) {
      setOrderId(sessionOrderId);
      toast.success("🎉 Order placed successfully!");
    }
  }, [searchParams]);

  const handleGoHome = () => router.push("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg w-[500px]">
        <h1 className="text-3xl font-bold text-green-400">🎉 Thank you for your purchase!</h1>
        <p className="mt-4">Your order has been successfully placed.</p>

        {orderId && (
          <p className="mt-2 text-gray-400">
            Order Reference: <strong>{orderId}</strong>
          </p>
        )}

        <button
          onClick={handleGoHome}
          className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg"
        >
          Continue Shopping 💅
        </button>
      </div>
    </div>
  );
}