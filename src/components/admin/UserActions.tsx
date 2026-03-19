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

const BAN_REASON_TEMPLATES = [
  {
    label: "Spam / Self-Promotion",
    reason: "Your account has been suspended for posting spam or unsolicited promotional content, which violates our Community Guidelines.",
  },
  {
    label: "Harassment",
    reason: "Your account has been suspended due to behaviour that constitutes harassment or bullying of other community members, in violation of our Community Guidelines.",
  },
  {
    label: "Inappropriate Content",
    reason: "Your account has been suspended for posting content that is inappropriate, offensive, or violates our Community Guidelines regarding acceptable content on the platform.",
  },
  {
    label: "Impersonation",
    reason: "Your account has been suspended for impersonating another individual or misrepresenting your identity, which is a violation of our Terms of Service.",
  },
  {
    label: "Terms of Service Violation",
    reason: "Your account has been suspended for a violation of our Terms of Service. Repeated or serious violations may result in permanent account termination.",
  },
  {
    label: "Fraudulent Activity",
    reason: "Your account has been suspended due to suspected fraudulent activity, including falsifying data or manipulating platform features in a deceptive manner.",
  },
  {
    label: "Multiple Accounts",
    reason: "Your account has been suspended for operating multiple accounts in violation of our one-account-per-user policy outlined in the Terms of Service.",
  },
];

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
    const msg = resetPending
      ? `Resend password reset to ${userName} (${userEmail})? This will cancel the previous link.`
      : `Send a password reset email to ${userName} (${userEmail})?`;
    if (!confirm(msg)) return;
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
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sunshine/10 px-3 py-1.5 text-xs font-medium text-sunshine transition-colors hover:bg-sunshine/20 disabled:opacity-50"
            title={resetPending ? "A reset link was already sent - clicking will cancel it and send a new one" : undefined}
          >
            {isPending ? <FontAwesomeIcon icon={faSpinner} className="h-3 w-3" spin /> : <FontAwesomeIcon icon={faRotateRight} className="h-3 w-3" />}
            {resetPending ? "Resend Reset" : "Reset Password"}
          </button>
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
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-semibold text-charcoal">
              Ban {userName}
            </h3>
            <p className="mb-4 text-sm text-slate">
              This will immediately suspend the user&apos;s account - they will be redirected to a suspension page and signed out. A notification email will be sent explaining the reason.
            </p>

            {/* Reason Templates */}
            <label className="mb-1.5 block text-sm font-medium text-charcoal">
              Select a reason
            </label>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {BAN_REASON_TEMPLATES.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  onClick={() => setBanReason(template.reason)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                    banReason === template.reason
                      ? "bg-coral text-white"
                      : "bg-gray-100 text-slate hover:bg-gray-200"
                  }`}
                >
                  {template.label}
                </button>
              ))}
            </div>

            {/* Editable reason */}
            <label className="mb-1 block text-sm font-medium text-charcoal">
              Reason for suspension
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              placeholder="Select a template above or write a custom reason..."
              className="mb-1 w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral/30"
            />
            <p className="mb-4 text-[10px] text-slate">
              This reason will be shown to the user in the suspension email and on the suspension page.
            </p>

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
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
