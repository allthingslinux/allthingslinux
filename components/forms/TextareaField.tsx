'use client';
import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextareaProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  rows?: number;
}

export default function TextareaField({
  form,
  name,
  label,
  description,
  placeholder,
  disabled,
  required = false,
  className,
  rows = 4,
}: TextareaProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel
            className={cn(
              required && "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
          </FormLabel>
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <Textarea
              placeholder={placeholder || 'Enter detailed answer...'}
              disabled={disabled}
              rows={rows}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
