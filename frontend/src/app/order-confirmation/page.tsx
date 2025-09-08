"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";


export default function OrderConfirmation() {
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [discountApplied, setDiscountApplied] = useState<string | null>(null);
  const [pointsUsed, setPointsUsed] = useState<number | null>(null);

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("latestOrder") || "{}");

    if (storedOrder?.orderId) {
      setOrderId(storedOrder.orderId);
      setTrackingCode(storedOrder.trackingCode || "Processing");
      setDiscountApplied(storedOrder.discountApplied || "0.00");
      setPointsUsed(storedOrder.pointsUsed || 0);
    } else {
      setOrderId(`#DIVA-${Math.floor(Math.random() * 1000000)}`);
    }

    if (!localStorage.getItem("orderCleared")) {
      clearCart();
      localStorage.setItem("orderCleared", "true");
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("latestOrder");
      localStorage.removeItem("orderCleared");
    }, 600000);

    return () => clearTimeout(timer);
  }, [clearCart]);

  return (
    <div className="container mx-auto pt-24 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-pink-500">🎉 THANK YOU FOR YOUR ORDER! 🎉</h1>
      <p className="mt-4 text-lg">
        Your order <span className="font-semibold">#{orderId}</span> has been successfully placed.
      </p>
      <p className="mt-2">
        <strong>Tracking Code:</strong> {trackingCode}
      </p>
      <p className="mt-2">
        <strong>Points Used:</strong> {pointsUsed} 
      </p>
      <p className="mt-2">
        <strong>Discount Applied:</strong> ${discountApplied}
      </p>
      <p className="mt-2">You will receive a confirmation email shortly with your order details</p>
      <p className="mt-2 text-sm text-gray-300">
        Estimated Delivery: <span className="font-semibold">5-7 Business Days</span>
      </p>

      <Link href="/shop">
        <button className="mt-6 bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition transform hover:scale-105">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}
