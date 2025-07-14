import { Feed } from 'feed';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/app/metadata';

/**
 * Generates an Atom feed containing all posts.
 *
 * @returns {Promise<string>} A promise that resolves to a string representing an Atom feed from ATL blog posts.
 *
 * @remarks
 * - Fetches all posts using `getAllPosts()`.
 * - Constructs a feed with site and author metadata.
 * - Iterates through each post and adds it as an item to the feed.
 *
 */
export async function generateFeed(): Promise<string> {
  const posts = await getAllPosts();

  const latestBlogPostDate = new Date(
    Math.max(...posts.map((post) => new Date(post.date).getTime()))
  );

  const feed = new Feed({
    title: `${siteConfig.name} - Blog`,
    description: siteConfig.description,
    id: siteConfig.url,
    link: `${siteConfig.url}/blog`,
    language: 'en',
    copyright: `All Rights Reserved ${new Date().getFullYear()}, ${siteConfig.name}`,
    updated: latestBlogPostDate,
    generator: `Feed for ${siteConfig.name}, using open-source Node.js Feed generator by jpmonette. `,
    feedLinks: {
      atom: `${siteConfig.url}/feed`,
    },
    author: {
      name: siteConfig.name,
      email: 'admin@allthingslinux.org',
      link: siteConfig.url,
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.url}${post.url}`,
      link: `${siteConfig.url}${post.url}`,
      description: post.description,
      content: post.body.raw,
      author: [
        {
          name: siteConfig.name,
          email: 'admin@allthingslinux.org',
          link: siteConfig.url,
        },
      ],
      date: new Date(post.date),
    });
  });

  feed.addCategory('News');

  return feed.atom1();
}
