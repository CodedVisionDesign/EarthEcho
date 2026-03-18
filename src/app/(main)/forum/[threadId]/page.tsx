import Image from "next/image";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faArrowRight } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentUser, getThread, resolveUserImage } from "@/lib/queries";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { ReactionButton } from "@/components/forum/ReactionButton";
import { ThreadActions } from "@/components/forum/ThreadActions";
import { ReplyActions } from "@/components/forum/ReplyActions";

const CATEGORY_BADGE_VARIANT: Record<string, "forest" | "ocean" | "sunshine" | "info" | "neutral"> = {
  tips: "forest",
  challenges: "ocean",
  wins: "sunshine",
  questions: "info",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
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

type ReactionType = "cheer" | "helpful" | "inspiring";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const [thread, currentUser] = await Promise.all([
    getThread(threadId),
    getCurrentUser(),
  ]);

  if (!thread) notFound();

  const badgeVariant = CATEGORY_BADGE_VARIANT[thread.category] ?? "neutral";
  const isThreadAuthor = currentUser.id === thread.userId;

  return (
    <div>
      {/* Back link */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" href="/forum" leftIcon={faArrowRight} className="rotate-180-icon">
          Back to Forum
        </Button>
      </div>

      {/* Thread Header */}
      <Card variant="default" className="mb-6 p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={badgeVariant} size="sm">
              {thread.category}
            </Badge>
            {thread.isPinned && (
              <Badge variant="forest" size="sm">
                Pinned
              </Badge>
            )}
          </div>
          {isThreadAuthor && (
            <ThreadActions
              threadId={thread.id}
              title={thread.title}
              content={thread.content}
            />
          )}
        </div>

        <h1 className="mb-3 text-xl font-bold text-charcoal">
          {thread.title}
        </h1>

        <div className="mb-4 flex items-center gap-3">
          {resolveUserImage(thread.user) ? (
            <Image
              src={resolveUserImage(thread.user)!}
              alt={thread.user.displayName || thread.user.name || "User"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/10 text-xs font-semibold text-forest">
              {getInitials(thread.user.displayName || thread.user.name)}
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-charcoal">
              {thread.user.displayName || thread.user.name}
            </span>
            <span className="ml-2 text-xs text-slate">
              {formatDate(thread.createdAt)}
            </span>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-sm leading-relaxed text-charcoal/80">
          {thread.content.split("\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Card>

      {/* Replies */}
      <div className="mb-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-charcoal">
          <FontAwesomeIcon
            icon={faComments}
            className="h-3.5 w-3.5 text-slate"
            aria-hidden
          />
          {thread.replies.length}{" "}
          {thread.replies.length === 1 ? "Reply" : "Replies"}
        </h2>

        {thread.replies.length === 0 ? (
          <Card variant="default" className="p-8 text-center">
            <p className="text-sm text-slate">
              No replies yet. Be the first to respond!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {thread.replies.map((reply) => {
              // Count reactions by type
              const reactionCounts: Record<ReactionType, number> = {
                cheer: 0,
                helpful: 0,
                inspiring: 0,
              };
              const userReactions = new Set<ReactionType>();

              for (const reaction of reply.reactions) {
                const t = reaction.type as ReactionType;
                if (t in reactionCounts) {
                  reactionCounts[t]++;
                  if (reaction.userId === currentUser.id) {
                    userReactions.add(t);
                  }
                }
              }

              const isReplyAuthor = currentUser.id === reply.userId;

              return (
                <Card key={reply.id} variant="default" className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {resolveUserImage(reply.user) ? (
                        <Image
                          src={resolveUserImage(reply.user)!}
                          alt={reply.user.displayName || reply.user.name || "User"}
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
                          {reply.user.displayName || reply.user.name}
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
                      <p key={i} className="mb-1">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Reaction buttons */}
                  <div className="flex gap-2">
                    {(["cheer", "helpful", "inspiring"] as const).map(
                      (type) => (
                        <ReactionButton
                          key={type}
                          replyId={reply.id}
                          type={type}
                          count={reactionCounts[type]}
                          active={userReactions.has(type)}
                        />
                      )
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Reply Form */}
      <Card variant="default" className="p-6">
        <h3 className="mb-4 text-sm font-semibold text-charcoal">
          Write a Reply
        </h3>
        <ReplyForm threadId={thread.id} />
      </Card>
    </div>
  );
}
