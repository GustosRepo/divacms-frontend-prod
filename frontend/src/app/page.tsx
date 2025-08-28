import { Metadata } from "next";
import Hero from "../components/Hero";
import BestSellers from "@/components/BestSeller";
import Testimonials from "@/components/Testimonials";
import AboutSection from "@/components/AboutSection";
import ProductList from "../components/ProductList";

export const metadata: Metadata = {
  title: "Diva Factory | Labubu Collectibles, Kawaii Boutique & Y2K Nails | Vegas Kawaii HQ",
  description: "Vegas's ultimate kawaii destination! Authentic Labubu collectibles, Pop Mart blind boxes, kawaii boutique accessories & custom Y2K press-on nails.",
  openGraph: {
    title: "Diva Factory | Labubu Collectibles, Kawaii Boutique & Y2K Nails", 
    description: "Vegas's kawaii paradise! Labubu collectibles, kawaii boutique & custom nails.",
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://divanails.com',
    name: 'Diva Factory',
    description: 'Vegas kawaii paradise! Labubu collectibles, kawaii boutique accessories, and Y2K press-on nails for kawaii enthusiasts',
    url: 'https://divanails.com',
    logo: 'https://divanails.com/uploads/divanailslogo.svg',
    image: 'https://divanails.com/uploads/divanailslogo.svg',
    sameAs: [
      'https://instagram.com/divanails',
      'https://tiktok.com/@divanails',
      'https://facebook.com/divanails'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-DIVA-FAB',
      contactType: 'Customer Service',
      email: 'contact@divanails.com',
      areaServed: 'US',
      availableLanguage: 'English'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '34.0522',
      longitude: '-118.2437'
    },
    priceRange: '$15-$50',
    paymentAccepted: 'Cash, Credit Card, PayPal, Stripe',
    currenciesAccepted: 'USD',
    openingHours: 'Mo-Fr 09:00-17:00',
    servesCuisine: null,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Diva Factory Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Press-On Nails',
            description: 'Luxury reusable press-on nails in Y2K and kawaii designs'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Collectible Toys',
            description: 'Curated designer and vinyl collectible toys'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Boutique Accessories',
            description: 'Kawaii boutique accessories and statement pieces'
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 space-y-16">
        <BestSellers />
        <AboutSection />
        <ProductList />
        <Testimonials />
      </div>
    </>
  );
}