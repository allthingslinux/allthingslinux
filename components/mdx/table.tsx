import React from 'react';
import { cn } from '@/lib/utils';

interface MDXTableProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export const Table = ({ className, ...props }: MDXTableProps) => (
  <div className="not-prose my-6 w-full overflow-x-auto rounded-lg">
    <table
      className={cn(
        'w-full border-collapse text-sm',
        'dark:text-gray-300',
        className
      )}
      {...props}
    />
  </div>
);

export const TableRow = ({ className, ...props }: MDXTableProps) => (
  <tr
    className={cn(
      'border-b border-muted/50 last:border-0',
      'hover:bg-muted/5',
      className
    )}
    {...props}
  />
);

export const TableHeader = ({ className, align, ...props }: MDXTableProps) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th
      className={cn(
        'bg-catppuccin-base p-4 text-sm font-medium text-gray-300',
        align && alignmentClasses[align],
        className
      )}
      {...props}
    />
  );
};

export const TableCell = ({ className, align, ...props }: MDXTableProps) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      className={cn(
        'border-b border-muted/50 p-4 text-sm',
        align && alignmentClasses[align],
        className
      )}
      {...props}
    />
  );
};
