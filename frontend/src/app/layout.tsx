import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Navbar from "../components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Add your custom font here
const shuneva = localFont({
  src: "../../public/fonts/Shuneva-Regular.otf",
  variable: "--font-shuneva",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diva Factory",
  description: "Luxury press-on nails, handcrafted for perfection.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${shuneva.variable} antialiased min-h-screen flex flex-col text-white transition-colors duration-300`}>
        {/* Skip link for keyboard users */}
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-3 py-2 rounded">Skip to content</a>
        <Providers>
          <Navbar />
          <main id="content" role="main" tabIndex={-1} className="flex-1 w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}