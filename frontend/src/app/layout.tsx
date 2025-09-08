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
  title: "Diva Factory | Luxury Press-On Nails, Toys & Boutique - Y2K Aesthetic",
  description: "Premium press-on nails, collectible toys & kawaii boutique finds. Express your Y2K aesthetic with our curated luxury collection. Free shipping on orders $50+",
  keywords: 'press-on nails, Y2K nails, kawaii accessories, luxury nail art, custom press-ons, nail trends 2025, cute nail designs, aesthetic nails, Las Vegas nails, Nevada nail salon, artificial nails, nail extensions, trendy nails, fashionable nails, Instagram nails',
  authors: [{ name: "Diva Factory" }],
  creator: "Diva Factory",
  publisher: "Diva Factory",
  openGraph: {
    title: "Diva Factory | Luxury Press-On Nails, Collectable toys & Y2K Boutique",
    description: "Premium press-on nails, collectible toys & kawaii boutique finds. Express your Y2K aesthetic with our curated luxury collection.",
    url: "https://divanails.com",
    siteName: "Diva Factory",
    images: [
      {
        url: "/uploads/divanailslogo.png",
        width: 800,
        height: 800,
        alt: "Diva Factory Logo"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diva Factory | Luxury Press-On Nails & Y2K Boutique",
    description: "Premium press-on nails, collectible toys & kawaii boutique finds. Express your Y2K aesthetic.",
    images: ["/uploads/divanailslogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `,
          }}
        />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fsitfoxofpsynhncpxjs.supabase.co" />
        {/* Canonical URL */}
        <link rel="canonical" href="https://divanails.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${shuneva.variable} antialiased min-h-screen flex flex-col transition-colors duration-300`}>
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
