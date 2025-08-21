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
    <section className="relative w-full bg-transparent">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <video
          className="w-full h-full object-cover object-center scale-[1.1] opacity-60 mix-blend-lighten"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/uploads/HeroVideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.55),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,182,193,0.35),rgba(216,191,255,0.35),rgba(186,255,214,0.35))] mix-blend-soft-light animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-8 pb-16 md:pt-24 md:pb-24 lg:pt-32 lg:pb-32">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: -16 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="flex justify-center items-center w-full"
        >
          <Image
            src="/uploads/divanailslogo.svg"
            alt="Diva Factory Logo"
            width={800}
            height={800}
            priority
            className="w-full max-w-[320px] md:max-w-[420px] h-auto drop-shadow-[0_0_12px_rgba(255,255,255,0.55)] contrast-110"
          />
        </motion.div>
<p className="text-base md:text-lg text-black dark:text-[#f3f3f7] mt-6 max-w-2xl leading-relaxed font-extrabold tracking-wide drop-shadow-xl">
  💅 Pastel drips, sparkle flips & kawaii magic — where press-ons, toys & boutique vibes pop like a Y2K music video 🌸🦋
</p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
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
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {[
            { icon: "♡", text: "Handmade Quality" },
            { icon: "☆", text: "Diva Aesthetic" },
            { icon: "✿", text: "Hottest Drops" },
          ].map((t) => (
            <span
              key={t.text}
              className="px-5 py-2 flex items-center gap-2 rounded-full bg-white/40 backdrop-blur-md border shadow-sm"
            >
              <span>{t.icon}</span>
              {t.text}
            </span>
          ))}
        </div>
        <Link href="/shop">
          <button className="mt-12 bg-pink-400 hover:bg-pink-200 text-black dark:text-[#f3f3f7] font-semibold px-10 py-3 rounded-full text-base shadow-[0_4px_0_0_rgba(0,0,0,0.15)] active:translate-y-[2px] active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] transition-all border border-pink-300 ring-2 ring-pink-100/60">
            Shop All Cute Things
          </button>
        </Link>
      </div>
    </section>
  );
}