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
      <div className="hidden md:flex items-center gap-6 text-sm font-medium font-shuneva">
        <Link href="/" className="hover:text-pink-500">Home</Link>
        <Link href="/shop" className="hover:text-pink-500">Shop</Link>
        <Link href="/toys" className="hover:text-pink-500">Toys</Link>
        <Link href="/nails" className="hover:text-pink-500">Nails</Link>
        <Link href="/boutique" className="hover:text-pink-500">Boutique</Link>
        <Link href="/about" className="hover:text-pink-500">About</Link>
        <Link href="/blog" className="hover:text-pink-500">Blog</Link>
        <Link href="/contact" className="hover:text-pink-500">Contact</Link>
        <Link href="/las-vegas" className="hover:text-pink-500">Las Vegas</Link>
        <Link href="/cart" className="relative">🛒{cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] px-1 py-[2px] rounded-full">
            {cartItemCount}
          </span>
        )}</Link>
        <Link href="/track-order">
          <button className="font-shuneva bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-md shadow-sm">Track</button>
        </Link>
        {/* Brand Theme Selector */}
        {/*
        <select
          value={brand ?? ''}
          onChange={(e) => setBrand(e.target.value ? (e.target.value as 'nails' | 'toys' | 'boutique') : null)}
          className="bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 rounded-md px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-pink-400/50"
          title="Set preferred brand theme"
        >
          {brandOptions.map(o => <option key={o.key ?? 'all'} value={o.key ?? ''}>{o.label}</option>)}
        </select>
        */}
  {/* Dark Mode */}
        <button
          onClick={toggleDark}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white flex items-center justify-center text-xs shadow hover:shadow-md transition"
          title="Toggle dark mode"
        >
          {dark ? '☀️' : '🌙'}
        </button>
  <button onClick={resetToSystemPref} className="ml-2 text-xs bg-white/60 dark:bg-white/10 px-2 py-1 rounded-md">Reset</button>
        {/* Reduced Motion */}
        {/* 
        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs shadow transition ${reducedMotion ? 'bg-emerald-500 text-white' : 'bg-white/60 dark:bg-white/10 text-gray-700 dark:text-gray-200 border border-white/40 dark:border-white/10'}`}
          title="Toggle reduced motion"
        >
          {reducedMotion ? 'RM' : 'AN'}
        </button>
        */}
        {/* User Authentication */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href={user?.isAdmin ? "/admin" : "/dashboard"}
              className="font-shuneva text-xs bg-pink-500 px-3 py-1.5 rounded-md text-white"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="font-shuneva text-red-500 text-xs hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="font-shuneva text-pink-500 hover:text-pink-400">
            Login
          </Link>
        )}
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full backdrop-blur-md bg-white/80 dark:bg-[#141720]/80 flex flex-col items-center py-4 md:hidden text-sm font-medium font-shuneva border-b border-white/30 dark:border-white/10">
          {[['/', 'Home'], ['/shop', 'Shop'], ['/toys', 'Toys'], ['/nails', 'Nails'], ['/boutique', 'Boutique'], ['/about', 'About'], ['/blog', 'Blog'], ['/contact', 'Contact'], ['/las-vegas', 'Las Vegas']].map(([href, label]) => (
            <Link key={href} href={href} className="py-2 w-full text-center hover:text-pink-500" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="flex gap-3 mt-3">
            <button onClick={toggleDark} className="font-shuneva px-3 py-1 rounded-md bg-pink-500 text-white text-xs">{dark ? 'Light' : 'Dark'}</button>
            <button onClick={resetToSystemPref} className="font-shuneva px-3 py-1 rounded-md bg-white/60 dark:bg-white/10 text-xs border border-white/30 dark:border-white/10">Reset</button>
            <button onClick={() => setReducedMotion(!reducedMotion)} className="font-shuneva px-3 py-1 rounded-md bg-white/60 dark:bg-white/10 text-xs border border-white/30 dark:border-white/10">{reducedMotion ? 'Motion' : 'Reduce'}</button>
          </div>
            {/* 
            <div className="mt-3">
            <select
              value={brand ?? ''}
              onChange={(e) => setBrand(e.target.value ? (e.target.value as 'nails'|'toys'|'boutique') : null)}
              className="bg-white/70 dark:bg-white/10 border border-white/40 dark:border-white/10 rounded-md px-2 py-1 text-xs"
            >
              {brandOptions.map(o => <option key={o.key ?? 'all'} value={o.key ?? ''}>{o.label}</option>)}
            </select>
            </div>
            */}
          <Link href="/cart" className="py-2 w-full text-center relative" onClick={() => setMenuOpen(false)}>
            🛒
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] px-1 py-[2px] rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link href="/track-order" className="py-2 w-full text-center" onClick={() => setMenuOpen(false)}>
            <button className="font-shuneva bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md w-full">Track Order</button>
          </Link>
          {user ? (
            <div className="flex flex-col items-center w-full">
              <Link
                href={user?.isAdmin ? "/admin" : "/dashboard"}
                className="font-shuneva text-xs bg-pink-500 px-3 py-1.5 rounded-md w-full text-center text-white"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="font-shuneva text-red-500 text-xs hover:underline w-full py-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-shuneva text-xs bg-pink-500 px-3 py-1.5 rounded-md w-full text-center text-white"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
