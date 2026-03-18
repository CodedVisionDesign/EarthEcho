"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faReply } from "@/lib/fontawesome";
import { Button } from "@/components/ui/Button";
import { createReply } from "@/lib/actions";

interface ReplyFormProps {
  threadId: string;
  parentReplyId?: string;
  parentAuthorName?: string;
  onCancelReply?: () => void;
}

export function ReplyForm({ threadId, parentReplyId, parentAuthorName, onCancelReply }: ReplyFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when replying to a specific comment
  useEffect(() => {
    if (parentReplyId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [parentReplyId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    startTransition(async () => {
      const result = await createReply({
        threadId,
        content: content.trim(),
        parentReplyId: parentReplyId || undefined,
      });
      if (result?.error) {
        setError(result.error);
        return;
      }
      setContent("");
      onCancelReply?.();
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      {parentReplyId && parentAuthorName && (
        <div className="mb-2 flex items-center gap-2 text-xs text-slate">
          <FontAwesomeIcon icon={faReply} className="h-3 w-3" aria-hidden />
          <span>
            Replying to <strong className="text-charcoal">{parentAuthorName}</strong>
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="ml-auto flex h-5 w-5 items-center justify-center rounded text-slate/50 hover:bg-gray-100 hover:text-slate"
            aria-label="Cancel reply"
          >
            <FontAwesomeIcon icon={faXmark} className="h-2.5 w-2.5" />
          </button>
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentReplyId ? `Reply to ${parentAuthorName}...` : "Share your thoughts..."}
        rows={parentReplyId ? 3 : 4}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-gray-400 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
        maxLength={2000}
        disabled={isPending}
      />
      <div className="mb-3 mt-1 text-right text-[11px] text-slate">{content.length}/2000</div>
      {error && (
        <p className="mb-3 text-xs text-coral">{error}</p>
      )}
      <div className="flex justify-end gap-2">
        {parentReplyId && onCancelReply && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
          >
            Cancel
          </Button>
        )}
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
