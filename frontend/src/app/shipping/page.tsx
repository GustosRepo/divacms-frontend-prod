import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Info | Diva Factory',
  description: 'Shipping options, local pickup, and delivery times for Diva Factory orders.',
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-fg/70">Shipping Info</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-shuneva text-4xl font-bold text-pink-400">Shipping & Pickup</h1>
        <p className="mt-3 text-gray-300">Details on shipping rates, delivery times, and local pickup options.</p>
      </header>

      <section className="prose prose-invert">
        <h2>Shipping</h2>
        <p>We ship with trusted carriers. Delivery times vary by destination.</p>

  <h2>Local Pickup</h2>
  <p>Choose Local Pickup at checkout to avoid shipping fees. We&apos;ll notify you when your order is ready.</p>

        <h2>Contact</h2>
        <p>For urgent shipping questions email <a href="mailto:admin@thedivafactory.com">admin@thedivafactory.com</a>.</p>
      </section>
    </div>
  );
}
