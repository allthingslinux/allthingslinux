import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to capitalize category names
function formatCategoryName(category: string): string {
  // Handle special cases like "ATL" or specific formatting
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  dateFormatted: string;
  category: string;
  content: string;
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'content/blog');
  const posts: Post[] = [];

  // Function to read posts from a directory
  const readPostsFromDir = (dir: string) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        // Recursively read posts from subdirectories
        readPostsFromDir(fullPath);
        continue;
      }

      if (!file.name.endsWith('.mdx')) continue;

      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Get category from directory structure or frontmatter
      const categoryFromPath = path
        .relative(postsDirectory, dir)
        .split(path.sep)[0];

      const rawCategory = data.category || categoryFromPath || 'Uncategorized';
      const category = formatCategoryName(rawCategory);

      // Safely handle the date
      let postDate: Date;
      try {
        // Try to parse the date string
        postDate = data.date ? parseISO(data.date) : new Date();
      } catch (e) {
        // If parsing fails, use current date
        console.warn(
          `Invalid date in ${file.name}, using current date instead ${e}`
        );
        postDate = new Date();
      }

      posts.push({
        slug: file.name.replace(/\.mdx$/, ''),
        title: data.title || file.name.replace(/\.mdx$/, '').replace(/-/g, ' '),
        description: data.description || '',
        date: postDate.toISOString(),
        dateFormatted: format(postDate, 'MMMM d, yyyy'),
        author: data.author || 'All Things Linux',
        category,
        content,
      });
    }
  };

  // Start reading from the root posts directory
  readPostsFromDir(postsDirectory);

  // Sort posts by date
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
