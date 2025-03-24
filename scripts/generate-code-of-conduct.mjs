import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Process markdown content by removing HTML comments and headers
 */
function processMarkdownContent(content) {
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

// Ensure the public directory exists
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Get the processed content
const readmePath = path.join(rootDir, 'code-of-conduct', 'README.md');
let readmeContent;
let lastUpdated;

try {
  // Read and process the README.md content
  readmeContent = processMarkdownContent(fs.readFileSync(readmePath, 'utf8'));

  // Get the last updated date
  const gitCommand = `git -C ${path.join(
    rootDir,
    'code-of-conduct'
  )} log -1 --format=%cd --date=format:'%B %d, %Y' -- README.md`;

  lastUpdated = execSync(gitCommand).toString().trim();

  // If empty (no commits yet), use a fallback
  if (!lastUpdated) {
    lastUpdated = 'Not available';
  }
} catch (error) {
  console.error('Error processing code of conduct:', error);
  readmeContent = '# Code of Conduct\n\nError loading code of conduct.';
  lastUpdated = 'Not available';
}

// Write to a JSON file that can be imported at runtime
fs.writeFileSync(
  path.join(publicDir, 'code-of-conduct.json'),
  JSON.stringify(
    {
      content: readmeContent,
      lastUpdated: lastUpdated,
    },
    null,
    2
  )
);

console.log('✅ Code of conduct JSON generated successfully');
