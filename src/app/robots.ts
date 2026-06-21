import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'] // Limit search crawlers from internal simulator and API zones
    },
    sitemap: 'https://postiq.nexdial.io/sitemap.xml',
  };
}
