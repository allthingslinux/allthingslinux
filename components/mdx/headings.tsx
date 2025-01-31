import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MDXHeadingProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  'data-language'?: string;
  'data-theme'?: string;
}

const baseStyles = {
  h1: 'mt-2 scroll-m-20 text-4xl font-bold tracking-tight',
  h2: 'mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'mt-8 scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
  h6: 'mt-8 scroll-m-20 text-base font-semibold tracking-tight',
} as const;

export const createHeadingComponent = (level: keyof typeof baseStyles) => {
  const HeadingComponent = ({
    className,
    children,
    ...props
  }: MDXHeadingProps) => {
    const text = typeof children === 'string' ? children : '';
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    return React.createElement(
      level,
      {
        id: slug,
        className: cn(
          baseStyles[level],
          'group flex items-center gap-2',
          className
        ),
        ...props,
      },
      <>
        {children}
        <a
          href={`#${slug}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Link to ${text}`}
        >
          <LinkIcon className="size-4 text-muted-foreground" />
        </a>
      </>
    );
  };

  HeadingComponent.displayName = `${level.toUpperCase()}Heading`;
  return HeadingComponent;
};
