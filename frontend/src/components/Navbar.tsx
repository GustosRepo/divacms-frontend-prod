"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // ✅ Import authentication
import { motion } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);


  return (
    <nav className="fixed top-0 left-0 w-full bg-[#222] text-white py-4 px-6 flex justify-between items-center shadow-lg z-50">
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.4, ease: "easeIn" }}
  className="flex w-full"
>
  <Image
    src="/uploads/divanailslogo.svg"
    alt="Diva Factory Nails Logo"
    width={50}
    height={50}
    priority
    className="drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
  />
</motion.div>

      <div className="flex items-center space-x-6">
        <Link href="/" className="hover:text-pink-400">
          Home
        </Link>
        <Link href="/shop" className="hover:text-pink-400">
          Shop
        </Link>
        <Link href="/about" className="hover:text-pink-400">
          About
        </Link>
        <Link href="/blog" className="hover:text-pink-400">
          Blog
        </Link>
        <Link href="/contact" className="hover:text-pink-400">
          Contact
        </Link>

        {/* Cart Icon with Badge */}
        <Link href="/cart" className="relative">
          🛒
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] px-1 py-[2px] rounded-full">
              {cartItemCount}
            </span>
          )}
        </Link>
        <Link href="/track-order">
          <button className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-2 rounded-md">
            Track Order
          </button>
        </Link>

        {/* User Authentication */}
        {user ? (
          <div className="flex items-center space-x-3">
            <Link
              href={user?.isAdmin ? "/admin" : "/dashboard"}
              className="text-sm bg-pink-500 px-3 py-1 rounded-md"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="text-red-500 text-sm hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-pink-400 hover:text-pink-300">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
