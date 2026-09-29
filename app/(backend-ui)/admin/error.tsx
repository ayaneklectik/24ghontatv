'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <h2 className="text-xl font-bold text-red-800">Admin page could not be loaded</h2>
      <p className="mt-2 text-sm text-red-700">Please try again. If the problem persists, check the backend API and server logs.</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
