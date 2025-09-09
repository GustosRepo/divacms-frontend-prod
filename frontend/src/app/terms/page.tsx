import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Diva Factory',
  description: 'Terms and conditions for using Diva Factory.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-accent hover:text-accent/80">Home</Link>
        <span className="mx-2">→</span>
        <span className="text-fg/70">Terms of Service</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-shuneva text-4xl font-bold text-pink-400">Terms of Service</h1>
        <p className="mt-3 text-gray-300">These terms govern your use of Diva Factory services and site.</p>
      </header>

      <section className="prose prose-invert">
        <h2>Accepting Terms</h2>
        <p>By using our site you agree to these terms. Please read them carefully.</p>

        <h2>Purchases</h2>
        <p>Purchases are subject to product availability and our refund policy.</p>

        <h2>Contact</h2>
        <p>If you have questions, email <a href="mailto:admin@thedivafactory.com">admin@thedivafactory.com</a>.</p>
      </section>
    </div>
  );
}
