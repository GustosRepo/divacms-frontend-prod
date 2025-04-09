import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartNotification from "@/components/CartNotification";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster for notifications

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diva Factory Nails",
  description: "Luxury press-on nails, handcrafted for perfection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-purple-200 to-blue-200 text-white`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartNotification />
            <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Toast notifications added */}
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}