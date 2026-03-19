"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@/lib/fontawesome";
import { sendVerificationEmail } from "@/lib/actions";

interface EmailVerificationCardProps {
  email: string;
  isVerified: boolean;
}

export function EmailVerificationCard({ email, isVerified }: EmailVerificationCardProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [cooldown, setCooldown] = useState(false);

  function handleSendVerification() {
    setMessage(null);
    startTransition(async () => {
      const result = await sendVerificationEmail();
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Verification email sent! Check your inbox." });
        setCooldown(true);
        setTimeout(() => setCooldown(false), 60_000);
      }
    });
  }

  if (isVerified) {
    return (
      <Card variant="default" className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-charcoal">Email Verified</h3>
            <p className="text-sm text-slate">{email}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" className="border-amber-200 bg-amber-50/50 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-amber-600" aria-hidden />
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-semibold text-charcoal">Email Not Verified</h3>
          <p className="mt-1 text-sm text-slate">
            Verify your email to post on the forum and comment on guides. We&apos;ll send a verification link to <strong>{email}</strong>.
          </p>

          {message && (
            <div
              className={`mt-3 rounded-lg px-3 py-2 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mt-3">
            <Button
              onClick={handleSendVerification}
              loading={isPending}
              disabled={cooldown}
              size="sm"
            >
              {cooldown ? "Email Sent — Check Your Inbox" : "Send Verification Email"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
