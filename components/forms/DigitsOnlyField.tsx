'use client';
import { useFormContext, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { memo } from 'react';

export interface DigitsOnlyFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  className?: string;
}

const DigitsOnlyField = memo(function DigitsOnlyField({
  name,
  label,
  description,
  placeholder,
  disabled,
  required = false,
  minLength,
  maxLength,
  className,
}: DigitsOnlyFieldProps) {
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
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="new-password"
            minLength={minLength}
            maxLength={maxLength}
            className={cn(
              'bg-transparent dark:bg-input/30',
              hasError && 'border-red-500 focus:ring-red-500'
            )}
            value={field.value || ''}
            onChange={(e) => {
              // Only allow digits
              const value = e.target.value.replace(/\D/g, '');
              field.onChange(value);
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

export default DigitsOnlyField;
