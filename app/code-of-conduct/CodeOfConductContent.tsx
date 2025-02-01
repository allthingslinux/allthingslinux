'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createHeadingComponent } from '@/components/mdx/headings';

interface CodeOfConductContentProps {
  content: string;
  lastUpdated: string;
}

export function CodeOfConductContent({
  content,
  lastUpdated,
}: CodeOfConductContentProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <article
        className="prose color-scheme-dark max-w-3xl mx-auto space-y-8 
        [&_p]:text-base [&_p]:leading-7 
        [&_ul]:space-y-2 [&_ol]:space-y-2 
        [&_ul]:list-disc [&_ol]:list-decimal 
        [&_ul]:pl-5 [&_ol]:pl-5
        [&_:is(h1,h2,h3,h4,h5,h6)]:scroll-mt-20 
        [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold 
        [&_:is(h1,h2,h3,h4,h5,h6)]:group
        [&_:is(h1,h2,h3,h4,h5,h6)]:w-full
        [&_:is(h1,h2,h3,h4,h5,h6)]:rounded-md
        [&_:is(h1,h2,h3,h4,h5,h6)]:-mx-2
        [&_:is(h1,h2,h3,h4,h5,h6)]:px-2
        [&_:is(h1,h2,h3,h4,h5,h6)]:transition-all
        [&_:is(h1,h2,h3,h4,h5,h6)]:duration-200
        [&_:is(h1,h2,h3,h4,h5,h6)]:hover:bg-catppuccin-base/30
        [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h4]:text-lg [&_h5]:text-base [&_h6]:text-base 
        [&_blockquote]:pl-4 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-700
        [&_li]:text-base [&_li]:leading-7 [&_li>p]:my-0
        [&_p_a]:text-blue-400 [&_p_a]:underline [&_p_a]:decoration-blue-400/30 
        [&_p_a]:underline-offset-2 [&_p_a]:transition-colors 
        hover:[&_p_a]:text-blue-300 hover:[&_p_a]:decoration-blue-300/30
        [&_li_a]:text-blue-400 [&_li_a]:underline [&_li_a]:decoration-blue-400/30 
        [&_li_a]:underline-offset-2 [&_li_a]:transition-colors 
        hover:[&_li_a]:text-blue-300 hover:[&_li_a]:decoration-blue-300/30"
      >
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
          <span>Last updated:</span>
          <time dateTime={lastUpdated}>{lastUpdated}</time>
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: createHeadingComponent('h1'),
            h2: createHeadingComponent('h2'),
            h3: createHeadingComponent('h3'),
            h4: createHeadingComponent('h4'),
            h5: createHeadingComponent('h5'),
            h6: createHeadingComponent('h6'),
            table: ({ ...props }) => (
              <div className="my-8 overflow-hidden rounded-lg border border-[color-mix(in_oklab,neutral-700_50%,transparent)]">
                <table {...props} className="w-full border-collapse" />
              </div>
            ),
            thead: ({ ...props }) => (
              <thead
                {...props}
                className="bg-[color-mix(in_oklab,neutral-900_30%,transparent)]"
              />
            ),
            th: ({ ...props }) => (
              <th
                {...props}
                className="p-3 text-left text-sm font-semibold text-neutral-200"
              />
            ),
            td: ({ ...props }) => (
              <td
                {...props}
                className="p-3 text-sm text-neutral-300 border-t border-[color-mix(in_oklab,neutral-700_50%,transparent)]"
              />
            ),
            tr: ({ ...props }) => (
              <tr
                {...props}
                className="hover:bg-[color-mix(in_oklab,neutral-800_20%,transparent)] transition-colors"
              />
            ),
            code: ({ className, children, ...props }) => {
              const isInlineCode = !className?.includes('language-');
              return (
                <code
                  {...props}
                  className={
                    isInlineCode
                      ? 'px-1.5 py-0.5 text-sm bg-[color-mix(in_oklab,neutral-900_30%,transparent)] rounded border border-neutral-800'
                      : undefined
                  }
                >
                  {children}
                </code>
              );
            },
            pre: ({ ...props }) => (
              <pre
                {...props}
                className="my-6 p-4 overflow-x-auto text-sm bg-[color-mix(in_oklab,neutral-900_30%,transparent)] rounded-lg border border-neutral-800"
              />
            ),
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={
                  href?.startsWith('http') ? 'noopener noreferrer' : undefined
                }
                {...props}
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        <div>
          <p className="text-sm text-neutral-400 pb-6">Contributors:</p>
          <a href="https://github.com/allthingslinux/code-of-conduct/graphs/contributors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://contrib.rocks/image?repo=allthingslinux/code-of-conduct"
              alt="Contributors"
              width={500}
              height={100}
            />
          </a>
        </div>
      </article>
    </div>
  );
}
