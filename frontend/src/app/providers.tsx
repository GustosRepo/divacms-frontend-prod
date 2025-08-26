"use client";
import React from "react";
import dynamic from "next/dynamic";
import AutoFocusOnRouteChange from "@/components/AutoFocusOnRouteChange";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

const CartNotification = dynamic(() => import("@/components/CartNotification"), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <CartNotification />
          <AutoFocusOnRouteChange />
          {children}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
