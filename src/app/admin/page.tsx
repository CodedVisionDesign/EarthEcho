import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faChartLine,
  faBan,
  faComments,
  faClipboardList,
  faShieldHalved,
  faBolt,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

const ACTION_LABELS: Record<string, { label: string; variant: "success" | "danger" | "warning" | "info" | "neutral" }> = {
  ban_user: { label: "Ban User", variant: "danger" },
  unban_user: { label: "Unban User", variant: "success" },
  delete_thread: { label: "Delete Thread", variant: "warning" },
  delete_reply: { label: "Delete Reply", variant: "warning" },
  promote_admin: { label: "Promote Admin", variant: "info" },
  demote_admin: { label: "Demote Admin", variant: "neutral" },
};

export default async function AdminDashboard() {
  const admin = await requireAdmin();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalUsers,
    activeUsers,
    totalActivities,
    totalThreads,
    totalReplies,
    bannedUsers,
    recentAuditLogs,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({
      where: { lastActiveAt: { gte: sevenDaysAgo } },
    }),
    db.activity.count(),
    db.thread.count(),
    db.reply.count(),
    db.user.count({ where: { banned: true } }),
    db.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        admin: { select: { name: true, email: true } },
      },
    }),
  ]);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: faUsers,
      gradient: "from-forest to-forest/80",
    },
    {
      label: "Active (7d)",
      value: activeUsers,
      icon: faBolt,
      gradient: "from-ocean to-ocean/80",
    },
    {
      label: "Activities Logged",
      value: totalActivities,
      icon: faChartLine,
      gradient: "from-sunshine/90 to-sunshine/70",
    },
    {
      label: "Forum Threads",
      value: totalThreads,
      icon: faComments,
      gradient: "from-ocean/90 to-forest/70",
    },
    {
      label: "Forum Replies",
      value: totalReplies,
      icon: faComments,
      gradient: "from-forest/80 to-ocean/60",
    },
    {
      label: "Banned Users",
      value: bannedUsers,
      icon: faBan,
      gradient: "from-coral to-coral/80",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-forest to-ocean text-white shadow">
            <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Admin Dashboard</h1>
            <p className="text-sm text-slate">
              Welcome back, {admin.email}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.label} variant="default" className="p-4">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} text-white`}>
              <FontAwesomeIcon icon={stat.icon} className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-charcoal">
              {stat.value.toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs text-slate">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Recent Audit Logs */}
      <Card variant="default" className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClipboardList} className="h-4 w-4 text-forest" />
            <h2 className="text-base font-semibold text-charcoal">
              Recent Activity
            </h2>
          </div>
          {admin.role === "superadmin" && (
            <a
              href="/admin/audit"
              className="text-xs font-medium text-forest hover:underline"
            >
              View all
            </a>
          )}
        </div>

        {recentAuditLogs.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate">
            No audit logs yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentAuditLogs.map((log) => {
              const meta = ACTION_LABELS[log.action] ?? {
                label: log.action,
                variant: "neutral" as const,
              };

              return (
                <div
                  key={log.id}
                  className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  <Badge variant={meta.variant} size="sm">
                    {meta.label}
                  </Badge>
                  <span className="text-sm text-charcoal">
                    {log.admin.name ?? log.admin.email}
                  </span>
                  {log.targetId && (
                    <span className="truncate text-xs text-slate">
                      Target: {log.targetType} {log.targetId.slice(0, 8)}...
                    </span>
                  )}
                  <span className="ml-auto text-xs text-slate">
                    {timeAgo(log.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
