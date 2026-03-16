"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faComments } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createGuideComment } from "@/lib/actions";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    displayName: string | null;
    image: string | null;
  };
}

interface GuideCommentSectionProps {
  guideSlug: string;
  comments: Comment[];
  isAuthenticated: boolean;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export function GuideCommentSection({
  guideSlug,
  comments,
  isAuthenticated,
}: GuideCommentSectionProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");

    startTransition(async () => {
      const result = await createGuideComment({
        guideSlug,
        content: content.trim(),
      });
      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
      }
    });
  }

  return (
    <Card variant="default" className="mt-8 p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <FontAwesomeIcon
          icon={faComments}
          className="h-4 w-4 text-slate/40"
          aria-hidden
        />
        <h2 className="text-[15px] font-semibold text-charcoal">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts or experience..."
            rows={3}
            maxLength={2000}
            className="mb-2 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition-colors placeholder:text-slate/40 focus:border-forest focus:ring-1 focus:ring-forest"
          />
          {error && (
            <p className="mb-2 text-xs text-coral">{error}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate/50">
              {content.length}/2000
            </span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isPending}
              disabled={!content.trim()}
            >
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-sm text-slate">
            <Link
              href="/login"
              className="font-medium text-forest hover:underline"
            >
              Sign in
            </Link>{" "}
            to leave a comment on this guide.
          </p>
        </div>
      )}

      {/* Comment List */}
      {comments.length === 0 ? (
        <p className="py-4 text-center text-sm text-slate">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 rounded-lg bg-gray-50/60 px-4 py-3"
            >
              <FontAwesomeIcon
                icon={faCircleUser}
                className="mt-0.5 h-6 w-6 shrink-0 text-slate/30"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-charcoal">
                    {comment.user.displayName || comment.user.name || "Anonymous"}
                  </span>
                  <span className="text-[11px] text-slate/50">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-charcoal/80">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
