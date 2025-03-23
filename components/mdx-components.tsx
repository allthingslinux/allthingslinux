'use client';

import * as React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { Alert } from '@/components/mdx/alert';

// Memoized components for better performance
const MemoizedHeading1 = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        'scroll-m-20 font-bold tracking-tight mt-10 mb-6',
        className
      )}
      {...props}
    />
  )
);

const MemoizedHeading2 = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 tracking-tight first:mt-0 mt-8 mb-4',
        className
      )}
      {...props}
    />
  )
);

const MemoizedHeading3 = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn('scroll-m-20 tracking-tight mt-6 mb-3', className)}
      {...props}
    />
  )
);

const MemoizedHeading4 = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn('scroll-m-20 tracking-tight mt-5 mb-2', className)}
      {...props}
    />
  )
);

const MemoizedHeading5 = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn('scroll-m-20 tracking-tight mt-4 mb-2', className)}
      {...props}
    />
  )
);

const MemoizedHeading6 = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn('scroll-m-20 tracking-tight mt-4 mb-1.5', className)}
      {...props}
    />
  )
);

// Simplified alert detection regex - precompiled
const ALERT_REGEX =
  /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*?)\s*$/i;

const MemoizedBlockquote = React.memo(
  ({
    className,
    children,
    ...props
  }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => {
    // Simpler alert detection with better performance
    const childArray = React.Children.toArray(children);
    const firstChild = childArray[0];

    // Early return for non-paragraph first children
    if (
      !firstChild ||
      !React.isValidElement(firstChild) ||
      firstChild.type !== 'p'
    ) {
      return (
        <blockquote
          className={cn(
            'mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground',
            className
          )}
          {...props}
        >
          {children}
        </blockquote>
      );
    }

    // Check for alert syntax in the first paragraph
    const firstChildProps = firstChild.props as { children?: React.ReactNode };
    const alertText =
      typeof firstChildProps.children === 'string'
        ? firstChildProps.children
        : null;

    // If no alert text pattern, render normal blockquote
    if (!alertText) {
      return (
        <blockquote
          className={cn(
            'mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground',
            className
          )}
          {...props}
        >
          {children}
        </blockquote>
      );
    }

    // Check for alert pattern using regex
    const match = alertText.match(ALERT_REGEX);
    if (!match) {
      return (
        <blockquote
          className={cn(
            'mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground',
            className
          )}
          {...props}
        >
          {children}
        </blockquote>
      );
    }

    // Extract alert type and title
    const alertType = match[1].toLowerCase() as
      | 'note'
      | 'tip'
      | 'important'
      | 'warning'
      | 'caution';
    const title = match[2] ? match[2].trim() : '';

    // Return the alert component
    return (
      <Alert type={alertType} title={title}>
        {childArray.slice(1)}
      </Alert>
    );
  }
);

// Optimize image component with lazy loading and proper sizing
const MemoizedImage = React.memo(
  ({ alt, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { width: propsWidth, height: propsHeight, ...restProps } = props;

    // Use default sizes that are more reasonable for blog content
    const width = propsWidth
      ? typeof propsWidth === 'number'
        ? propsWidth
        : parseInt(String(propsWidth), 10) || 800
      : 800;

    const height = propsHeight
      ? typeof propsHeight === 'number'
        ? propsHeight
        : parseInt(String(propsHeight), 10) || 450
      : 450;

    return (
      <Image
        className="rounded-md border"
        alt={alt || ''}
        src={src || ''}
        width={width}
        height={height}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        {...restProps}
      />
    );
  }
);

// Set display names for devtools
MemoizedHeading1.displayName = 'MemoizedH1';
MemoizedHeading2.displayName = 'MemoizedH2';
MemoizedHeading3.displayName = 'MemoizedH3';
MemoizedHeading4.displayName = 'MemoizedH4';
MemoizedHeading5.displayName = 'MemoizedH5';
MemoizedHeading6.displayName = 'MemoizedH6';
MemoizedBlockquote.displayName = 'MemoizedBlockquote';
MemoizedImage.displayName = 'MemoizedImage';

// Set display names for the remaining memoized components
const MemoizedAnchor = React.memo(
  ({
    className,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        className={cn(
          'font-medium text-blue-400 underline underline-offset-4 hover:text-blue-300',
          className
        )}
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      />
    );
  }
);
MemoizedAnchor.displayName = 'MemoizedAnchor';

const MemoizedParagraph = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    />
  )
);
MemoizedParagraph.displayName = 'MemoizedParagraph';

const MemoizedUnorderedList = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
  )
);
MemoizedUnorderedList.displayName = 'MemoizedUnorderedList';

const MemoizedOrderedList = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
  )
);
MemoizedOrderedList.displayName = 'MemoizedOrderedList';

const MemoizedListItem = React.memo(
  ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className={cn('mt-2', className)} {...props} />
  )
);
MemoizedListItem.displayName = 'MemoizedListItem';

const MemoizedHorizontalRule = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className={cn('my-4 md:my-8', className)} {...props} />
  )
);
MemoizedHorizontalRule.displayName = 'MemoizedHorizontalRule';

const MemoizedTable = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn('w-full', className)} {...props} />
    </div>
  )
);
MemoizedTable.displayName = 'MemoizedTable';

const MemoizedTableRow = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn('m-0 border-t p-0 even:bg-muted', className)}
      {...props}
    />
  )
);
MemoizedTableRow.displayName = 'MemoizedTableRow';

const MemoizedTableHeader = React.memo(
  ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  )
);
MemoizedTableHeader.displayName = 'MemoizedTableHeader';

const MemoizedTableCell = React.memo(
  ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        'border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right',
        className
      )}
      {...props}
    />
  )
);
MemoizedTableCell.displayName = 'MemoizedTableCell';

const MemoizedPreformatted = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        'mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4',
        className
      )}
      {...props}
    />
  )
);
MemoizedPreformatted.displayName = 'MemoizedPreformatted';

const MemoizedCode = React.memo(
  ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInlineCode = !className?.includes('language-');
    return isInlineCode ? (
      <code
        className={cn(
          'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
          className
        )}
        {...props}
      />
    ) : (
      <code
        className={cn(
          'relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm',
          className
        )}
        {...props}
      />
    );
  }
);
MemoizedCode.displayName = 'MemoizedCode';

const components = {
  h1: MemoizedHeading1,
  h2: MemoizedHeading2,
  h3: MemoizedHeading3,
  h4: MemoizedHeading4,
  h5: MemoizedHeading5,
  h6: MemoizedHeading6,
  a: MemoizedAnchor,
  p: MemoizedParagraph,
  ul: MemoizedUnorderedList,
  ol: MemoizedOrderedList,
  li: MemoizedListItem,
  blockquote: MemoizedBlockquote,
  img: MemoizedImage,
  hr: MemoizedHorizontalRule,
  table: MemoizedTable,
  tr: MemoizedTableRow,
  th: MemoizedTableHeader,
  td: MemoizedTableCell,
  pre: MemoizedPreformatted,
  code: MemoizedCode,
  Image,
  Alert,
};

// Client-side error handling component
function ErrorDisplay({ error }: { error: Error }) {
  return (
    <div className="rounded-md border border-red-500 bg-red-50 p-4 dark:bg-red-900/10">
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
        Error rendering MDX content
      </h3>
      <p className="mt-2 text-sm text-red-700 dark:text-red-300">
        There was an error rendering this content. Please check the MDX syntax.
      </p>
      <pre className="mt-4 overflow-auto rounded-md bg-red-100 p-2 text-xs text-red-900 dark:bg-red-950 dark:text-red-200">
        {error.message}
      </pre>
    </div>
  );
}

function MissingContentDisplay() {
  return (
    <div className="rounded-md border border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900/10">
      <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
        Missing content
      </h3>
      <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
        The MDX content for this post could not be loaded.
      </p>
    </div>
  );
}

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const [renderError, setRenderError] = React.useState<Error | null>(null);

  // Always call hooks at the top level, regardless of conditions
  const Component = useMDXComponent(code || '');

  // Use effect to reset error state when code changes
  React.useEffect(() => {
    setRenderError(null);
  }, [code]);

  // Handle missing code - after all hooks are called
  if (!code) {
    return <MissingContentDisplay />;
  }

  if (renderError) {
    return <ErrorDisplay error={renderError} />;
  }

  try {
    return (
      <div className="mdx prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-a:text-primary prose-pre:bg-black prose-code:bg-muted prose-code:before:content-none prose-code:after:content-none">
        <Component
          components={components}
          // Add error handler for runtime errors
          onError={(error: Error) => {
            console.error('MDX rendering error:', error);
            setRenderError(error);
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering MDX:', error);
    if (error instanceof Error) {
      return <ErrorDisplay error={error} />;
    }
    return (
      <div className="rounded-md border border-red-500 bg-red-50 p-4 dark:bg-red-900/10">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
          Unknown error rendering MDX content
        </h3>
      </div>
    );
  }
}
