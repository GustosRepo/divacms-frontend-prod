import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 py-12 bg-[#222] text-white w-full">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-shuneva text-lg font-bold mb-4 text-pink-400">Diva Factory</h3>
            <p className="text-gray-400 text-sm">
              Your destination for luxury press-on nails, kawaii accessories, and Y2K aesthetic vibes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-shuneva text-md font-bold mb-4 text-white">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/shop" className="block hover:text-pink-400 transition-colors">Shop All</Link>
              <Link href="/shop?brand_segment=nails" className="block hover:text-pink-400 transition-colors">Press-On Nails</Link>
              <Link href="/faq" className="block hover:text-pink-400 transition-colors">FAQ</Link>
              <Link href="/contact" className="block hover:text-pink-400 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Guides & Resources */}
          <div>
            <h4 className="font-shuneva text-md font-bold mb-4 text-white">Guides & Tips</h4>
            <div className="space-y-2 text-sm">
              <Link href="/nail-guide" className="block hover:text-pink-400 transition-colors">Complete Nail Guide</Link>
              <Link href="/blog/y2k-nail-trends-2025" className="block hover:text-pink-400 transition-colors">Y2K Nail Trends</Link>
              <Link href="/blog/press-on-nail-care-guide" className="block hover:text-pink-400 transition-colors">Nail Care Guide</Link>
              <Link href="/blog/kawaii-aesthetic-guide" className="block hover:text-pink-400 transition-colors">Kawaii Guide</Link>
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="font-shuneva text-md font-bold mb-4 text-white">Connect</h4>
            <div className="space-y-2 text-sm">
              <Link href="https://instagram.com" className="block hover:text-pink-400 transition-colors">📸 Instagram</Link>
              <Link href="https://tiktok.com" className="block hover:text-pink-400 transition-colors">🎵 TikTok</Link>
              <Link href="https://facebook.com" className="block hover:text-pink-400 transition-colors">💬 Facebook</Link>
              <Link href="mailto:hello@divanails.com" className="block hover:text-pink-400 transition-colors">📧 Email Us</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 pt-6 text-center">
          <p className="font-shuneva text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Diva Factory. All rights reserved.
          </p>
          <div className="mt-2 space-x-4 text-xs">
            <Link href="/privacy" className="text-gray-500 hover:text-pink-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-pink-400 transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="text-gray-500 hover:text-pink-400 transition-colors">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}