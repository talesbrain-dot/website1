import { getAllProducts, categories } from '@/lib/content';

export default function sitemap() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com').replace(/\/$/, '');
  const now = new Date();

  const staticPages = [
    { url: '', priority: 1 },
    { url: '/services', priority: 0.9 },
    { url: '/about', priority: 0.6 },
    { url: '/portfolio', priority: 0.6 },
    { url: '/faq', priority: 0.5 },
    { url: '/contact', priority: 0.7 },
    { url: '/enquiry', priority: 0.8 },
  ].map((p) => ({
    url: `${baseUrl}${p.url}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p.priority,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${baseUrl}/services#${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const productPages = getAllProducts().map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
