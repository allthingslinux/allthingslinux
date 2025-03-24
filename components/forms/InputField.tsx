'use client';
import { useFormContext, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { memo } from 'react';

export interface InputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const InputField = memo(function InputField({
  name,
  label,
  type = 'text',
  description,
  placeholder,
  disabled,
  required = false,
  className,
}: InputProps) {
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
          <Input
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="new-password"
            data-lpignore="true"
            className={cn(
              'bg-transparent dark:bg-input/30',
              hasError && 'border-red-500 focus:ring-red-500'
            )}
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

export default InputField;
