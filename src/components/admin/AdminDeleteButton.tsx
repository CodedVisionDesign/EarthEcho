"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSpinner } from "@/lib/fontawesome";
import { adminDeleteThread, adminDeleteReply } from "@/lib/admin-actions";

interface AdminDeleteButtonProps {
  type: "thread" | "reply";
  id: string;
  label: string;
}

export function AdminDeleteButton({ type, id, label }: AdminDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete ${label}? This action cannot be undone and will be logged.`)) return;

    startTransition(async () => {
      try {
        if (type === "thread") {
          await adminDeleteThread(id);
        } else {
          await adminDeleteReply(id);
        }
        router.refresh();
      } catch (e) {
        alert(e instanceof Error ? e.message : "Failed to delete");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-lg bg-coral/10 px-2.5 py-1.5 text-xs font-medium text-coral transition-colors hover:bg-coral/20 disabled:opacity-50"
    >
      {isPending ? (
        <FontAwesomeIcon icon={faSpinner} className="h-3 w-3" spin />
      ) : (
        <FontAwesomeIcon icon={faTrashCan} className="h-3 w-3" />
      )}
      Delete
    </button>
  );
}
