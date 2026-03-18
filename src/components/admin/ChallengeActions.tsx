"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCircleCheck,
  faBan,
  faRocket,
  faPaperPlane,
  faFlag,
  faTrashCan,
} from "@/lib/fontawesome";
import {
  submitForReview,
  approveChallenge,
  rejectChallenge,
  activateChallenge,
  deactivateChallenge,
  archiveChallenge,
} from "@/lib/challenge-actions";

interface ChallengeActionsProps {
  challengeId: string;
  status: string;
  isSuperAdmin: boolean;
}

export function ChallengeActions({ challengeId, status, isSuperAdmin }: ChallengeActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState("");

  function run(action: () => Promise<unknown>) {
    setError("");
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    });
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {/* DRAFT actions */}
        {status === "DRAFT" && (
          <button
            onClick={() => run(() => submitForReview(challengeId))}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-ocean px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ocean/90 disabled:opacity-50"
          >
            {isPending ? (
              <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} className="h-3.5 w-3.5" />
            )}
            Submit for Review
          </button>
        )}

        {/* PENDING_REVIEW actions (superadmin only) */}
        {status === "PENDING_REVIEW" && isSuperAdmin && (
          <>
            <button
              onClick={() => run(() => approveChallenge(challengeId))}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-50"
            >
              {isPending ? (
                <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faCircleCheck} className="h-3.5 w-3.5" />
              )}
              Approve
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faBan} className="h-3.5 w-3.5" />
              Reject
            </button>
          </>
        )}

        {/* APPROVED actions (superadmin only) */}
        {status === "APPROVED" && isSuperAdmin && (
          <button
            onClick={() => run(() => activateChallenge(challengeId))}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-50"
          >
            {isPending ? (
              <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faRocket} className="h-3.5 w-3.5" />
            )}
            Activate Challenge
          </button>
        )}

        {/* ACTIVE actions (superadmin only) */}
        {status === "ACTIVE" && isSuperAdmin && (
          <button
            onClick={() => setShowDeactivateConfirm(true)}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faFlag} className="h-3.5 w-3.5" />
            End Challenge Early
          </button>
        )}

        {/* COMPLETED actions (superadmin only) */}
        {status === "COMPLETED" && isSuperAdmin && (
          <button
            onClick={() => run(() => archiveChallenge(challengeId))}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {isPending ? (
              <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" />
            )}
            Archive
          </button>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-charcoal">Reject Challenge</h3>
            <p className="mb-3 text-sm text-slate">
              Provide a reason so the creator knows what to improve.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
              className="mb-4 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-slate hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  run(() => rejectChallenge(challengeId, rejectReason));
                  setRejectReason("");
                }}
                disabled={!rejectReason.trim()}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                Reject Challenge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation */}
      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-charcoal">End Challenge Early?</h3>
            <p className="mb-4 text-sm text-slate">
              This will immediately stop all progress tracking for participants. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeactivateConfirm(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-slate hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  run(() => deactivateChallenge(challengeId));
                }}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                End Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
