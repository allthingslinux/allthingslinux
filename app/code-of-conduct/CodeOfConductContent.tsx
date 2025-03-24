'use client';

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import Image from 'next/image';

// Custom CSS for the animation
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

interface CodeOfConductContentProps {
  content: string;
  lastUpdated: string;
}

// Define custom components with improved styling
const components = {
  h1: ({
    id,
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      id={id}
      className={`group scroll-m-20 font-bold tracking-tight mt-12 mb-8 text-neutral-100 text-3xl lg:text-4xl pb-3 border-b border-blue-500/30 ${className || ''}`}
      {...props}
    >
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition-opacity"
          aria-label={`Link to this section`}
        >
          #
        </a>
      )}
    </h1>
  ),
  h2: ({
    id,
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={id}
      className={`group scroll-m-20 font-semibold tracking-tight mt-10 mb-6 text-neutral-100 text-2xl lg:text-3xl border-l-3 border-blue-500/40 pl-3 ${className || ''}`}
      {...props}
    >
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition-opacity"
          aria-label={`Link to this section`}
        >
          #
        </a>
      )}
    </h2>
  ),
  h3: ({
    id,
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={id}
      className={`group scroll-m-20 tracking-tight mt-8 mb-4 text-neutral-200 text-xl lg:text-2xl border-l-2 border-blue-400/30 pl-2 ${className || ''}`}
      {...props}
    >
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition-opacity"
          aria-label={`Link to this section`}
        >
          #
        </a>
      )}
    </h3>
  ),
  h4: ({
    id,
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      id={id}
      className={`group scroll-m-20 tracking-tight mt-6 mb-3 text-neutral-200 text-lg lg:text-xl border-l border-blue-400/20 pl-2 ${className || ''}`}
      {...props}
    >
      <span>{children}</span>
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-300 transition-opacity"
          aria-label={`Link to this section`}
        >
          #
        </a>
      )}
    </h4>
  ),
  a: ({
    href,
    className,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Handle case where href might not be a string
    if (href === undefined || href === null) {
      return <span className="text-neutral-300">{children}</span>;
    }

    // Make sure href is a string
    const hrefString = String(href);
    const isExternal = hrefString.startsWith('http');

    return (
      <a
        className={`font-medium text-blue-400 underline underline-offset-4 hover:text-blue-300 ${className || ''}`}
        href={hrefString}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  ul: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={`my-6 ml-6 list-disc text-neutral-300 space-y-2 ${className || ''}`}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={`my-6 ml-6 list-decimal text-neutral-300 space-y-2 ${className || ''}`}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({
    className,
    children,
    ...props
  }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li
      className={`text-neutral-300 leading-relaxed ${className || ''}`}
      {...props}
    >
      {children}
    </li>
  ),
  p: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={`leading-7 [&:not(:first-child)]:mt-6 text-neutral-300 ${className || ''}`}
      {...props}
    >
      {children}
    </p>
  ),
  code: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={`px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 font-mono text-sm ${className || ''}`}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={`p-4 my-6 rounded-lg bg-neutral-900 overflow-x-auto border border-neutral-700/50 ${className || ''}`}
      {...props}
    >
      {children}
    </pre>
  ),
};

// Optimize the main component with memo
const CodeOfConductContent = memo(function CodeOfConductContent({
  content,
  lastUpdated,
}: CodeOfConductContentProps) {
  return (
    <div className="container mx-auto pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-16 sm:pb-20 md:pb-24 lg:pb-32 px-3 sm:px-4 md:px-6 lg:px-8">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <article className="prose max-w-3xl mx-auto space-y-8 [&_p]:text-base [&_p]:leading-7">
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
          <span>Last updated:</span>
          <time dateTime={lastUpdated}>{lastUpdated}</time>
        </div>

        {/* Render the Markdown content */}
        <div
          className="prose prose-invert max-w-none 
          prose-headings:font-semibold 
          prose-a:text-blue-400 hover:prose-a:text-blue-300
          prose-pre:bg-neutral-900 prose-code:bg-neutral-800 prose-code:before:content-none 
          prose-code:after:content-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'append',
                  properties: {
                    className: ['anchor'],
                    ariaHidden: true,
                    tabIndex: -1,
                  },
                },
              ],
            ]}
            components={components}
          >
            {content || ''}
          </ReactMarkdown>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800">
          <p className="text-sm text-neutral-400">Contributors:</p>
          <a
            href="https://github.com/allthingslinux/code-of-conduct/graphs/contributors"
            className="block hover:opacity-90 transition-opacity"
          >
            <Image
              src="https://contrib.rocks/image?repo=allthingslinux/code-of-conduct"
              alt="Contributors"
              width={1000}
              height={1000}
              loading="lazy"
              className="rounded-lg"
            />
          </a>
        </div>
      </article>
    </div>
  );
});

export { CodeOfConductContent };
