import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface TaskListProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export const TaskList = ({ className, ...props }: TaskListProps) => (
  <ul className={cn('my-6 list-none space-y-2 pl-0', className)} {...props} />
);

export const TaskListItem = ({
  className,
  checked,
  ...props
}: TaskListProps & { checked?: boolean }) => (
  <li className={cn('flex items-center gap-3 text-sm', className)} {...props}>
    <div
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
        checked ? 'border-blue-500 bg-blue-500' : 'border-muted'
      )}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </div>
    <span
      className={cn('flex-1', checked && 'text-muted-foreground line-through')}
    >
      {props.children}
    </span>
  </li>
);
