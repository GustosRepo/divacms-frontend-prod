import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Moved: Boutique',
  robots: { index: false }
};

export default function AccessoriesRedirectPage() {
  return (
    <div className="pt-40 pb-20 text-center space-y-6">
      <h1 className="text-3xl font-bold">Page Moved</h1>
      <p className="text-sm text-gray-600 max-w-md mx-auto">Accessories content is now part of our Boutique brand experience.</p>
      <Link href="/boutique" className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow">
        Go to Boutique <span>→</span>
      </Link>
    </div>
  );
}
