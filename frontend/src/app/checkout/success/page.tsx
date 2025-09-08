"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const pickup = useMemo(() => searchParams.get("pickup") === "1", [searchParams]);
  const expQuery = useMemo(() => searchParams.get("exp"), [searchParams]);
  const localOrder = useMemo(() => {
    try {
      const raw = localStorage.getItem("latestPickupOrder");
      return raw ? JSON.parse(raw) as { orderId:string; expiresAt?: number } : null;
    } catch { return null; }
  }, [pickup]);

  useEffect(() => {
    const sessionOrderId = searchParams.get("session_id");

    if (pickup) {
      // Local pickup flow: read orderId from query or local storage and show toast
      const oid = searchParams.get("order_id") || localOrder?.orderId || null;
      setOrderId(oid);
      toast.success("🎉 Pickup order reserved — we’ll hold your order until pickup");
      // Persist orderId locally for reference (no expiry)
      if (oid) {
        try {
          localStorage.setItem("latestPickupOrder", JSON.stringify({ orderId: oid }));
        } catch {}
      }
      return;
    }

    if (sessionOrderId && !localStorage.getItem(`pointsFinalized-${sessionOrderId}`)) {
      setOrderId(sessionOrderId);
      toast.success("🎉 Order placed successfully!");

      // ⛔ Prevent double trigger immediately
      localStorage.setItem(`pointsFinalized-${sessionOrderId}`, "true");

      const finalizePoints = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/finalize-points`, {
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
  }, [searchParams, pickup, localOrder]);

  const handleGoHome = () => router.push("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg w-[500px]">
        <h1 className="text-3xl font-bold text-green-400">🎉 {pickup ? "Pickup Order Reserved" : "Thank you for your purchase!"}</h1>
        <p className="mt-4">{pickup ? "We’ll hold your items." : "Your order has been successfully placed."}</p>

        {orderId && (
          <p className="mt-2 text-gray-400 break-words">
            Order Reference: <strong className="break-all">{orderId}</strong>
          </p>
        )}

  {/* We no longer show an expiry for pickup orders; we hold until pickup */}

        {pickup && (
          <div className="mt-4 text-sm bg-white/10 border border-white/20 rounded-lg p-4 text-left">
            <p><strong>Pickup hours:</strong> 10:00 AM – 6:00 PM</p>
            <p className="mt-1">To coordinate pickup location and time, DM us or email <a href="mailto:admin@thedivafactory.com" className="underline">admin@thedivafactory.com</a>.</p>
            <p className="mt-1">You can also reach us via our <Link href="/contact" className="underline">contact page</Link>.</p>
          </div>
        )}

        {/* Proof upload moved to checkout form for Local Pickup */}

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
