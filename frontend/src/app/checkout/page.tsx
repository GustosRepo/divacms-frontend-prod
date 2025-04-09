"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import CheckoutForm from "@/components/CheckoutForm";
import { CheckoutFormData, CartItem, OrderData } from "@/types/checkout";

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
        const response = await fetch(`http://localhost:3001/users/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user profile.");
        
        const data = await response.json();
        setShippingInfo({ ...data, pointsUsed: 0 });
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
        toast.error("Error fetching user data.");
      }
    };

    fetchUserData();

    // ✅ Load cart items from localStorage safely
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
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (!user) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const userPoints = shippingInfo?.points || 0;

  const handleOrderSubmit = async (data: CheckoutFormData, pointsUsed: number) => {
    let discount = 0;
    if (pointsUsed === 50) discount = totalAmount * 0.05;
    if (pointsUsed === 100) discount = totalAmount * 0.10;

    const discountedAmount = Math.max(0, totalAmount - discount);

    console.log("📦 Order Details:", JSON.stringify(cartItems, null, 2));

    const orderData: OrderData = {
      userId: user.id,
      email: user.email,
      items: cartItems,
      totalAmount: discountedAmount,
      status: "Pending",
      trackingCode: "Processing",
      shippingInfo: { ...data, pointsUsed },
      pointsUsed: pointsUsed,
    };

    try {
      const res = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Unknown server error");
      }

      const responseData = await res.json();
      console.log("✅ Order Success:", responseData);

      localStorage.setItem(
        "latestOrder",
        JSON.stringify({
          orderId: responseData.order.id,
          trackingCode: responseData.order.trackingCode,
          estimatedDelivery: responseData.order.estimatedDelivery,
          pointsUsed,
          discountApplied: discount.toFixed(2),
        })
      );

      localStorage.removeItem("cart");
      toast.success("🎉 Order placed successfully!");
      setTimeout(() => router.push("/order-confirmation"), 2000);
    } catch (error) {
      console.error("❌ Error placing order:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  return (
    <div className="container pt-24 w-1/2 mx-auto text-white">
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