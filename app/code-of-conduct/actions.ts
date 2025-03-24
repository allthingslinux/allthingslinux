/**
 * This file now uses static imports for the code of conduct content
 * instead of relying on fetch requests which can be unreliable in
 * Cloudflare Workers.
 */

import { CODE_OF_CONDUCT_CONTENT, LAST_UPDATED } from '@/lib/code-of-conduct';

/**
 * Get the processed content of the Code of Conduct
 */
export async function getCodeOfConductContent(): Promise<string> {
  // No more fetch calls or network requests - directly return the imported content
  return CODE_OF_CONDUCT_CONTENT;
}

/**
 * Get the last updated date of the Code of Conduct
 */
export async function getLastUpdated(): Promise<string> {
  // No more fetch calls or network requests - directly return the imported date
  return LAST_UPDATED;
}
