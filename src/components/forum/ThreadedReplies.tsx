"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { ReactionButton } from "@/components/forum/ReactionButton";
import { ReplyActions } from "@/components/forum/ReplyActions";

type ReactionType = "cheer" | "helpful" | "inspiring";

interface ReplyUser {
  id: string;
  name: string | null;
  displayName: string | null;
  image: string | null;
  customImage: string | null;
}

interface ReplyData {
  id: string;
  userId: string;
  content: string;
  parentReplyId: string | null;
  createdAt: Date;
  user: ReplyUser;
  reactions: { id: string; userId: string; type: string }[];
  parentReply?: {
    id: string;
    user: { name: string | null; displayName: string | null };
  } | null;
}

interface ThreadedRepliesProps {
  threadId: string;
  replies: ReplyData[];
  currentUserId: string;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function resolveImage(user: ReplyUser): string | null {
  return user.customImage || user.image || null;
}

function ReplyCard({
  reply,
  currentUserId,
  threadId,
  depth,
  childReplies,
  replyingTo,
  onStartReply,
  onCancelReply,
}: {
  reply: ReplyData;
  currentUserId: string;
  threadId: string;
  depth: number;
  childReplies: ReplyData[];
  replyingTo: string | null;
  onStartReply: (replyId: string) => void;
  onCancelReply: () => void;
}) {
  const reactionCounts: Record<ReactionType, number> = { cheer: 0, helpful: 0, inspiring: 0 };
  const userReactions = new Set<ReactionType>();

  for (const reaction of reply.reactions) {
    const t = reaction.type as ReactionType;
    if (t in reactionCounts) {
      reactionCounts[t]++;
      if (reaction.userId === currentUserId) userReactions.add(t);
    }
  }

  const isReplyAuthor = currentUserId === reply.userId;
  const isReplying = replyingTo === reply.id;
  const maxDepth = 3;
  const replyAuthorName = reply.user.displayName || reply.user.name || "User";

  return (
    <div>
      <Card
        variant="default"
        className={`p-5 ${depth > 0 ? "border-l-2 border-forest/10" : ""}`}
      >
        {/* "Replying to" context for nested replies */}
        {reply.parentReply && (
          <div className="mb-2 flex items-center gap-1.5 text-[11px] text-slate">
            <FontAwesomeIcon icon={faReply} className="h-2.5 w-2.5" aria-hidden />
            Replying to{" "}
            <strong className="text-charcoal/70">
              {reply.parentReply.user.displayName || reply.parentReply.user.name}
            </strong>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {resolveImage(reply.user) ? (
              <Image
                src={resolveImage(reply.user)!}
                alt={replyAuthorName}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-slate">
                {getInitials(reply.user.displayName || reply.user.name)}
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-charcoal">
                {replyAuthorName}
              </span>
              <span className="ml-2 text-xs text-slate">
                {formatDate(reply.createdAt)}
              </span>
            </div>
          </div>
          {isReplyAuthor && (
            <ReplyActions replyId={reply.id} content={reply.content} />
          )}
        </div>

        <div className="mb-3 text-sm leading-relaxed text-charcoal/80">
          {reply.content.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-1">{paragraph}</p>
          ))}
        </div>

        {/* Reaction buttons + Reply button */}
        <div className="flex items-center gap-2">
          {(["cheer", "helpful", "inspiring"] as const).map((type) => (
            <ReactionButton
              key={type}
              replyId={reply.id}
              type={type}
              count={reactionCounts[type]}
              active={userReactions.has(type)}
            />
          ))}
          {depth < maxDepth && (
            <button
              type="button"
              onClick={() => onStartReply(reply.id)}
              className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate transition-colors hover:bg-gray-100 hover:text-charcoal"
            >
              <FontAwesomeIcon icon={faReply} className="h-2.5 w-2.5" aria-hidden />
              Reply
            </button>
          )}
        </div>

        {/* Inline reply form */}
        {isReplying && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <ReplyForm
              threadId={threadId}
              parentReplyId={reply.id}
              parentAuthorName={replyAuthorName}
              onCancelReply={onCancelReply}
            />
          </div>
        )}
      </Card>

      {/* Child replies (indented) */}
      {childReplies.length > 0 && (
        <div className={`mt-2 space-y-2 ${depth < maxDepth ? "ml-4 sm:ml-6" : ""}`}>
          {childReplies.map((child) => (
            <ReplyCard
              key={child.id}
              reply={child}
              currentUserId={currentUserId}
              threadId={threadId}
              depth={depth + 1}
              childReplies={[]} // Nested children handled below
              replyingTo={replyingTo}
              onStartReply={onStartReply}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ThreadedReplies({ threadId, replies, currentUserId }: ThreadedRepliesProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Build reply tree: group by parentReplyId
  const childrenMap = new Map<string, ReplyData[]>();
  const topLevel: ReplyData[] = [];

  for (const reply of replies) {
    if (!reply.parentReplyId) {
      topLevel.push(reply);
    } else {
      const existing = childrenMap.get(reply.parentReplyId) || [];
      existing.push(reply);
      childrenMap.set(reply.parentReplyId, existing);
    }
  }

  // Recursively get all descendants for a reply
  function getDescendants(parentId: string): ReplyData[] {
    const children = childrenMap.get(parentId) || [];
    const result: ReplyData[] = [];
    for (const child of children) {
      result.push(child);
      result.push(...getDescendants(child.id));
    }
    return result;
  }

  return (
    <div className="space-y-3">
      {topLevel.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          currentUserId={currentUserId}
          threadId={threadId}
          depth={0}
          childReplies={childrenMap.get(reply.id) || []}
          replyingTo={replyingTo}
          onStartReply={(id) => setReplyingTo(id)}
          onCancelReply={() => setReplyingTo(null)}
        />
      ))}
    </div>
  );
}
