"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { editThread } from "@/lib/actions";

interface EditThreadFormProps {
  threadId: string;
  initialTitle: string;
  initialContent: string;
  onCancel: () => void;
}

export function EditThreadForm({ threadId, initialTitle, initialContent, onCancel }: EditThreadFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const inputClasses =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-gray-400 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (content.trim().length < 10) {
      setError("Content must be at least 10 characters.");
      return;
    }

    startTransition(async () => {
      const result = await editThread({ id: threadId, title: title.trim(), content: content.trim() });
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
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClasses}
          maxLength={200}
          disabled={isPending}
        />
        <div className="mt-1 text-right text-[11px] text-slate">{title.length}/200</div>
      </div>
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className={`${inputClasses} resize-none`}
          maxLength={5000}
          disabled={isPending}
        />
        <div className="mt-1 text-right text-[11px] text-slate">{content.length}/5000</div>
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
