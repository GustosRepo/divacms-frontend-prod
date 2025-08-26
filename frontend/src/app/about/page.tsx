"use client";

export default function About() {
  return (
    <div className="min-h-screen relative text-gray-900 overflow-x-hidden">
      {/* Sparkle Animation */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="animate-pulse-sparkle absolute top-24 left-1/4 w-8 h-8 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-60" />
        <div className="animate-pulse-sparkle absolute top-1/2 left-2/3 w-6 h-6 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-40" />
        <div className="animate-pulse-sparkle absolute bottom-20 right-1/4 w-10 h-10 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-50" />
        <div className="animate-pulse-sparkle absolute bottom-10 left-1/3 w-7 h-7 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-30" />
      </div>
      <div className="container mx-auto p-10 text-center pt-24 relative z-10">

        {/* Page Header */}
        <h1 className="font-shuneva text-6xl font-extrabold text-pink-600 tracking-widest drop-shadow-[0_2px_12px_rgba(255,0,180,0.18)] bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-400 text-transparent">
          ✨ DIVA FACTORY ✨
        </h1>
        <p className="font-shuneva max-w-3xl mx-auto text-lg leading-relaxed font-medium text-fuchsia-700 mt-4 drop-shadow-sm">
          Your pastel Y2K destination for luxury press-on nails, collectible toys, and kawaii boutique finds! Express your unique style with our curated collection.
        </p>

        {/* 🔹 Floating Card Sections */}
        <div className="grid md:grid-cols-3 gap-10 mt-16">
          {/* Card 1: Our Mission */}
          <div className="bg-white/90 p-6 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-pink-200 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-20 rotate-12" />
            <h2 className="font-shuneva text-2xl font-bold text-pink-500 mb-3 drop-shadow-sm">🌸 Our Mission</h2>
              <p className="font-shuneva text-gray-700">
              We curate the cutest Y2K and kawaii lifestyle products - from luxury press-on nails to collectible toys and boutique accessories that spark joy.
            </p>
          </div>

          {/* Card 2: Why Choose Us */}
          <div className="bg-white/90 p-6 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-purple-200 relative overflow-hidden">
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-20 -rotate-12" />
            <h2 className="font-shuneva text-2xl font-bold text-fuchsia-500 mb-3 drop-shadow-sm">💖 Why Choose Us?</h2>
            <p className="font-shuneva text-gray-700">
              <span className="font-bold text-fuchsia-400">Trendy, kawaii, and authentic</span> – we're your one-stop shop for everything pastel, sparkly, and Instagram-worthy. Made for divas who love to stand out!
            </p>
          </div>

          {/* Card 3: Eco-Friendly & Ethical */}
          <div className="bg-white/90 p-6 rounded-xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2 border-2 border-blue-200 relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-[url('/star.svg')] bg-no-repeat bg-center opacity-20 rotate-6" />
            <h2 className="font-shuneva text-2xl font-bold text-blue-500 mb-3 drop-shadow-sm">🌱 Sustainable & Ethical</h2>
            <p className="font-shuneva text-gray-700">
              <span className="font-bold text-blue-400">Quality over quantity</span> – our reusable nails, curated toys, and boutique finds are built to last. Cute doesn't have to compromise the planet! 🌍
            </p>
          </div>
        </div>

        {/* 🔹 Trust & Testimonials Section */}
        <div className="mt-20">
          <h2 className="font-shuneva text-4xl font-bold text-fuchsia-600 drop-shadow-sm">💖 Loved by Divas Worldwide</h2>
          <p className="font-shuneva text-lg text-pink-700 mt-2">50,000+ happy customers across nails, toys & boutique!</p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {/* Testimonial 1 */}
            <div className="bg-white/90 p-6 rounded-xl shadow-xl w-80 border-2 border-pink-200 hover:shadow-2xl transition transform hover:-translate-y-2">
              <p className="font-shuneva text-fuchsia-700">&quot;Obsessed with my press-ons AND the kawaii plushies! Everything is so cute!&quot;</p>
              <h3 className="font-shuneva text-sm font-bold mt-3 text-pink-500">– Sophia R.</h3>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/90 p-6 rounded-xl shadow-xl w-80 border-2 border-purple-200 hover:shadow-2xl transition transform hover:-translate-y-2">
              <p className="font-shuneva text-fuchsia-700">&quot;Best place for Y2K vibes! My nails, room decor, and toy collection are all from here!&quot;</p>
              <h3 className="font-shuneva text-sm font-bold mt-3 text-fuchsia-500">– Emily K.</h3>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/90 p-6 rounded-xl shadow-xl w-80 border-2 border-blue-200 hover:shadow-2xl transition transform hover:-translate-y-2">
              <p className="font-shuneva text-fuchsia-700">&quot;Quality is amazing! My nails last weeks and the toys are collector-worthy. 100% recommend!&quot;</p>
              <h3 className="font-shuneva text-sm font-bold mt-3 text-blue-500">– Jasmine P.</h3>
            </div>
          </div>
        </div>

        {/* 🔹 Social & CTA */}
        <div className="mt-20">
          <h2 className="font-shuneva text-4xl font-bold text-blue-500 drop-shadow-sm">📲 Follow Us</h2>
          <p className="font-shuneva text-lg text-fuchsia-700 mt-2">Stay updated with the latest drops & kawaii finds:</p>

          <div className="flex justify-center mt-6 space-x-8">
            <a href="https://instagram.com" target="_blank" className="font-shuneva hover:text-pink-600 text-pink-500 font-semibold text-lg transition-all duration-300">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" className="font-shuneva hover:text-black text-fuchsia-700 font-semibold text-lg transition-all duration-300">
              TikTok
            </a>
            <a href="https://facebook.com" target="_blank" className="font-shuneva hover:text-blue-600 text-blue-500 font-semibold text-lg transition-all duration-300">
              Facebook
            </a>
          </div>

            <button 
            className="font-shuneva mt-10 px-8 py-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 transition duration-300 transform hover:-translate-y-1 drop-shadow-lg"
            onClick={() => window.location.href = '/shop'}
            >
            ✨ Shop All Cute Things
            </button>
        </div>

      </div>
    </div>
  );
}