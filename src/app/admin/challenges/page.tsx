import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy, faPlus, faUsers, faCircleInfo, faEye } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { CATEGORIES, type ActivityCategory } from "@/lib/categories";
import { AutoGenerateConfig } from "@/components/admin/AutoGenerateConfig";
import { getAutoGenerateConfig } from "@/lib/auto-challenge-actions";
import Link from "next/link";

const PAGE_SIZE = 20;

type StatusFilter = "all" | "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "ACTIVE" | "COMPLETED" | "ARCHIVED";

const STATUS_BADGE: Record<string, { variant: "success" | "info" | "warning" | "neutral" | "forest" | "danger"; label: string }> = {
  DRAFT: { variant: "neutral", label: "Draft" },
  PENDING_REVIEW: { variant: "warning", label: "Pending Review" },
  APPROVED: { variant: "info", label: "Approved" },
  ACTIVE: { variant: "success", label: "Active" },
  COMPLETED: { variant: "forest", label: "Completed" },
  ARCHIVED: { variant: "neutral", label: "Archived" },
};

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING_REVIEW", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

export default async function AdminChallengesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const admin = await requireAdmin();
  const { status, page } = await searchParams;
  const statusFilter = (STATUS_TABS.some((t) => t.value === status) ? status : "all") as StatusFilter;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
  const isSuperAdmin = admin.role === "superadmin" || admin.role === "developer";

  const where = statusFilter !== "all" ? { status: statusFilter } : {};

  const [challenges, total, upcomingChallenges] = await Promise.all([
    db.challenge.findMany({
      where,
      include: { _count: { select: { participants: true } } },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
    db.challenge.count({ where }),
    // Upcoming: PENDING_REVIEW or APPROVED challenges starting in the future
    db.challenge.findMany({
      where: {
        status: { in: ["PENDING_REVIEW", "APPROVED"] },
        startDate: { gt: new Date() },
      },
      orderBy: { startDate: "asc" },
      take: 10,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildUrl(overrides: { status?: string; page?: number } = {}) {
    const params = new URLSearchParams();
    const s = overrides.status ?? statusFilter;
    const p = overrides.page ?? undefined;
    if (s && s !== "all") params.set("status", s);
    if (p && p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/admin/challenges${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sunshine/15">
            <FontAwesomeIcon icon={faTrophy} className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-charcoal">Challenge Management</h1>
            <p className="text-sm text-slate">{total} {statusFilter === "all" ? "total" : statusFilter.toLowerCase().replace("_", " ")} challenges</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/challenges/new"
            className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90"
          >
            <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
            New Challenge
          </Link>
        </div>
      </div>

      {/* Auto-Generate Config (superadmin only) */}
      {isSuperAdmin && <AutoGenerateConfigWrapper />}

      {/* Generation Frequency Info */}
      <Card variant="default" className="mb-4 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ocean/10">
            <FontAwesomeIcon icon={faCircleInfo} className="h-4 w-4 text-ocean" />
          </div>
          <div className="text-sm text-slate">
            <p className="font-medium text-charcoal">Challenge Generation Schedule</p>
            <p className="mt-1">
              Challenges are <strong>auto-generated monthly</strong> via the daily cron job.
              Each enabled template produces one challenge for the following month, created with <strong>Pending Review</strong> status.
              Approved challenges are auto-activated on their start date and auto-completed when they end.
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Generated → Pending Review
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-ocean" /> Admin Approves → Approved
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-forest" /> Start Date Arrives → Active
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-slate" /> End Date Passes → Completed
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming Challenges Preview */}
      {upcomingChallenges.length > 0 && (
        <Card variant="default" className="mb-4 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
            <FontAwesomeIcon icon={faEye} className="h-4 w-4 text-forest" />
            <h2 className="text-sm font-semibold text-charcoal">Upcoming Challenges Preview</h2>
            <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[11px] font-medium text-forest">
              {upcomingChallenges.length}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {upcomingChallenges.map((ch) => {
              const statusBadge = STATUS_BADGE[ch.status] ?? STATUS_BADGE.DRAFT;
              const cat = CATEGORIES[ch.category as ActivityCategory];
              const formatDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
              return (
                <Link key={ch.id} href={`/admin/challenges/${ch.id}`} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-charcoal">{ch.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate">{ch.description}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate">
                      <span>{cat?.icon} {cat?.label ?? ch.category}</span>
                      <span>{formatDate(ch.startDate)} – {formatDate(ch.endDate)}</span>
                      <span>Target: {ch.targetValue} {cat?.unitLabel?.toLowerCase() ?? "units"}</span>
                    </div>
                  </div>
                  <Badge variant={statusBadge.variant} size="sm">{statusBadge.label}</Badge>
                </Link>
              );
            })}
          </div>
        </Card>
      )}

      {/* Status Filter Tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={buildUrl({ status: tab.value, page: 1 })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-forest text-white shadow-sm"
                  : "bg-gray-100 text-slate hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Desktop Table */}
      <Card variant="default" className="hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Challenge</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Category</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Dates</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Participants</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">Target</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge) => {
                const statusBadge = STATUS_BADGE[challenge.status] ?? STATUS_BADGE.DRAFT;
                const cat = CATEGORIES[challenge.category as ActivityCategory];
                const formatDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                return (
                  <tr key={challenge.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/challenges/${challenge.id}`} className="group">
                        <p className="text-sm font-medium text-charcoal group-hover:text-forest transition-colors">
                          {challenge.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate">{challenge.description}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal">
                        {cat?.icon} {cat?.label ?? challenge.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadge.variant} size="sm">{statusBadge.label}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate">
                      {formatDate(challenge.startDate)} – {formatDate(challenge.endDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-sm text-charcoal">
                        <FontAwesomeIcon icon={faUsers} className="h-3 w-3 text-slate/50" />
                        {challenge._count.participants}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-charcoal">
                      {challenge.targetValue} {cat?.unitLabel?.toLowerCase() ?? "units"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {challenges.map((challenge) => {
          const statusBadge = STATUS_BADGE[challenge.status] ?? STATUS_BADGE.DRAFT;
          const cat = CATEGORIES[challenge.category as ActivityCategory];
          const formatDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
          return (
            <Link key={challenge.id} href={`/admin/challenges/${challenge.id}`}>
              <Card variant="default" className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-charcoal">{challenge.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate">{challenge.description}</p>
                  </div>
                  <Badge variant={statusBadge.variant} size="sm">{statusBadge.label}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate">
                  <span>{cat?.icon} {cat?.label ?? challenge.category}</span>
                  <span>{formatDate(challenge.startDate)} – {formatDate(challenge.endDate)}</span>
                  <span className="inline-flex items-center gap-1">
                    <FontAwesomeIcon icon={faUsers} className="h-3 w-3" />
                    {challenge._count.participants}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {challenges.length === 0 && (
        <Card variant="default" className="p-12 text-center">
          <FontAwesomeIcon icon={faTrophy} className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="mb-4 text-sm text-slate">
            {statusFilter !== "all" ? `No ${statusFilter.toLowerCase().replace("_", " ")} challenges` : "No challenges yet"}
          </p>
          <Link
            href="/admin/challenges/new"
            className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90"
          >
            <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
            Create First Challenge
          </Link>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={buildUrl({ page: currentPage - 1 })}
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
              href={buildUrl({ page: currentPage + 1 })}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-slate hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

async function AutoGenerateConfigWrapper() {
  const config = await getAutoGenerateConfig();
  return (
    <AutoGenerateConfig
      globalEnabled={config.globalEnabled}
      templates={config.templates}
    />
  );
}
