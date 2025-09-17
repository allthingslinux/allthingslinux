'use client';

import { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { defineStepper } from '@stepperize/react';
import FormWrapper from '@/components/forms/FormWrapper';
import { generateFormSchema } from '@/lib/utils';
import type { FormQuestion } from '@/types';
import type { Role } from '@/types';
import StepIndicator from './StepIndicator';
import type { StepId } from './StepIndicator';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

// Define the stepper with two steps
const { Scoped, useStepper } = defineStepper(
  {
    id: 'general',
    title: 'General Information',
    description: 'Basic information about you',
  },
  {
    id: 'role_specific',
    title: 'Department & Role Questions',
    description: 'Questions specific to your application',
  }
);

export default function StepperForm({
  generalQuestions,
  departmentalQuestions,
  roleQuestions: _unused,
  role,
  onSubmitAction,
}: {
  generalQuestions: FormQuestion[];
  departmentalQuestions: FormQuestion[];
  roleQuestions: FormQuestion[];
  role: Role;
  onSubmitAction: (data: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <Scoped initialStep="general">
      <StepperFormContent
        generalQuestions={generalQuestions}
        roleQuestions={departmentalQuestions}
        role={role}
        onSubmitAction={onSubmitAction}
      />
    </Scoped>
  );
}

function StepperFormContent({
  generalQuestions,
  roleQuestions,
  role,
  onSubmitAction,
}: {
  generalQuestions: FormQuestion[];
  roleQuestions: FormQuestion[];
  role: Role;
  onSubmitAction: (data: Record<string, unknown>) => Promise<void>;
}) {
  const methods = useStepper();
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Create all schemas up-front
  const generalSchema = generateFormSchema(generalQuestions);
  const roleSchema = generateFormSchema(roleQuestions);

  // Combine schemas into one master schema (useful for final validation)
  const combinedSchema = z.object({
    ...generalSchema.shape,
    ...roleSchema.shape,
  });

  // Create a single form instance with validation options
  const form = useForm({
    mode: 'onBlur', // Only validate when field loses focus, not on every change
    criteriaMode: 'all', // Show all validation errors
    shouldFocusError: true, // Focus on first error field
    resolver: zodResolver(
      methods.current.id === 'general' ? generalSchema : roleSchema
    ),
    // Ensure every field has at least an empty string as default
    defaultValues: {
      ...Object.fromEntries(
        [...generalQuestions, ...roleQuestions].map((q) => [q.name, ''])
      ),
      ...formData,
    },
  });

  // Handle step navigation
  const navigateToStep = async (targetStep: StepId) => {
    // Reset any previous submission errors when navigating
    setSubmissionError(null);

    // If moving forward, validate the current step first
    if (
      (methods.current.id === 'general' && targetStep === 'role_specific') ||
      methods.current.id === targetStep
    ) {
      // Get required fields for the current step
      const currentQuestions =
        methods.current.id === 'general' ? generalQuestions : roleQuestions;
      const requiredFields = currentQuestions
        .filter((q) => !q.optional)
        .map((q) => q.name);

      // Validate all fields with validation triggered
      const isValid = await form.trigger(requiredFields, { shouldFocus: true });

      if (!isValid) {
        // Find the first field with an error and scroll to it
        setTimeout(() => {
          const firstErrorField = document.querySelector(
            '[aria-invalid="true"]'
          );
          if (firstErrorField) {
            // Make sure we scroll with smooth behavior
            firstErrorField.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });

            // Also try to focus the element for better accessibility
            if (firstErrorField instanceof HTMLElement) {
              try {
                firstErrorField.focus();
              } catch (e) {
                console.warn('Unable to focus error field:', e);
              }
            }
          }
        }, 100);

        return; // Don't proceed if validation fails
      }
    }

    // Save current data before navigating
    const currentValues = form.getValues();
    setFormData((prev) => ({ ...prev, ...currentValues }));

    // Navigate to the requested step
    methods.goTo(targetStep);

    // Make sure to scroll to top with a slight delay to ensure DOM updates
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  // Handle form submission
  const handleSubmit = async (stepData: Record<string, unknown>) => {
    try {
      setSubmissionError(null);

      // For final submission, merge all form data
      const finalData = { ...formData, ...stepData };

      // Validate all required fields with the combined schema
      const validationResult = combinedSchema.safeParse(finalData);

      if (validationResult.success) {
        try {
          await onSubmitAction(finalData);

          // Scroll to top after successful submission
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error('Error in form submission:', error);
          setSubmissionError(
            'There was an error submitting your application. Please try again later.'
          );

          // Scroll to error message
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        }
      } else {
        // If validation fails on the final step, show field errors
        console.log('Validation failed:', validationResult.error);

        // Find the first field with an error and scroll to it
        setTimeout(() => {
          const firstErrorField = document.querySelector(
            '[aria-invalid="true"]'
          );
          if (firstErrorField) {
            firstErrorField.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          } else {
            // If no specific field is found, scroll to top of form
            const form = document.querySelector('form');
            if (form) {
              form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 100);

        return;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionError(
        'There was an error processing your application. Please try again later.'
      );

      // Scroll to error message
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="space-y-8">
      <StepIndicator
        currentStep={methods.current}
        stepper={methods}
        errors={{}} // Hide error indicators in step navigator
        errorCounts={{}} // Hide error counts
        onStepClick={navigateToStep}
      />

      {submissionError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Submission Error
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{submissionError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <FormProvider {...form}>
        {methods.switch({
          general: () => (
            <StepForm
              questions={generalQuestions}
              title="General Questions"
              description="We'll use this information to get to know you better"
              onNext={() => navigateToStep('role_specific')}
              showPrevious={false}
            />
          ),
          role_specific: () => (
            <StepForm
              questions={roleQuestions}
              title="Department & Role Questions"
              description={`Questions specific to the ${role.department} department and this role`}
              onPrevious={() => navigateToStep('general')}
              onSubmit={handleSubmit}
              isLastStep={true}
            />
          ),
        })}
      </FormProvider>
    </div>
  );
}

function StepForm({
  questions,
  title,
  description,
  onNext,
  onPrevious,
  onSubmit,
  isLastStep = false,
  showPrevious = true,
}: {
  questions: FormQuestion[];
  title: string;
  description?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: (data: Record<string, unknown>) => Promise<void>;
  isLastStep?: boolean;
  showPrevious?: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get methods from the form context
  const { handleSubmit, formState, trigger } = useFormContext();

  const handleFormAction = async (data: Record<string, unknown>) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Get required fields for validation
      const requiredFields = questions
        .filter((q) => !q.optional)
        .map((q) => q.name);

      // Explicitly trigger validation on all required fields
      const isValid = await trigger(requiredFields, { shouldFocus: true });

      if (!isValid) {
        setIsSubmitting(false);

        // Find the first field with an error and scroll to it
        setTimeout(() => {
          const firstErrorField = document.querySelector(
            '[aria-invalid="true"]'
          );
          if (firstErrorField) {
            // Ensure the field is visible in the viewport with a reliable scroll
            firstErrorField.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });

            // Try to focus the field for better accessibility
            if (firstErrorField instanceof HTMLElement) {
              try {
                firstErrorField.focus();
              } catch (e) {
                console.warn('Unable to focus error field:', e);
              }
            }
          } else {
            // If no specific field error is found, scroll to the form
            const form = document.querySelector('form');
            if (form) {
              form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 150); // Slightly longer timeout to ensure DOM is ready

        return;
      }

      if (isLastStep && onSubmit) {
        await onSubmit(data);
      } else if (onNext) {
        onNext();
        // Make sure to scroll to top after transitioning to next step
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      }
    } catch (error) {
      console.error('Form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormWrapper
        questions={questions}
        title={title}
        description={description}
        onSubmit={() => Promise.resolve()}
        submitText={isLastStep ? 'Submit Application' : 'Continue'}
        hideSubmitButton={true}
        // Don't show any error summary at the top
        error=""
      />

      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        {/* Left side - Previous button */}
        <div>
          {showPrevious && onPrevious && (
            <Button
              type="button"
              onClick={() => {
                // No validation needed when going back
                onPrevious();
              }}
              variant="outline"
              size="lg"
              className="md:w-auto min-w-[200px]"
              disabled={isSubmitting || formState.isSubmitting}
            >
              Previous
            </Button>
          )}
        </div>

        {/* Right side - Next/Submit button */}
        <div>
          <Button
            type="button"
            onClick={() => {
              handleSubmit(handleFormAction)();
            }}
            size="lg"
            className="md:w-auto min-w-[200px]"
            disabled={isSubmitting || formState.isSubmitting}
          >
            {isSubmitting || formState.isSubmitting
              ? isLastStep
                ? 'Submitting...'
                : 'Processing...'
              : isLastStep
                ? 'Submit Application'
                : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  );
}
