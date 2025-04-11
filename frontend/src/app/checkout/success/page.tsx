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
  
    if (sessionOrderId && !localStorage.getItem(`pointsFinalized-${sessionOrderId}`)) {
      setOrderId(sessionOrderId);
      toast.success("🎉 Order placed successfully!");
  
      // ⛔ Prevent double trigger immediately
      localStorage.setItem(`pointsFinalized-${sessionOrderId}`, "true");
  
      const finalizePoints = async () => {
        try {
          const response = await fetch("http://localhost:3001/checkout/finalize-points", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId: sessionOrderId }),
          });
  
          const result = await response.json();
          if (response.ok) {
            console.log("🟢 Points finalized:", result);
          } else {
            console.error("⚠️ Failed to finalize points:", result.message);
          }
        } catch (err) {
          console.error("❌ Error finalizing points:", err);
        }
      };
  
      finalizePoints();
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