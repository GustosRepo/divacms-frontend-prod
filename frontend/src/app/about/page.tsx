"use client";

export default function About() {
  return (
    <div className="min-h-screen text-gray-900">
      <div className="container mx-auto p-10 text-center pt-24">

        {/* Page Header */}
        <h1 className="font-shuneva text-6xl font-extrabold text-gray-900 tracking-widest drop-shadow-md">
          ✨ DIVA FACTORY ✨
        </h1>
        <p className="font-shuneva max-w-3xl mx-auto text-lg leading-relaxed font-medium text-gray-700 mt-4">
          Your pastel Y2K destination for luxury press-on nails, collectible toys, and kawaii boutique finds! Express your unique style with our curated collection.
        </p>

        {/* 🔹 Floating Card Sections */}
        <div className="grid md:grid-cols-3 gap-10 mt-16">
          
                    {/* Card 1: Our Mission */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-pink-200">
            <h2 className="font-shuneva text-2xl font-bold text-gray-900 mb-3">� Our Mission</h2>
            <p className="font-shuneva text-gray-700">
              We curate the cutest Y2K and kawaii lifestyle products - from luxury press-on nails to collectible toys and boutique accessories that spark joy.
            </p>
          </div>

          {/* Card 2: Why Choose Us */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-purple-200">
            <h2 className="font-shuneva text-2xl font-bold text-gray-900 mb-3">� Why Choose Us?</h2>
            <p className="font-shuneva text-gray-700">
              **Trendy, kawaii, and authentic** – we're your one-stop shop for everything pastel, sparkly, and Instagram-worthy. Made for divas who love to stand out!
            </p>
          </div>

          {/* Card 3: Eco-Friendly & Ethical */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2 border border-blue-200">
            <h2 className="font-shuneva text-2xl font-bold text-gray-900 mb-3">🌱 Sustainable & Ethical</h2>
            <p className="font-shuneva text-gray-700">
              **Quality over quantity** – our reusable nails, curated toys, and boutique finds are built to last. Cute doesn't have to compromise the planet! 🌍
            </p>
          </div>
        </div>

        {/* 🔹 Trust & Testimonials Section */}
        <div className="mt-20">
          <h2 className="font-shuneva text-4xl font-bold text-gray-900">💖 Loved by Divas Worldwide</h2>
          <p className="font-shuneva text-lg text-gray-700 mt-2">50,000+ happy customers across nails, toys & boutique!</p>

          <div className="flex flex-wrap justify-center gap-8 mt-12">
            
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-2">
              <p className="font-shuneva text-gray-700">&quot;Obsessed with my press-ons AND the kawaii plushies! Everything is so cute!&quot;</p>
              <h3 className="font-shuneva text-sm font-bold mt-3">– Sophia R.</h3>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-2">
              <p className="font-shuneva text-gray-700">&quot;Best place for Y2K vibes! My nails, room decor, and toy collection are all from here!&quot;</p>
              <h3 className="font-shuneva text-sm font-bold mt-3">– Emily K.</h3>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg w-80 border border-gray-200 hover:shadow-xl transition transform hover:-translate-y-2">
              <p className="font-shuneva text-gray-700">&quot;Quality is amazing! My nails last weeks and the toys are collector-worthy. 100% recommend!&quot;</p>
              <h3 className="font-shuneva text-sm font-bold mt-3">– Jasmine P.</h3>
            </div>
          </div>
        </div>

        {/* 🔹 Social & CTA */}
        <div className="mt-20">
          <h2 className="font-shuneva text-4xl font-bold text-gray-900">📲 Follow Us</h2>
          <p className="font-shuneva text-lg text-gray-700 mt-2">Stay updated with the latest drops & kawaii finds:</p>

          <div className="flex justify-center mt-6 space-x-8">
            <a href="https://instagram.com" target="_blank" className="font-shuneva hover:text-pink-600 text-pink-500 font-semibold text-lg transition-all duration-300">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" className="font-shuneva hover:text-black text-gray-800 font-semibold text-lg transition-all duration-300">
              TikTok
            </a>
            <a href="https://facebook.com" target="_blank" className="font-shuneva hover:text-blue-600 text-blue-500 font-semibold text-lg transition-all duration-300">
              Facebook
            </a>
          </div>

            <button 
            className="font-shuneva mt-10 px-8 py-3 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 transition duration-300 transform hover:-translate-y-1"
            onClick={() => window.location.href = '/shop'}
            >
            ✨ Shop All Cute Things
            </button>
        </div>


      </div>
    </div>
  );
}