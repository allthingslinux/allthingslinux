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
  const realSlug = slug.replace(/\.mdx$/, '');
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

    const { data, content } = matter(fileContents);
    log('Frontmatter parsed successfully', data);

    // if data.date doesnt exist check if the file is called in the format of "xx-xx-xx" with a possible (2)/(3)
    // if it is, set the date to the file name and if its a duplicate (with (2)) set the date just a little bit later
    // TODO: this is a temporary solution until we have a better way to handle this
    if (!data.date) {
      const date = realSlug.split('-').slice(0, 3).join('-');
      data.date = date;
    }

    // convert date to unix timestamp
    data.date = new Date(data.date).getTime();

    log('Post slug processed successfully', { slug, data });

    return {
      slug: realSlug,
      title: data.title || realSlug,
      date: data.date,
      content,
      dateformatted: new Date(data.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // FIXME: what the fuck is this
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