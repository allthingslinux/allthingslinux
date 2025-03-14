import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import { format, parseISO } from 'date-fns';
import type { FormQuestion, Role } from '@/types';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateFormSchema = (questions: FormQuestion[]) => {
  return z.object(
    questions.reduce(
      (acc, curr) => {
        switch (curr.type) {
          case 'short':
          case 'paragraph':
            acc[curr.name] = curr.optional
              ? z.string().optional()
              : z.string().min(1, 'Required');
            break;

          case 'select':
            acc[curr.name] = curr.optional
              ? z.enum(curr.options as [string, ...string[]]).optional()
              : z.enum(curr.options as [string, ...string[]]);
            break;

          default:
            acc[curr.name] = z.string().optional();
        }
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    )
  );
};

// Helper function to organize roles by department
export function getRolesByDepartment(roles: Role[]): Record<string, Role[]> {
  return roles.reduce(
    (acc, role) => {
      if (!acc[role.department]) {
        acc[role.department] = [];
      }
      acc[role.department].push(role);
      return acc;
    },
    {} as Record<string, Role[]>
  );
}

// Helper function to format category for URLs
export function formatCategorySlug(category: string): string {
  return category.toLowerCase().replace(/ /g, '-');
}

// Helper function to capitalize category names
function formatCategoryName(category: string): string {
  if (category === 'atl') return 'ATL';
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
  categorySlug: string;
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
      const categorySlug = formatCategorySlug(category);

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
        categorySlug,
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
