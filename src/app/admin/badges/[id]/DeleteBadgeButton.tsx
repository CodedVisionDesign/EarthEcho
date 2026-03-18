"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSpinner } from "@/lib/fontawesome";
import { deleteBadge } from "@/lib/badge-actions";

interface DeleteBadgeButtonProps {
  badgeId: string;
  badgeName: string;
}

export function DeleteBadgeButton({ badgeId, badgeName }: DeleteBadgeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteBadge(badgeId);
        router.push("/admin/badges");
        router.refresh();
      } catch {
        // Best effort
      }
    });
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h3 className="mb-3 text-lg font-semibold text-charcoal">Delete Badge?</h3>
          <p className="mb-4 text-sm text-slate">
            This will permanently delete &ldquo;{badgeName}&rdquo; and remove it from all users who earned it. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-slate hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              {isPending ? (
                <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Delete Badge"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
    >
      <FontAwesomeIcon icon={faTrashCan} className="h-3 w-3" />
      Delete
    </button>
  );
}
