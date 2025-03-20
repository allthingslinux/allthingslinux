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
import { Button } from '@/components/ui/button';
import { z } from 'zod';

// Import StepId from StepIndicator
import type { StepId } from './StepIndicator';

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
  onSubmit,
}: {
  generalQuestions: FormQuestion[];
  departmentalQuestions: FormQuestion[];
  roleQuestions: FormQuestion[];
  role: Role;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <Scoped initialStep="general">
      <StepperFormContent
        generalQuestions={generalQuestions}
        roleQuestions={departmentalQuestions}
        role={role}
        onSubmit={onSubmit}
      />
    </Scoped>
  );
}

function StepperFormContent({
  generalQuestions,
  roleQuestions,
  role,
  onSubmit,
}: {
  generalQuestions: FormQuestion[];
  roleQuestions: FormQuestion[];
  role: Role;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}) {
  const methods = useStepper();
  const [formData, setFormData] = useState<Record<string, unknown>>({});

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
    mode: 'onChange', // Validate on field change to provide immediate feedback
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
        return; // Don't proceed if validation fails
      }
    }

    // Save current data before navigating
    const currentValues = form.getValues();
    setFormData((prev) => ({ ...prev, ...currentValues }));

    // Navigate to the requested step
    methods.goTo(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form submission
  const handleSubmit = async (stepData: Record<string, unknown>) => {
    try {
      // For final submission, merge all form data
      const finalData = { ...formData, ...stepData };

      // Validate all required fields with the combined schema
      const validationResult = combinedSchema.safeParse(finalData);

      if (validationResult.success) {
        await onSubmit(finalData);
      } else {
        // If validation fails on the final step, show field errors
        console.log('Validation failed:', validationResult.error);
        return;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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

      <FormProvider {...form}>
        {methods.switch({
          general: () => (
            <StepForm
              questions={generalQuestions}
              title={`${role.name} Application - General Information`}
              description="Please provide your general information"
              onNext={() => navigateToStep('role_specific')}
              showPrevious={false}
            />
          ),
          role_specific: () => (
            <StepForm
              questions={roleQuestions}
              title={`${role.name} Application - Department Questions`}
              description={`Questions specific to the ${role.department} department`}
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
        return;
      }

      if (isLastStep && onSubmit) {
        await onSubmit(data);
      } else if (onNext) {
        onNext();
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
