import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
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

// Add your custom font here
const shuneva = localFont({
  src: "../../public/fonts/Shuneva-Regular.otf",
  variable: "--font-shuneva",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diva Factory",
  description: "Luxury press-on nails, handcrafted for perfection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${shuneva.variable} antialiased min-h-screen flex flex-col text-white transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <CartNotification />
              <Toaster position="top-right" reverseOrder={false} />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}