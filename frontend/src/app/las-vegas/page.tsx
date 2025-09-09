"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
// import Image from "next/image";

interface PopupEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

interface PopupFormData {
  title: string;
  description: string;
  emoji: string;
}

export default function LasVegasPage() {
  const { user } = useAuth();
  const [popupEvents, setPopupEvents] = useState<PopupEvent[]>([
    { id: '1', title: 'Las Vegas Market', description: 'First Sunday monthly', emoji: '🎰' },
    { id: '2', title: 'Vegas Strip Events', description: 'Seasonal shows', emoji: '🎭' },
    { id: '3', title: 'Vegas Beauty Expo', description: 'Coming this fall', emoji: '✨' },
    { id: '4', title: 'Casino Resort Partnerships', description: 'Monthly', emoji: '💎' }
  ]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PopupEvent | null>(null);
  const [formData, setFormData] = useState<PopupFormData>({
    title: "",
    description: "",
    emoji: ""
  });

  // Only allow admin users to access admin features
  const isAdmin = user?.isAdmin === true;

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      // Update existing event
      setPopupEvents(popupEvents.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData }
          : event
      ));
      setEditingEvent(null);
    } else {
      // Add new event
      const newEvent: PopupEvent = {
        id: Date.now().toString(),
        ...formData
      };
      setPopupEvents([...popupEvents, newEvent]);
    }
    
    // Reset form
    setFormData({ title: "", description: "", emoji: "" });
  };

  const handleEditEvent = (event: PopupEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      emoji: event.emoji
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this pop-up event?')) {
      setPopupEvents(popupEvents.filter(event => event.id !== eventId));
    }
  };
  const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Diva Factory - Las Vegas',
  description: 'Premium Labubu collectibles, kawaii boutique accessories, and Y2K press-on nails serving Las Vegas and Nevada',
  url: 'https://thedivafactory.com/las-vegas',
  image: 'https://thedivafactory.com/uploads/divanailslogo.png',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Las Vegas',
      addressRegion: 'NV',
      postalCode: '89101',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.1699,
      longitude: -115.1398
    },
    areaServed: [
      'Las Vegas',
      'Henderson',
      'North Las Vegas',
      'Paradise',
      'Summerlin',
      'Spring Valley',
      'Enterprise',
      'Sunrise Manor',
      'Winchester',
      'Boulder City',
      'Green Valley',
      'Anthem',
      'Mountain Edge',
      'Centennial Hills',
      'Aliante',
      'Nevada'
    ],
    telephone: '+1-555-DIVA-CMS',
    openingHours: 'Mo-Su 09:00-21:00',
    priceRange: '$15-$95',
    paymentAccepted: ['Credit Card', 'PayPal', 'Stripe'],
    currenciesAccepted: 'USD'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative min-h-screen px-4 py-24">
        <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
          <span className="mx-2">→</span>
          <span className="text-fg/70">Las Vegas</span>
        </nav>

        <header className="text-center mb-16">
          <h1 className="font-shuneva text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Vegas Kawaii Paradise{" "}
            <span
              className="emoji inline-block align-[-0.1em]"
              aria-hidden="true"
            >
              🎁💅✨
            </span>
          </h1>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            Vegas&apos;s ultimate kawaii destination! From Labubu collectibles &amp; Pop Mart blind boxes to Y2K boutique accessories &amp; custom press-on nails. Everything cute in one place!
          </p>
        </header>

        {/* Local Benefits */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-pink-400 mb-3">Collectibles Paradise</h3>
            <p className="text-gray-100">Authentic Labubu, Pop Mart blind boxes, and rare kawaii finds. Vegas&apos;s best collectibles selection!</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold text-purple-400 mb-3">Kawaii Boutique</h3>
            <p className="text-gray-100">Y2K accessories, cute phone cases, and kawaii lifestyle products. Complete your aesthetic!</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-pink-900/30 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">💅</div>
            <h3 className="text-xl font-bold text-blue-400 mb-3">Custom Nails</h3>
            <p className="text-gray-100">Y2K press-on nails and kawaii nail art. Perfect for Vegas nightlife and special events!</p>
          </div>
        </section>

        {/* Areas We Serve */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-pink-400 text-center mb-8">Areas We Serve in Las Vegas</h2>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            {[
              'The Strip', 'Downtown Las Vegas', 'Summerlin', 'Henderson',
              'North Las Vegas', 'Paradise', 'Spring Valley', 'Enterprise',
              'Sunrise Manor', 'Winchester', 'Boulder City', 'Green Valley',
              'Anthem', 'Mountain Edge', 'Centennial Hills', 'Aliante'
            ].map((area) => (
              <div key={area} className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all">
                <span className="text-white font-medium">{area}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Our Vegas Collections */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-pink-400 mb-4">What Makes Us Vegas&apos;s Kawaii HQ</h2>
            <p className="max-w-2xl mx-auto">
              We&apos;re not just another store - we&apos;re Vegas&apos;s complete kawaii lifestyle destination
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold text-pink-400 mb-3">Premium Collectibles</h3>
                <p className="text-gray-100 text-sm mb-4">Our #1 Revenue Driver</p>
              </div>
              <ul className="text-gray-100 space-y-2 text-sm">
                <li>• Authentic Labubu from The Monsters series</li>
                <li>• Pop Mart blind boxes & chase figures</li>
                <li>• Exclusive kawaii designer toys</li>
                <li>• Limited edition releases</li>
                <li>• Rare chase variants & special collaborations</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🛍️</div>
                <h3 className="text-2xl font-bold text-purple-400 mb-3">Kawaii Boutique</h3>
                <p className="text-gray-100 text-sm mb-4">Y2K & Cute Lifestyle</p>
              </div>
              <ul className="text-gray-100 space-y-2 text-sm">
                <li>• Y2K phone cases & tech accessories</li>
                <li>• Kawaii plushies & room decor</li>
                <li>• Harajuku fashion accessories</li>
                <li>• Sanrio licensed merchandise</li>
                <li>• Cute stationery & lifestyle products</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-pink-900/20 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💅</div>
                <h3 className="text-2xl font-bold text-blue-400 mb-3">Custom Nails</h3>
                <p className="text-gray-100 text-sm mb-4">Y2K & Kawaii Nail Art</p>
              </div>
              <ul className="text-gray-100 space-y-2 text-sm">
                <li>• Custom Y2K press-on nail sets</li>
                <li>• Kawaii character nail art</li>
                <li>• Holographic & chrome finishes</li>
                <li>• Vegas nightlife ready designs</li>
                <li>• Matching accessories available</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Areas We Serve */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-pink-400 text-center mb-8">Areas We Serve in Las Vegas</h2>
          <div className="grid md:grid-cols-4 gap-4 text-center">
            {[
              'The Strip', 'Downtown Las Vegas', 'Summerlin', 'Henderson',
              'North Las Vegas', 'Paradise', 'Spring Valley', 'Enterprise',
              'Sunrise Manor', 'Winchester', 'Boulder City', 'Green Valley',
              'Anthem', 'Mountain Edge', 'Centennial Hills', 'Aliante'
            ].map((area) => (
              <div key={area} className="bg-white/10 rounded-lg p-4 hover:bg-white/15 transition-all">
                <span className="text-white font-medium">{area}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Popular with Vegas Community */}
        <section className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-pink-400 text-center mb-6">Loved by Vegas Kawaii Community 🎁</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-100 leading-relaxed mb-4">
                From collectors and influencers to kawaii enthusiasts and nail lovers, Diva Factory has become Vegas&apos;s go-to kawaii destination.
              </p>
              <ul className="text-gray-100 space-y-2">
                <li>🎁 #1 for authentic collectibles in Nevada</li>
                <li>🛍️ Complete kawaii lifestyle boutique</li>
                <li>💅 Custom Y2K nail art & press-ons</li>
                <li>📱 Perfect for content creators & unboxing</li>
                <li>💎 Rare and exclusive collectible finds</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-3">Collector Discount</h3>
              <p className="text-gray-200 mb-4">Collectors get 15% off orders over $50!</p>
              <Link 
                href="/contact" 
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg transition-all"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </section>

        {/* Local Events & Pop-ups */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-pink-400 text-center">Find Us at Vegas Events 🎰</h2>
            
            {/* Admin Toggle - Only show for logged in admins */}
            {isAdmin && (
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                {isAdminMode ? "Exit Admin" : "✏️ Edit Events"}
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-300 mb-4">Upcoming Pop-ups</h3>
              <ul className="text-gray-100 space-y-3">
                {popupEvents.map((event) => (
                  <li key={event.id} className="flex items-center justify-between group">
                    <span>
                      {event.emoji} <strong>{event.title}</strong> - {event.description}
                    </span>
                    {isAdmin && isAdminMode && (
                      <div className="flex gap-2 transition-opacity">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-blue-400 hover:text-blue-300 text-sm bg-blue-900/30 hover:bg-blue-900/50 px-2 py-1 rounded transition-all"
                          title="Edit event"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-400 hover:text-red-300 text-sm bg-red-900/30 hover:bg-red-900/50 px-2 py-1 rounded transition-all"
                          title="Delete event"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-4">Collectible Meetups</h3>
              <p className="text-gray-100 mb-4">
                Join our hands-on workshops throughout Las Vegas! Learn about collectibles and get exclusive access to new releases.
              </p>
              <Link 
                href="/las-vegas" 
                className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg transition-all"
              >
                Stay Tuned!
              </Link>
            </div>
          </div>
        </section>

        {/* Admin Form - Only show for logged in admins in admin mode */}
        {isAdmin && isAdminMode && (
          <section className="mb-16">
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-8 border border-purple-400/30">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingEvent ? "Edit Pop-up Event" : "Add New Pop-up Event"}
              </h3>
              
              <form onSubmit={handleSubmitEvent} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="emoji" className="block text-sm font-medium text-gray-300 mb-2">
                      Emoji
                    </label>
                    <input
                      type="text"
                      id="emoji"
                      value={formData.emoji}
                      onChange={(e) => setFormData({...formData, emoji: e.target.value})}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="🎰"
                      maxLength={2}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Las Vegas Market"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="First Sunday monthly"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-medium"
                  >
                    {editingEvent ? "Update Event" : "Add Event"}
                  </button>
                  
                  {editingEvent && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEvent(null);
                        setFormData({ title: "", description: "", emoji: "" });
                      }}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Testimonials from Vegas Customers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-pink-400 text-center mb-8">What Vegas Customers Say 💕</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-6">
              <p className="text-gray-100 italic mb-4">&quot;Amazing Labubu collection! Perfect for my Vegas lifestyle and kawaii aesthetic.&quot;</p>
              <cite className="text-pink-400 font-semibold">- Sarah M., Summerlin</cite>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <p className="text-gray-100 italic mb-4">&quot;Local pickup is so convenient! Love supporting a Vegas-based collectibles business.&quot;</p>
              <cite className="text-pink-400 font-semibold">- Jessica L., Henderson</cite>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <p className="text-gray-100 italic mb-4">&quot;Best Pop Mart selection in Vegas! Quality is casino-level amazing for my collection.&quot;</p>
              <cite className="text-pink-400 font-semibold">- Maya K., Paradise</cite>
            </div>
          </div>
        </section>

        {/* Why Choose Us for Vegas */}
        <section className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600"></span> for Vegas Collectibles?
            </h2>
            <p className="text-gray-100 max-w-2xl mx-auto">
              Las Vegas deserves collectibles as exciting as the Strip! Our authentic Labubu and Pop Mart collection is perfect for Nevada&apos;s entertainment capital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-bold text-white mb-2">Authentic Products</h3>
              <p className="text-gray-100 text-sm">100% genuine Labubu and Pop Mart items</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-white mb-2">Fast Shipping</h3>
              <p className="text-gray-100 text-sm">Same-day delivery in Vegas Valley</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-white mb-2">Best Prices</h3>
              <p className="text-gray-100 text-sm">Competitive pricing on all collectibles</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h3 className="font-bold text-white mb-2">Local Support</h3>
              <p className="text-gray-100 text-sm">Vegas-based customer service</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-heading mb-4">Ready to Start Your Collection?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Browse our exclusive selection of Labubu collectibles and Pop Mart blind boxes. Perfect for Vegas collectors and kawaii enthusiasts!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop" 
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all inline-block"
            >
              Shop Collectibles
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-pink-400 text-pink-100 font-bold py-3 px-8 rounded-full hover:bg-pink-400 hover:text-black transition-all inline-block"
            >
              Contact Us
            </Link>
          </div>
        </section>
        </div>
      </main>
    </>
  );
}
