"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // ✅ Import authentication
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useThemePrefs } from "@/context/ThemeContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { dark, toggleDark, reducedMotion, setReducedMotion, resetToSystemPref } = useThemePrefs();

  // apply reduced motion preference to document
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);
  }, [reducedMotion]);

  // brandOptions removed — feature currently disabled

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/70 dark:bg-[#141720]/70 text-gray-900 dark:text-gray-100 py-3 px-4 md:px-6 flex justify-between items-center shadow-lg z-50 border-b border-white/40 dark:border-white/10 transition-colors">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden block text-2xl mr-2"
        aria-label="Open menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="flex items-center gap-3"
      >
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image
            src="/uploads/divanailslogo.png"
            alt="Diva Factory Logo"
            width={46}
            height={46}
            priority
            className="drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] cursor-pointer"
          />
        </Link>
      </motion.div>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 text-sm font-medium font-shuneva">
        <Link href="/" className="hover:text-pink-500">Home</Link>
        <Link href="/shop" className="hover:text-pink-500">Shop</Link>
        <Link href="/toys" className="hover:text-pink-500">Toys</Link>
        <Link href="/nails" className="hover:text-pink-500">Nails</Link>
        <Link href="/boutique" className="hover:text-pink-500">Boutique</Link>
        <Link href="/about" className="hover:text-pink-500">About</Link>
        <Link href="/blog" className="hover:text-pink-500">Blog</Link>
        <Link href="/contact" className="hover:text-pink-500">Contact</Link>
        <Link href="/las-vegas" className="hover:text-pink-500">Las Vegas</Link>
        
        {/* Cart and Track - can be hidden on smaller screens */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/cart" className="relative">🛒{cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] px-1 py-[2px] rounded-full">
              {cartItemCount}
            </span>
          )}</Link>
          <Link href="/track-order">
            <button className="font-shuneva bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-md shadow-sm">Track</button>
          </Link>
        </div>

        {/* Theme controls - can be hidden on smaller screens */}
        <div className="hidden xl:flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white flex items-center justify-center text-xs shadow hover:shadow-md transition"
            title="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <button onClick={resetToSystemPref} className="text-xs bg-white/60 dark:bg-white/10 px-2 py-1 rounded-md">Reset</button>
        </div>
      </div>

      {/* ALWAYS VISIBLE USER SECTION */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {/* Cart - always visible on mobile/tablet */}
        <Link href="/cart" className="relative lg:hidden">🛒{cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] px-1 py-[2px] rounded-full">
            {cartItemCount}
          </span>
        )}</Link>
        
        {/* Theme toggle - always visible */}
        <button
          onClick={toggleDark}
          className="xl:hidden w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white flex items-center justify-center text-xs shadow hover:shadow-md transition"
          title="Toggle dark mode"
        >
          {dark ? '☀️' : '🌙'}
        </button>

        {/* User Authentication - ALWAYS VISIBLE AND PROMINENT */}
        {user ? (
          <div className="flex items-center gap-1 shrink-0">
            <Link
              href={user?.isAdmin ? "/admin" : "/dashboard"}
              className="font-shuneva text-xs bg-pink-500 hover:bg-pink-600 px-2 py-1.5 rounded-md text-white whitespace-nowrap transition-colors font-medium"
              title="Go to Profile"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="font-shuneva text-white text-xs bg-red-500 hover:bg-red-600 px-2 py-1.5 rounded-md border border-red-400 whitespace-nowrap transition-colors font-medium"
              title="Logout"
            >
              Logout
            </button>
          </div>
          
        ) : (
          <Link 
            href="/login" 
            className="font-shuneva bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-md shrink-0 text-xs font-medium transition-colors"
          >
            Login
          </Link>
        )}
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full backdrop-blur-md bg-white/90 dark:bg-[#141720]/95 flex flex-col items-center py-4 md:hidden text-sm font-medium font-shuneva border-b border-white/30 dark:border-white/10 shadow-lg">
          
          {/* USER ACTIONS FIRST - MOST IMPORTANT */}
          {user ? (
            <div className="flex flex-col items-center w-full gap-3 mb-4 pb-4 border-b border-pink-200 dark:border-pink-800">
              <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                Welcome, {user.email?.split('@')[0]}!
              </div>
              <div className="flex gap-3 w-full px-4">
                <Link
                  href={user?.isAdmin ? "/admin" : "/dashboard"}
                  className="font-shuneva text-sm bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md text-center text-white font-medium flex-1 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="font-shuneva text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium flex-1 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full px-4 mb-4 pb-4 border-b border-pink-200 dark:border-pink-800">
              <Link
                href="/login"
                className="font-shuneva text-sm bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md w-full text-center font-medium block transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Login / Sign Up
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          {[['/', 'Home'], ['/shop', 'Shop'], ['/toys', 'Toys'], ['/nails', 'Nails'], ['/boutique', 'Boutique'], ['/about', 'About'], ['/blog', 'Blog'], ['/contact', 'Contact'], ['/las-vegas', 'Las Vegas']].map(([href, label]) => (
            <Link key={href} href={href} className="py-2 w-full text-center hover:text-pink-500" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          
          {/* Cart and Track Order */}
          <div className="flex gap-3 mt-3 w-full px-4">
            <Link href="/cart" className="py-2 flex-1 text-center relative bg-white/20 dark:bg-white/10 rounded-md" onClick={() => setMenuOpen(false)}>
              🛒 Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] px-1 py-[2px] rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link href="/track-order" className="py-2 flex-1 text-center bg-pink-500 text-white rounded-md" onClick={() => setMenuOpen(false)}>
              Track Order
            </Link>
          </div>

          {/* Theme Controls */}
          <div className="flex gap-3 mt-3">
            <button onClick={toggleDark} className="font-shuneva px-3 py-1 rounded-md bg-pink-500 text-white text-xs">{dark ? 'Light' : 'Dark'}</button>
            <button onClick={resetToSystemPref} className="font-shuneva px-3 py-1 rounded-md bg-white/60 dark:bg-white/10 text-xs border border-white/30 dark:border-white/10">Reset</button>
            <button onClick={() => setReducedMotion(!reducedMotion)} className="font-shuneva px-3 py-1 rounded-md bg-white/60 dark:bg-white/10 text-xs border border-white/30 dark:border-white/10">{reducedMotion ? 'Motion' : 'Reduce'}</button>
          </div>
        </div>
      )}
    </nav>
  );
}
