"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-350 flex-col items-center gap-4 px-4 py-16 text-center text-body">
      <h2 className="text-step-title">Something went wrong</h2>
      <p className="text-product-description text-muted">
        Please try again, or reload the page.
      </p>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="rounded-button bg-primary px-6 py-2 text-primary-text-on"
      >
        Try again
      </button>
    </div>
  );
}
