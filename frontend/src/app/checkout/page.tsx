"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { safeFetch } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import CheckoutForm from "@/components/CheckoutForm";
import { CheckoutFormData, CartItem } from "@/types/checkout";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [shippingInfo, setShippingInfo] = useState<CheckoutFormData | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error("You need to be logged in to checkout.");
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const data = await safeFetch(`/users/${user.id}`);
        setShippingInfo({ ...data, pointsUsed: 0 });
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
        toast.error("Error fetching user data.");
      }
    };

    fetchUserData();

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          const formattedCart: CartItem[] = parsedCart.map((item) => ({
            id: item.id,
            title: item.title || "Unnamed Product",
            price: item.price || 0,
            quantity: item.quantity || 1,
            image: item.image || "/default-image.png",
          }));

          console.log("🛒 Loaded Cart Items:", formattedCart);
          setCartItems(formattedCart);
        } else {
          console.error("❌ Invalid cart data format.");
        }
      } catch (error) {
        console.error("❌ Error parsing cart:", error);
      }
    }

    setLoading(false);
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!user) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const userPoints = shippingInfo?.points || 0;

  const handleOrderSubmit = async (data: CheckoutFormData, pointsUsed: number) => {
    try {
      const res = await safeFetch(`/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, pointsUsed, shippingInfo: data, metadata: { userId: user.id, email: user.email } }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          // Another customer likely bought the last unit at the same time.
          let msg = "One or more items are no longer in stock at the requested quantity.";
          let conflictedId: string | undefined;
          let available: number | undefined;
          try {
            const body = await res.json();
            msg = body?.message || msg;
            conflictedId = body?.product_id || body?.productId || body?.id;
            if (typeof body?.available === 'number') available = body.available;
          } catch {}

          if (conflictedId) {
            setCartItems((prev) => {
              const next = prev
                .map((line) => {
                  if (line.id !== conflictedId) return line;
                  const newQty = typeof available === 'number' ? Math.max(0, Math.min(line.quantity, available)) : 0;
                  if (newQty <= 0) return null; // remove item if none available
                  return { ...line, quantity: newQty };
                })
                .filter(Boolean) as CartItem[];
              try { localStorage.setItem('cart', JSON.stringify(next)); } catch {}
              return next;
            });
          }

          toast.error(msg);
          return;
        }
        const errorData = await res.json();
        throw new Error(errorData.message || "Unknown server error");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      console.error("❌ Error starting Stripe session:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  return (
    <div className="container pt-24 w-1/2 mx-auto">
      <h1 className="text-3xl font-bold text-center">Checkout</h1>

      {shippingInfo ? (
        <CheckoutForm 
          onSubmit={handleOrderSubmit} 
          defaultValues={shippingInfo} 
          totalAmount={totalAmount} 
          userPoints={userPoints}
          cartItems={cartItems}
        />
      ) : (
        <p className="text-center text-gray-300">Loading your shipping info...</p>
      )}
    </div>
  );
}
