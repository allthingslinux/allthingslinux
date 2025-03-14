'use client';
import type { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReloadIcon } from '@radix-ui/react-icons';
import InputField from './InputField';
import TextareaField from './TextareaField';
import SelectField from './SelectField';
import type { FormQuestion } from '@/types';

interface FormWrapperProps {
  form: UseFormReturn<any>;
  questions: FormQuestion[];
  onSubmit: (values: any) => Promise<void>;
  title: string;
  description?: string;
  submitText?: string;
  isSubmitting?: boolean;
  error?: string;
  className?: string;
}

export default function FormWrapper({
  form,
  questions,
  onSubmit,
  title,
  description,
  submitText = 'Submit Application',
  isSubmitting = false,
  error,
  className = 'space-y-6 max-w-2xl mx-auto p-4',
}: FormWrapperProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {questions.map((q) => {
            const commonProps = {
              form,
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

              default:
                return null;
            }
          })}
        </div>

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
      </form>
    </Form>
  );
}
