"use client";

import { useState, type FormEvent } from "react";
import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faCircleExclamation } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { deleteOwnAccount } from "@/lib/actions";

export function DeleteAccountSection({ hasPassword }: { hasPassword: boolean }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm.");
      return;
    }

    setLoading(true);
    try {
      const result = await deleteOwnAccount({
        password: hasPassword ? password : undefined,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Account deleted — sign out and redirect to home
      await signOut({ callbackUrl: "/" });
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card variant="default" className="border-coral/30 p-6">
      <div className="mb-4 flex items-center gap-2">
        <FontAwesomeIcon
          icon={faTrashCan}
          className="h-4 w-4 text-coral"
          aria-hidden
        />
        <h3 className="text-[15px] font-semibold text-charcoal">
          Delete Account
        </h3>
      </div>

      {!showConfirm ? (
        <>
          <p className="mb-4 text-sm text-slate">
            Permanently delete your account and all associated data including
            activities, badges, forum posts, challenge progress, and leaderboard
            position. This action cannot be undone.
          </p>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => setShowConfirm(true)}
          >
            Delete My Account
          </Button>
        </>
      ) : (
        <form onSubmit={handleDelete} className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
              aria-hidden
            />
            <div className="text-sm text-amber-800">
              <p className="font-medium">This will permanently delete:</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs">
                <li>All logged activities and impact data</li>
                <li>Earned badges and challenge progress</li>
                <li>Forum threads and replies</li>
                <li>Leaderboard position and points</li>
                <li>Notification preferences and linked accounts</li>
              </ul>
            </div>
          </div>

          {hasPassword && (
            <Input
              label="Confirm your password"
              type="password"
              placeholder="Enter your current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">
              Type <span className="font-bold text-coral">DELETE</span> to
              confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral"
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>

          {error && (
            <p className="text-sm text-coral">{error}</p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowConfirm(false);
                setPassword("");
                setConfirmText("");
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              loading={loading}
              disabled={confirmText !== "DELETE"}
            >
              Permanently Delete Account
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
