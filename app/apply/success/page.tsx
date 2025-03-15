import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 text-center">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
      <p className="text-xl mb-8 max-w-md">
        Thank you for your application. We'll review it and get back to you
        soon.
      </p>

      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
      >
        Return Home
      </Link>
    </div>
  );
}
