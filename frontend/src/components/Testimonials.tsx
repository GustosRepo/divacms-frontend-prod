"use client";
import { useState, useEffect } from "react";

interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
  type: "boutique" | "toys" | "nails";
}

const reviews: Review[] = [
  // Boutique reviews
  { id: 1, name: "Emily R.", text: "The boutique selection is so dreamy! Pastel heaven.", rating: 5, type: "boutique" },
  { id: 2, name: "Sophia M.", text: "Love the Y2K bags and accessories. Super cute!", rating: 5, type: "boutique" },
  { id: 3, name: "Olivia J.", text: "The scrunchies and clips are adorable and high quality.", rating: 4.5, type: "boutique" },
  { id: 4, name: "Ava L.", text: "My pastel sunglasses are a total vibe.", rating: 5, type: "boutique" },
  { id: 5, name: "Mia K.", text: "The boutique packaging is so aesthetic!", rating: 5, type: "boutique" },
  { id: 6, name: "Zoe T.", text: "I always find something unique for my outfits.", rating: 4.5, type: "boutique" },
  { id: 7, name: "Chloe S.", text: "The jewelry is perfect for layering. Obsessed!", rating: 5, type: "boutique" },
  { id: 8, name: "Lily P.", text: "Fast shipping and everything arrived in perfect condition.", rating: 5, type: "boutique" },
  { id: 9, name: "Ella D.", text: "The pastel purses are my new go-to.", rating: 4, type: "boutique" },
  { id: 10, name: "Grace F.", text: "Customer service is so friendly and helpful.", rating: 5, type: "boutique" },
  // Toys reviews
  { id: 11, name: "Harper W.", text: "The plushies are SO soft and cute!", rating: 5, type: "toys" },
  { id: 12, name: "Layla B.", text: "My daughter loves the pastel stacking toys.", rating: 4.5, type: "toys" },
  { id: 13, name: "Aria C.", text: "The fidget toys are a hit at our house.", rating: 5, type: "toys" },
  { id: 14, name: "Scarlett N.", text: "Great quality and safe for little hands.", rating: 5, type: "toys" },
  { id: 15, name: "Penelope V.", text: "The Y2K toy colors are so fun and bright!", rating: 4.5, type: "toys" },
  { id: 16, name: "Camila G.", text: "My son loves the pastel puzzle set.", rating: 5, type: "toys" },
  { id: 17, name: "Madison H.", text: "Perfect gift for birthdays!", rating: 5, type: "toys" },
  { id: 18, name: "Victoria Q.", text: "The toy packaging is adorable and eco-friendly.", rating: 5, type: "toys" },
  { id: 19, name: "Evelyn Z.", text: "The plush unicorn is a bedtime favorite.", rating: 5, type: "toys" },
  { id: 20, name: "Stella M.", text: "My kids play with these toys every day!", rating: 5, type: "toys" },

  // Nail reviews
  { id: 21, name: "Bella H.", text: "The pastel press-ons are so easy to apply and look amazing!", rating: 5, type: "nails" },
  { id: 22, name: "Jasmine T.", text: "Love the Y2K nail art stickers. Super cute designs!", rating: 4.5, type: "nails" },
  { id: 23, name: "Sienna W.", text: "My nails have never looked this good. Salon quality!", rating: 5, type: "nails" },
  { id: 24, name: "Ruby G.", text: "The nail polish colors are vibrant and last long.", rating: 4.5, type: "nails" },
  { id: 25, name: "Isla S.", text: "Fast shipping and adorable packaging for nail kits.", rating: 5, type: "nails" },
];

function getRandomIndex(length: number, prevIndex: number): number {
  let idx = Math.floor(Math.random() * length);
  // Avoid repeat
  if (idx === prevIndex) idx = (idx + 1) % length;
  return idx;
}

export default function Testimonials({ embedded = true, type }: { embedded?: boolean; type?: "boutique" | "toys" }) {
  const filteredReviews = type ? reviews.filter(r => r.type === type) : reviews;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => getRandomIndex(filteredReviews.length, prevIndex));
    }, 4000);
    return () => clearInterval(interval);
  }, [filteredReviews.length]);

  const stars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <span key={i} className="text-amber-400 text-sm">★</span>
        ))}
        {half && <span className="text-amber-300 text-sm">★</span>}
      </div>
    );
  };

  const body = (
    <div className="relative w-full max-w-lg mx-auto mt-6">
      <div className="relative rounded-3xl p-8 bg-white/25 backdrop-blur-xl border border-white/80 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.85),transparent_60%)]" />
        <div className="relative flex flex-col items-center text-center text-black min-h-[160px]">
          <p className="text-base md:text-lg font-bold font-sans text-black dark:text-[#f3f3f7] italic leading-relaxed mb-4 max-w-sm drop-shadow-lg">
            “{filteredReviews[index].text}”
          </p>
          <p className="font-extrabold text-black dark:text-[#f3f3f7] text-sm font-sans drop-shadow-lg">— {filteredReviews[index].name}</p>
          <div className="mt-2">{stars(filteredReviews[index].rating)}</div>
          <div className="absolute bottom-2 right-3 text-[10px] tracking-widest text-black dark:text-[#f3f3f7] font-bold select-none font-sans">
            {index + 1}/{filteredReviews.length}
          </div>
        </div>
      </div>
      {/* progress bar */}
      <div className="mt-4 h-1 w-full bg-white/50 rounded-full overflow-hidden">
        <div
          key={index}
          className="h-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 animate-[progress_4s_linear]"
        />
      </div>
      <style jsx>{`
        @keyframes progress { from { transform: translateX(-100%);} to { transform: translateX(0);} }
      `}</style>
    </div>
  );

  if (embedded) return body;

  return (
    <section className="mt-20 text-center px-4">
      <h2 className="font-shuneva text-3xl font-extrabold tracking-wide text-black dark:text-[#f3f3f7] drop-shadow-lg">
        Customer Love
      </h2>
      <p className="font-shuneva text-black dark:text-[#f3f3f7] text-base mt-2 font-bold drop-shadow-lg">What our divas are saying!</p>
      {body}
    </section>
  );
}