'use client';

import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

// Define step IDs type
export type StepId = 'general' | 'role_specific';

// Basic Step interface
export interface Step {
  id: StepId;
  title: string;
  description?: string;
}

// Stepper methods interface
export interface StepperMethods {
  all: Step[];
  current: Step;
  next: () => void;
  prev: () => void;
  goTo: (id: StepId) => void;
}

// Props interface with proper typing
interface StepIndicatorProps {
  currentStep: Step;
  stepper: StepperMethods;
  errors?: Record<string, boolean>;
  errorCounts?: Record<string, number>;
  onStepClick?: (stepId: StepId) => void;
}

// Extracted step item component for better organization
function StepItem({
  step,
  index,
  isComplete,
  isCurrent,
  isUpcoming,
  hasError,
  errorCount,
  onClick,
}: {
  step: Step;
  index: number;
  isComplete: boolean;
  isCurrent: boolean;
  isUpcoming: boolean;
  hasError: boolean;
  errorCount: number;
  onClick: () => void;
}) {
  // Helper to determine border styles
  const borderStyles = cn(
    'group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 cursor-pointer hover:border-primary transition-colors',
    {
      'border-destructive': hasError,
      'border-primary': (isComplete || isCurrent) && !hasError,
      'border-border': isUpcoming && !hasError,
    }
  );

  // Helper to determine step indicator styles
  const indicatorStyles = cn(
    'flex h-6 w-6 items-center justify-center rounded-full mr-2',
    {
      'bg-destructive text-destructive-foreground': hasError,
      'bg-primary text-primary-foreground': isComplete && !hasError,
      'border border-primary text-primary':
        isCurrent && !isComplete && !hasError,
      'border border-border text-muted-foreground':
        isUpcoming && !isCurrent && !hasError,
    }
  );

  // Helper to determine title styles
  const titleStyles = cn('flex items-center', {
    'text-destructive': hasError,
    'text-primary': (isComplete || isCurrent) && !hasError,
    'text-muted-foreground': isUpcoming && !isCurrent && !hasError,
  });

  return (
    <li key={step.id} className="md:flex-1">
      <div className={borderStyles} onClick={onClick}>
        <span className="text-sm font-medium">
          <span className="flex items-center">
            <span className={indicatorStyles}>
              {isComplete && !hasError ? (
                <CheckIcon className="h-3 w-3" aria-hidden="true" />
              ) : hasError ? (
                <ExclamationTriangleIcon
                  className="h-3 w-3"
                  aria-hidden="true"
                />
              ) : (
                <span>{index + 1}</span>
              )}
            </span>
            <span className={titleStyles}>
              {step.title}
              {hasError && errorCount > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                  {errorCount} {errorCount === 1 ? 'error' : 'errors'}
                </span>
              )}
            </span>
          </span>
        </span>
        {step.description && (
          <span className="mt-0.5 text-sm text-muted-foreground">
            {step.description}
          </span>
        )}
      </div>
    </li>
  );
}

export default function StepIndicator({
  currentStep,
  stepper,
  errors = {},
  errorCounts = {},
  onStepClick,
}: StepIndicatorProps) {
  const allSteps = stepper.all;
  const currentIndex = allSteps.findIndex((step) => step.id === currentStep.id);

  return (
    <nav aria-label="Form Progress" className="mb-8">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {allSteps.map((step, index) => (
          <StepItem
            key={step.id}
            step={step}
            index={index}
            isComplete={index < currentIndex}
            isCurrent={step.id === currentStep.id}
            isUpcoming={index > currentIndex}
            hasError={!!errors[step.id]}
            errorCount={errorCounts[step.id] || 0}
            onClick={() => onStepClick?.(step.id)}
          />
        ))}
      </ol>
    </nav>
  );
}
