import { readFileSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Process markdown content by removing HTML comments and headers
 */
function processMarkdownContent(content: string): string {
  // Remove header content before "Code of Conduct"
  const contentStartIndex = content.indexOf('# Code of Conduct');
  if (contentStartIndex !== -1) {
    content = content.slice(contentStartIndex);
  }

  // Remove HTML comments and table of contents section
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  const tocStart = content.indexOf('**Table of Contents**');
  const tocEnd = content.indexOf('## Preface');
  if (tocStart !== -1 && tocEnd !== -1) {
    content = content.slice(0, tocStart) + content.slice(tocEnd);
  }

  // Remove everything after "Above all, exercise good judgment and common sense."
  const endIndex = content.indexOf(
    'Above all, exercise good judgment and common sense.'
  );
  if (endIndex !== -1) {
    content = content.slice(
      0,
      endIndex + 'Above all, exercise good judgment and common sense.'.length
    );
  }

  return content.trim();
}

/**
 * Get the processed content of the Code of Conduct
 */
export async function getCodeOfConductContent(): Promise<string> {
  const readmePath = path.join(process.cwd(), 'code-of-conduct', 'README.md');

  // Read and process the contents of the README.md file
  const readmeContent = processMarkdownContent(
    readFileSync(readmePath, 'utf8')
  );

  return readmeContent;
}

/**
 * Get the last updated date of the Code of Conduct
 */
export async function getLastUpdated(): Promise<string> {
  try {
    // Get the last commit date for the README.md file in the submodule
    const gitCommand = `git -C ${path.join(
      process.cwd(),
      'code-of-conduct'
    )} log -1 --format=%cd --date=format:'%B %d, %Y' -- README.md`;

    const lastUpdated = execSync(gitCommand).toString().trim();

    // If empty (no commits yet), use a fallback
    if (!lastUpdated) {
      throw new Error('No commit history found');
    }

    return lastUpdated;
  } catch (error) {
    console.error('Error getting last commit date:', error);
    // Fallback date
    return 'Not available';
  }
}
