import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Diva Factory',
  description: 'Our privacy practices and how we handle your information at Diva Factory.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-fg/70">Privacy Policy</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-shuneva text-4xl font-bold text-pink-400">Privacy Policy</h1>
        <p className="mt-3 text-gray-300">Your privacy matters. This page summarizes how we collect and use your data.</p>
      </header>

      <section className="prose prose-invert">
        <h2>Information We Collect</h2>
        <p>We collect information you provide when you place an order, create an account, or contact us.</p>

        <h2>How We Use Information</h2>
        <p>We use data to process orders, communicate about your purchases, and improve our services.</p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email us at <a href="mailto:admin@thedivafactory.com">admin@thedivafactory.com</a>.
        </p>
      </section>
    </div>
  );
}
