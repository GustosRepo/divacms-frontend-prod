"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  trackingCode: string;
}


export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
  
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;
  
    try {
      const res = await fetch(`http://localhost:3001/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error("Failed to cancel order.");
      }
  
      alert("✅ Order has been canceled.");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Canceled" } : order
        )
      );
    } catch (error) {
      console.error("❌ Error canceling order:", error);
      alert("❌ Unable to cancel order.");
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3001/orders/my-orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return <p className="text-center text-white">Please log in to view your orders.</p>;
  }

  if (loading) return <p className="text-center text-white">Loading your orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-center">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 mt-4">You have no orders yet.</p>
      ) : (
<div className="mt-6 space-y-6">
  {orders.map((order) => (
    <div key={order.id} className="bg-black/20 p-6 rounded-lg shadow-lg">
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
      <p><strong>Tracking:</strong> {order.trackingCode}</p>

      {order.status === "Pending" && (
        <button
          onClick={() => handleCancelOrder(order.id)}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Cancel Order
        </button>
      )}
    </div>
  ))}
</div>
      )}
    </div>
  );
}