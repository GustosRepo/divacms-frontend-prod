import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 py-8 lg:py-12 bg-[#222] text-white w-full">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-6 lg:mb-8">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-shuneva text-base lg:text-lg font-bold mb-2 lg:mb-4 text-pink-400">Diva Factory</h3>
            <p className="text-gray-400 text-xs lg:text-sm">
              Your destination for luxury press-on nails, kawaii accessories, and Y2K aesthetic vibes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-shuneva text-sm lg:text-md font-bold mb-2 lg:mb-4 text-white">Quick Links</h4>
            <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
              <Link href="/shop" className="block hover:text-pink-400 transition-colors">Shop All</Link>
              <Link href="/shop?brand_segment=nails" className="block hover:text-pink-400 transition-colors">Press-On Nails</Link>
              <Link href="/faq" className="block hover:text-pink-400 transition-colors">FAQ</Link>
              <Link href="/contact" className="block hover:text-pink-400 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Guides & Resources */}
          <div>
            <h4 className="font-shuneva text-sm lg:text-md font-bold mb-2 lg:mb-4 text-white">Guides & Tips</h4>
            <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
              <Link href="/nail-guide" className="block hover:text-pink-400 transition-colors">Complete Nail Guide</Link>
              <Link href="/blog/y2k-nail-trends-2025" className="block hover:text-pink-400 transition-colors">Y2K Nail Trends</Link>
              <Link href="/blog/nail-care" className="block hover:text-pink-400 transition-colors">Nail Care Guide</Link>
              <Link href="/blog/kawaii-aesthetic-guide" className="block hover:text-pink-400 transition-colors">Kawaii Guide</Link>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-shuneva text-sm lg:text-md font-bold mb-2 lg:mb-4 text-white">Connect</h4>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1 lg:space-y-2 text-xs lg:text-sm">
              <Link href="https://instagram.com/thedivafactory" className="block hover:text-pink-400 transition-colors">📸 Instagram</Link>
              <Link href="https://instagram.com/divafactory.nails" className="block hover:text-pink-400 transition-colors">📌 Pinterest</Link>
              <Link href="https://tiktok.com/@thedivafactory" className="block hover:text-pink-400 transition-colors">🎵 TikTok</Link>
              <Link href="https://facebook.com/thedivafactory" className="block hover:text-pink-400 transition-colors">💬 Facebook</Link>
              <Link href="mailto:admin@thedivafactory.com" className="block hover:text-pink-400 transition-colors col-span-2 lg:col-span-1">📧 Email Us</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 pt-4 lg:pt-6 text-center">
          <p className="font-shuneva text-gray-400 text-xs lg:text-sm">
            &copy; {new Date().getFullYear()} Diva Factory. All rights reserved.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 lg:space-x-4 text-xs">
            <Link href="/privacy" className="text-gray-500 hover:text-pink-400 transition-colors">Privacy Policy</Link>
            <span className="text-gray-600">•</span>
            <Link href="/terms" className="text-gray-500 hover:text-pink-400 transition-colors">Terms of Service</Link>
            <span className="text-gray-600">•</span>
            <Link href="/shipping" className="text-gray-500 hover:text-pink-400 transition-colors">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}