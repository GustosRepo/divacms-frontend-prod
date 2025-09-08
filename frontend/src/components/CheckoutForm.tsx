"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckoutFormData } from "@/types/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/AuthContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  onSubmit?: (data: CheckoutFormData, pointsUsed: number) => void;
  defaultValues?: CheckoutFormData;
  totalAmount: number;
  userPoints: number;
  cartItems: { id: string; title: string; price: number; quantity: number; image: string }[];
}

// country name -> ISO2 map for common countries used by Goshipoo
const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  "united states": "US",
  "usa": "US",
  "us": "US",
  "canada": "CA",
  "ca": "CA",
  "united kingdom": "GB",
  "uk": "GB",
  "great britain": "GB",
  "australia": "AU",
  "france": "FR",
  "germany": "DE",
  "de": "DE",
  "spain": "ES",
  "italy": "IT",
  "netherlands": "NL",
  "belgium": "BE",
  "switzerland": "CH",
  "china": "CN",
  "japan": "JP",
  "mexico": "MX",
};

function getCountryCode(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;
  // If already an ISO2 code
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase();
  const key = trimmed.toLowerCase();
  return COUNTRY_NAME_TO_ISO[key] || null;
}

export default function CheckoutForm({
  onSubmit,
  defaultValues,
  totalAmount,
  userPoints,
  cartItems,
}: CheckoutFormProps) {
  const { user } = useAuth();
  const router = useRouter();
    const [formData, setFormData] = useState<CheckoutFormData>({
      cartItems: defaultValues?.cartItems || cartItems || [],
      pointsUsed: defaultValues?.pointsUsed || 0,
      points: defaultValues?.points || 0,
      shippingInfo: defaultValues?.shippingInfo || {
        name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      },
    });
    const [isLocalPickup, setIsLocalPickup] = useState(false);

  const [selectedPoints, setSelectedPoints] = useState<number>(formData.pointsUsed || 0);
  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  // Compute subtotal and discount locally
  const subtotal = cartItems.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0);
  const discountAmount = (subtotal * discount) / 100;
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);

  // shipping fee will be fetched from backend (Goshipoo) on submit; keep local state for UX
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const rateDebounceRef = useRef<number | null>(null);

  // Fetch live shipping rate when shippingInfo or cartItems change (debounced)
  useEffect(() => {
    if (isLocalPickup) {
      setShippingFee(0);
      setShippingLoading(false);
      return;
    }
    const s = formData.shippingInfo;
    const isoCountry = getCountryCode(s?.country);
    if (!s || !s.postal_code || !isoCountry) return;
    if (rateDebounceRef.current) window.clearTimeout(rateDebounceRef.current);
    rateDebounceRef.current = window.setTimeout(async () => {
      setShippingLoading(true);
      try {
        const shippingForRate = { ...s, country: isoCountry };
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/shippo-rate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
          body: JSON.stringify({ shippingInfo: shippingForRate, items: cartItems }),
        });
        if (!resp.ok) {
          setShippingFee(5);
          return;
        }
        const json = await resp.json();
        const fee = Number(json?.shipping_fee ?? (json?.shipping_fee_cents ? json.shipping_fee_cents / 100 : 5));
        setShippingFee(Number.isFinite(fee) ? fee : 5);
      } catch (err) {
        setShippingFee(5);
      } finally {
        setShippingLoading(false);
      }
    }, 600);
    return () => {
      if (rateDebounceRef.current) window.clearTimeout(rateDebounceRef.current);
    };
  }, [formData.shippingInfo.postal_code, formData.shippingInfo.country, formData.shippingInfo.state, JSON.stringify(cartItems), user?.token, isLocalPickup]);

  // Derive shipping shown in totals: 0 for local pickup or until a rate is fetched
  const shippingDisplayed = isLocalPickup ? 0 : (shippingFee ?? 0);
  const totalDisplayed = Number((totalAfterDiscount + shippingDisplayed).toFixed(2));

  const handlePointsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const points = parseInt(e.target.value);
    let discountPercentage = 0;
    if (points === 50) discountPercentage = 5;
    if (points === 100) discountPercentage = 10;
    setSelectedPoints(points);
    setDiscount(discountPercentage);
    setFormData({ ...formData, pointsUsed: points });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If Local Pickup, call backend to create pickup order and skip Stripe
      if (isLocalPickup) {
        const s = formData.shippingInfo;
        if (!s.name || !s.phone) {
          throw new Error("Please provide your name and phone for local pickup.");
        }
        // Build minimal payload the backend expects
        const payload = {
          items: cartItems.map((it) => ({ id: it.id, quantity: it.quantity })),
          customer: {
            user_id: (user as any)?.id,
            name: s.name,
            phone: s.phone,
            email: (user as any)?.email || "",
          },
          notes: undefined as unknown as string | undefined,
        };
        try {
          const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/pickup`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
            body: JSON.stringify(payload),
          });
          if (!resp.ok) {
            let msg = "Failed to create pickup order.";
            try { const e = await resp.json(); msg = e?.message || msg; } catch {}
            throw new Error(msg);
          }
          const json = await resp.json();
          const serverOrderId: string = json?.order_id || `pickup_${Date.now()}`;
          const expIso: string | undefined = json?.reservation_expires_at;
          const expiresAt = expIso ? Date.parse(expIso) : (Date.now() + 48 * 60 * 60 * 1000);
          try {
            localStorage.setItem("latestPickupOrder", JSON.stringify({ orderId: serverOrderId, expiresAt }));
            localStorage.removeItem("cart");
          } catch {}
          const expParam = expIso ? `&exp=${encodeURIComponent(expIso)}` : "";
          router.push(`/checkout/success?pickup=1&order_id=${encodeURIComponent(serverOrderId)}${expParam}`);
          return;
        } catch (err) {
          throw err;
        }
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load.");

      // quick front-end validation so we actually send an address for shipping
      const s = formData.shippingInfo;
      if (!s.name || !s.address_line1 || !s.city || !s.postal_code || !s.country) {
        throw new Error("Please fill out name, address, city, ZIP/postal code, and country.");
      }
      if (!cartItems || cartItems.length === 0) {
        throw new Error("No items in cart. Cannot proceed with checkout.");
      }

      // 📨 Build shippingInfo in the exact shape your backend/webhook expects
      const isoCountry = getCountryCode(s.country) || "US";
      const shippingInfo = {
        name: s.name || "",
        phone: s.phone || "",
        address_line1: s.address_line1 || "",
        address_line2: s.address_line2 || "",
        city: s.city || "",
        state: s.state || "",
        postal_code: s.postal_code || "",
        country: isoCountry,
      };

      // 1) If local pickup, shipping fee is $0. Otherwise, fetch live shipping rate from backend (Goshipoo). If it fails, fallback to $5
      // Default to 0 on the client unless a live rate is fetched
      let shipping_fee = 0.0;
      let shipping_fee_cents = 0;
      if (isLocalPickup) {
        shipping_fee = 0;
        shipping_fee_cents = 0;
        setShippingFee(0);
      } else {
        setShippingLoading(true);
        try {
          const rateResp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/shippo-rate`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
            body: JSON.stringify({ shippingInfo, items: cartItems }),
          });
          if (rateResp.ok) {
            const rateJson = await rateResp.json();
            if (rateJson?.shipping_fee != null) {
              shipping_fee = Number(rateJson.shipping_fee);
              shipping_fee_cents = Number(rateJson?.shipping_fee_cents ?? Math.round(shipping_fee * 100));
            } else if (rateJson?.shipping_fee_cents != null) {
              shipping_fee = Number(rateJson.shipping_fee_cents) / 100;
              shipping_fee_cents = Number(rateJson.shipping_fee_cents);
            }
          }
        } catch (err) {
        } finally {
          setShippingLoading(false);
          setShippingFee(shipping_fee);
        }
      }

      // Build request body including shipping fee metadata (cents)
      const requestBody = {
        items: cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        // send final amount in major units (dollars)
        totalAmount: Number((totalAfterDiscount + shipping_fee).toFixed(2)),
        // ✅ send the full address to backend so webhook can persist it
        shippingInfo,
        isLocalPickup,
        // include shipping fee in metadata as cents for backend to persist reliably
        metadata: {
          pointsUsed: String(selectedPoints),
          subtotal: Math.round(subtotal * 100).toString(),
          shipping_fee: Math.round(shipping_fee * 100).toString(),
          shipping_fee_cents: shipping_fee_cents.toString(),
        },
      };

      console.log("🛒 Cart Items:", cartItems);
      console.log("💰 Total (discounted):", totalDisplayed);
      console.log("📦 shippingInfo:", shippingInfo);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        let msg = "Failed to create Stripe session.";
        try {
          const err = await response.json();
          console.error("❌ Server Response:", err);
          msg = err?.message || msg;
        } catch {}
        throw new Error(msg);
      }

      const { url } = await response.json();
      console.log("✅ Stripe Checkout URL:", url);
      if (!url) throw new Error("Stripe session URL missing from response.");
      window.location.href = url;
    } catch (error) {
      console.error("❌ Checkout Error:", error);
      alert(error instanceof Error ? error.message : "Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <form onSubmit={handleSubmit} className="p-6 bg-black/30 rounded-lg">
      <div className="flex items-center mt-2 mb-2">
        <input
          type="checkbox"
          id="localPickup"
          checked={isLocalPickup}
          onChange={(e) => setIsLocalPickup(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="localPickup" className="text-white">Local Pickup (Free Shipping)</label>
      </div>
      <h2 className="text-xl font-bold text-pink-500">{isLocalPickup ? "Pickup Details" : "Shipping Details"}</h2>
      {isLocalPickup && (
        <div className="mt-2 text-sm bg-white/10 border border-white/20 rounded-lg p-3">
          <p><strong>Pickup hours:</strong> 8:00 AM – 8:00 PM</p>
          <p className="mt-1">We’ll reserve your items for 48 hours. Pay at pickup.</p>
        </div>
      )}

      <input
        type="text"
        name="name"
        value={formData.shippingInfo.name}
        onChange={(e) => setFormData({ ...formData, shippingInfo: { ...formData.shippingInfo, name: e.target.value } })}
        placeholder="Full Name"
        className="p-2 text-black rounded-lg w-full mt-2"
      />
      <input
        type="tel"
        name="phone"
        value={formData.shippingInfo.phone}
        onChange={(e) => setFormData({ ...formData, shippingInfo: { ...formData.shippingInfo, phone: e.target.value } })}
        placeholder="Phone (for pickup updates)"
        className="p-2 text-black rounded-lg w-full mt-2"
      />
      <input
        type="text"
        name="address"
        value={formData.shippingInfo.address_line1}
        onChange={(e) => setFormData({ ...formData, shippingInfo: { ...formData.shippingInfo, address_line1: e.target.value } })}
        placeholder="Address"
        className={`p-2 text-black rounded-lg w-full mt-2 ${isLocalPickup ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLocalPickup}
      />
      <input
        type="text"
        name="city"
        value={formData.shippingInfo.city}
        onChange={(e) => setFormData({ ...formData, shippingInfo: { ...formData.shippingInfo, city: e.target.value } })}
        placeholder="City"
        className={`p-2 text-black rounded-lg w-full mt-2 ${isLocalPickup ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLocalPickup}
      />
      <input
        type="text"
        name="state"
        value={formData.shippingInfo.state}
        onChange={(e) => setFormData({ ...formData, shippingInfo: { ...formData.shippingInfo, state: e.target.value } })}
        placeholder="State / Province"
        className={`p-2 text-black rounded-lg w-full mt-2 ${isLocalPickup ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLocalPickup}
      />
      <input
        type="text"
        name="zip"
        value={formData.shippingInfo.postal_code}
        onChange={(e) => setFormData({ ...formData, shippingInfo: { ...formData.shippingInfo, postal_code: e.target.value } })}
        placeholder="ZIP Code"
        className={`p-2 text-black rounded-lg w-full mt-2 ${isLocalPickup ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLocalPickup}
      />
      <input
        type="text"
        name="country"
        value={formData.shippingInfo.country}
        onChange={(e) => setFormData({ ...formData, shippingInfo: { ...formData.shippingInfo, country: e.target.value } })}
        placeholder="Country"
        className={`p-2 text-black rounded-lg w-full mt-2 ${isLocalPickup ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isLocalPickup}
      />

      {/* (Optional) add a select to actually vary selectedPoints/discount */}
      {/* <select onChange={handlePointsChange} className="mt-3 p-2 text-black rounded-lg w-full">
        <option value={0}>Use 0 points (0%)</option>
        <option value={50}>Use 50 points (5%)</option>
        <option value={100}>Use 100 points (10%)</option>
      </select> */}

      <div className="text-white mt-4 text-lg space-y-1">
        <div><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</div>
        <div><strong>Discount:</strong> -${discountAmount.toFixed(2)}</div>
        <div><strong>Shipping:</strong> {isLocalPickup ? "$0.00 (Local Pickup)" : shippingFee !== null ? `$${shippingFee.toFixed(2)}` : "..."} {shippingLoading && !isLocalPickup ? "(fetching)" : ""}</div>
        <div className="pt-2"><strong>Total:</strong> ${totalDisplayed.toFixed(2)}</div>
      </div>

      <button type="submit" disabled={loading} className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md w-full">
        {loading ? "Processing..." : (isLocalPickup ? "Place Pickup Order (Pay at pickup)" : "Proceed to Payment")}
      </button>
    </form>
  );
}
