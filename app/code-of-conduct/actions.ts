/**
 * This file has been updated to be compatible with Cloudflare Workers.
 * It uses fetch with absolute URLs instead of file system operations.
 * The actual content is pre-generated during build time and stored as a JSON file.
 */

/**
 * Get the processed content of the Code of Conduct
 */
export async function getCodeOfConductContent(): Promise<string> {
  try {
    // In Cloudflare Workers, we need to use absolute URLs
    // We'll use the process.env.NEXT_PUBLIC_URL if available, or a fallback for development
    const baseUrl =
      process.env.NEXT_PUBLIC_URL ||
      (typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000');

    const response = await fetch(`${baseUrl}/code-of-conduct.json`);
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error loading code of conduct content:', error);
    return '# Code of Conduct\n\nError loading code of conduct.';
  }
}

/**
 * Get the last updated date of the Code of Conduct
 */
export async function getLastUpdated(): Promise<string> {
  try {
    // Same approach for absolute URL as above
    const baseUrl =
      process.env.NEXT_PUBLIC_URL ||
      (typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000');

    const response = await fetch(`${baseUrl}/code-of-conduct.json`);
    const data = await response.json();
    return data.lastUpdated;
  } catch (error) {
    console.error('Error loading last updated date:', error);
    return 'Not available';
  }
}
