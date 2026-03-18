"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCircleCheck, faUserShield, faUser, faSpinner } from "@/lib/fontawesome";
import { banUser, unbanUser, promoteToAdmin, demoteFromAdmin } from "@/lib/admin-actions";

interface UserActionsProps {
  userId: string;
  userName: string;
  userRole: string;
  isBanned: boolean;
  currentUserRole: string;
}

export function UserActions({ userId, userName, userRole, isBanned, currentUserRole }: UserActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");

  const isSuperAdmin = currentUserRole === "superadmin" || currentUserRole === "developer";
  const isTargetAdmin = ["admin", "superadmin", "developer"].includes(userRole);

  function handleBan() {
    if (!banReason.trim()) return;
    startTransition(async () => {
      try {
        await banUser(userId, banReason);
        setShowBanModal(false);
        setBanReason("");
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to ban user");
      }
    });
  }

  function handleUnban() {
    startTransition(async () => {
      try {
        await unbanUser(userId);
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to unban user");
      }
    });
  }

  function handlePromote() {
    if (!confirm(`Promote ${userName} to admin?`)) return;
    startTransition(async () => {
      try {
        await promoteToAdmin(userId);
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to promote user");
      }
    });
  }

  function handleDemote() {
    if (!confirm(`Remove admin role from ${userName}?`)) return;
    startTransition(async () => {
      try {
        await demoteFromAdmin(userId);
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to demote user");
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Ban/Unban */}
        {!isTargetAdmin && (
          isBanned ? (
            <button
              type="button"
              onClick={handleUnban}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-forest/10 px-3 py-1.5 text-xs font-medium text-forest transition-colors hover:bg-forest/20 disabled:opacity-50"
            >
              {isPending ? <FontAwesomeIcon icon={faSpinner} className="h-3 w-3" spin /> : <FontAwesomeIcon icon={faCircleCheck} className="h-3 w-3" />}
              Unban
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowBanModal(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-coral/10 px-3 py-1.5 text-xs font-medium text-coral transition-colors hover:bg-coral/20 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faBan} className="h-3 w-3" />
              Ban
            </button>
          )
        )}

        {/* Promote/Demote (superadmin only) */}
        {isSuperAdmin && userRole !== "superadmin" && userRole !== "developer" && (
          userRole === "admin" ? (
            <button
              type="button"
              onClick={handleDemote}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-slate transition-colors hover:bg-gray-200 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faUser} className="h-3 w-3" />
              Remove Admin
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePromote}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ocean/10 px-3 py-1.5 text-xs font-medium text-ocean transition-colors hover:bg-ocean/20 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faUserShield} className="h-3 w-3" />
              Make Admin
            </button>
          )
        )}
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-semibold text-charcoal">
              Ban {userName}
            </h3>
            <p className="mb-4 text-sm text-slate">
              This will prevent the user from logging in. A notification email will be sent.
            </p>
            <label className="mb-1 block text-sm font-medium text-charcoal">
              Reason for ban
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              placeholder="Describe the reason for this ban..."
              className="mb-4 w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setShowBanModal(false); setBanReason(""); }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBan}
                disabled={isPending || !banReason.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral/90 disabled:opacity-50"
              >
                {isPending && <FontAwesomeIcon icon={faSpinner} className="h-3 w-3" spin />}
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
