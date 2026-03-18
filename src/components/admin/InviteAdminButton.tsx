"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSpinner } from "@/lib/fontawesome";
import { inviteAdmin } from "@/lib/admin-actions";

export function InviteAdminButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  function handleInvite() {
    if (!email.trim()) return;
    startTransition(async () => {
      try {
        await inviteAdmin(email, name);
        alert("Admin invite sent successfully!");
        setShowModal(false);
        setEmail("");
        setName("");
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to invite admin");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-forest/90"
      >
        <FontAwesomeIcon icon={faUserPlus} className="h-3 w-3" />
        Invite Admin
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-lg font-semibold text-charcoal">
              Invite New Admin
            </h3>
            <p className="mb-4 text-sm text-slate">
              A branded invitation email with temporary credentials will be sent.
            </p>

            <label className="mb-1 block text-sm font-medium text-charcoal">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="mb-3 w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />

            <label className="mb-1 block text-sm font-medium text-charcoal">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mb-4 w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setShowModal(false); setEmail(""); setName(""); }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInvite}
                disabled={isPending || !email.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-50"
              >
                {isPending && <FontAwesomeIcon icon={faSpinner} className="h-3 w-3" spin />}
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
