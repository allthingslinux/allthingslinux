'use client';

import { Button } from '@/components/ui/button';

export default function StepperNavigation({
  onPrevious,
}: {
  onPrevious?: () => void;
}) {
  return (
    <div className="flex justify-between mt-6">
      {onPrevious ? (
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
      ) : (
        <div></div>
      )}
    </div>
  );
}
