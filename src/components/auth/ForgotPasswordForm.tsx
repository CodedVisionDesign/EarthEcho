"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { faEnvelope, faPaperPlane } from "@/lib/fontawesome";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset } from "@/lib/actions";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await requestPasswordReset({ email });
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      // Always show success to prevent email enumeration (OWASP)
      setSubmitted(true);
    } catch {
      setSubmitted(true); // Still show success to prevent enumeration
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
          <svg className="h-8 w-8 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-charcoal">Check your email</h2>
        <p className="mb-4 text-sm text-slate">
          If an account exists with that email, we&apos;ve sent a password reset
          link. The link is valid for <strong className="text-charcoal">1 hour</strong>.
        </p>
        <p className="mb-6 text-sm text-slate">
          Please check your junk or spam folder if you don&apos;t see it in your
          inbox. If you&apos;re still having trouble, contact us at{" "}
          <a
            href="mailto:contact@earthecho.co.uk"
            className="font-medium text-forest transition-colors hover:text-forest-dark hover:underline"
          >
            contact@earthecho.co.uk
          </a>
        </p>
        <Link
          href="/login"
          className="text-sm font-medium text-forest transition-colors hover:text-forest-dark hover:underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg bg-coral/10 px-4 py-2.5 text-sm text-coral">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          icon={faEnvelope}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          leftIcon={faPaperPlane}
          loading={loading}
          className="w-full"
        >
          Send Reset Link
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-forest transition-colors hover:text-forest-dark hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
