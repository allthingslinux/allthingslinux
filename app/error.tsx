'use client';

import Link from 'next/link';

export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center text-center p-4">
          <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-6">
            We encountered an error while loading this page.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => reset()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try again
            </button>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              Return to home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
