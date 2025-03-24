'use client';
import { useFormContext, Controller } from 'react-hook-form';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { memo } from 'react';

export interface NumberFieldProps {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const NumberField = memo(function NumberField({
  name,
  label,
  description,
  placeholder,
  disabled,
  required = false,
  min,
  max,
  step = 1,
  className,
}: NumberFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Check if this field has an error
  const hasError = !!errors[name];
  const errorMessage = hasError
    ? String(errors[name]?.message || 'Please enter a valid number')
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
                "after:content-['*'] after:ml-0.5 after:text-destructive after:font-bold",
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
            type="number"
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            min={min}
            max={max}
            step={step}
            className={cn(
              'bg-transparent dark:bg-input/30',
              hasError && 'border-destructive focus:ring-destructive'
            )}
            // Use value directly but ensure it's a string for the input
            value={
              field.value === undefined || field.value === null
                ? ''
                : field.value
            }
            onChange={(e) => {
              // For number inputs, we need to convert the string value to a number
              const value =
                e.target.value === '' ? '' : parseFloat(e.target.value);
              field.onChange(value);
              // React Hook Form will handle validation automatically in onChange mode
            }}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />

          {/* Add direct error display that will always show */}
          {hasError && (
            <p className="text-sm font-medium text-destructive mt-1">
              {errorMessage}
            </p>
          )}
        </FormItem>
      )}
    />
  );
});

export default NumberField;
