'use client';
import { useFormContext, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { memo } from 'react';

export interface TextareaProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  className?: string;
}

const TextareaField = memo(function TextareaField({
  name,
  label,
  description,
  placeholder,
  disabled,
  required = false,
  rows = 4,
  className,
}: TextareaProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Check if this field has an error
  const hasError = !!errors[name];
  const errorMessage = hasError
    ? String(errors[name]?.message || 'This field is required')
    : '';

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel
            className={cn(
              'font-medium text-base',
              required &&
                "after:content-['*'] after:ml-0.5 after:text-red-500 after:font-bold",
              !required &&
                "after:content-['(optional)'] after:ml-1.5 after:text-muted-foreground after:text-xs after:font-normal"
            )}
          >
            {label}
          </FormLabel>
          {description && (
            <FormDescription className="mt-2">{description}</FormDescription>
          )}
          <Textarea
            placeholder={placeholder || 'Enter detailed answer...'}
            disabled={disabled}
            autoComplete="new-password"
            rows={rows}
            className={cn(hasError && 'border-red-500 focus:ring-red-500')}
            value={field.value || ''}
            onChange={(e) => {
              field.onChange(e);
              // React Hook Form will handle validation automatically in onChange mode
            }}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />

          {/* Add direct error display that will always show */}
          {hasError && (
            <p className="text-sm font-medium text-red-400 mt-1">
              {errorMessage}
            </p>
          )}
        </FormItem>
      )}
    />
  );
});

export default TextareaField;
