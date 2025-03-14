'use client';

import Link from 'next/link';

export default function ErrorBoundary({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="mb-6">
        We encountered an error while loading this blog post.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => reset()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try again
        </button>
        <Link
          href="/blog"
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          Return to blog
        </Link>
      </div>
    </div>
  );
}
