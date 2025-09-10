/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press-On Nails Guide | Complete Beginner Tutorial | Diva Factory",
  description: "Complete guide to press-on nails! Learn everything from application to removal, sizing tips, and care instructions for long-lasting luxury nails.",
  keywords: "press-on nails guide, how to apply press-on nails, beginner nail tutorial, nail application guide, press-on nail tips, sizing guide",
  openGraph: {
    title: "Complete Press-On Nails Guide | Diva Factory",
    description: "Master press-on nails with our comprehensive guide! Application, care, sizing, and pro tips included.",
  },
};

export default function NailGuidePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Apply Press-On Nails',
    description: 'Complete step-by-step guide to applying press-on nails for long-lasting results',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '25-50'
    },
    totalTime: 'PT20M',
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Press-on nail set'
      },
      {
        '@type': 'HowToSupply', 
        name: 'Nail glue'
      },
      {
        '@type': 'HowToSupply',
        name: 'Nail file'
      },
      {
        '@type': 'HowToSupply',
        name: 'Alcohol or nail dehydrator'
      }
    ],
    step: [
      {
        '@type': 'HowToStep',
        text: 'Prep your natural nails by pushing back cuticles and lightly buffing the surface'
      },
      {
        '@type': 'HowToStep',
        text: 'Clean nails with alcohol to remove oils and debris'
      },
      {
        '@type': 'HowToStep',
        text: 'Select the correct size press-on nail for each finger'
      },
      {
        '@type': 'HowToStep',
        text: 'Apply a thin layer of nail glue to your natural nail'
      },
      {
        '@type': 'HowToStep',
        text: 'Press the press-on nail firmly for 10-15 seconds'
      },
      {
        '@type': 'HowToStep',
        text: 'File and shape to desired length'
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
        name: 'Blog',
        item: 'https://thedivafactory.com/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Nail Guide',
        item: 'https://thedivafactory.com/nail-guide'
      }
    ]
  };

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
          <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
          <span className="mx-2">→</span>
          <Link href="/blog" className="text-accent hover:text-accent/80">Blog</Link>
          <span className="mx-2">→</span>
          <span className="text-fg/70">Nail Guide</span>
        </nav>

        <header className="text-center mb-16">
          <h1 className="font-shuneva text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Complete Press-On Nails Guide
          </h1>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            Everything you need to know about press-on nails! From your first application to pro-level tips, this comprehensive guide will help you achieve salon-quality results at home.
          </p>
        </header>

        {/* Quick Navigation */}
        <section className="mb-12 bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-xl p-6">
          <h2 className="text-xl font-bold text-pink-400 mb-4 text-center">Quick Navigation</h2>
          <div className="grid md:grid-cols-4 gap-3 text-sm">
            <a href="#application" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full text-center transition-colors">Application</a>
            <a href="#sizing" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full text-center transition-colors">Sizing</a>
            <a href="#care" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full text-center transition-colors">Care & Maintenance</a>
            <a href="#removal" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full text-center transition-colors">Safe Removal</a>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-pink-400 mb-8">Getting Started 🌟</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-300 mb-4">What You'll Need</h3>
              <ul className=" space-y-2">
                <li>✨ Press-on nail set (12 sizes included)</li>
                <li>✨ Nail glue (included with our sets)</li>
                <li>✨ Nail file or buffer</li>
                <li>✨ Cuticle pusher</li>
                <li>✨ Alcohol or nail dehydrator</li>
                <li>✨ Small scissors (optional)</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-4">Time Investment</h3>
              <div className=" space-y-3">
                <div className="flex justify-between">
                  <span>First-time application:</span>
                  <span className="text-white">30-45 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Regular application:</span>
                  <span className="text-white">15-20 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Wear time:</span>
                  <span className="text-white">1-2 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Application */}
        <section id="application" className="mb-12">
          <h2 className="text-3xl font-bold text-pink-400 mb-8">Step-by-Step Application 📋</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Prep Your Natural Nails",
                description: "Push back cuticles, trim nails short, and lightly buff the surface to create texture for better adhesion. Remove any old polish completely.",
                tip: "Pro tip: Use a nail dehydrator or rubbing alcohol to remove all oils from your nail bed."
              },
              {
                step: 2,
                title: "Size Selection",
                description: "Test each press-on nail against your natural nails. The press-on should cover your nail bed from side to side without touching your skin.",
                tip: "When in doubt, choose the smaller size and file the sides to fit perfectly."
              },
              {
                step: 3,
                title: "Apply the Glue",
                description: "Place a small drop of glue on your natural nail, not the press-on. Less is more - you can always add more glue if needed.",
                tip: "Work on one nail at a time to prevent the glue from drying out."
              },
              {
                step: 4,
                title: "Press and Hold",
                description: "Place the press-on nail at a 45-degree angle, then lower it down. Press firmly for 10-15 seconds without sliding.",
                tip: "Apply pressure evenly across the entire nail surface for the strongest bond."
              },
              {
                step: 5,
                title: "File and Shape",
                description: "Once all nails are applied, file to your desired length and shape. File in one direction to prevent splitting.",
                tip: "Start with the longest length you want and gradually file shorter if needed."
              },
              {
                step: 6,
                title: "Final Touches",
                description: "Buff the seam where the press-on meets your natural nail for a seamless look. Apply cuticle oil around the edges.",
                tip: "Wait 24 hours before heavy water exposure for maximum adhesion."
              }
            ].map((step) => (
              <div key={step.step} className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className=" mb-3">{step.description}</p>
                    <div className="bg-blue-900/30 rounded-lg p-3">
                      <p className="text-blue-300 text-sm font-medium">{step.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sizing Guide */}
        <section id="sizing" className="mb-12">
          <h2 className="text-3xl font-bold text-pink-400 mb-8">Perfect Sizing Guide 📏</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-4">How to Measure</h3>
              <ol className=" space-y-3">
                <li>1. Hold each press-on against your nail bed</li>
                <li>2. It should cover side-to-side without touching skin</li>
                <li>3. Check that it doesn't overlap your cuticle area</li>
                <li>4. Choose the closest fit for each finger</li>
                <li>5. File sides if needed for perfect fit</li>
              </ol>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-300 mb-4">Size Chart Reference</h3>
              <div className=" space-y-2 text-sm">
                <div className="flex justify-between"><span>Size 0-2:</span><span>Large nail beds</span></div>
                <div className="flex justify-between"><span>Size 3-5:</span><span>Medium nail beds</span></div>
                <div className="flex justify-between"><span>Size 6-8:</span><span>Small nail beds</span></div>
                <div className="flex justify-between"><span>Size 9-11:</span><span>Very small nail beds</span></div>
              </div>
              <p className=" text-sm mt-4">
                Each set includes 12 sizes to accommodate all nail shapes and sizes.
              </p>
            </div>
          </div>
        </section>

        {/* Care and Maintenance */}
        <section id="care" className="mb-12">
          <h2 className="text-3xl font-bold text-pink-400 mb-8">Care & Maintenance 🧴</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-pink-300 mb-4">Daily Care</h3>
              <ul className=" space-y-2 text-sm">
                <li>• Apply cuticle oil daily</li>
                <li>• Wear gloves for cleaning</li>
                <li>• Avoid using nails as tools</li>
                <li>• Moisturize hands regularly</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-purple-300 mb-4">Water Activities</h3>
              <ul className=" space-y-2 text-sm">
                <li>• Wait 24h before swimming</li>
                <li>• Pat dry after washing</li>
                <li>• Avoid hot water soaks</li>
                <li>• Reapply cuticle oil after water</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-pink-900/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-300 mb-4">Quick Fixes</h3>
              <ul className=" space-y-2 text-sm">
                <li>• File small chips smooth</li>
                <li>• Add extra glue if lifting</li>
                <li>• Replace damaged nails quickly</li>
                <li>• Keep backup nails handy</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Safe Removal */}
        <section id="removal" className="mb-12">
          <h2 className="text-3xl font-bold text-pink-400 mb-8">Safe Removal Process 🛁</h2>
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Step-by-Step Removal</h3>
                <ol className=" space-y-3">
                  <li>1. Soak nails in warm soapy water for 10-15 minutes</li>
                  <li>2. Gently lift from the cuticle area using a cuticle pusher</li>
                  <li>3. Never force or pull - soak longer if resistant</li>
                  <li>4. Remove any residual glue with gentle buffing</li>
                  <li>5. Apply cuticle oil and hand cream afterward</li>
                </ol>
              </div>
              <div className="bg-red-900/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-300 mb-4">❌ Never Do This</h3>
                <ul className=" space-y-2">
                  <li>• Force or peel off press-ons</li>
                  <li>• Use acetone or harsh chemicals</li>
                  <li>• Pull at lifted edges</li>
                  <li>• Skip the soaking step</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pro Tips */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-pink-400 mb-8">Pro Tips for Best Results ⭐</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Make Them Last Longer",
                tips: [
                  "Apply a base coat before press-ons for extra bond",
                  "Avoid oil-based products on your nails",
                  "File seams smooth for professional look",
                  "Store unused nails properly for reuse"
                ]
              },
              {
                title: "Troubleshooting Common Issues",
                tips: [
                  "If lifting: add tiny drop of glue under lifted area",
                  "If too long: file gradually from both sides",
                  "If air bubbles: press out during application",
                  "If sizing issues: file sides carefully to fit"
                ]
              }
            ].map((section, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4">{section.title}</h3>
                <ul className=" space-y-2">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>💡 {tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-heading mb-4">Ready to Get Started? 🎉</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Now that you know all the secrets, it's time to try our premium press-on nails! Every set includes everything you need for perfect application.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/shop?brand_segment=nails" 
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
            >
              Shop Nail Sets
            </Link>
            <Link 
              href="/faq" 
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
            >
              View FAQ
            </Link>
          </div>
        </section>

        {/* Related Links */}
        <section className="mt-12 text-center">
          <h3 className="text-xl font-bold text-pink-400 mb-4">Related Guides</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/blog/press-on-nail-care-guide" className="text-blue-400 hover:text-blue-300">Detailed Care Guide</Link>
            <Link href="/blog/y2k-nail-trends-2025" className="text-blue-400 hover:text-blue-300">Y2K Nail Trends</Link>
            <Link href="/blog/kawaii-aesthetic-guide" className="text-blue-400 hover:text-blue-300">Kawaii Style Guide</Link>
            <Link href="/contact" className="text-blue-400 hover:text-blue-300">Need Help?</Link>
          </div>
        </section>
      </div>
    </>
  );
}
