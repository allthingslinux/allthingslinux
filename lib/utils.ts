import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import matter from 'gray-matter';
import fs from 'fs';
import { join } from 'path-browserify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const postsDirectory = join(process.cwd(), 'markdown');

// Logging helper function
function log(message: string, data?: unknown) {
  console.log(`[LOG]: ${message}`, data ? data : '');
}

export async function getPostSlugs() {
  log('Attempting to read post slugs from directory', postsDirectory);
  try {
    const files = await new Promise<string[]>((resolve, reject) => {
      fs.readdir(postsDirectory, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
    log('Post slugs retrieved successfully', files);
    return files;
  } catch (error) {
    log('Error reading post slugs', error);
    if (error instanceof Error) {
      throw new Error(`Failed to read posts directory: ${error.message}`);
    } else {
      throw new Error('Failed to read posts directory: Unknown error');
    }
  }
}

export async function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.mdx`);

  log('Processing post slug', { slug, fullPath });

  try {
    const fileExists = await new Promise<boolean>((resolve) => {
      fs.access(fullPath, fs.constants.F_OK, (err) => resolve(!err));
    });

    if (!fileExists) {
      log('Post file not found', { slug, fullPath });
      throw new Error(`Post not found: ${fullPath}`);
    }

    const fileContents = await new Promise<string>((resolve, reject) => {
      fs.readFile(fullPath, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    log('Post file read successfully', { slug });
    log('File contents', fileContents);

    const { data, content } = matter(fileContents);
    log('Frontmatter parsed successfully', data);
    log('Post content', content);

    return {
      slug: realSlug,
      content,
      date: data.date,
      ...data,
    };
  } catch (error) {
    log('Error processing post slug', { slug, error });
    if (error instanceof Error) {
      throw new Error(`Error processing post slug "${slug}": ${error.message}`);
    } else {
      throw new Error(`Error processing post slug "${slug}": Unknown error`);
    }
  }
}

export async function getAllPosts(fields: string[] = []) {
  log('Starting to fetch all posts');
  try {
    const slugs = await getPostSlugs();
    log('Slugs fetched successfully', slugs);

    const posts = await Promise.all(
      slugs.map(async (slug) => await getPostBySlug(slug, fields))
    );

    const sortedPosts = posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    log('Posts sorted successfully', sortedPosts);

    return sortedPosts;
  } catch (error) {
    log('Error fetching all posts', error);
    if (error instanceof Error) {
      throw new Error(`Error fetching all posts: ${error.message}`);
    } else {
      throw new Error('Error fetching all posts: Unknown error');
    }
  }
}