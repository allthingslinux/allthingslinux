import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { FormQuestion, Role } from '@/types';
import { z } from 'zod';

/**
 * Combines multiple class names and merges Tailwind classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const generateFormSchema = (questions: FormQuestion[]) => {
  return z.object(
    questions.reduce(
      (acc, curr) => {
        // Check if this is an "other" field that depends on a parent field
        const isOtherField = curr.name.endsWith('_other');

        // If the question has showIf condition, make it conditionally required
        const isConditional = !!curr.showIf;

        switch (curr.type) {
          case 'short':
          case 'paragraph':
            // If it's conditional or optional, make it optional in schema
            // Special handling for "_other" fields - they should be conditionally required
            if (isOtherField && isConditional) {
              // Make it optional by default
              acc[curr.name] = z.string().optional();

              // We'll handle this with the form display logic instead of validation
              // The server-side validation will intelligently check these fields
            } else {
              acc[curr.name] =
                curr.optional || isConditional
                  ? z.string().optional()
                  : z.string().min(1, { message: 'This field is required' });
            }
            break;

          case 'digits-only':
            // Create a validator for digit-only string (like Discord IDs)
            let digitsSchema = z.string().regex(/^\d*$/, {
              message: 'Only numeric digits (0-9) are allowed',
            });

            // Add length constraints if specified
            if (typeof curr.minLength === 'number') {
              digitsSchema = digitsSchema.min(curr.minLength, {
                message: `Must be at least ${curr.minLength} digits`,
              });
            }

            if (typeof curr.maxLength === 'number') {
              digitsSchema = digitsSchema.max(curr.maxLength, {
                message: `Must be at most ${curr.maxLength} digits`,
              });
            }

            // If not required, make it optional
            acc[curr.name] =
              curr.optional || isConditional
                ? digitsSchema.optional()
                : digitsSchema.min(1, { message: 'This field is required' });
            break;

          case 'number':
            // Create a number validator with optional min/max constraints
            let numberSchema = z.coerce.number();

            // Add min constraint if specified
            if (typeof curr.min === 'number') {
              numberSchema = numberSchema.min(curr.min, {
                message: `Value must be at least ${curr.min}`,
              });
            }

            // Add max constraint if specified
            if (typeof curr.max === 'number') {
              numberSchema = numberSchema.max(curr.max, {
                message: `Value must be at most ${curr.max}`,
              });
            }

            // Make it optional if needed
            acc[curr.name] =
              curr.optional || isConditional
                ? numberSchema.optional()
                : numberSchema;
            break;

          case 'select':
            // Handle select fields with comprehensive validation
            const selectOptions = curr.options as [string, ...string[]];

            const selectSchema = z.union([
              // Accept a valid enum value
              z.enum(selectOptions),
              // Accept an empty string (unselected state)
              z.literal(''),
              // Handle case where options array is mistakenly passed
              z.array(z.string()).transform(() => ''),
              // Handle any other unexpected input
              z.any().transform((val) => {
                console.warn(`Field ${curr.name} received unexpected value:`, val, typeof val);
                return '';
              })
            ]).transform((val) => {
              // Ensure we always return a string
              if (typeof val !== 'string') {
                console.warn(`Field ${curr.name} transformed non-string to empty string:`, val);
                return '';
              }
              return val;
            });

            acc[curr.name] =
              curr.optional || isConditional
                ? selectSchema.optional()
                : selectSchema.refine((val) => val && val.length > 0, {
                    message: 'Please select an option',
                  });
            break;          default:
            acc[curr.name] = z.string().optional();
        }
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    )
  );
};

// Helper function to organize roles by department
export function getRolesByDepartment(roles: Role[]): Record<string, Role[]> {
  return roles.reduce(
    (acc, role) => {
      if (!acc[role.department]) {
        acc[role.department] = [];
      }
      acc[role.department].push(role);
      return acc;
    },
    {} as Record<string, Role[]>
  );
}

/**
 * Generates absolute URLs for the application.
 * - In development: uses localhost:3000
 * - In production: uses NEXT_PUBLIC_APP_URL env var or falls back to allthingslinux.org
 */
export function getBaseUrl(): string {
  // Check if we're running on the server and in development mode
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // Check if window is available (client side)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // In production server-side rendering, use the environment variable or fallback
  return process.env.NEXT_PUBLIC_APP_URL || 'https://allthingslinux.org';
}

/**
 * Creates URLs for the API with correct absolute paths and cache busting in development
 */
export function getApiUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

  // Add cache busting in development mode
  if (process.env.NODE_ENV === 'development') {
    const cacheBuster = `_cb=${Date.now()}`;
    return url.includes('?')
      ? `${url}&${cacheBuster}`
      : `${url}?${cacheBuster}`;
  }

  return url;
}
