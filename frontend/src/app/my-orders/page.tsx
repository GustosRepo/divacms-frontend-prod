"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

type Order = {
  id: string;
  status: string;           // e.g. "Pending", "Shipped"
  total_amount: number;     // dollars (from your table)
  tracking_code: string;    // e.g. "Processing" or carrier code
};

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`,
          { headers: { Authorization: `Bearer ${user?.token || ""}` } }
        );
        if (!res.ok) throw new Error("Failed to load orders");
        const data = (await res.json()) as Order[];
        setOrders(data ?? []);
      } catch {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, router]);

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${user?.token || ""}` },
        }
      );
      if (!res.ok) throw new Error("Failed to cancel order");

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o))
      );
  } catch {
      setError("Could not cancel order.");
    }
  };

  const fmtMoney = (n?: number) =>
    typeof n === "number" && !Number.isNaN(n) ? `$${n.toFixed(2)}` : "N/A";

  if (loading) return <p className="text-center">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center mt-6">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {orders.map((order) => {
            const isPending =
              order.status?.toLowerCase() === "pending" ||
              order.status?.toLowerCase() === "processing";

            return (
              <div key={order.id} className="bg-black/20 p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold">
                  Order <span className="text-pink-400">#{order.id}</span>
                </h2>

                <p className="text-gray-300">
                  Status: {order.status?.toUpperCase() || "PENDING"}
                </p>

                <p><strong>TOTAL:</strong> {fmtMoney(order.total_amount)}</p>
                <p><strong>TRACKING:</strong> {order.tracking_code || "N/A"}</p>

                <Link
                  href={
                    user
                      ? `/track-order?orderId=${order.id}&email=${user.email}`
                      : "#"
                  }
                  className="mt-2 inline-block bg-pink-500 hover:bg-pink-700 px-4 py-2 rounded-md text-sm text-white"
                >
                  View Order
                </Link>

                {isPending && (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="ml-2 inline-block bg-red-600 hover:bg-red-800 px-4 py-2 rounded-md text-sm text-white"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
