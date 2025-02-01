import React from 'react';
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { createHeadingComponent } from '@/components/mdx/headings';
import {
  Link,
  Paragraph,
  UnorderedList,
  OrderedList,
  ListItem,
  Blockquote,
  HorizontalRule,
} from '@/components/mdx/text';
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from '@/components/mdx/table';
import { Pre, InlineCode } from '@/components/mdx/code';
import { TaskList, TaskListItem } from '@/components/mdx/task-list';
import { Alert } from '@/components/mdx/alert';

interface ListProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

interface CheckboxProps {
  type: 'checkbox';
  checked?: boolean;
}

function isCheckbox(
  element: unknown
): element is React.ReactElement<CheckboxProps> {
  return (
    React.isValidElement(element) &&
    element.type === 'input' &&
    (element.props as CheckboxProps).type === 'checkbox'
  );
}

// Export the components directly
export const components: MDXComponents = {
  h1: createHeadingComponent('h1'),
  h2: createHeadingComponent('h2'),
  h3: createHeadingComponent('h3'),
  h4: createHeadingComponent('h4'),
  a: Link,
  p: Paragraph,
  ul: ({ className, ...props }: ListProps) => {
    if (className?.includes('contains-task-list')) {
      return <TaskList {...props} />;
    }
    return <UnorderedList className={className} {...props} />;
  },
  ol: OrderedList,
  li: ({ className, children, ...props }: ListProps) => {
    if (className?.includes('task-list-item')) {
      // Handle task list items
      const content = React.Children.toArray(children);
      // Find the input element that represents the checkbox
      const checkbox = content.find(isCheckbox);
      // Get the text content (everything after the checkbox)
      const text = content.filter(
        (child) =>
          !React.isValidElement(child) ||
          (child.type !== 'input' && child.type !== 'p')
      );

      return (
        <TaskListItem checked={Boolean(checkbox?.props.checked)} {...props}>
          {text}
        </TaskListItem>
      );
    }
    return (
      <ListItem className={className} {...props}>
        {children}
      </ListItem>
    );
  },
  blockquote: Blockquote,
  hr: HorizontalRule,
  table: Table,
  tr: TableRow,
  th: ({ align, ...props }) => (
    <TableHeader align={align as 'left' | 'center' | 'right'} {...props} />
  ),
  td: ({ align, ...props }) => (
    <TableCell align={align as 'left' | 'center' | 'right'} {...props} />
  ),
  pre: Pre,
  code: InlineCode,
  Image,
  Alert,
};

// Keep this for compatibility with MDX's expected interface
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Alert,
    a: Link,
    p: Paragraph,
    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,
    blockquote: Blockquote,
    hr: HorizontalRule,
    Image,
    ...components,
  };
}
