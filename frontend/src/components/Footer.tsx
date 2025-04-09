import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 py-6 bg-[#222] text-white w-full text-center">
      <p className="text-gray-400">© {new Date().getFullYear()} Diva Nails Factory</p>
      <div className="flex justify-center space-x-4 mt-2">
        <Link href="https://instagram.com" className="hover:text-pink-400">Instagram</Link>
        <Link href="https://tiktok.com" className="hover:text-pink-400">TikTok</Link>
        <Link href="mailto:contact@divanails.com" className="hover:text-pink-400">Contact</Link>
        
      </div>
    </footer>
  );
}