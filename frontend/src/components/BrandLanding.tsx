"use client";
import React from 'react';
import Link from 'next/link';
import { useThemePrefs } from '@/context/ThemeContext';

export interface BrandCategory {
  title: string;
  desc: string;
  slug: string;
}

export interface BrandThemeTokens {
  gradient: string;
  accent: string;
  chipBg: string;
  cardBg: string;
  button: string;
  glow1: string;
  glow2: string;
}

export interface BrandConfig {
  brand: string; // slug key e.g. 'toys'
  displayName: string;
  tagline: string;
  tags: string[];
  categories: BrandCategory[];
  theme: BrandThemeTokens;
  ctaHref: string;
}

interface Props {
  config: BrandConfig;
}

const BrandLanding: React.FC<Props> = ({ config }) => {
  const { displayName, tagline, tags, categories, theme, ctaHref, brand } = config;
  const { reducedMotion } = useThemePrefs();

  return (
    <div className="pt-32 md:pt-36 pb-10 space-y-10">
      {/* Hero Section */}
      <section className={`relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br ${theme.gradient}`}>
        <div className="relative z-10 max-w-3xl">
          <h1 className="font-shuneva text-4xl md:text-5xl font-extrabold tracking-tight outline-heading text-legible">
            {displayName.split(' ').slice(0, 2).join(' ')}{' '}
            <span className={`${theme.accent} outline-heading text-legible`}>{displayName.split(' ').slice(2).join(' ') || ''}</span>
          </h1>
          <p className="font-shuneva mt-4 text-lg md:text-xl font-medium text-legible">{tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {tags.map(tag => (
              <span key={tag} className={`font-shuneva px-3 py-1 rounded-full text-xs font-semibold border ${theme.chipBg} text-legible`}>{tag}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={ctaHref} className={`px-6 py-3 rounded-md font-semibold shadow ${theme.button} text-legible`}>Shop {displayName.split(' ').slice(-1)[0]}</Link>
            <Link href="/" className="px-6 py-3 rounded-md font-semibold bg-white/40 hover:bg-white/60 dark:bg-white/10 dark:hover:bg-white/20 transition text-legible">Main Site</Link>
          </div>
        </div>
        <div className={`absolute -right-10 -bottom-10 w-72 h-72 ${theme.glow1} rounded-full blur-3xl ${reducedMotion ? '' : 'animate-pulse'}`} />
        <div className={`absolute right-20 top-10 w-40 h-40 ${theme.glow2} rounded-full blur-2xl ${reducedMotion ? '' : 'animate-pulse'}`} />
      </section>

      {/* Categories */}
      {categories?.length > 0 && (
        <section>
          <h2 className="font-shuneva text-2xl font-bold mb-4 outline-heading text-legible">Featured Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/shop?brand_segment=${brand}&category_slug=${cat.slug}`}
                className={`group rounded-xl p-6 ${theme.cardBg} transition hover:-translate-y-1 hover:shadow-xl dark:shadow-black/40`}
              >
                <h3 className="font-shuneva font-semibold text-lg group-hover:opacity-80 text-legible">{cat.title}</h3>
                <p className="font-shuneva mt-1 text-sm text-legible">{cat.desc}</p>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300 text-legible">Explore →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Value Props */}
      <section>
        <h2 className="font-shuneva text-2xl font-bold mb-4 outline-heading text-legible">Why Shop With Us?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ title: 'Curated Drops', text: 'Hand-picked designers & emerging studios.' }, { title: 'Authenticity First', text: 'Guaranteed genuine limited pieces.' }, { title: 'Fast & Secure Shipping', text: 'Protected packaging for mint condition.' }].map(f => (
            <div key={f.title} className={`p-6 rounded-xl ${theme.cardBg} dark:shadow-black/40`}>
              <h3 className="font-shuneva font-semibold text-legible">{f.title}</h3>
              <p className="font-shuneva mt-2 text-sm leading-relaxed text-legible">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BrandLanding;
