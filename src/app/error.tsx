"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          We encountered an unexpected error. This may be due to a session
          issue. Try refreshing the page or signing out.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            Try Again
          </button>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>

        <p className="mt-6 text-[10px] text-gray-400">
          If this problem persists, contact{" "}
          <a
            href="mailto:contact@earthecho.co.uk"
            className="font-medium text-emerald-700 hover:underline"
          >
            contact@earthecho.co.uk
          </a>
        </p>
      </div>
    </div>
  );
}
