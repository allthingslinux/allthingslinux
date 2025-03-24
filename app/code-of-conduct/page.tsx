import React, { Suspense } from 'react';
import { CodeOfConductContent } from './CodeOfConductContent';
import { getCodeOfConductContent, getLastUpdated } from './actions';
import { LoadingSpinner } from '../../components/ui/loading-spinner';

export const metadata = {
  title: 'Code of Conduct | AllThingsLinux',
  description:
    'Our Code of Conduct outlines the standards of behavior for our community to create a respectful and inclusive environment for all participants.',
};

// Loading component to display while content is loading
function CodeOfConductLoading() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center py-16">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-neutral-400">Loading Code of Conduct...</p>
    </div>
  );
}

export default async function CodeOfConductPage() {
  // These operations happen in parallel
  const [content, lastUpdated] = await Promise.all([
    getCodeOfConductContent(),
    getLastUpdated(),
  ]);

  return (
    <main>
      <Suspense fallback={<CodeOfConductLoading />}>
        <CodeOfConductContent content={content} lastUpdated={lastUpdated} />
      </Suspense>
    </main>
  );
}
