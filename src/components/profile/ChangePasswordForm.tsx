"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { changePassword } from "@/lib/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEye, faEyeSlash } from "@/lib/fontawesome";

export function ChangePasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!hasPassword) {
    return (
      <div className="flex items-start gap-3 rounded-lg bg-ocean/5 p-4">
        <FontAwesomeIcon icon={faKey} className="mt-0.5 h-4 w-4 text-ocean" />
        <div>
          <p className="text-sm font-medium text-charcoal">Social login account</p>
          <p className="mt-0.5 text-xs text-slate">
            Your account uses Google or Facebook to sign in. To set a password, use the{" "}
            <a href="/forgot-password" className="font-medium text-forest hover:underline">
              forgot password
            </a>{" "}
            flow with your account email.
          </p>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters" });
      return;
    }

    startTransition(async () => {
      const result = await changePassword({ currentPassword, newPassword });
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Password */}
      <div>
        <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-charcoal">
          Current Password
        </label>
        <div className="relative">
          <input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/50 hover:text-slate"
            tabIndex={-1}
          >
            <FontAwesomeIcon icon={showCurrent ? faEyeSlash : faEye} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-charcoal">
          New Password
        </label>
        <div className="relative">
          <input
            id="newPassword"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            placeholder="At least 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/50 hover:text-slate"
            tabIndex={-1}
          >
            <FontAwesomeIcon icon={showNew ? faEyeSlash : faEye} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Confirm New Password */}
      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-charcoal">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          placeholder="Re-enter new password"
        />
      </div>

      {/* Feedback message */}
      {message && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" loading={isPending}>
        Change Password
      </Button>
    </form>
  );
}
