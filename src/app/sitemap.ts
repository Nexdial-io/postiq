import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://postiq.nexdial.io';

  // Static routes including new free tools
  const staticRoutes = [
    '',
    '/pricing',
    '/about',
    '/docs',
    '/blog',
    '/headline-generator',
    '/about-generator',
    '/hashtag-generator'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route.includes('generator') ? 0.9 : 0.8
  }));

  // Dynamic blog slugs for 14 pillar pages & 9 programmatic pages
  const blogSlugs = [
    "how-to-grow-on-linkedin-in-2026",
    "linkedin-algorithm-guide",
    "best-time-to-post-on-linkedin",
    "how-linkedin-reach-works",
    "best-linkedin-headline-examples",
    "linkedin-about-section-examples",
    "linkedin-seo-checklist",
    "how-recruiters-search-linkedin-profiles",
    "personal-branding-for-engineers",
    "how-founders-build-authority-online",
    "personal-branding-strategy-for-saas-founders",
    "linkedin-vs-twitter-growth",
    "creator-monetization-strategies",
    "building-an-audience-from-zero",
    "best-linkedin-headline-for-product-managers",
    "best-linkedin-headline-for-engineers",
    "best-linkedin-headline-for-marketers",
    "linkedin-about-section-examples-for-founders",
    "linkedin-about-section-examples-for-recruiters",
    "linkedin-about-section-examples-for-developers",
    "100-linkedin-hooks-for-saas-founders",
    "100-linkedin-hooks-for-creators",
    "100-linkedin-hooks-for-consultants"
  ];

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  return [...staticRoutes, ...blogRoutes];
}

