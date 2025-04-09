"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-200 to-blue-200 text-gray-900">
      <div className="container mx-auto px-4 py-24">
        {/* Page Title */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-widest drop-shadow-md">
            💖 Nail Care & Tips
          </h1>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed font-medium text-gray-700 mt-4">
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
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
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
                  <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                  <p className="text-gray-700 mt-2">{post.excerpt}</p>

                  {/* Read More Button */}
                  <button 
                    onClick={() => toggleExpand(post.id)}
                    className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg w-full hover:opacity-90 transition duration-300 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "Hide Tips" : "Read More"}
                  </button>
                  
                  {/* Expanded Content */}
                  {isExpanded && (
                    <div 
                      className="mt-4 p-4 bg-gray-100 text-gray-800 rounded-lg shadow-inner animate-[fadeIn_0.3s_ease-in-out]"
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