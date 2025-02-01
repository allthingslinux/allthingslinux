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
  };
}

export const Pre = ({ children }: MDXCodeProps) => {
  const childProps = (children as CodeBlockProps).props;
  const code = childProps?.children || '';
  const language =
    childProps?.className?.replace('language-', '') || 'plaintext';

  // Extract filename from first line if it's a comment
  const lines = code.split('\n');
  const firstLine = lines[0].trim();
  const filename =
    firstLine.startsWith('//') || firstLine.startsWith('#')
      ? firstLine.slice(firstLine.startsWith('//') ? 2 : 1).trim()
      : `example.${language}`;
  const actualCode =
    firstLine.startsWith('//') || firstLine.startsWith('#')
      ? lines.slice(1).join('\n')
      : code;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-muted bg-muted">
      <CodeBlock code={actualCode} language={language} filename={filename} />
    </div>
  );
};

export const InlineCode = ({ className, ...props }: MDXCodeProps) => (
  <code
    className={cn(
      'relative rounded-md border border-muted bg-catppuccin-base px-[0.4rem] py-[0.3rem] mx-1 font-mono text-sm',
      className
    )}
    {...props}
  />
);
