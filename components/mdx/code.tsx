import React from 'react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/code-block';

interface MDXCodeProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  'data-language'?: string;
  'data-theme'?: string;
}

interface CodeBlockProps {
  props: {
    children: string;
    className?: string;
    'data-meta'?: string;
  };
}

export const Pre = ({ children }: MDXCodeProps) => {
  try {
    // Safely access child props
    const childProps = (children as CodeBlockProps)?.props;

    // If childProps is undefined, throw a more descriptive error
    if (!childProps) {
      throw new Error('Invalid code block structure: missing props');
    }

    let code = childProps.children || '';
    const language =
      childProps.className?.replace('language-', '') || 'plaintext';
    const meta = childProps['data-meta'] || '';

    // Extract filename and highlight lines from meta
    let filename = `example.${language}`;
    let highlightLines: number[] = [];

    // Parse meta information
    if (meta) {
      // Check for filename in meta
      const filenameMatch = meta.match(/file=([^\s]+)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }

      // Check for highlight lines in meta
      const highlightMatch = meta.match(/highlight=([0-9,-]+)/);
      if (highlightMatch && highlightMatch[1]) {
        highlightLines = parseHighlightLines(highlightMatch[1]);
      }
    } else {
      // Extract filename from first line if it's a comment (legacy approach)
      const lines = code.split('\n');
      const firstLine = lines[0].trim();
      if (firstLine.startsWith('//') || firstLine.startsWith('#')) {
        filename = firstLine.slice(firstLine.startsWith('//') ? 2 : 1).trim();
        // If the first line is a comment, remove it from the code
        code = lines.slice(1).join('\n');
      }
    }

    return (
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-muted bg-muted">
        <CodeBlock
          code={code}
          language={language}
          filename={filename}
          highlightLines={highlightLines}
        />
      </div>
    );
  } catch (error) {
    // Safe error logging without accessing error.stack
    console.error(
      'Error rendering code block:',
      error instanceof Error ? error.message : 'Unknown error'
    );

    // Safely extract content for fallback display
    let fallbackContent = 'No code content available';
    try {
      fallbackContent =
        (children as CodeBlockProps)?.props?.children || fallbackContent;
    } catch (e) {
      // If we can't even extract the fallback content, just use the default
      fallbackContent = 'No code content available';
      console.error(
        'Error extracting fallback content:',
        e instanceof Error ? e.message : 'Unknown error'
      );
    }

    return (
      <div className="not-prose my-6 overflow-hidden rounded-lg border border-muted bg-muted p-4">
        <div className="text-red-500">Error rendering code block</div>
        <pre className="mt-2 text-sm text-gray-400 overflow-x-auto">
          {fallbackContent}
        </pre>
      </div>
    );
  }
};

// Helper function to parse highlight lines from string like "1,3-5,7"
function parseHighlightLines(highlightStr: string): number[] {
  const result: number[] = [];

  highlightStr.split(',').forEach((part) => {
    if (part.includes('-')) {
      // Handle ranges like "3-5"
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    } else {
      // Handle single lines like "1"
      result.push(Number(part));
    }
  });

  return result;
}

export const InlineCode = ({ className, ...props }: MDXCodeProps) => (
  <code
    className={cn(
      'relative rounded-md border border-muted bg-background px-[0.4rem] py-[0.3rem] mx-1 font-mono text-sm',
      className
    )}
    {...props}
  />
);
