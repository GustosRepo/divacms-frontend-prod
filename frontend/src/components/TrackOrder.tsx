"use client";
import { useState } from "react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<{ orderId: string; status: string; trackingCode: string } | null>(null);

  const trackOrder = async () => {
    try {
      const q = new URLSearchParams({ orderId, email }).toString();
      const res = await fetch(`/api/proxy/orders/track?${q}`, { credentials: 'include' });
      if (!res.ok) return alert("Order not found.");
      setOrder(await res.json());
    } catch (err) {
      console.error("Track order failed:", err);
      alert("Order not found.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-pink-500">Track Your Order</h2>
      <input
        type="text"
        placeholder="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="p-2 mt-2 text-black rounded-lg w-full"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 mt-2 text-black rounded-lg w-full"
      />
      <button
        onClick={trackOrder}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md w-full"
      >
        Track Order
      </button>

      {order && (
        <div className="mt-4 p-4 bg-black/20 rounded-lg">
          <p>Order ID: {order.orderId}</p>
          <p>Status: {order.status}</p>
          <p>Tracking: {order.trackingCode}</p>
        </div>
      )}
    </div>
  );
}