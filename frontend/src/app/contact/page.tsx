import { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Customer Service & Local Pickup | Diva Factory",
  description:
    "Get in touch with Diva Factory! Customer service, local pickup in Los Angeles, wholesale inquiries, and press contact information.",
  keywords:
    "contact diva factory, customer service, local pickup Los Angeles, wholesale press-on nails, nail art inquiries, LA pickup location",
  openGraph: {
    title: "Contact Diva Factory | Customer Service & Local Pickup",
    description: "Get in touch with us! Customer service, LA pickup, and wholesale inquiries welcome.",
  },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Diva Factory',
    description: 'Premium press-on nails and kawaii accessories',
    url: 'https://divanails.com/contact',
    telephone: '+1-555-DIVA-123',
  email: 'admin@thedivafactory.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Kawaii Street',
      addressLocality: 'Las Vegas',
      addressRegion: 'NV',
      postalCode: '89101',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: '36.1699', longitude: '-115.1398' },
    openingHours: ['Mo-Fr 09:00-17:00', 'Sa 10:00-16:00'],
    areaServed: ['Los Angeles', 'California', 'United States'],
    serviceType: ['Press-On Nail Sales', 'Local Pickup', 'Nail Art Consultation'],
  } as const;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://thedivafactory.com' },
      { '@type': 'ListItem', position: 2, name: 'Contact', item: 'https://thedivafactory.com/contact' },
    ],
  } as const;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-6xl mx-auto px-4 py-24">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
          <span className="mx-2">→</span>
          <span className="text-fg/70">Contact</span>
        </nav>

        <header className="text-center mb-16">
          <h1 className="font-shuneva text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Get In Touch!{" "}
            <span
              className="emoji inline-block align-[-0.1em]"
              aria-hidden="true"
            >
              💌
            </span>
          </h1>
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            We'd love to hear from you! Whether you need help with your order, want to schedule a pickup,
            or have a custom design idea — we're here to help make your nail dreams come true!
          </p>
        </header>

        {/* Contact Form */}
        <section className="max-w-3xl mx-auto mb-20">
          <ContactForm />
        </section>

        {/* Contact Methods Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-pink-400 mb-3">Email Us</h3>
            <p className="text-gray-300 mb-3">For general inquiries and customer service</p>
            <a href="mailto:admin@thedivafactory.com" className="text-pink-300 hover:text-pink-200 font-semibold">
              admin@thedivafactory.com
            </a>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-purple-400 mb-3">Text/Call</h3>
            <p className="text-gray-300 mb-3">Quick questions and order updates</p>
            <a href="tel:+15553482123" className="text-purple-300 hover:text-purple-200 font-semibold">
              (555) DIVA-123
            </a>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-pink-900/30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Local Pickup</h3>
            <p className="text-gray-300 mb-3">Las Vegas area pickup location</p>
            <span className="text-blue-300 font-semibold">Las Vegas, NV</span>
          </div>

          <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-pink-400 mb-3">Wholesale</h3>
            <p className="text-gray-300 mb-3">Business and bulk orders</p>
            <a href="mailto:admin@thedivafactory.com" className="text-pink-300 hover:text-pink-200 font-semibold">
              admin@thedivafactory.com
            </a>
          </div>
        </section>

        {/* Quick Help */}
        <section className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-pink-400 text-center mb-6">Quick Help</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-3">Order Issues?</h3>
              <p className="text-gray-300 mb-4">Track your order, request changes, or report problems</p>
              <Link href="/track-order" className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg transition-all">
                Track Order
              </Link>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-3">Need Help?</h3>
              <p className="text-gray-300 mb-4">Application tips, sizing help, and care instructions</p>
              <Link href="/faq" className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg transition-all">
                View FAQ
              </Link>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-3">Learn More</h3>
              <p className="text-gray-300 mb-4">Nail care guides and trend inspiration</p>
              <Link href="/blog" className="inline-block bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg transition-all">
                Read Blog
              </Link>
            </div>
          </div>
        </section>

        {/* Local Pickup & Custom Orders */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-6">🚗 Local Pickup in Las Vegas</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">How It Works:</h3>
                <ol className="space-y-2 ml-4 list-decimal">
                  <li>Select "Local Pickup" at checkout</li>
                  <li>Complete your order (no shipping fee!)</li>
                  <li>We'll text you when ready (usually 2 hours)</li>
                  <li>Pick up from our Las Vegas location</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Pickup Hours:</h3>
                <ul className="space-y-1 ml-4 list-disc">
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Monday - Friday: 9 AM - 5 PM</li>
                    <li>Saturday: 10 AM - 4 PM</li>
                    <li>Sunday: By appointment only</li>
                  </ul>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">💎 Custom Orders</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Have a specific vision? We love creating custom nail sets for special events, brand collaborations,
                or just because you deserve something unique!
              </p>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Custom Options:</h3>
                <ul className="space-y-1 ml-4 list-disc">
                  <li>Personalized designs and colors</li>
                  <li>Wedding and event nail sets</li>
                  <li>Brand collaboration designs</li>
                  <li>Exclusive size modifications</li>
                </ul>
              </div>
              <p className="text-sm text-gray-400">
                Custom orders require 2-3 weeks lead time and have a minimum order requirement. Contact us for pricing!
              </p>
            </div>
          </div>
        </section>

        {/* Social & Reviews */}
        <section className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl p-8 text-center mb-16">
          <h2 className="text-3xl font-bold text-heading mb-6">Connect With Us! ✨</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Follow us for nail inspo, tutorials, and behind-the-scenes content! Tag us in your nail pics for a chance to be featured.
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-pink-400 hover:text-pink-300 text-2xl">📸 Instagram</a>
            <a href="#" className="text-purple-400 hover:text-purple-300 text-2xl">🎵 TikTok</a>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-2xl">💬 Twitter</a>
          </div>
          <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-heading mb-3">Leave a Review!</h3>
            <p className="mb-4 text-sm">
              Love your nails? We'd love to hear about it! Reviews help other nail lovers discover us.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg transition-all">
              Write Review
            </button>
          </div>
        </section>

        {/* Business Hours */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-pink-400 mb-6">Business Hours</h2>
          <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 5:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM PST</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-gray-400">Closed</span>
              </div>
            </div>
            <p className="text-sm text-fg/70 mt-4">
              Response time is typically within 24 hours during business days
            </p>
          </div>
        </section>
      </div>
  </>
  );
}
