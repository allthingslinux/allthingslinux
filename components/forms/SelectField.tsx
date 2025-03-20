'use client';
import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface SelectFieldProps {
  name: string;
  label: string;
  description?: string;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

// Using memo to prevent unnecessary re-renders
const SelectField = memo(function SelectField({
  name,
  label,
  description,
  options,
  placeholder = 'Select an option',
  disabled,
  required = false,
  className,
}: SelectFieldProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Ensure value is always a string
  const value = watch(name) || '';

  // Check if this field has an error
  const hasError = !!errors[name];
  // Always use a clean error message for select fields rather than showing the enum error
  const errorMessage = hasError ? 'Please select an option' : '';

  return (
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
      {/* Hidden input to prevent autocomplete */}
      <input type="hidden" autoComplete="off" />
      <Select
        onValueChange={(newValue) => {
          setValue(name, newValue, {
            shouldValidate: true, // Validate immediately on selection
            shouldDirty: true,
            shouldTouch: true,
          });
        }}
        value={value}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            'w-full',
            hasError && 'border-red-500 focus:ring-red-500'
          )}
        >
          <SelectValue placeholder={placeholder} className="" />
        </SelectTrigger>
        <SelectContent className="">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Add direct error display that will always show */}
      {hasError && (
        <p className="text-sm font-medium text-red-400 mt-1">{errorMessage}</p>
      )}
    </FormItem>
  );
});

export default SelectField;
