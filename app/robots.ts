import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/private'],
    },
    sitemap: 'https://allthingslinux.org/sitemap.xml',
    host: 'https://allthingslinux.org',
  };
}
