import { allBlogPosts } from 'contentlayer/generated';
import type { BlogPost } from 'contentlayer/generated';
import type { Post } from '@/types/blog';

// Convert BlogPost to Post
function convertToPost(blogPost: BlogPost): Post {
  return {
    ...blogPost,
    content: blogPost.body.raw, // Use the raw MDX content
  };
}

export function getAllPosts(): BlogPost[] {
  return allBlogPosts.sort((a: BlogPost, b: BlogPost) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get all posts as Post type
export function getAllPostsAsPostType(): Post[] {
  return getAllPosts().map(convertToPost);
}

export function getPostsByCategory(category: string): BlogPost[] {
  const categorySlug = category.toLowerCase().replace(/ /g, '-');

  if (categorySlug === 'all-posts') {
    return getAllPosts();
  }

  return getAllPosts().filter((post) => post.categorySlug === categorySlug);
}

// Get posts by category as Post type
export function getPostsByCategoryAsPostType(category: string): Post[] {
  return getPostsByCategory(category).map(convertToPost);
}

export function getPost(category: string, slug: string): BlogPost | undefined {
  return getAllPosts().find(
    (post) => post.slug === slug && post.categorySlug === category
  );
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();

  getAllPosts().forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });

  return Array.from(categories).sort();
}
