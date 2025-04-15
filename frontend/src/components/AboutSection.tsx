import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="mt-20 text-center relative py-12 px-6">
      <h2 className="text-3xl font-bold glitch text-white">💖 ABOUT US</h2>
      <p className="text-gray-800 text-sm mt-2 max-w-2xl mx-auto">
        Diva Factory Nails is all about **luxury press-on nails** that are
        handmade, durable, and stylish! We craft each set with **love &
        precision**, so you can **slay effortlessly**. 💅✨
      </p>

      {/* Image */}
      <div className="relative flex justify-center mt-6">
        <Image
          src={"${process.env.NEXT_PUBLIC_API_URL}/uploads/aboutplace.jpg"}
          alt="About Diva Factory Nails"
          width={500}
          height={300}
          className="rounded-lg shadow-lg border-4 border-pink-500 glitch-border"
        />
      </div>

      {/* CTA Button */}
      <Link href="/about">
        <button className="mt-6 bg-pink-500 hover:bg-pink-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition transform hover:scale-105 glitch-button">
          Learn More
        </button>
      </Link>
    </section>
  );
}
