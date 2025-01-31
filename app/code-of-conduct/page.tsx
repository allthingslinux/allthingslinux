import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { CodeOfConductContent } from './CodeOfConductContent';

export default function CodeOfConduct() {
  const readmePath = path.join(process.cwd(), 'code-of-conduct', 'README.md');

  // Check if the code-of-conduct submodule exists
  if (!existsSync(readmePath)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="prose color-scheme-dark max-w-none space-y-6">
          <h1 className="text-3xl font-bold">Code of Conduct</h1>
          <p className="text-lg">
            The Code of Conduct content is not available. To view it, you need
            to initialize the git submodule:
          </p>
          <pre className="bg-[color-mix(in_oklab,neutral-900_30%,transparent)] p-4 rounded-lg overflow-x-auto">
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
  const readmeContent = readFileSync(readmePath, 'utf8');

  // Get the last commit date
  const lastUpdated = 'January 13, 2024';

  // Remove header content before "Code of Conduct"
  const contentStartIndex = readmeContent.indexOf('# Code of Conduct');
  let cleanedContent = readmeContent.slice(contentStartIndex);

  // Remove HTML comments and table of contents section
  cleanedContent = cleanedContent.replace(/<!--[\s\S]*?-->/g, '');
  const tocStart = cleanedContent.indexOf('**Table of Contents**');
  const tocEnd = cleanedContent.indexOf('## Preface');
  if (tocStart !== -1 && tocEnd !== -1) {
    cleanedContent =
      cleanedContent.slice(0, tocStart) + cleanedContent.slice(tocEnd);
  }

  // Remove everything after "Above all, exercise good judgment and common sense."
  const endIndex = cleanedContent.indexOf(
    'Above all, exercise good judgment and common sense.'
  );
  if (endIndex !== -1) {
    cleanedContent = cleanedContent.slice(
      0,
      endIndex + 'Above all, exercise good judgment and common sense.'.length
    );
  }

  return (
    <CodeOfConductContent content={cleanedContent} lastUpdated={lastUpdated} />
  );
}
