import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { readFileSync } from 'fs';
import path from 'path';

export default function CodeOfConduct() {
    // Read the contents of the README.md file
    const readmePath = path.join(process.cwd(), 'code-of-conduct', 'README.md');
    const readmeContent = readFileSync(readmePath, 'utf8');

    // Remove header content before "Code of Conduct"
    const contentStartIndex = readmeContent.indexOf('# Code of Conduct');
    let cleanedContent = readmeContent.slice(contentStartIndex);

    // Remove HTML comments and table of contents section
    cleanedContent = cleanedContent.replace(/<!--[\s\S]*?-->/g, '');
    const tocStart = cleanedContent.indexOf('**Table of Contents**');
    const tocEnd = cleanedContent.indexOf('## Preface');
    if (tocStart !== -1 && tocEnd !== -1) {
        cleanedContent =
            cleanedContent.slice(0, tocStart) +
            cleanedContent.slice(tocEnd);
    }

    // Remove Contributors section
    const contributorsIndex = cleanedContent.indexOf('## Contributors');
    if (contributorsIndex !== -1) {
        cleanedContent = cleanedContent.slice(0, contributorsIndex);
    }

    return (
        <div className="container mx-auto px-4 py-12 prose prose-invert max-w-7xl">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    table: ({ node, ...props }) => (
                        <div className="overflow-hidden rounded-lg border border-gray-700/50">
                            <table {...props} className="w-full border-collapse" />
                        </div>
                    ),
                    thead: ({ node, ...props }) => (
                        <thead {...props} className="bg-gray-900/30" />
                    ),
                    th: ({ node, ...props }) => (
                        <th {...props} className="p-3 text-left text-sm font-semibold text-gray-200" />
                    ),
                    td: ({ node, ...props }) => (
                        <td {...props} className="p-3 text-sm text-gray-300 border-t border-gray-700/50" />
                    ),
                    tr: ({ node, ...props }) => (
                        <tr {...props} className="hover:bg-gray-800/20 transition-colors" />
                    ),
                }}
            >
                {cleanedContent}
            </ReactMarkdown>
        </div>
    );
}
