"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { editReply } from "@/lib/actions";

interface EditReplyFormProps {
  replyId: string;
  initialContent: string;
  onCancel: () => void;
}

export function EditReplyForm({ replyId, initialContent, onCancel }: EditReplyFormProps) {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    startTransition(async () => {
      const result = await editReply({ id: replyId, content: content.trim() });
      if (result?.error) {
        setError(result.error);
        return;
      }
      onCancel();
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-gray-400 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
          maxLength={2000}
          disabled={isPending}
        />
        <div className="mt-1 text-right text-[11px] text-slate">{content.length}/2000</div>
      </div>
      {error && <p className="text-xs text-coral">{error}</p>}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="sm" loading={isPending}>
          Save
        </Button>
      </div>
    </form>
  );
}
