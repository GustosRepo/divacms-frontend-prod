"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: string;
  status: string;
  totalAmount?: number; // cents or dollars? assuming dollars already
  subtotal?: number;
  taxAmount?: number;
  shippingFee?: number;
  discountAmount?: number;
  trackingCode?: string;
  trackingUrl?: string;
  carrier?: string;
  service?: string;
  createdAt?: string;
}

// Centralized currency formatter (defaults to USD)
const formatCurrency = (value?: number, currency = "USD") => {
  if (value == null || isNaN(value)) return "N/A";
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
};

const StatusBadge = ({ status }: { status: string }) => {
  const base = "inline-block px-2 py-1 rounded text-xs font-semibold tracking-wide";
  const map: Record<string, string> = {
    Pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    Processing: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    Shipped: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    Delivered: "bg-green-500/20 text-green-300 border border-green-500/30",
    Canceled: "bg-red-500/20 text-red-300 border border-red-500/30",
    Refunded: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  };
  return <span className={`${base} ${map[status] || "bg-gray-500/20 text-gray-300 border border-gray-500/30"}`}>{status}</span>;
};

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [groupBy, setGroupBy] = useState<"none" | "status" | "month">("none"); // NEW

  const fetchOrders = useCallback(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
          method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            signal: controller.signal,
        });

        if (response.status === 204 || response.status === 404) {
          setOrders([]);
          return;
        }
        if (!response.ok) throw new Error(`Failed to fetch orders (status ${response.status}).`);
        const data = await response.json();
        const extractedRaw = Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : []);
        // helpers to coerce values safely
        const getString = (obj: Record<string, unknown>, keys: string[]) => {
          for (const k of keys) {
            const v = obj[k];
            if (v == null) continue;
            return String(v);
          }
          return "";
        };
        const getNumber = (obj: Record<string, unknown>, keys: string[]) => {
          for (const k of keys) {
            const v = obj[k];
            if (typeof v === 'number') return v;
            if (typeof v === 'string' && v.trim() !== '') {
              const n = Number(v);
              if (!Number.isNaN(n)) return n;
            }
          }
          return undefined;
        };

        const extracted: Order[] = (extractedRaw as unknown[]).map((it) => {
          const item = (it || {}) as Record<string, unknown>;
          return {
            id: getString(item, ['id', 'order_id']),
            status: getString(item, ['status']) || 'Unknown',
            totalAmount: getNumber(item, ['total_amount', 'total']),
            subtotal: getNumber(item, ['subtotal']),
            taxAmount: getNumber(item, ['tax_amount']),
            shippingFee: getNumber(item, ['shipping_fee']),
            discountAmount: getNumber(item, ['discount_amount']),
            trackingCode: getString(item, ['tracking_code']),
            trackingUrl: getString(item, ['tracking_url']),
            carrier: getString(item, ['carrier']),
            service: getString(item, ['service']),
            createdAt: getString(item, ['created_at', 'createdAt']) || undefined,
          };
        });

        // NEW: sort newest first by createdAt (fallback to id if no createdAt)
        extracted.sort((a: Order, b: Order) => {
          const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          if (bt !== at) return bt - at; // newer first
          return (b.id || "").localeCompare(a.id || "");
        });
        setOrders(extracted);
      } catch (err) {
  const e = err as unknown;
  if (typeof (e as any)?.name === 'string' && (e as any).name === "AbortError") return; // ignore aborts
  setError(err instanceof Error ? err.message : String(err ?? 'An error'));
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [user, refreshIndex]);

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to cancel order");
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: "Canceled" } : o)));
    } catch (e) {
      console.error("Error canceling order", e);
      alert("Unable to cancel order.");
    }
  };

  useEffect(() => {
    const abort = fetchOrders();
    return () => { if (typeof abort === 'function') abort(); };
  }, [fetchOrders]);

  if (!user) {
    return <p className="text-center text-white">Please log in to view your orders.</p>;
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-6 w-48 bg-white/10 animate-pulse rounded" />
        <div className="h-24 bg-white/5 animate-pulse rounded" />
        <div className="h-24 bg-white/5 animate-pulse rounded" />
      </div>
    );
  }

  const showEmpty = orders.length === 0 && !error;

  // ---------- Grouping Logic (client-side) ----------
  let grouped: { key: string; items: Order[] }[] | null = null;
  if (groupBy !== "none") {
    const map = new Map<string, Order[]>();
    for (const o of orders) {
      let key = "Unknown";
      if (groupBy === "status") key = o.status || "Unknown";
      else if (groupBy === "month") {
        if (o.createdAt) {
          const d = new Date(o.createdAt);
          key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
        }
      }
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(o);
    }
    grouped = Array.from(map.entries())
      .map(([key, items]) => ({ key, items: items.sort((a, b) => {
        const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bt - at;
      }) }))
      .sort((a, b) => {
        if (groupBy === "status") return a.key.localeCompare(b.key);
        // month: newest group first
        return b.key.localeCompare(a.key);
      });
  }

  return (
    <div className="container mx-auto px-6 py-10 text-white">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold">📦 My Orders</h1>
        <div className="flex items-center gap-3">
      <select
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value as unknown as "none" | "status" | "month")}
            className="bg-gray-800 text-sm px-3 py-2 rounded border border-white/10"
            title="Group orders"
          >
            <option value="none">No Group</option>
            <option value="status">Group: Status</option>
            <option value="month">Group: Month</option>
          </select>
          <button
            onClick={() => setRefreshIndex(i => i + 1)}
            className="bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded-md transition"
          >
            Refresh
          </button>
          <Link
            href="/shop"
            className="bg-pink-600 hover:bg-pink-700 text-sm px-4 py-2 rounded-md transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {error && !showEmpty && (
        <div className="mt-6 bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded">
          <p className="font-semibold mb-1">Error loading orders</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      )}

      {showEmpty ? (
        <div className="text-center mt-10">
          <p className="text-gray-400">You have no orders yet.</p>
          <Link
            href="/shop"
            className="inline-block mt-6 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-md transition"
          >
            Browse Products
          </Link>
        </div>
      ) : groupBy === "none" ? (
        <ul className="mt-8 space-y-6">
          {orders.map(order => {
            const createdLabel = order.createdAt ? new Date(order.createdAt).toLocaleString() : null;
            return (
              <li key={order.id} className="bg-black/30 backdrop-blur p-6 rounded-lg shadow-lg border border-white/5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1 text-sm">
                    <p className="font-mono text-xs tracking-wide text-gray-400">ID: {order.id}</p>
                    {createdLabel && <p className="text-gray-400 text-xs">Placed: {createdLabel}</p>}
                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.status} />
                      {order.carrier && order.service && (
                        <span className="text-xs text-gray-400">{order.carrier} • {order.service}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1 text-sm">
                    <p><span className="text-gray-400">Total:</span> <strong>{formatCurrency(order.totalAmount)}</strong></p>
                    {order.subtotal != null && (
                      <p className="text-gray-400">Subtotal: {formatCurrency(order.subtotal)}</p>
                    )}
                    {order.taxAmount != null && (
                      <p className="text-gray-400">Tax: {formatCurrency(order.taxAmount)}</p>
                    )}
                    {order.shippingFee != null && (
                      <p className="text-gray-400">Shipping: {formatCurrency(order.shippingFee)}</p>
                    )}
                    {order.discountAmount != null && order.discountAmount > 0 && (
                      <p className="text-gray-400">Discount: -{formatCurrency(order.discountAmount)}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                  {order.trackingCode && (
                    <div>
                      <span className="text-gray-400">Tracking:</span>{" "}
                      {order.trackingUrl ? (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {order.trackingCode}
                        </a>
                      ) : (
                        <span>{order.trackingCode}</span>
                      )}
                    </div>
                  )}

                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-8 space-y-10">
          {grouped && grouped.map(group => (
            <div key={group.key}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="text-pink-400">{groupBy === "month" ? `🗓 ${group.key}` : `🗂 ${group.key}`}</span>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{group.items.length}</span>
              </h2>
              <ul className="space-y-6">
                {group.items.map(order => (
                  <li key={order.id} className="bg-black/30 backdrop-blur p-6 rounded-lg shadow-lg border border-white/5">
                    {/* Reuse same order markup */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1 text-sm">
                        <p className="font-mono text-xs tracking-wide text-gray-400">ID: {order.id}</p>
                        {order.createdAt && <p className="text-gray-400 text-xs">Placed: {new Date(order.createdAt).toLocaleString()}</p>}
                        <div className="flex items-center gap-2">
                          <StatusBadge status={order.status} />
                          {order.carrier && order.service && (
                            <span className="text-xs text-gray-400">{order.carrier} • {order.service}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-1 text-sm">
                        <p><span className="text-gray-400">Total:</span> <strong>{formatCurrency(order.totalAmount)}</strong></p>
                        {order.subtotal != null && (
                          <p className="text-gray-400">Subtotal: {formatCurrency(order.subtotal)}</p>
                        )}
                        {order.taxAmount != null && (
                          <p className="text-gray-400">Tax: {formatCurrency(order.taxAmount)}</p>
                        )}
                        {order.shippingFee != null && (
                          <p className="text-gray-400">Shipping: {formatCurrency(order.shippingFee)}</p>
                        )}
                        {order.discountAmount != null && order.discountAmount > 0 && (
                          <p className="text-gray-400">Discount: -{formatCurrency(order.discountAmount)}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                      {order.trackingCode && (
                        <div>
                          <span className="text-gray-400">Tracking:</span>{" "}
                          {order.trackingUrl ? (
                            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                              {order.trackingCode}
                            </a>
                          ) : (
                            <span>{order.trackingCode}</span>
                          )}
                        </div>
                      )}
                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}