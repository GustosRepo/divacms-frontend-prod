"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useThemePrefs } from "@/context/ThemeContext";

export default function Hero() {
  const { reducedMotion } = useThemePrefs();
  const brands = [
    {
      key: "nails",
      label: "Nails",
      href: "/nails",
      desc: "Cute press-ons",
      pastel: "bg-pink-200/70 border-pink-300",
      accent: "text-pink-700",
    },
    {
      key: "toys",
      label: "Toys",
      href: "/toys",
      desc: "Collectible fun",
      pastel: "bg-violet-200/70 border-violet-300",
      accent: "text-violet-700",
    },
    {
      key: "boutique",
      label: "Boutique",
      href: "/boutique",
      desc: "Kawaii finds",
      pastel: "bg-emerald-200/70 border-emerald-300",
      accent: "text-emerald-700",
    },
  ];

  return (
    <section className="relative h-screen bg-transparent overflow-hidden">
      {/* Background Video - Full Viewport */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <video
          className="w-full h-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/uploads/HeroVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 h-full max-w-6xl mx-auto pt-18">
         <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: -16 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="flex justify-center items-center w-full mb-6"
        >
          <Image
            src="/uploads/divanailslogo.png"
            alt="Diva Factory Logo"
            width={800}
            height={800}
            priority
            className="w-full max-w-[320px] md:max-w-[420px] h-auto drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] contrast-110 pb-0"
          />
        </motion.div> 
  <p className="font-shuneva text-xl md:text-2xl text-[#3d3005] font-extrabold tracking-wide drop-shadow-sm bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(255,248,225,0.85))] border border-white/60 rounded-2xl px-7 py-4 max-w-2xl leading-relaxed mb-3 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)]">
          💅 Where press-ons, toys & boutique vibes pop like a Y2K music video 🌸🦋
        </p>
        {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
          {brands.map((b) => (
            <Link
              key={b.key}
              href={b.href}
              className={`group block rounded-3xl border ${b.pastel} backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="relative px-5 py-10 flex flex-col items-center text-center">
                <span className={`text-lg font-extrabold tracking-wide ${b.accent}`}>{b.label}</span>
                <span className="mt-3 text-xs uppercase font-semibold">{b.desc}</span>
                <span className="mt-4 text-[11px] font-semibold px-4 py-1 bg-white/70 rounded-full">
                  Explore ✦
                </span>
              </div>
            </Link>
          ))}
        </div> */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { icon: "♡", text: "Handmade Quality" },
            { icon: "☆", text: "Diva Aesthetic" },
            { icon: "✿", text: "Hottest Drops" },
          ].map((t) => (
            <span
              key={t.text}
              className="px-4 py-2 flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.55),rgba(255,245,210,0.55))] backdrop-blur-sm border border-white/50 shadow-[0_2px_6px_rgba(0,0,0,0.12)] text-sm font-medium text-[#4a3805]"
            >
              <span>{t.icon}</span>
              {t.text}
            </span>
          ))}
        </div>
        <Link href="/shop">
            <button className="font-shuneva mt-8 bg-pink-400 hover:bg-pink-500 text-pink-900 font-bold px-8 py-3 rounded-full text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] transition-all border border-pink-300 ring-2 ring-pink-100/60">
            Shop All Cute Things
            </button>
        </Link>
      </div>
    </section>
  );
}