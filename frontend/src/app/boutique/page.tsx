import React from 'react';
import BrandLanding, { BrandConfig } from '@/components/BrandLanding';

export const metadata = {
  title: 'Diva Factory Boutique',
  description: 'Kawaii lifestyle & curated boutique finds.',
};

const boutiqueConfig: BrandConfig = {
  brand: 'accessories',
  displayName: 'Diva Factory Boutique',
  tagline: 'Kawaii lifestyle & Diva finds across accessories & decor.',
  tags: ['Kawaii', 'Pastel', 'Curated', 'Lifestyle', 'Giftable', 'Trendy', 'Affordable', 'Unique'],
  categories: [
    { title: 'Everyday Essentials', desc: 'Pins, clips & charms', slug: 'everyday-essentials' },
    { title: 'Seasonal Highlights', desc: 'Limited seasonal collections', slug: 'seasonal-highlights' },
    { title: 'Statement Pieces', desc: 'Bold & eye-catching items', slug: 'statement-pieces' },
  ],
  theme: {
    gradient: 'from-amber-100 via-rose-200 to-pink-200',
    accent: 'text-amber-700',
    chipBg: 'bg-amber-500/10 border-amber-400/30 text-amber-700',
    cardBg: 'bg-white/70 backdrop-blur shadow-lg border border-amber-600/20',
    button: 'bg-amber-600 hover:bg-amber-700 text-white',
    glow1: 'bg-amber-300/40',
    glow2: 'bg-rose-300/30'
  },
  ctaHref: '/shop?brand_segment=accessories'
};

export default function BoutiqueLanding() { return <BrandLanding config={boutiqueConfig}/>; }
