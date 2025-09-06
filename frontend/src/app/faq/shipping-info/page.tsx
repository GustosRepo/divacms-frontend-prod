import Link from "next/link";

export const metadata = {
  title: "Shipping & Delivery | Diva Factory",
  description: "Processing times, shipping methods, tracking, international duties, returns for damaged items, and more.",
};

const faqs = [
  {
    q: "How long is processing time?",
    a: (
      <p>
        Our current processing time is <strong>1–3 business days</strong> for in-stock items and
        <strong> 5–7 business days</strong> for made-to-order sets. Processing time is separate from
        shipping time.
      </p>
    ),
  },
  {
    q: "What shipping options do you offer?",
    a: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Economy (3–7 business days)</strong> — budget-friendly with tracking.
        </li>
        <li>
          <strong>Standard (2–4 business days)</strong> — our most popular option.
        </li>
        <li>
          <strong>Expedited (1–2 business days)</strong> — fastest delivery. Order by 12pm PT.
        </li>
        <li>
          <strong>Free shipping</strong> on US orders over <strong>$200</strong> (after discounts, before tax).
        </li>
      </ul>
    ),
  },
  {
    q: "Do you ship internationally?",
    a: (
      <p>
        Yes! We ship to most countries. Transit times vary by destination. Customs/VAT may apply and are
        the responsibility of the recipient. We can’t mark orders as gifts.
      </p>
    ),
  },
  {
    q: "How do I track my order?",
    a: (
      <p>
        You’ll receive a tracking link via email when your order ships. Tracking updates may take up to
        24 hours to appear after the label is created.
      </p>
    ),
  },
  {
    q: "My package says delivered but I can’t find it",
    a: (
      <ol className="list-decimal pl-5 space-y-1">
        <li>Check with household members and neighbors.</li>
        <li>Look around alternate drop-off spots (porch, side door, mailbox, package lockers).</li>
        <li>Wait 24 hours — carriers sometimes scan early.</li>
        <li>
          Still missing? Email us at <a className="underline" href="mailto:admin@thedivafactory.com">admin@thedivafactory.com</a>
          with your order number so we can help.
        </li>
      </ol>
    ),
  },
  {
    q: "What if my order arrives damaged?",
    a: (
      <p>
  Oh no! Please email <a className="underline" href="mailto:admin@thedivafactory.com">admin@thedivafactory.com</a>
        with photos of the packaging and item within <strong>7 days</strong> of delivery. We’ll make it right.
      </p>
    ),
  },
  {
    q: "Can I change or cancel my order?",
    a: (
      <p>
        We start working on orders quickly. If you need to update shipping address, items, or cancel,
  contact us ASAP at <a className="underline" href="mailto:admin@thedivafactory.com">admin@thedivafactory.com</a>.
        Once shipped, we can’t modify the order.
      </p>
    ),
  },
  {
    q: "Do you ship to PO Boxes or APO/FPO?",
    a: (
      <p>
        Yes, Economy and Standard methods support PO Boxes and APO/FPO addresses. Expedited options may
        require a physical address.
      </p>
    ),
  },
];

function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-lg p-6 group border border-white/10">
      <summary className="text-lg font-semibold text-white cursor-pointer hover:text-pink-300 transition-colors list-none">
        <div className="flex items-center justify-between">
          <span>{q}</span>
          <span className="text-pink-400 text-2xl group-open:rotate-45 transition-transform">+</span>
        </div>
      </summary>
      <div className="mt-4 pt-4 border-t border-gray-700 text-gray-300 leading-relaxed">
        {a}
      </div>
    </details>
  );
}

export default function ShippingInfoPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: typeof f.a === 'string' ? f.a : undefined,
      },
    })),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-24 text-white">
      {/* Breadcrumbs */}
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-pink-400 hover:text-pink-300">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-gray-300">Shipping Info</span>
      </nav>

      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="font-shuneva text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
          Shipping &amp; Delivery{' '}
          <span
            className="inline-block align-[-0.1em] text-white"
            style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji' }}
            aria-hidden="true"
          >
            📦
          </span>
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Quick guide to processing times, shipping options, tracking, international duties, and support.
        </p>
      </header>

      {/* Highlights */}
      <section className="mb-12 bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-pink-400 mb-4 text-center">At a Glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Fast Processing', desc: '1–3 business days for in‑stock items' },
            { title: 'Free US Shipping', desc: 'Orders $200+ (after discounts)' },
            { title: 'Tracked Delivery', desc: 'Email updates every step' },
          ].map((c) => (
            <div key={c.title} className="bg-white/10 hover:bg-white/20 px-4 py-5 rounded-lg transition-colors">
              <h3 className="font-semibold mb-1">{c.title}</h3>
              <p className="text-sm text-gray-200">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-6">
        {faqs.map((item) => (
          <FAQItem key={item.q} q={item.q} a={item.a} />
        ))}
      </section>

      {/* Help card */}
      <section className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl p-8 text-center mt-16">
        <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions? 💭</h2>
        <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for? We typically respond within 24 hours.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="mailto:admin@thedivafactory.com?subject=Shipping%20Question" 
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
          >
            Email Support
          </a>
          <Link 
            href="/faq" 
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all transform hover:scale-105"
          >
            View FAQs
          </Link>
        </div>
      </section>

      {/* JSON-LD for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
