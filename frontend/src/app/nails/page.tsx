import React from 'react';
import BrandLanding, { BrandConfig } from '@/components/BrandLanding';

export const metadata = {
  title: 'Diva Factory Nails',
  description: 'Luxury press-on nails & custom artistry.',
};

const nailsConfig: BrandConfig = {
  brand: 'nails',
  displayName: 'Diva Factory Nails',
  tagline: 'Luxury press-on artistry. Express every mood in minutes.',
  tags: ['Handcrafted', 'Reusable', 'Salon-Free', 'Trendy', 'Custom'],
  categories: [
    { title: 'Signature Sets', desc: 'Core curated looks', slug: 'signature' },
    { title: 'Limited Drops', desc: 'Seasonal exclusives', slug: 'limited' },
    { title: 'Custom Orders', desc: 'Personalized designs', slug: 'custom' },
  ],
  theme: {
    gradient: 'from-pink-100 via-purple-200 to-blue-200',
    accent: 'text-pink-600',
    chipBg: 'bg-pink-500/10 border-pink-400/30 text-pink-600',
    cardBg: 'bg-white/70 backdrop-blur shadow-lg border border-pink-600/20',
    button: 'bg-pink-600 hover:bg-pink-700 text-white',
    glow1: 'bg-pink-300/40',
    glow2: 'bg-purple-300/30'
  },
  ctaHref: '/shop?brand_segment=nails'
};

export default function NailsLanding() { return <BrandLanding config={nailsConfig}/>; }
