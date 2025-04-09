"use client";

export default function About() {
  return (
    <div className="min-h-screen text-gray-900">
      <div className="container mx-auto p-10 text-center pt-24">

        {/* Page Header */}
        <h1 className="text-6xl font-extrabold text-gray-900 tracking-widest drop-shadow-md">
          ✨ DIVA FACTORY NAILS ✨
        </h1>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed font-medium text-gray-700 mt-4">
          Elevate your nail game with **luxury press-ons** designed for style, confidence, and self-expression.
        </p>

        {/* 🔹 Floating Card Sections */}
        <div className="grid md:grid-cols-3 gap-10 mt-16">
          
          {/* Card 1: Our Mission */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-pink-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">💅 Our Mission</h2>
            <p className="text-gray-700">
              We bring **high-quality, reusable press-on nails** to trendsetters who want salon-perfect nails in minutes.
            </p>
          </div>

          {/* Card 2: Why Choose Us */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">🌟 Why Choose Us?</h2>
            <p className="text-gray-700">
              **Trendy, chic, and effortless** – our nails are made for **divas** who demand perfection without the hassle.
            </p>
          </div>

          {/* Card 3: Eco-Friendly & Ethical */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">🌱 Eco-Friendly</h2>
            <p className="text-gray-700">
              **Sustainable beauty** that’s cruelty-free & reusable – because glam should never harm the planet. 🌍
            </p>
          </div>
        </div>

        {/* 🔹 Trust & Testimonials Section */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-gray-900">💖 Trusted by Thousands</h2>
          <p className="text-lg text-gray-700 mt-2">50,000+ happy customers worldwide!</p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-2">
              <p className="text-gray-700">"Literally obsessed! So easy to apply & last for weeks!"</p>
              <h3 className="text-sm font-bold mt-3">– Sophia R.</h3>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-2">
              <p className="text-gray-700">"Salon-quality nails without the price tag. Love it!"</p>
              <h3 className="text-sm font-bold mt-3">– Emily K.</h3>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-2">
              <p className="text-gray-700">"Game changer! So pretty and reusable. 100% recommended!"</p>
              <h3 className="text-sm font-bold mt-3">– Jasmine P.</h3>
            </div>
          </div>
        </div>

        {/* 🔹 Social & CTA */}
        <div className="mt-20">
          <h2 className="text-4xl font-bold text-gray-900">📲 Follow Us</h2>
          <p className="text-lg text-gray-700 mt-2">Stay updated with the latest trends & deals:</p>

          <div className="flex justify-center mt-6 space-x-8">
            <a href="https://instagram.com" target="_blank" className="hover:text-pink-600 text-pink-500 font-semibold text-lg transition-all duration-300">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" className="hover:text-black text-gray-800 font-semibold text-lg transition-all duration-300">
              TikTok
            </a>
            <a href="https://facebook.com" target="_blank" className="hover:text-blue-600 text-blue-500 font-semibold text-lg transition-all duration-300">
              Facebook
            </a>
          </div>

            <button 
            className="mt-10 px-8 py-3 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 transition duration-300 transform hover:-translate-y-1"
            onClick={() => window.location.href = '/shop'}
            >
            💅 Shop the Collection
            </button>
        </div>

        {/* 🔹 Footer */}
        <footer className="mt-24 text-gray-700 text-sm">
          © 2025 **Diva Nails Factory** |  
          <a href="/contact" className="ml-2 hover:text-pink-500 transition">Contact Us</a>
        </footer>

      </div>
    </div>
  );
}