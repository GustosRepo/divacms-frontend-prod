"use client";
import { useState, useEffect } from "react";

interface Review {
  id: number;
  name: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  { id: 1, name: "Emily R.", text: "These nails are AMAZING! 💅✨", rating: 5 },
  { id: 2, name: "Sophia M.", text: "Obsessed with the quality & style! 😍", rating: 5 },
  { id: 3, name: "Olivia J.", text: "They last so long & feel so natural!", rating: 4.5 },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 4000); // Auto-switch every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-10 text-center">
      <h2 className="text-3xl font-bold glitch text-white">💬 CUSTOMER REVIEWS</h2>
      <p className="text-gray-800 text-sm mt-2">What our divas are saying!</p>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6 max-w-lg mx-auto">
        <p className="text-gray-800 italic">“{reviews[index].text}”</p>
        <p className="font-bold text-pink-500 mt-2">— {reviews[index].name}</p>
        <div className="text-yellow-400 text-lg">
          {"⭐".repeat(Math.floor(reviews[index].rating))}
          {reviews[index].rating % 1 !== 0 && "⭐"}
        </div>
      </div>
    </section>
  );
}