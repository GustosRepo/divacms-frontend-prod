"use client";
import { useState } from "react";

interface Order {
  orderId: string;
  status: string;
  totalAmount: number;
  trackingCode: string;
  estimatedDelivery?: string; // Optional if backend does not always return it
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null); // ✅ Fix: Ensure Type Safety
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    setError("");
    setOrder(null);

    if (!orderId || !email) {
      setError("Please enter both Order ID and Email.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/track?orderId=${orderId}&email=${email}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Order not found.");

      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-center text-pink-500">Track Your Order</h1>

      <div className="mt-6 bg-black/20 p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full p-2 mb-4 text-black rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 text-black rounded-lg"
        />
        <button
          onClick={handleTrackOrder}
          className="w-full bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md"
        >
          Track Order
        </button>
      </div>

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {order && (
        <div className="mt-6 bg-black/30 p-6 rounded-lg shadow-lg">
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
          <p><strong>Tracking Code:</strong> {order.trackingCode}</p>
          {order.estimatedDelivery && <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery}</p>}
        </div>
      )}
    </div>
  );
}