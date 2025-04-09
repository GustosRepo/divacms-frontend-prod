"use client";
import { useState } from "react";
import { CheckoutFormData } from "@/types/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@/context/AuthContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData, pointsUsed: number) => void;
  defaultValues?: CheckoutFormData;
  totalAmount: number;
  userPoints: number;
  cartItems: { id: string; title: string; price: number; quantity: number; image: string }[]; // ✅ Add cartItems
}

export default function CheckoutForm({ onSubmit, defaultValues, totalAmount, userPoints, cartItems }: CheckoutFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: defaultValues?.name || "",
    address: defaultValues?.address || "",
    city: defaultValues?.city || "",
    zip: defaultValues?.zip || "",
    country: defaultValues?.country || "",
    pointsUsed: defaultValues?.pointsUsed || 0,
    points: defaultValues?.points || 0,
    cartItems: defaultValues?.cartItems || [],
  });

  const [selectedPoints, setSelectedPoints] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handlePointsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const points = parseInt(e.target.value);
    let discountPercentage = 0;
    if (points === 50) discountPercentage = 5;
    if (points === 100) discountPercentage = 10;
    setSelectedPoints(points);
    setDiscount(discountPercentage);
  };

  const discountedTotal = (totalAmount - (totalAmount * discount) / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      console.log("🛒 Cart Items before sending:", cartItems);
      console.log("💰 Total Amount before sending:", discountedTotal);

      if (!cartItems || cartItems.length === 0) {
        throw new Error("No items in cart. Cannot proceed with checkout.");
      }

      const requestBody = {
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: parseFloat(discountedTotal)
      };

      console.log("📩 Sending checkout request with body:", requestBody);

      const response = await fetch("http://localhost:3001/checkout/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`, // ✅ Add this line
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("❌ Server Response:", errorResponse);
        throw new Error("Failed to create Stripe session.");
      }

      const { url } = await response.json();
      console.log("✅ Stripe Checkout URL:", url);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Stripe session URL missing from response.");
      }
    } catch (error) {
      console.error("❌ Checkout Error:", error);
      if (error instanceof Error) {
        alert(error.message || "Failed to initiate payment.");
      } else {
        alert("Failed to initiate payment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-black/30 rounded-lg">
      <h2 className="text-xl font-bold text-pink-500">Shipping Details</h2>

      <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" className="p-2 text-black rounded-lg w-full mt-2" />
      <input type="text" name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" className="p-2 text-black rounded-lg w-full mt-2" />
      <input type="text" name="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="City" className="p-2 text-black rounded-lg w-full mt-2" />
      <input type="text" name="zip" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} placeholder="ZIP Code" className="p-2 text-black rounded-lg w-full mt-2" />
      <input type="text" name="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="Country" className="p-2 text-black rounded-lg w-full mt-2" />

      <div className="mt-4">
        <label className="block text-white">💎 Redeem Diva Points:</label>
        <select className="p-2 text-black rounded-lg w-full mt-2" value={selectedPoints} onChange={handlePointsChange}>
          <option value="0">Do not use points</option>
          {userPoints >= 50 && <option value="50">50 Points → 5% Off</option>}
          {userPoints >= 100 && <option value="100">100 Points → 10% Off</option>}
        </select>
      </div>

      <p className="text-white mt-4 text-lg"><strong>Total After Discount:</strong> ${discountedTotal}</p>

      <button type="submit" disabled={loading} className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-md w-full">
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </form>
  );
}