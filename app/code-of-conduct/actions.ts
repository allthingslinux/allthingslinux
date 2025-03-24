/**
 * This file has been updated to be compatible with Cloudflare Workers.
 * It uses fetch with absolute URLs instead of file system operations.
 * The actual content is pre-generated during build time and stored as a JSON file.
 */

// Define the type for the code of conduct JSON data
interface CodeOfConductData {
  content: string;
  lastUpdated: string;
}

/**
 * Get the processed content of the Code of Conduct
 */
export async function getCodeOfConductContent(): Promise<string> {
  try {
    // Construct a base URL that works in both environments
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // Try to fetch using the constructed URL
    const response = await fetch(`${baseUrl}/code-of-conduct.json`);

    if (!response.ok) {
      console.error(`Failed to fetch code of conduct: ${response.status}`);
      throw new Error(`Failed to fetch code of conduct: ${response.status}`);
    }

    const data = (await response.json()) as CodeOfConductData;
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
    // Construct a base URL that works in both environments
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // Try to fetch using the constructed URL
    const response = await fetch(`${baseUrl}/code-of-conduct.json`);

    if (!response.ok) {
      console.error(`Failed to fetch code of conduct: ${response.status}`);
      throw new Error(`Failed to fetch code of conduct: ${response.status}`);
    }

    const data = (await response.json()) as CodeOfConductData;
    return data.lastUpdated;
  } catch (error) {
    console.error('Error loading last updated date:', error);
    return 'Not available';
  }
}
