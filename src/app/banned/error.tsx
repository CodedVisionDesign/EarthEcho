"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function BannedError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[BannedPageError]", error);
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
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Account Suspended
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Your account has been suspended. Please sign out and contact support
          if you believe this is an error.
        </p>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Sign Out
        </button>

        <p className="mt-6 text-xs text-gray-500">
          Contact{" "}
          <a
            href="mailto:contact@earthecho.co.uk"
            className="font-medium text-emerald-700 hover:underline"
          >
            contact@earthecho.co.uk
          </a>{" "}
          to appeal this decision.
        </p>
      </div>
    </div>
  );
}
