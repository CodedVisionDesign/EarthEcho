import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faTrashCan } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

export default async function AdminForumPage() {
  await requireAdmin();

  const [threads, recentReplies] = await Promise.all([
    db.thread.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
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
  ]);

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

      {/* Threads */}
      <h2 className="mb-3 text-base font-semibold text-charcoal">Threads</h2>
      <Card variant="default" className="mb-8 overflow-hidden">
        {threads.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate">No threads yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {threads.map((thread) => (
              <div key={thread.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">{thread.title}</p>
                  <p className="text-xs text-slate">
                    by {thread.user.displayName || thread.user.name || thread.user.email} ·{" "}
                    {thread._count.replies} replies ·{" "}
                    {thread.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" size="sm">{thread.category}</Badge>
                  {thread.isPinned && <Badge variant="info" size="sm">Pinned</Badge>}
                  <AdminDeleteButton
                    type="thread"
                    id={thread.id}
                    label={thread.title}
                  />
                </div>
              </div>
            ))}
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
            {recentReplies.map((reply) => (
              <div key={reply.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-charcoal">{reply.content.slice(0, 120)}{reply.content.length > 120 ? "..." : ""}</p>
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
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
