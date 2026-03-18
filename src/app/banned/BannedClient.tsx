"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export function BannedClient({
  reason,
  bannedAt,
}: {
  reason?: string;
  bannedAt?: string;
}) {
  const [signingOut, setSigningOut] = useState(false);

  // Auto sign-out after 15 seconds so the session is cleared
  useEffect(() => {
    const timer = setTimeout(() => {
      setSigningOut(true);
      signOut({ callbackUrl: "/login" });
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  function handleSignOut() {
    setSigningOut(true);
    signOut({ callbackUrl: "/login" });
  }

  const formattedDate = bannedAt
    ? new Date(bannedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-coral/10">
          <svg
            className="h-8 w-8 text-coral"
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

        <h1 className="mb-2 text-2xl font-bold text-charcoal">
          Account Suspended
        </h1>

        <p className="mb-6 text-sm text-slate">
          Your EarthEcho account has been suspended following a review of your
          activity on the platform.
        </p>

        {/* Reason box */}
        {reason && (
          <div className="mb-6 rounded-xl border border-coral/20 bg-coral/5 p-4 text-left">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-coral">
              Reason for Suspension
            </p>
            <p className="text-sm leading-relaxed text-charcoal">{reason}</p>
            {formattedDate && (
              <p className="mt-2 text-[11px] text-slate">
                Suspended on {formattedDate}
              </p>
            )}
          </div>
        )}

        <p className="mb-6 text-xs leading-relaxed text-slate">
          If you believe this action was taken in error, please contact our
          support team at{" "}
          <a
            href="mailto:contact@earthecho.co.uk"
            className="font-medium text-forest hover:underline"
          >
            contact@earthecho.co.uk
          </a>{" "}
          to appeal this decision. We will review your case within 5 business
          days.
        </p>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="inline-flex items-center gap-2 rounded-lg bg-charcoal px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-charcoal/90 disabled:opacity-50"
        >
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>

        <p className="mt-4 text-[10px] text-slate/60">
          You will be automatically signed out in a few seconds.
        </p>
      </div>
    </div>
  );
}
