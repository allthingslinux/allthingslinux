'use client';
import type { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReloadIcon } from '@radix-ui/react-icons';
import InputField from './InputField';
import TextareaField from './TextareaField';
import SelectField from './SelectField';
import NumberField from './NumberField';
import DigitsOnlyField from './DigitsOnlyField';
import type { FormQuestion } from '@/types';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

interface FormWrapperProps {
  form?: UseFormReturn<Record<string, unknown>>; // Replace any with more specific type
  questions: FormQuestion[];
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  title: string;
  description?: string;
  submitText?: string;
  isSubmitting?: boolean;
  error?: string;
  className?: string;
  hideSubmitButton?: boolean;
}

// Helper function to check if a question should be shown based on dependencies
const shouldShowQuestion = (
  question: FormQuestion,
  formValues: Record<string, unknown>
): boolean => {
  // If the question has no showIf condition, always show it
  if (!question.showIf) return true;

  // Check each condition to determine if the question should be shown
  for (const [dependentField, requiredValue] of Object.entries(
    question.showIf
  )) {
    const fieldValue = formValues[dependentField];

    // If required value is an array, check if the current value is in that array
    if (Array.isArray(requiredValue)) {
      // Convert to string for comparison since form values are often strings
      const strValue =
        typeof fieldValue === 'string' ? fieldValue : String(fieldValue || '');
      if (!requiredValue.includes(strValue)) {
        return false;
      }
    }
    // Otherwise check if the current value equals the required value
    else if (fieldValue !== requiredValue) {
      return false;
    }
  }

  return true;
};

export default function FormWrapper({
  form: formProp,
  questions,
  onSubmit,
  title,
  description,
  submitText = 'Submit Application',
  isSubmitting = false,
  error,
  className = 'space-y-6 max-w-2xl mx-auto p-4',
  hideSubmitButton = false,
}: FormWrapperProps) {
  // Try to get form from context, otherwise use the provided form prop
  const formContext = useFormContext();
  const form = formProp || formContext;

  // Filter questions to only show ones that satisfy their conditions
  const visibleQuestions = useMemo(() => {
    // Move formValues inside useMemo to fix exhaustive deps warning
    const formValues = form?.watch() || {};
    return questions.filter((q) => shouldShowQuestion(q, formValues));
  }, [form, questions]);

  if (!form) {
    console.error('Form is required. Provide it as a prop or via FormProvider');
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Only show error alert if explicitly provided and not empty */}
        {error && error.length > 0 && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          {visibleQuestions.map((q) => {
            const commonProps = {
              name: q.name,
              label: q.question,
              required: !q.optional,
              description: q.description,
              disabled: isSubmitting,
            };

            switch (q.type) {
              case 'short':
                return (
                  <InputField
                    key={q.name}
                    {...commonProps}
                    type={q.inputType || 'text'}
                  />
                );

              case 'paragraph':
                return (
                  <TextareaField
                    key={q.name}
                    {...commonProps}
                    rows={q.rows || 4}
                  />
                );

              case 'select':
                return (
                  <SelectField
                    key={q.name}
                    {...commonProps}
                    options={q.options || []}
                  />
                );

              case 'number':
                return (
                  <NumberField
                    key={q.name}
                    {...commonProps}
                    min={q.min}
                    max={q.max}
                    step={q.step}
                  />
                );

              case 'digits-only':
                return (
                  <DigitsOnlyField
                    key={q.name}
                    {...commonProps}
                    minLength={q.minLength}
                    maxLength={q.maxLength}
                    placeholder={q.placeholder}
                  />
                );

              default:
                return null;
            }
          })}
        </div>

        {!hideSubmitButton && (
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[200px]"
            >
              {isSubmitting && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitText}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
