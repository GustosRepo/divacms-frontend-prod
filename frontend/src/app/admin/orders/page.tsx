"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import type { ShippingInfo, AdminOrder } from '@/types/checkout';

type Order = AdminOrder;

export default function ManageOrders() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [proofModalUrl, setProofModalUrl] = useState<string | null>(null);

  // Close modal on Escape
  useEffect(() => {
    if (!proofModalUrl) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setProofModalUrl(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [proofModalUrl]);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/dashboard");
      return;
    }

    const fetchOrders = async () => {
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/orders`);
        if (filterStatus) url.searchParams.set("status", filterStatus);
          const res = await fetch(url.toString(), { 
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
          let errMsg = `Failed to fetch orders. Status: ${res.status}`;
          try {
            const errJson = await res.json();
            errMsg += ` | ${errJson.message || JSON.stringify(errJson)}`;
          } catch {}
          throw new Error(errMsg);
        }
        const data = await res.json();
    setOrders(data.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router, filterStatus]);

  if (loading)
    return <p className="text-center text-white">Loading orders...</p>;
  if (error)
    return <p className="text-center text-red-500">{error}</p>;

  // 🔹 Handle Order Status Update with Tracking Number (shipping flow)
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
      const isCancel = newStatus === "Canceled";
      const endpoint = isCancel
        ? `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`
        : `${process.env.NEXT_PUBLIC_API_URL}/orders/admin/orders/${orderId}`;

      const res = await fetch(endpoint, {
        method: isCancel ? "PATCH" : "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, trackingCode }),
      });

      if (!res.ok) {
        let msg = `Failed to update order status (${res.status}).`;
        try { const j = await res.json(); msg = j?.message || msg; } catch {}
        throw new Error(msg);
      }

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

  // 🔹 Admin action: Mark Paid (for local pickup)
  async function handleMarkPaid(orderId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/mark-paid`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) throw new Error("Failed to mark as paid");
      setOrders(prev => prev.map(o => (
        o.id === orderId
          ? { ...o, shipping_info: { ...(o.shipping_info || {}), payment_status: "paid" } }
          : o
      )));
      setMessage("✅ Marked as paid");
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage("❌ Failed to mark paid");
      setTimeout(() => setMessage(null), 3000);
    }
  }

  // 🔹 Admin action: Mark Picked Up
  async function handleMarkPickedUp(orderId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/mark-picked-up`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) throw new Error("Failed to mark picked up");
      setOrders(prev => prev.map(o => (
        o.id === orderId ? { ...o, status: "picked_up" } : o
      )));
      setMessage("✅ Marked as picked up");
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage("❌ Failed to mark picked up");
      setTimeout(() => setMessage(null), 3000);
    }
  }

  // 🔹 Admin action: Cancel (restock)
  async function handleCancel(orderId: string) {
    if (!confirm("Cancel this order? This will restock items.")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (!res.ok) throw new Error("Failed to cancel order");
      setOrders(prev => prev.map(o => (
        o.id === orderId ? { ...o, status: "canceled" } : o
      )));
      setMessage("✅ Order canceled");
      setTimeout(() => setMessage(null), 2000);
    } catch {
      setMessage("❌ Failed to cancel order");
      setTimeout(() => setMessage(null), 3000);
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
    } catch (_err) {
      console.error("❌ Error deleting order:", _err);
      setMessage("❌ Failed to delete order");
    }
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-center">Manage Orders</h1>
      {message && <p className="text-center text-green-500 mt-4">{message}</p>}
      {/* Filters */}
      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="statusFilter" className="text-sm text-gray-300">Filter status:</label>
        <select
          id="statusFilter"
          className="bg-gray-800 border border-white/10 rounded p-2 text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
          <option value="awaiting_pickup">awaiting_pickup</option>
          <option value="picked_up">picked_up</option>
        </select>
      </div>
      <table className="w-full mt-6 bg-gray-800 text-white rounded-lg">
        <thead>
          <tr className="bg-blue-500">
            <th className="p-3">Customer</th>
            <th className="p-3">Shipping Address</th>
            <th className="p-3">Total Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Tracking</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center p-3">
                No orders found
              </td>
            </tr>
          )}
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-600">
                <td className="p-3">{order.customerEmail || "Guest"}</td>
                <td className="p-3">
                  {(() => {
                    const s = (order.shipping_info || {}) as ShippingInfo;
                    const line1 = s.address_line1 || s.address || order.address || "";
                    const line2 = s.address_line2 || "";
                    const city = s.city || order.city || "";
                    const state = s.state || "";
                    const zip = s.postal_code || s.zip || order.zip || "";
                    const country = s.country || order.country || "";
                    const isPickup = Boolean(s.pickup);
                    const expIso = s?.pickup?.reservation_expires_at as string | undefined;
                    const pay = s?.payment_status as string | undefined;
                    const unpaid = (pay || "").toLowerCase() !== "paid";
                    const now = Date.now();
                    const expMs = expIso ? Date.parse(expIso) : undefined;
                    const expired = Boolean(expMs && expMs <= now && unpaid && order.status === "awaiting_pickup");
                    const soon = Boolean(expMs && expMs > now && (expMs - now) <= 12 * 60 * 60 * 1000 && unpaid && order.status === "awaiting_pickup");
                    if (isPickup) {
                      return (
                        <div className="text-sm text-gray-200">
                          <div className="font-semibold text-pink-300">Local Pickup</div>
                          {expIso && (
                            <div className="text-xs text-gray-400">Hold until: {new Date(expIso).toLocaleString()}</div>
                          )}
                          {expired && (
                            <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded bg-red-600/20 text-red-300">Expired</span>
                          )}
                          {!expired && soon && (
                            <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-300">Expiring soon</span>
                          )}
                                {((s?.customer?.phone) || s?.phone) && (
                                  <div className="text-xs mt-1">☎ {String((s?.customer?.phone) || s?.phone)}</div>
                                )}
                        </div>
                      );
                    }
                    if (line1 || city || country) {
                      return (
                        <div className="text-sm text-gray-200">
                          {line1 && <div>{String(line1)}</div>}
                          {line2 && <div>{String(line2)}</div>}
                          {(city || state || zip) && (
                            <div>
                              {city}{city ? ", " : ""}{state}{state ? " " : ""}{zip}
                            </div>
                          )}
                          {country && <div>{String(country)}</div>}
                        </div>
                      );
                    }
                    return <span className="text-gray-400">No address</span>;
                  })()}
                </td>
                <td className="p-3">{typeof order.totalAmount === "number" ? `$${order.totalAmount.toFixed(2)}` : <span className="text-gray-400">N/A</span>}</td>
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
                    <option value="awaiting_pickup">awaiting_pickup</option>
                    <option value="picked_up">picked_up</option>
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
                  {(() => {
                    const s = order.shipping_info as ShippingInfo | null;
                    const phone = s?.customer?.phone || s?.phone || order.phone;
                    return phone ? String(phone) : <span className="text-gray-400">No phone</span>;
                  })()}
                </td>
                <td className="p-3">
                  {(() => {
                    const pay = (order.shipping_info as ShippingInfo | null)?.payment_status as string | undefined;
                    if (!pay) return <span className="text-gray-400">N/A</span>;
                    if (pay.toLowerCase() === "paid") return <span className="px-2 py-0.5 rounded bg-green-600/20 text-green-300 text-xs">paid</span>;
                    if (pay.toLowerCase() === "unpaid") return <span className="px-2 py-0.5 rounded bg-yellow-600/20 text-yellow-300 text-xs">unpaid</span>;
                    return <span className="text-gray-300 text-xs">{pay}</span>;
                  })()}
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* View payment proof if uploaded */}
                    {(() => {
                      const proofUrl = (order.shipping_info as ShippingInfo | null)?.payment_proof_url as string | undefined;
                      return proofUrl ? (
                        <button
                          onClick={() => setProofModalUrl(proofUrl)}
                          className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm"
                        >
                          View Proof
                        </button>
                      ) : null;
                    })()}
                    {/* Show Mark Paid whenever payment_status !== paid */}
                    {(() => {
                      const pay = (order.shipping_info as ShippingInfo | null)?.payment_status as string | undefined;
                      const isPaid = (pay || "").toLowerCase() === "paid";
                      return !isPaid ? (
                        <button onClick={() => handleMarkPaid(order.id)} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">Mark Paid</button>
                      ) : null;
                    })()}

                    {/* Pickup-specific actions */}
                    {order.status === "awaiting_pickup" && (
                      <>
                        <button onClick={() => handleMarkPickedUp(order.id)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Mark Picked Up</button>
                        <button onClick={() => handleCancel(order.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Cancel</button>
                      </>
                    )}

                    {/* Fallback delete (admin dangerous) */}
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="bg-red-500 px-3 py-1 rounded text-sm"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Proof modal */}
      {proofModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setProofModalUrl(null)} />
          <div className="relative max-w-3xl w-full mx-4">
            <button
              onClick={() => setProofModalUrl(null)}
              className="absolute right-2 top-2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
              aria-label="Close proof"
            >
              ✖
            </button>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="w-full h-auto rounded overflow-hidden">
                <Image src={proofModalUrl || ''} alt="Payment proof" width={1200} height={800} style={{ width: '100%', height: 'auto' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
