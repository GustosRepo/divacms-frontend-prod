import { MetadataRoute } from 'next';

// Basic static sitemap including new /boutique route
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const staticRoutes = ['', '/shop', '/nails', '/toys', '/boutique', '/about', '/contact', '/blog'].map(p => ({
    url: base + p,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
  ];
}
