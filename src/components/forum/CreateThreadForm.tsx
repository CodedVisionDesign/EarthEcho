"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createThread } from "@/lib/actions";

const CATEGORIES = [
  { value: "tips", label: "Tips" },
  { value: "challenges", label: "Challenges" },
  { value: "wins", label: "Wins" },
  { value: "questions", label: "Questions" },
] as const;

export function CreateThreadForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("tips");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
      const result = await createThread({
        title: title.trim(),
        content: content.trim(),
        category,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.threadId) {
        router.push(`/forum/${result.threadId}`);
      }
    });
  }

  const inputClasses =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-gray-400 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <label
          htmlFor="thread-title"
          className="mb-1.5 block text-xs font-medium text-slate"
        >
          Title
        </label>
        <input
          id="thread-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's on your mind?"
          className={inputClasses}
          maxLength={200}
          disabled={isPending}
        />
        <div className="mt-1 text-right text-[11px] text-slate">{title.length}/200</div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="thread-category"
          className="mb-1.5 block text-xs font-medium text-slate"
        >
          Category
        </label>
        <select
          id="thread-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClasses}
          disabled={isPending}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="thread-content"
          className="mb-1.5 block text-xs font-medium text-slate"
        >
          Content
        </label>
        <textarea
          id="thread-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, tips, or questions..."
          rows={5}
          className={`${inputClasses} resize-none`}
          maxLength={5000}
          disabled={isPending}
        />
        <div className="mt-1 text-right text-[11px] text-slate">{content.length}/5000</div>
      </div>

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
          Create Thread
        </Button>
      </div>
    </form>
  );
}
