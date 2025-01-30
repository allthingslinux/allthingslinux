import React from 'react';
import { cn } from '@/lib/utils';

interface MDXMediaProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  alt?: string;
  src?: string;
}

export const Image = ({ className, alt, ...props }: MDXMediaProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img className={cn('rounded-md border', className)} alt={alt} {...props} />
);
