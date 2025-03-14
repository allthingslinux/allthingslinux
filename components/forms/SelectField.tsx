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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  description?: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export default function SelectField({
  form,
  name,
  label,
  description,
  options,
  placeholder = 'Select an option',
  disabled,
  required = false,
  className,
}: SelectFieldProps) {
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
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
