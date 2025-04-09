"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void; // ✅ Add this
  clearCart: () => void;
  cartNotification: boolean;
  setCartNotification: (value: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartNotification, setCartNotification] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingItem = prev.find((p) => p.id === item.id);
      if (existingItem) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
  
    console.log("✅ Product added to cart:", item);
    
    // ✅ Show notification for 3 seconds
    setCartNotification(true);
    console.log("🔔 Notification Triggered!");
    
    setTimeout(() => {
      setCartNotification(false);
      console.log("🔕 Notification Cleared!");
    }, 3000);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity, // ✅ Now properly defined
        clearCart,
        cartNotification,
        setCartNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};