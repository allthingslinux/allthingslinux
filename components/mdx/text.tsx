import React from 'react';
import { cn } from '@/lib/utils';
import { Alert } from './alert';
import { GitHubLink } from './github';

interface MDXTextProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  href?: string;
  children?: React.ReactNode;
}

export const Link = ({ className, href, children, ...props }: MDXTextProps) => {
  // Handle GitHub issue/PR references (#123)
  if (typeof children === 'string' && /^#\d+$/.test(children)) {
    // Check if it's a pull request by looking at the href
    const isPR = href?.includes('/pull/');
    return <GitHubLink type={isPR ? 'pr' : 'issue'} reference={children} />;
  }

  // Handle GitHub commit references (37095db)
  if (typeof children === 'string' && /^[0-9a-f]{7,40}$/.test(children)) {
    return <GitHubLink type="commit" reference={children} />;
  }

  // Handle GitHub commit range (37095db...d1f9088)
  if (
    typeof children === 'string' &&
    /^[0-9a-f]{7,40}\.{2,3}[0-9a-f]{7,40}$/.test(children)
  ) {
    const [start, end] = children.split(/\.{2,3}/);
    return (
      <span className="inline-flex items-center gap-1.5">
        <GitHubLink type="commit" reference={start} />
        <span className="text-muted-foreground">→</span>
        <GitHubLink type="commit" reference={end} />
      </span>
    );
  }

  // Handle GitHub user references (@username)
  if (typeof children === 'string' && /^@[a-zA-Z0-9-]+$/.test(children)) {
    // Check if it's an organization by looking at the href
    const isOrg = href?.includes('/orgs/');
    return <GitHubLink type={isOrg ? 'org' : 'user'} reference={children} />;
  }

  // Handle GitHub repo references (org/repo#123)
  if (
    typeof children === 'string' &&
    /^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+#\d+$/.test(children)
  ) {
    const [repo, issueNum] = children.split('#');
    // Check if it's a pull request by looking at the href
    const isPR = href?.includes('/pull/');
    return (
      <GitHubLink
        type={isPR ? 'pr' : 'issue'}
        reference={`#${issueNum}`}
        repo={repo}
      />
    );
  }

  // Handle GitHub repo references with commit (org/repo@commit)
  if (
    typeof children === 'string' &&
    /^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+@[0-9a-f]{7,40}$/.test(children)
  ) {
    const [repo, commit] = children.split('@');
    return <GitHubLink type="commit" reference={commit} repo={repo} />;
  }

  // Handle GitHub repo references with branch (org/repo:branch)
  if (
    typeof children === 'string' &&
    /^[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+:[a-zA-Z0-9\/_-]+$/.test(children)
  ) {
    const [repo, branch] = children.split(':');
    return <GitHubLink type="branch" reference={branch} repo={repo} />;
  }

  // Handle GH-123 format
  if (typeof children === 'string' && /^GH-\d+$/.test(children)) {
    return (
      <GitHubLink type="issue" reference={`#${children.replace('GH-', '')}`} />
    );
  }

  // Default link handling
  const isExternal = href?.startsWith('http');
  const displayHref = isExternal
    ? href
    : `${process.env.NEXT_PUBLIC_APP_URL}${href}`;

  return (
    <a
      className={cn(
        'font-medium text-blue-400 underline underline-offset-4 hover:text-blue-300',
        className
      )}
      href={href}
      data-href={displayHref}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export const Paragraph = ({ className, ...props }: MDXTextProps) => (
  <p
    className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
    {...props}
  />
);

export const UnorderedList = ({ className, ...props }: MDXTextProps) => (
  <ul className={cn('my-6 ml-6 list-disc', className)} {...props} />
);

export const OrderedList = ({ className, ...props }: MDXTextProps) => (
  <ol className={cn('my-6 ml-6 list-decimal', className)} {...props} />
);

export const ListItem = ({ className, ...props }: MDXTextProps) => (
  <li className={cn('mt-2', className)} {...props} />
);

export const Blockquote = ({ className, children, ...props }: MDXTextProps) => {
  const childArray = React.Children.toArray(children);
  const firstChild = childArray[0] as React.ReactElement<{ children: string }>;

  if (
    React.isValidElement(firstChild) &&
    typeof firstChild.props?.children === 'string' &&
    firstChild.props.children.startsWith('[!')
  ) {
    const alertText = firstChild.props.children;
    const match = alertText.match(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (match) {
      const alertType = match[1].toLowerCase() as
        | 'note'
        | 'tip'
        | 'important'
        | 'warning'
        | 'caution';
      const content = alertText.replace(/\[!.*?\]\s*/, '').trim();

      return (
        <Alert type={alertType}>
          <p>{content}</p>
          {childArray.slice(1)}
        </Alert>
      );
    }
  }

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
};

export const HorizontalRule = ({ ...props }: MDXTextProps) => (
  <hr className="my-4 md:my-8" {...props} />
);
