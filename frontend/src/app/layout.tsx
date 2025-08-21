import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartNotification from "@/components/CartNotification";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster for notifications
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diva Factory Nails",
  description: "Luxury press-on nails, handcrafted for perfection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased min-h-screen flex flex-col text-white transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <CartNotification />
              <Toaster position="top-right" reverseOrder={false} />
              <main className="flex-1 w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}