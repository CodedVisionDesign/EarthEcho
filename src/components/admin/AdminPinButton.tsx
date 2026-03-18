"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack, faSpinner } from "@/lib/fontawesome";
import { togglePinThread } from "@/lib/admin-actions";

interface AdminPinButtonProps {
  threadId: string;
  isPinned: boolean;
}

export function AdminPinButton({ threadId, isPinned }: AdminPinButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        await togglePinThread(threadId);
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to toggle pin");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        isPinned
          ? "bg-ocean/10 text-ocean hover:bg-ocean/20"
          : "bg-gray-100 text-slate hover:bg-gray-200"
      }`}
      title={isPinned ? "Unpin thread" : "Pin thread"}
    >
      {isPending ? (
        <FontAwesomeIcon icon={faSpinner} className="h-3 w-3" spin />
      ) : (
        <FontAwesomeIcon
          icon={faThumbtack}
          className={`h-3 w-3 ${isPinned ? "" : "opacity-50"}`}
        />
      )}
      {isPinned ? "Unpin" : "Pin"}
    </button>
  );
}
