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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
  className?: string;
}

export default function InputField({
  form,
  name,
  label,
  description,
  placeholder,
  disabled,
  required = false,
  type = 'text',
  className,
}: InputProps) {
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
            <Input
              type={type}
              placeholder={placeholder || 'Enter your answer...'}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
