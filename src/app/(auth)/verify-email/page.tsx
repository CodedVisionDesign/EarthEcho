"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { verifyEmail } from "@/lib/actions";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    verifyEmail(token).then((result) => {
      if (result.success) {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } else {
        setStatus("error");
        setMessage(result.error || "Verification failed.");
      }
    });
  }, [token]);

  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur-sm">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-forest/20 border-t-forest" />
            <h1 className="text-xl font-bold text-charcoal">Verifying your email...</h1>
            <p className="mt-2 text-sm text-slate">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-charcoal">Email Verified!</h1>
            <p className="mt-2 text-sm text-slate">{message}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest/90"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/forum"
                className="rounded-lg border border-forest/20 px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest/5"
              >
                Visit the Forum
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-charcoal">Verification Failed</h1>
            <p className="mt-2 text-sm text-slate">{message}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/profile"
                className="rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest/90"
              >
                Go to Profile to Resend
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-forest/20 px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest/5"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur-sm text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-forest/20 border-t-forest" />
          <h1 className="text-xl font-bold text-charcoal">Verifying your email...</h1>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
