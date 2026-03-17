import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList, faFilter } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import Link from "next/link";

const PAGE_SIZE = 30;

const ACTION_LABELS: Record<string, { label: string; variant: "success" | "danger" | "warning" | "info" | "neutral" }> = {
  ban_user: { label: "Ban User", variant: "danger" },
  unban_user: { label: "Unban User", variant: "success" },
  delete_thread: { label: "Delete Thread", variant: "warning" },
  delete_reply: { label: "Delete Reply", variant: "warning" },
  promote_admin: { label: "Promote Admin", variant: "info" },
  demote_admin: { label: "Demote Admin", variant: "neutral" },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; page?: string }>;
}) {
  const admin = await requireAdmin();
  const { action, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  // Superadmin sees all logs, regular admin sees only their own
  const baseWhere = admin.role === "superadmin"
    ? {}
    : { adminId: admin.id };

  const where = {
    ...baseWhere,
    ...(action ? { action } : {}),
  };

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
      include: {
        admin: { select: { name: true, email: true, role: true } },
      },
    }),
    db.auditLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const actionTypes = Object.keys(ACTION_LABELS);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10">
            <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5 text-forest" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-charcoal">Audit Log</h1>
            <p className="text-sm text-slate">
              {total} entries{admin.role !== "superadmin" ? " (your actions)" : ""}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <FontAwesomeIcon icon={faFilter} className="h-3 w-3 text-slate" />
          <Link
            href="/admin/audit"
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !action ? "bg-forest text-white" : "bg-gray-100 text-slate hover:bg-gray-200"
            }`}
          >
            All
          </Link>
          {actionTypes.map((a) => (
            <Link
              key={a}
              href={`/admin/audit?action=${a}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                action === a ? "bg-forest text-white" : "bg-gray-100 text-slate hover:bg-gray-200"
              }`}
            >
              {ACTION_LABELS[a].label}
            </Link>
          ))}
        </div>
      </div>

      {/* Log entries */}
      <Card variant="default" className="overflow-hidden">
        {logs.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate">
            No audit logs{action ? ` for "${ACTION_LABELS[action]?.label ?? action}"` : ""}.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Admin</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Action</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Target</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const meta = ACTION_LABELS[log.action] ?? { label: log.action, variant: "neutral" as const };
                    const details: Record<string, string> = {};
                    try { const parsed = log.details ? JSON.parse(log.details) : {}; for (const [k, v] of Object.entries(parsed)) details[k] = String(v); } catch { /* */ }

                    return (
                      <tr key={log.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm text-charcoal">
                          {log.admin.name ?? log.admin.email}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate">
                          {log.targetType && <span className="capitalize">{log.targetType}</span>}
                          {log.targetId && <span className="ml-1 font-mono">{log.targetId.slice(0, 8)}...</span>}
                        </td>
                        <td className="max-w-[250px] truncate px-4 py-3 text-xs text-slate">
                          {details.reason && <span>Reason: {details.reason}</span>}
                          {details.targetEmail && <span> ({details.targetEmail})</span>}
                          {details.title && <span>&ldquo;{details.title}&rdquo;</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-50 md:hidden">
              {logs.map((log) => {
                const meta = ACTION_LABELS[log.action] ?? { label: log.action, variant: "neutral" as const };
                const details: Record<string, string> = {};
                try { const parsed = log.details ? JSON.parse(log.details) : {}; for (const [k, v] of Object.entries(parsed)) details[k] = String(v); } catch { /* */ }

                return (
                  <div key={log.id} className="px-4 py-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
                      <span className="text-[11px] text-slate">{formatDate(log.createdAt)}</span>
                    </div>
                    <p className="text-sm text-charcoal">
                      {log.admin.name ?? log.admin.email}
                    </p>
                    {details.reason && (
                      <p className="mt-1 text-xs text-slate">Reason: {details.reason}</p>
                    )}
                    {details.targetEmail && (
                      <p className="text-xs text-slate">Target: {details.targetEmail}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={`/admin/audit?action=${action ?? ""}&page=${currentPage - 1}`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-slate hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          <span className="px-3 text-sm text-slate">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/admin/audit?action=${action ?? ""}&page=${currentPage + 1}`}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-slate hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}

      {/* Retention notice */}
      <div className="mt-6 rounded-lg bg-sunshine/10 p-4 text-center text-xs text-amber-700">
        Audit logs are retained for 90 days. Logs older than 90 days are automatically purged.
      </div>
    </div>
  );
}
