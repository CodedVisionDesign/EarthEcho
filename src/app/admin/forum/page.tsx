import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faShieldHalved, faFilter } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { AdminPinButton } from "@/components/admin/AdminPinButton";
import { ModerationWords } from "@/components/admin/ModerationWords";
import Link from "next/link";

type SortOption = "newest" | "oldest" | "most_replies" | "least_replies";

export default async function AdminForumPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string }>;
}) {
  await requireAdmin();
  const { sort, category } = await searchParams;
  const currentSort = (sort ?? "newest") as SortOption;
  const currentCategory = category ?? "all";

  const orderBy =
    currentSort === "oldest"
      ? { createdAt: "asc" as const }
      : currentSort === "most_replies"
        ? { replies: { _count: "desc" as const } }
        : currentSort === "least_replies"
          ? { replies: { _count: "asc" as const } }
          : { createdAt: "desc" as const };

  const categoryFilter = currentCategory !== "all" ? { category: currentCategory } : {};

  const [threads, recentReplies, moderationWords] = await Promise.all([
    db.thread.findMany({
      take: 50,
      where: categoryFilter,
      orderBy,
      include: {
        user: { select: { name: true, displayName: true, email: true } },
        _count: { select: { replies: true } },
      },
    }),
    db.reply.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, displayName: true, email: true } },
        thread: { select: { title: true } },
      },
    }),
    db.moderationWord.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Check threads/replies for flagged words
  const flagWords = moderationWords.filter((w) => w.type === "flag").map((w) => w.word.toLowerCase());

  function containsFlagWord(text: string): boolean {
    const lower = text.toLowerCase();
    return flagWords.some((w) => lower.includes(w));
  }

  const categories = ["all", "tips", "challenges", "wins", "questions"];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean/10">
          <FontAwesomeIcon icon={faComments} className="h-5 w-5 text-ocean" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-charcoal">Forum Moderation</h1>
          <p className="text-sm text-slate">{threads.length} threads · {recentReplies.length} recent replies</p>
        </div>
      </div>

      {/* Moderation Words Section */}
      <Card variant="default" className="mb-8 p-5">
        <div className="mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faShieldHalved} className="h-4 w-4 text-forest" />
          <h2 className="text-base font-semibold text-charcoal">Content Moderation Words</h2>
        </div>
        <p className="mb-4 text-xs text-slate">
          <strong>Flag words</strong> highlight posts for admin review. <strong>Auto-block words</strong> prevent posts containing them from being published.
        </p>
        <ModerationWords words={moderationWords} />
      </Card>

      {/* Sort & Filter Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-charcoal">Threads</h2>
        <div className="flex flex-wrap gap-2">
          {/* Category filter */}
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faFilter} className="h-3 w-3 text-slate" />
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/admin/forum?sort=${currentSort}&category=${cat}`}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  currentCategory === cat
                    ? "bg-forest/10 text-forest"
                    : "text-slate hover:bg-gray-100"
                }`}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            ))}
          </div>
          {/* Sort */}
          <div className="flex items-center gap-1.5">
            {(["newest", "oldest", "most_replies", "least_replies"] as const).map((s) => {
              const labels: Record<string, string> = { newest: "Newest", oldest: "Oldest", most_replies: "Most Replies", least_replies: "Least Replies" };
              return (
                <Link
                  key={s}
                  href={`/admin/forum?sort=${s}&category=${currentCategory}`}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                    currentSort === s
                      ? "bg-ocean/10 text-ocean"
                      : "text-slate hover:bg-gray-100"
                  }`}
                >
                  {labels[s]}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Threads */}
      <Card variant="default" className="mb-8 overflow-hidden">
        {threads.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate">No threads yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {threads.map((thread) => {
              const flagged = containsFlagWord(thread.title) || containsFlagWord(thread.content);
              return (
                <div
                  key={thread.id}
                  className={`flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between ${flagged ? "bg-coral/5 border-l-2 border-l-coral" : ""}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-charcoal">{thread.title}</p>
                      {flagged && (
                        <Badge variant="danger" size="sm">Flagged</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate">
                      by {thread.user.displayName || thread.user.name || thread.user.email} ·{" "}
                      {thread._count.replies} replies ·{" "}
                      {thread.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" size="sm">{thread.category}</Badge>
                    <AdminPinButton threadId={thread.id} isPinned={thread.isPinned} />
                    <AdminDeleteButton
                      type="thread"
                      id={thread.id}
                      label={thread.title}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Recent Replies */}
      <h2 className="mb-3 text-base font-semibold text-charcoal">Recent Replies</h2>
      <Card variant="default" className="overflow-hidden">
        {recentReplies.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate">No replies yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentReplies.map((reply) => {
              const flagged = containsFlagWord(reply.content);
              return (
                <div
                  key={reply.id}
                  className={`flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between ${flagged ? "bg-coral/5 border-l-2 border-l-coral" : ""}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm text-charcoal">{reply.content.slice(0, 120)}{reply.content.length > 120 ? "..." : ""}</p>
                      {flagged && (
                        <Badge variant="danger" size="sm">Flagged</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate">
                      by {reply.user.displayName || reply.user.name || reply.user.email} ·{" "}
                      in &ldquo;{reply.thread.title}&rdquo; ·{" "}
                      {reply.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <AdminDeleteButton
                    type="reply"
                    id={reply.id}
                    label="this reply"
                  />
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
