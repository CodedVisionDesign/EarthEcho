"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { faTrashCan } from "@/lib/fontawesome";

interface DeleteConfirmButtonProps {
  onDelete: () => Promise<{ error?: string; success?: boolean }>;
  redirectTo?: string;
  label?: string;
}

export function DeleteConfirmButton({ onDelete, redirectTo, label = "Delete" }: DeleteConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-coral">Are you sure?</span>
        <Button
          variant="danger"
          size="sm"
          loading={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await onDelete();
              if (result?.success && redirectTo) {
                router.push(redirectTo);
              } else {
                router.refresh();
              }
            });
          }}
        >
          Confirm
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setConfirming(false)} disabled={isPending}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" leftIcon={faTrashCan} onClick={() => setConfirming(true)}>
      {label}
    </Button>
  );
}
