"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckoutFormData } from "@/types/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/AuthContext";
import { safeFetch } from "@/utils/api";

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

export default function CheckoutForm(props: CheckoutFormProps) {
  const { cartItems, defaultValues } = props;
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

    // Stable memo keys for deps to satisfy react-hooks/exhaustive-deps
    const cartKey = useMemo(() => JSON.stringify(cartItems || []), [cartItems]);
    const shippingKey = useMemo(() => JSON.stringify(formData.shippingInfo || {}), [formData.shippingInfo]);

  const [selectedPoints /*, setSelectedPoints*/] = useState<number>(formData.pointsUsed || 0);
  const [discount /*, setDiscount*/] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  // Compute subtotal and discount locally
  const subtotal = cartItems.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0);
  const discountAmount = (subtotal * discount) / 100;
  const totalAfterDiscount = Math.max(0, subtotal - discountAmount);
  // Local pickup sales tax (8.375%)
  const TAX_RATE = 0.08375;

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
    // Use memoized JSON keys so effect deps can be stable
    const s = shippingKey ? JSON.parse(shippingKey) : null;
    const isoCountry = getCountryCode(s?.country);
    const items = cartKey ? JSON.parse(cartKey) : [];
    if (!s || !s.postal_code || !isoCountry) return;
    if (rateDebounceRef.current) window.clearTimeout(rateDebounceRef.current);
    rateDebounceRef.current = window.setTimeout(async () => {
      setShippingLoading(true);
      try {
        const shippingForRate = { ...s, country: isoCountry };
        const json = await safeFetch(`/checkout/shippo-rate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shippingInfo: shippingForRate, items }),
        });
        const fee = Number(json?.shipping_fee ?? (json?.shipping_fee_cents ? json.shipping_fee_cents / 100 : 5));
        setShippingFee(Number.isFinite(fee) ? fee : 5);
      } catch (error) {
        console.error("Shipping rate fetch error:", error);
        setShippingFee(5);
      } finally {
        setShippingLoading(false);
      }
    }, 600);
    return () => {
      if (rateDebounceRef.current) window.clearTimeout(rateDebounceRef.current);
    };
  }, [shippingKey, cartKey, user?.token, isLocalPickup]);

  // Derive shipping shown in totals: 0 for local pickup or until a rate is fetched
  const shippingDisplayed = isLocalPickup ? 0 : (shippingFee ?? 0);
  const taxDisplayed = isLocalPickup ? Number((totalAfterDiscount * TAX_RATE).toFixed(2)) : 0;
  const totalDisplayed = Number((totalAfterDiscount + taxDisplayed + shippingDisplayed).toFixed(2));

  // Points selection UI removed for now; state variables remain for future use

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If Local Pickup, call backend to create pickup order and upload proof, then route to success
      if (isLocalPickup) {
        const s = formData.shippingInfo;
        if (!s.name || !s.phone) {
          throw new Error("Please provide your name and phone for local pickup.");
        }
        if (!proofFile) {
          setFileError("Please upload payment confirmation for local pickup.");
          setLoading(false);
          return;
        }
        // extra guard on size/type
        const maxBytes = 10 * 1024 * 1024; // 10MB
        const okType = proofFile.type.startsWith("image/") || proofFile.type === "application/pdf";
        if (!okType) { setFileError("Invalid file type. Upload an image or PDF."); setLoading(false); return; }
        if (proofFile.size > maxBytes) { setFileError("File too large. Max 10MB."); setLoading(false); return; }
        setFileError(null);
        // Build minimal payload the backend expects
        const payload = {
          items: cartItems.map((it) => ({ id: it.id, quantity: it.quantity })),
          customer: {
            user_id: (user as { id?: string } | null | undefined)?.id || undefined,
            name: s.name,
            phone: s.phone,
            email: (user as { email?: string } | null | undefined)?.email || "",
          },
          taxes: Number((totalAfterDiscount * TAX_RATE).toFixed(2)),
          tax_rate: TAX_RATE,
          notes: undefined as unknown as string | undefined,
        };
        try {
          const resp = await safeFetch(`/orders/pickup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
          // Upload payment proof
          const fd = new FormData();
          fd.append('file', proofFile);
          const up = await safeFetch(`/orders/${serverOrderId}/payment-proof`, {
            method: 'POST',
            // when sending FormData, do NOT set Content-Type (browser sets multipart/form-data)
            body: fd,
          });
          if (!up.ok) {
            let m = 'Failed to upload payment proof';
            try { const j = await up.json(); m = j?.message || m; } catch {}
            throw new Error(m);
          }
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
          const rateResp = await safeFetch(`/checkout/shippo-rate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
  } catch {
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

      const response = await safeFetch(`/checkout/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("✅ Checkout Response:", response);
      const { url } = response;
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
        <label htmlFor="localPickup" className="text-white">Local Pickup</label>
      </div>
      <h2 className="text-xl font-bold text-pink-500">{isLocalPickup ? "Pickup Details" : "Shipping Details"}</h2>
      {isLocalPickup && (
        <div className="mt-2 text-sm bg-white/10 border border-white/20 rounded-lg p-3">
          <p><strong>Pickup hours:</strong> 10:00 AM – 6:00 PM</p>
          <p className="mt-1">We’ll reserve your items after payment confirmation.</p>
          <p className="mt-2">Pay via Venmo, Zelle, or Cash App, then upload your payment confirmation below:</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-white/90">
            <li>Venmo: <span className="font-mono">@your-venmo</span></li>
            <li>Zelle: <span className="font-mono">admin@thedivafactory.com</span></li>
            <li>Cash App: <span className="font-mono">$yourcashapp</span></li>
          </ul>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="bg-white/10 rounded p-2">
              <div className="mb-1">Venmo QR</div>
              <div className="mx-auto max-h-20">
                <Image src="/qr/venmo.png" alt="Venmo QR" width={80} height={80} priority={false} />
              </div>
            </div>
            <div className="bg-white/10 rounded p-2">
              <div className="mb-1">Zelle QR</div>
              <div className="mx-auto max-h-20">
                <Image src="/qr/zelle.png" alt="Zelle QR" width={80} height={80} priority={false} />
              </div>
            </div>
            <div className="bg-white/10 rounded p-2">
              <div className="mb-1">Cash App QR</div>
              <div className="mx-auto max-h-20">
                <Image src="/qr/cashapp.png" alt="Cash App QR" width={80} height={80} priority={false} />
              </div>
            </div>
          </div>
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
      {isLocalPickup && (
        <div className="mt-3">
          <label className="block text-sm mb-1">Upload payment confirmation (required)</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            required
            onChange={(e) => {
              const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
              setProofFile(f);
              if (f) setFileError(null);
            }}
            className="block w-full text-sm file:bg-white/10 file:border file:border-white/20 file:px-3 file:py-1 file:rounded"
          />
          <p className="text-xs text-white/70 mt-1">Accepted: images or PDF. This helps us verify and hold your order.</p>
          {fileError && <p className="text-xs text-red-400 mt-1" aria-live="polite">{fileError}</p>}
        </div>
      )}
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
        maxLength={2}
        onChange={(e) => setFormData({ ...formData, shippingInfo: { ...formData.shippingInfo, state: e.target.value.toUpperCase() } })}
        placeholder="State (2-letter code)"
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
        {isLocalPickup && (
          <div><strong>Tax (8.375%):</strong> ${taxDisplayed.toFixed(2)}</div>
        )}
        <div><strong>Shipping:</strong> {isLocalPickup ? "$0.00 (Local Pickup)" : shippingFee !== null ? `$${shippingFee.toFixed(2)}` : "..."} {shippingLoading && !isLocalPickup ? "(fetching)" : ""}</div>
        <div className="pt-2"><strong>Total:</strong> ${totalDisplayed.toFixed(2)}</div>
      </div>

      <button type="submit" disabled={loading} className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md w-full">
        {loading ? "Processing..." : (isLocalPickup ? "Submit Proof & Reserve Pickup" : "Proceed to Payment")}
      </button>
    </form>
  );
}
