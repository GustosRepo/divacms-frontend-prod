"use client";
import { createContext, useContext, useState, useEffect } from "react";

// add these fields to your CartItem type
export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  // 👇 new (all optional to avoid breaking existing code)
  // Available stock for this item at time of add; used to clamp quantities client-side
  stock?: number;
  weightOz?: number;
  lengthIn?: number;
  widthIn?: number;
  heightIn?: number;
};

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
        return prev.map((p) => {
          if (p.id !== item.id) return p;
          const max = (p.stock ?? item.stock);
          if (typeof max === 'number' && Number.isFinite(max)) {
            const nextQty = Math.min(p.quantity + item.quantity, max);
            return { ...p, quantity: nextQty, stock: max };
          }
          return { ...p, quantity: p.quantity + item.quantity, stock: p.stock ?? item.stock };
        });
      }
      const max = item.stock ?? Infinity;
      const initialQty = Math.min(item.quantity, max);
      return [...prev, { ...item, quantity: initialQty }];
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
      currentCart.map((item) => {
        if (item.id !== productId) return item;
        const max = item.stock ?? Infinity;
        const clamped = Math.max(1, Math.min(newQuantity, max));
        return { ...item, quantity: clamped };
      })
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