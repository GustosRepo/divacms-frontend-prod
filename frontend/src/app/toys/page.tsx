import React from 'react';
import BrandLanding, { BrandConfig } from '@/components/BrandLanding';

export const metadata = {
  title: 'Diva Factory Toys',
  description: 'Designer toys & collectibles from Diva Factory.',
};

const toysConfig: BrandConfig = {
  brand: 'toys',
  displayName: 'Diva Factory Toys',
  tagline: 'Curated art toys, vinyl figures, and limited collectibles. Elevate your shelf.',
  tags: ['Vinyl', 'Designer', 'Blind Box', 'Limited', 'Resin'],
  categories: [
    { title: 'Vinyl Figures', desc: 'Bold sculpts & iconic lines', slug: 'vinyl-figures' },
    { title: 'Blind Boxes', desc: 'Mystery collectibles', slug: 'blind-boxes' },
    { title: 'Limited Editions', desc: 'Short runs & exclusives', slug: 'limited-editions' },
  ],
  theme: {
    gradient: 'from-indigo-100 via-sky-200 to-teal-200',
    accent: 'text-black',
    chipBg: 'bg-teal-500/10 border-teal-400/30 text-black',
    cardBg: 'bg-white/70 backdrop-blur shadow-lg border border-teal-600/20 text-black',
    button: 'bg-teal-600 hover:bg-teal-700 text-white',
    glow1: 'bg-teal-300/40',
    glow2: 'bg-indigo-300/30'
  },
  ctaHref: '/shop?brand_segment=toys'
};

export default function ToysLanding() {
  return <BrandLanding config={toysConfig} />;
}
