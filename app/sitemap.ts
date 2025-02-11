import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://allthingslinux.org';

  // Define static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      // Add Open Graph image to sitemap
      images: [`${baseUrl}/images/og.png`],
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/code-of-conduct`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/get-involved`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Add distribution logos to sitemap for better image SEO
  const distributionLogos = [
    'arch',
    'gentoo',
    'bazzite',
    'debian',
    'cachy',
    'fedora',
    'mint',
    'bedrock',
    'asahi',
    'ubuntu',
    'opensuse',
    'nixos',
    'redhat',
    'slackware',
  ].map((distro) => ({
    url: `${baseUrl}/images/hero/${distro}.png`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  // Get all blog posts and add them to sitemap
  const posts = await getAllPosts();
  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.categorySlug}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Get unique categories and add them to sitemap
  const categories = Array.from(
    new Set(posts.map((post) => post.categorySlug))
  );
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/blog/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...distributionLogos,
    ...categoryPages,
    ...blogPosts,
  ];
}
