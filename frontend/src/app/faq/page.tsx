import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press-On Nails FAQ | Application, Care & Shipping | Diva Factory",
  description: "Everything you need to know about press-on nails! Application tips, care instructions, sizing guide, and shipping information for luxury Y2K nail art.",
  keywords: "press-on nails FAQ, how to apply press-on nails, nail care tips, press-on nail sizing, shipping information, nail removal, Y2K nails guide",
  openGraph: {
    title: "Press-On Nails FAQ | Complete Guide | Diva Factory",
    description: "Everything you need to know about press-on nails! Application, care, sizing, and more.",
  },
};

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How long do press-on nails last?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'With proper application and care, our premium press-on nails can last 1-2 weeks. Factors like nail prep, application technique, and daily activities affect longevity.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I apply press-on nails?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Clean and prep your natural nails, select the correct size for each nail, apply a thin layer of nail glue, press firmly for 10-15 seconds, and file to desired length and shape.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you offer free shipping?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! We offer free shipping on orders over $250 within the United States. We also offer local pickup in Los Angeles for free shipping regardless of order amount.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I remove press-on nails safely?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Soak your nails in warm soapy water for 10-15 minutes, then gently lift from the cuticle area. Never force or pull them off. Use cuticle oil afterward to moisturize.'
        }
      }
    ]
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://thedivafactory.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
        item: 'https://thedivafactory.com/faq'
      }
    ]
  };

  const faqs = [
    {
      category: "Application & Removal",
      questions: [
        {
          q: "How long do press-on nails last?",
          a: "With proper application and care, our premium press-on nails can last 1-2 weeks. Factors that affect longevity include nail preparation, application technique, daily activities, and exposure to water. For maximum wear time, follow our detailed application guide and aftercare tips."
        },
        {
          q: "How do I apply press-on nails properly?",
          a: "1. Clean and push back cuticles, 2. Buff nail surface lightly, 3. Clean with alcohol, 4. Select correct size for each nail, 5. Apply thin layer of included glue, 6. Press firmly for 10-15 seconds, 7. File and shape to desired length. Full video tutorial available on our blog!"
        },
        {
          q: "How do I remove press-on nails safely?",
          a: "Never force or pull! Soak nails in warm soapy water for 10-15 minutes to soften the adhesive. Gently lift from the cuticle area using a cuticle pusher. If resistant, soak longer. Apply cuticle oil afterward to moisturize your natural nails."
        },
        {
          q: "Can I reuse press-on nails?",
          a: "Yes! If removed carefully and stored properly, many of our sets can be reused 2-3 times. Clean off old adhesive with alcohol, store in the original packaging, and reapply with fresh nail glue for best results."
        },
        {
          q: "What if a nail pops off?",
          a: "Clean both the press-on nail and your natural nail with alcohol, apply a small amount of nail glue, and repress firmly. This is why we include extra glue and backup nails in our deluxe sets!"
        }
      ]
    },
    {
      category: "Sizing & Fit",
      questions: [
        {
          q: "How do I find my correct nail size?",
          a: "Each set includes 12 sizes (0-11) to fit most nail beds. Hold each press-on against your nail - it should cover your nail bed from side to side without touching your skin. When in doubt, choose the smaller size and file the sides to fit perfectly."
        },
        {
          q: "What if none of the sizes fit?",
          a: "Our sets accommodate 98% of nail sizes, but if you need custom sizing, contact us! We offer custom sizing services for an additional fee. You can also file the sides of a slightly larger nail to achieve the perfect fit."
        },
        {
          q: "Do you have sizes for very small or large nails?",
          a: "Yes! Our 12-size range includes very small (sizes 9-11) and larger sizes (0-2). We also carry XS and XL specialty sets for extreme sizing needs. Check our sizing guide for detailed measurements."
        }
      ]
    },
    {
      category: "Shipping & Orders",
      questions: [
        {
          q: "Do you offer free shipping?",
          a: "Yes! Free shipping on orders over $200 within the United States. Las Vegas customers can choose free local pickup to skip shipping entirely!"
        },
        {
          q: "How fast do orders ship?",
          a: "Orders placed before 2 PM PST ship same day! Standard shipping takes 3-5 business days. Express shipping arrives in 1-2 business days. Local LV pickup orders are ready within 2 hours."
        },
        {
          q: "Do you ship internationally?",
          a: "Currently we ship within the US only, but international shipping is coming soon! Follow us on social media for updates on when we'll be available in your country."
        },
        {
          q: "Can I track my order?",
          a: "Absolutely! You'll receive a tracking number via email once your order ships. You can also check your order status anytime by logging into your account on our website."
        },
        {
          q: "What's your return policy?",
          a: "We offer 30-day returns on unopened sets in original packaging. If you're not satisfied with your purchase, contact us within 30 days for a full refund. Opened sets can be exchanged for different sizes within 14 days."
        }
      ]
    },
    {
      category: "Care & Maintenance",
      questions: [
        {
          q: "How do I make my press-ons last longer?",
          a: "Apply a base coat before the press-ons, avoid excessive water exposure in the first 24 hours, wear gloves for cleaning/gardening, apply cuticle oil daily, and avoid using your nails as tools. Proper prep is 80% of longevity!"
        },
        {
          q: "Can I shower with press-on nails?",
          a: "Yes! After the initial 24-hour curing period, they're water-resistant. However, avoid prolonged soaking in hot water, and gently pat dry rather than rubbing. Apply cuticle oil after long baths."
        },
        {
          q: "Can I go swimming with press-ons?",
          a: "Yes, once fully cured (24 hours). Chlorine and salt water won't damage them, but prolonged exposure may weaken the adhesive. Rinse with fresh water after swimming and apply cuticle oil."
        },
        {
          q: "What if my press-on nail chips or breaks?",
          a: "Small chips can be filed smooth. For breaks, remove the damaged nail, clean your natural nail, and apply a new press-on from your backup set. This is why our deluxe sets include extras!"
        }
      ]
    },
    {
      category: "Product Questions",
      questions: [
        {
          q: "What materials are your nails made from?",
          a: "Our premium press-ons are made from high-quality ABS plastic that's durable, flexible, and long-lasting. They're non-toxic, cruelty-free, and designed to feel lightweight and natural on your nails."
        },
        {
          q: "Are your nails safe for sensitive skin?",
          a: "Yes! Our nails and adhesive are formulated to be gentle and non-irritating. However, if you have known allergies to acrylates or adhesives, please patch test first or consult your dermatologist."
        },
        {
          q: "Do you offer custom designs?",
          a: "We love creating custom designs! Contact us with your vision and we'll work with you to create something unique. Custom orders require a 2-3 week lead time and have a minimum order requirement."
        },
        {
          q: "What's the difference between your nail collections?",
          a: "Our Y2K collection features bold metallics and futuristic designs. The Kawaii collection has cute, pastel themes with 3D elements. Our Classic collection offers timeless French tips and neutral tones. All use the same premium materials."
        }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-24">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-pink-400 hover:text-pink-300">Home</Link>
          <span className="mx-2">→</span>
          <span className="text-gray-300">FAQ</span>
        </nav>

        <header className="text-center mb-16">
          <h1 className="font-shuneva text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Frequently Asked Questions{' '}
            <span
              className="emoji inline-block align-[-0.1em]"
              aria-hidden="true"
            >
              🤔
            </span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about our luxury press-on nails! From application tips to shipping info, we&apos;ve got you covered.
          </p>
        </header>

        {/* Quick Links */}
        <section className="mb-12 bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-pink-400 mb-4 text-center">Quick Navigation</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {faqs.map((category) => (
              <a
                key={category.category}
                href={`#${category.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-colors"
              >
                {category.category}
              </a>
            ))}
          </div>
        </section>

        {faqs.map((category, categoryIndex) => (
          <section key={categoryIndex} className="mb-12">
            <h2 
              id={category.category.toLowerCase().replace(/\s+/g, '-')}
              className="text-3xl font-bold text-pink-400 mb-8 text-center"
            >
              {category.category}
            </h2>
            <div className="space-y-6">
              {category.questions.map((faq, faqIndex) => (
                <details 
                  key={faqIndex}
                  className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-6 group"
                >
                  <summary className="text-lg font-semibold text-white cursor-pointer hover:text-pink-300 transition-colors list-none">
                    <div className="flex items-center justify-between">
                      <span>{faq.q}</span>
                      <span className="text-pink-400 text-2xl group-open:rotate-45 transition-transform">+</span>
                    </div>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* Still Have Questions Section */}
        <section className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl p-8 text-center mt-16">
          <h2 className="text-3xl font-bold text-heading mb-4">Still Have Questions? 💭</h2>
            <p className="mb-6 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our customer service team is here to help! We typically respond within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
            >
              Contact Us
            </Link>
            <Link 
              href="/nail-guide" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
            >
              Read Care Guide
            </Link>
          </div>
        </section>

        {/* Related Links */}
        <section className="mt-12 text-center">
          <h3 className="text-xl font-bold text-pink-400 mb-4">Related Resources</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {/*<Link href="/blog/nail-care" className="text-blue-400 hover:text-blue-300">Nail Care Blog</Link>
             <Link href="/size-guide" className="text-blue-400 hover:text-blue-300">Sizing Guide</Link>
            <Link href="/application-guide" className="text-blue-400 hover:text-blue-300">Application Tutorial</Link> */}
            <Link href="/faq/shipping-info" className="text-blue-400 hover:text-blue-300">Shipping Information</Link>
          </div>
        </section>
      </div>
    </>
  );
}
