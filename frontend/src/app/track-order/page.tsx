"use client";
import { useState } from "react";
import Link from "next/link";

interface Order {
  orderId: string;
  status: string;
  totalAmount: number;
  trackingCode: string;
  estimatedDelivery?: string;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async () => {
    setError("");
    setOrder(null);

    if (!orderId || !email) {
      setError("Please enter both Order ID and Email.");
      return;
    }

    try {
      setLoading(true);
  const q = new URLSearchParams({ orderId, email }).toString();
  const res = await fetch(`/api/proxy/orders/track?${q}`, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Order not found.");
  setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyTracking = async () => {
    if (!order?.trackingCode) return;
    try {
      await navigator.clipboard.writeText(order.trackingCode);
      setError("");
    } catch {
      setError("Could not copy tracking code. Please copy manually.");
    }
  };

  const statusColor = (s: string) => {
    const v = s.toLowerCase();
    if (v.includes("delivered")) return "bg-green-500/20 text-green-300 border-green-400/30";
    if (v.includes("shipped") || v.includes("fulfilled")) return "bg-blue-500/20 text-blue-300 border-blue-400/30";
    if (v.includes("processing") || v.includes("pending")) return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
    if (v.includes("canceled") || v.includes("cancelled")) return "bg-red-500/20 text-red-300 border-red-400/30";
    return "bg-white/10 text-white border-white/20";
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-24">
      {/* Breadcrumbs */}
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-fg/70">Track Order</span>
      </nav>

      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="font-shuneva text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
          Track Your Order
        </h1>
        <p className="max-w-2xl mx-auto">
          Enter your Order ID and the email you used at checkout to see the latest status and tracking updates.
        </p>
      </header>

      {/* Form Card */}
      <section className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-xl p-6 md:p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="orderId" className="block text-sm text-gray-300 mb-1">Order ID</label>
            <input
              id="orderId"
              type="text"
              placeholder="e.g. 7b414e6d-5159-45c4-acf5-c7741d870922"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/90 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/90 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        </div>
        <button
          onClick={handleTrackOrder}
          disabled={loading}
          className="mt-5 w-full md:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
              Checking...
            </span>
          ) : (
            "Track Order"
          )}
        </button>

        {error && (
          <p role="alert" aria-live="assertive" className="mt-4 text-sm text-red-300">
            {error}
          </p>
        )}
      </section>

      {/* Result */}
      {order && (
        <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold">Order <span className="text-pink-300">#{order.orderId}</span></h2>
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusColor(order.status)}`}>
              <span className="h-2 w-2 rounded-full bg-current" />
              {order.status}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="text-white/70">Total</div>
              <div className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</div>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="text-white/70">Tracking Code</div>
              <div className="flex items-center justify-between gap-3">
                <code className="text-sm">{order.trackingCode}</code>
                <button onClick={copyTracking} className="text-pink-300 hover:text-pink-200 text-xs underline">Copy</button>
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="text-white/70">Estimated Delivery</div>
              <div className="font-semibold">{order.estimatedDelivery || "—"}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <Link href="/faq/shipping-info" className="text-blue-300 hover:text-blue-200 underline">Shipping info</Link>
            <span className="text-white/30">•</span>
            <a href={`https://parcelsapp.com/en/tracking/${encodeURIComponent(order.trackingCode)}`} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-200 underline">Track on carrier</a>
          </div>
        </section>
      )}
    </main>
  );
}
