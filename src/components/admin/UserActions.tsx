"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCircleCheck, faUserShield, faSpinner, faRotateRight } from "@/lib/fontawesome";
import { banUser, unbanUser, changeUserRole, adminSendPasswordReset } from "@/lib/admin-actions";

interface UserActionsProps {
  userId: string;
  userName: string;
  userRole: string;
  userEmail: string;
  hasPassword: boolean;
  resetPending: boolean;
  isBanned: boolean;
  currentUserRole: string;
}

export function UserActions({ userId, userName, userRole, userEmail, hasPassword, resetPending, isBanned, currentUserRole }: UserActionsProps) {
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
        const result = await banUser(userId, banReason);
        if (result.success) {
          setShowBanModal(false);
          setBanReason("");
          router.refresh();
        } else {
          alert(result.error || "Failed to ban user");
        }
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to ban user");
      }
    });
  }

  function handleUnban() {
    startTransition(async () => {
      try {
        const result = await unbanUser(userId);
        if (result.success) {
          router.refresh();
        } else {
          alert(result.error || "Failed to unban user");
        }
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to unban user");
      }
    });
  }

  function handleRoleChange(newRole: string) {
    const labels: Record<string, string> = { user: "User", admin: "Admin", superadmin: "Super Admin" };
    if (!confirm(`Change ${userName}'s role to ${labels[newRole] ?? newRole}?`)) return;
    startTransition(async () => {
      try {
        const result = await changeUserRole(userId, newRole as "user" | "admin" | "superadmin");
        if (result.success) {
          router.refresh();
        } else {
          alert(result.error || "Failed to change role");
        }
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to change role");
      }
    });
  }

  function handlePasswordReset() {
    if (!confirm(`Send a password reset email to ${userName} (${userEmail})?`)) return;
    startTransition(async () => {
      try {
        const result = await adminSendPasswordReset(userId);
        if (result.success) {
          alert("Password reset email sent successfully.");
          router.refresh();
        } else {
          alert(result.error || "Failed to send reset email");
        }
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to send reset email");
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Password Reset (superadmin/developer only, credentials users only) */}
        {isSuperAdmin && hasPassword && (
          resetPending ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-lg bg-sunshine/10 px-3 py-1.5 text-xs font-medium text-sunshine cursor-default"
              title="A password reset link has already been sent and is still valid"
            >
              <FontAwesomeIcon icon={faRotateRight} className="h-3 w-3" />
              Reset Sent
            </span>
          ) : (
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sunshine/10 px-3 py-1.5 text-xs font-medium text-sunshine transition-colors hover:bg-sunshine/20 disabled:opacity-50"
            >
              {isPending ? <FontAwesomeIcon icon={faSpinner} className="h-3 w-3" spin /> : <FontAwesomeIcon icon={faRotateRight} className="h-3 w-3" />}
              Reset Password
            </button>
          )
        )}

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

        {/* Role change (superadmin/developer only, not for developer accounts) */}
        {isSuperAdmin && userRole !== "developer" && (
          <div className="inline-flex items-center gap-1.5">
            <FontAwesomeIcon icon={faUserShield} className="h-3 w-3 text-ocean" />
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              disabled={isPending}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-charcoal transition-colors hover:border-gray-300 focus:border-ocean focus:outline-none focus:ring-1 focus:ring-ocean/20 disabled:opacity-50"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
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
