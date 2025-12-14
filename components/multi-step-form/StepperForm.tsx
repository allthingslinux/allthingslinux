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

// Helper function to check if a question should be shown based on dependencies
export const shouldShowQuestion = (
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
        typeof fieldValue === 'string'
          ? fieldValue
          : String(fieldValue ?? '');
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

// Helper function to scroll to the first error field
const scrollToFirstError = () => {
  setTimeout(() => {
    const firstErrorField = document.querySelector('[aria-invalid="true"]');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      if (firstErrorField instanceof HTMLElement) {
        try {
          firstErrorField.focus();
        } catch (e) {
          console.warn('Unable to focus error field:', e);
        }
      }
    } else {
      const form = document.querySelector('form');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, 150);
};

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
    mode: 'onSubmit', // Only validate on submit
    reValidateMode: 'onSubmit', // Never re-validate automatically
    criteriaMode: 'all', // Show all validation errors
    shouldFocusError: true, // Focus on first error field
    shouldUnregister: false, // Keep all fields registered
    // No resolver - we'll handle validation manually
    // Ensure every field has at least an empty string as default
    defaultValues: {
      ...Object.fromEntries(
        [...generalQuestions, ...roleQuestions].map((q) => [q.name, ''])
      ),
      ...formData,
    },
  });

  // Compute visible questions for each step
  const currentValues = form.watch();
  const visibleGeneralQuestions = generalQuestions.filter((q) =>
    shouldShowQuestion(q, currentValues)
  );
  const visibleRoleQuestions = roleQuestions.filter((q) =>
    shouldShowQuestion(q, currentValues)
  );

  // Handle step navigation
  const navigateToStep = async (targetStep: StepId) => {
    // Reset any previous submission errors when navigating
    setSubmissionError(null);

    // If moving forward, validate the current step first
    if (
      (methods.current.id === 'general' && targetStep === 'role_specific') ||
      methods.current.id === targetStep
    ) {
      // Get visible questions for the current step
      const visibleQuestions =
        methods.current.id === 'general'
          ? visibleGeneralQuestions
          : visibleRoleQuestions;

      const requiredFields = visibleQuestions
        .filter((q) => !q.optional)
        .map((q) => q.name);

      // Manually validate using the appropriate schema
      const currentSchema = methods.current.id === 'general' ? generalSchema : roleSchema;
      const currentValues = form.getValues();
      const validationResult = currentSchema.safeParse(currentValues);

      if (!validationResult.success) {
        // Set errors for failed validations
        validationResult.error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          // Only set errors for fields on the current step
          if (requiredFields.includes(fieldName)) {
            form.setError(fieldName, {
              type: 'validation',
              message: issue.message,
            });
          }
        });
        
        scrollToFirstError();
        return; // Don't proceed if validation fails
      }
      
      // Clear errors on successful validation
      requiredFields.forEach((fieldName) => {
        form.clearErrors(fieldName);
      });
    }

    // Save current data before navigating
    const currentFormValues = form.getValues();
    setFormData((prev) => ({ ...prev, ...currentFormValues }));

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
        scrollToFirstError();
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
              questions={visibleGeneralQuestions}
              title="General Questions"
              description="We'll use this information to get to know you better"
              onNext={() => navigateToStep('role_specific')}
              showPrevious={false}
            />
          ),
          role_specific: () => (
            <StepForm
              questions={visibleRoleQuestions}
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
  description: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onSubmit?: (data: Record<string, unknown>) => Promise<void>;
  isLastStep?: boolean;
  showPrevious?: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, formState, trigger, watch } = useFormContext();

  // Watch form values to reactively check if all required fields are filled
  const watchedValues = watch();

  // Get required fields for validation (questions are already filtered by parent)
  const requiredFields = questions
    .filter((q) => !q.optional)
    .map((q) => q.name);

  const allRequiredFilled = requiredFields.every((name) => {
    const value = watchedValues[name];
    return value !== undefined && value !== null && String(value).trim() !== '';
  });

  const handleFormAction = async (data: Record<string, unknown>) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const isValid = await trigger(requiredFields, { shouldFocus: true });
      if (!isValid) {
        scrollToFirstError();
        return;
      }
      if (isLastStep && onSubmit) {
        await onSubmit(data);
      } else if (onNext) {
        onNext();
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
        error=""
      />
      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        {/* Left side - Previous button */}
        <div>
          {showPrevious && onPrevious && (
            <Button
              type="button"
              onClick={onPrevious}
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
            disabled={isSubmitting || formState.isSubmitting || !allRequiredFilled}
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