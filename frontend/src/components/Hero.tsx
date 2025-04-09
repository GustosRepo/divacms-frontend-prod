"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 🎥 Background Video */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <video
          className="w-full h-full object-cover object-center scale-[1.3]"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/uploads/HeroVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>

      {/* ✨ Overlay Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center bg-black/10 px-6 pt-32 pb-32">
        {/* Logo */}
        <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
  className="flex justify-center items-center w-full"
>
  <Image
    src="/uploads/divanailslogo.svg"
    alt="Diva Factory Nails Logo"
    width={600}
    height={600}
    priority
    className="w-[100%] max-w-xs md:max-w-sm h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
  />
</motion.div>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-white mt-4 max-w-xl leading-relaxed font-medium">
          Luxury press-on nails, handcrafted for perfection. Easy to apply,
          long-lasting, and totally customizable!
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 text-white text-sm bg-black/30 px-6 py-3 rounded-lg mt-5 backdrop-blur-md">
          <span>⭐ 100% Handmade</span>
          <span>✨ Cruelty-Free</span>
          <span>🚚 Free Shipping Over $50</span>
        </div>

        {/* Call-to-Action */}
        <Link href="/shop">
          <button className="mt-6 bg-pink-500 hover:bg-pink-700 text-white px-8 py-3 rounded-lg text-lg shadow-lg transition-all duration-300 hover:scale-105">
            Shop Now
          </button>
        </Link>
      </div>
    </div>
  );
}