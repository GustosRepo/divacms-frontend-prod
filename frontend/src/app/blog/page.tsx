"use client";
import { useState } from "react";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "💅 How to Apply Press-On Nails Like a Pro",
    excerpt: "Get a flawless, salon-quality application at home with these easy steps...",
    content: "Start with clean, dry nails. Push back cuticles and lightly buff the surface. Choose the right size nails, apply adhesive, and press firmly for 30 seconds. Avoid water for the first hour to ensure long-lasting wear!",
    image: "/uploads/set1.jpg",
  },
  {
    id: 2,
    title: "🛁 Removing Press-On Nails Without Damage",
    excerpt: "Safely remove your press-on nails without harming your natural nails...",
    content: "Soak nails in warm, soapy water for 10-15 minutes. Gently lift the edges with a cuticle stick and never force removal! Use an acetone-free nail polish remover to dissolve any residue.",
    image: "/uploads/set2.jpg",
  },
  {
    id: 3,
    title: "✨ Nail Care 101: Keeping Your Nails Healthy",
    excerpt: "Tips to keep your natural nails strong, even when using press-ons...",
    content: "Moisturize your cuticles daily, avoid harsh chemicals, and take biotin supplements for stronger nails. Always give your nails a break between applications!",
    image: "/uploads/set3.jpg",
  },
];

export default function NailCare() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (postId: number) => {
    setExpandedId(expandedId === postId ? null : postId);
  };

  return (
    <main className="relative min-h-screen px-4 py-24 overflow-x-hidden">
      {/* light mode subtle overlays */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.5),transparent_60%)] dark:opacity-0 transition" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0)_50%)] dark:opacity-0 transition" />
      {/* dark mode atmospheric glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100 dark:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.10),transparent_70%)] transition" />
      <div className="relative container mx-auto">
        {/* Page Title */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-widest drop-shadow-md">
            💖 Nail Care & Tips
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed font-medium mt-4">
            Keep your nails looking flawless with our expert tips & tricks!
          </p>
        </header>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => {
            const isExpanded = expandedId === post.id;
            return (
              <div
                key={post.id}
                className="relative rounded-2xl overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.6)] transform transition-all duration-300 hover:scale-[1.025] hover:shadow-[0_10px_28px_-6px_rgba(0,0,0,0.32)] dark:hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.7)]"
              >
                {/* Image Container */}
                <div className="relative w-full h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={post.id <= 2}
                  />
                </div>

                {/* Content Container */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold">{post.title}</h2>
                  <p className="mt-2">{post.excerpt}</p>

                  {/* Read More Button */}
                  <button
                    onClick={() => toggleExpand(post.id)}
                    className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-4 py-2 rounded-lg w-full transition duration-300 focus:ring-2 focus:ring-pink-500/60 focus:outline-none shadow-md hover:shadow-lg"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "Hide Tips" : "Read More"}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div
                      className="mt-4 p-4 rounded-lg shadow-inner bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 animate-[fadeIn_0.3s_ease-in-out]"
                      role="region"
                      aria-label={`Additional content for ${post.title}`}
                    >
                      <p>{post.content}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}