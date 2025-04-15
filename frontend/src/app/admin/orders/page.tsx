"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  trackingCode: string;
}

export default function ManageOrders() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/dashboard");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/orders/admin/orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch orders.");
        const data = await res.json();

        setOrders(data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

  if (loading)
    return <p className="text-center text-white">Loading orders...</p>;

  // 🔹 Handle Order Status Update with Tracking Number
  async function handleStatusChange(orderId: string, newStatus: string) {
    let trackingCode = "";

    // 🚨 If order is already shipped or delivered, prevent cancellation
    const order = orders.find((order) => order.id === orderId);
    if (newStatus === "Canceled" && order?.status !== "Pending") {
      setMessage("❌ You can only cancel orders that are still Pending.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // ✅ If "Shipped", prompt for a tracking number
    if (newStatus === "Shipped") {
      trackingCode = prompt("Enter Tracking Number:") || "";
    }

    try {
      const endpoint =
        newStatus === "Canceled"
          ? `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`
          : `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/orders/${orderId}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, trackingCode }),
      });

      if (!res.ok) throw new Error("Failed to update order status.");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                trackingCode: trackingCode || order.trackingCode,
              }
            : order
        )
      );

      setMessage(`✅ Order updated to "${newStatus}"`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("❌ Error updating order status:", err);
      setMessage("❌ Failed to update order status");
    }
  }

  // 🔹 Handle Order Deletion
  async function handleDelete(orderId: string) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/orders/${orderId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to delete order.");

      // ✅ Remove order from state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );

      // ✅ Show success message
      setMessage("🗑 Order deleted successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("❌ Error deleting order:", err);
      setMessage("❌ Failed to delete order");
    }
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-center">Manage Orders</h1>
      {message && <p className="text-center text-green-500 mt-4">{message}</p>}
      <table className="w-full mt-6 bg-gray-800 text-white rounded-lg">
        <thead>
          <tr className="bg-blue-500">
            <th className="p-3">Customer</th>
            <th className="p-3">Total Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Tracking</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-3">
                No orders found
              </td>
            </tr>
          )}
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-600">
                <td className="p-3">{order.customerEmail || "Guest"}</td>
                <td className="p-3">${order.totalAmount.toFixed(2)}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="bg-gray-700 text-white rounded p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </td>
                <td className="p-3">
                  {order.trackingCode ? (
                    <span className="text-green-400">{order.trackingCode}</span>
                  ):(
                    <span className="text-gray-400">Not Available</span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-500 px-3 py-1 rounded ml-2"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
