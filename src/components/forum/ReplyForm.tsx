"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createReply } from "@/lib/actions";

interface ReplyFormProps {
  threadId: string;
}

export function ReplyForm({ threadId }: ReplyFormProps) {
  const [content, setContent] = useState("");
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
      const result = await createReply({ threadId, content: content.trim() });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setContent("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        rows={4}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-gray-400 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
        maxLength={2000}
        disabled={isPending}
      />
      <div className="mb-3 mt-1 text-right text-[11px] text-slate">{content.length}/2000</div>
      {error && (
        <p className="mb-3 text-xs text-coral">{error}</p>
      )}
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={isPending}
        >
          Post Reply
        </Button>
      </div>
    </form>
  );
}
