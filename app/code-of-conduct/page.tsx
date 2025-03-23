import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { getPageMetadata } from '../metadata';
import { execSync } from 'child_process';
import { CodeOfConductContent } from './CodeOfConductContent';
export const metadata = getPageMetadata('code-of-conduct');

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function CodeOfConduct() {
  const readmePath = path.join(process.cwd(), 'code-of-conduct', 'README.md');

  // Check if the code-of-conduct submodule exists
  if (!existsSync(readmePath)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="prose max-w-none space-y-6">
          <h1 className="text-3xl font-bold">Code of Conduct</h1>
          <p className="text-lg">
            The Code of Conduct content is not available. To view it, you need
            to initialize the git submodule:
          </p>
          <pre className="p-4 rounded-lg overflow-x-auto">
            <code>
              git submodule init{'\n'}
              git submodule update
            </code>
          </pre>
        </div>
      </div>
    );
  }

  // Read the contents of the README.md file
  let readmeContent = readFileSync(readmePath, 'utf8');

  // Get the last commit date using Git commands
  let lastUpdated;
  try {
    // Get the last commit date for the README.md file in the submodule
    const gitCommand = `git -C ${path.join(process.cwd(), 'code-of-conduct')} log -1 --format=%cd --date=format:'%B %d, %Y' -- README.md`;
    lastUpdated = execSync(gitCommand).toString().trim();

    // If empty (no commits yet), use a fallback
    if (!lastUpdated) {
      throw new Error('No commit history found');
    }
  } catch (error) {
    console.error('Error getting last commit date:', error);
    // Fallback date
    lastUpdated = 'Not available';
  }

  // Remove header content before "Code of Conduct"
  const contentStartIndex = readmeContent.indexOf('# Code of Conduct');
  if (contentStartIndex !== -1) {
    readmeContent = readmeContent.slice(contentStartIndex);
  }

  // Remove HTML comments and table of contents section
  readmeContent = readmeContent.replace(/<!--[\s\S]*?-->/g, '');
  const tocStart = readmeContent.indexOf('**Table of Contents**');
  const tocEnd = readmeContent.indexOf('## Preface');
  if (tocStart !== -1 && tocEnd !== -1) {
    readmeContent =
      readmeContent.slice(0, tocStart) + readmeContent.slice(tocEnd);
  }

  // Remove everything after "Above all, exercise good judgment and common sense."
  const endIndex = readmeContent.indexOf(
    'Above all, exercise good judgment and common sense.'
  );
  if (endIndex !== -1) {
    readmeContent = readmeContent.slice(
      0,
      endIndex + 'Above all, exercise good judgment and common sense.'.length
    );
  }

  return (
    <CodeOfConductContent content={readmeContent} lastUpdated={lastUpdated} />
  );
}
