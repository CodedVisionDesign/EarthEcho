import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faArrowLeft,
  faUsers,
  faBullseye,
  faCircleCheck,
  faCircleExclamation,
  faPen,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { CATEGORIES, type ActivityCategory } from "@/lib/categories";
import { ChallengeActions } from "@/components/admin/ChallengeActions";
import { ChallengeForm } from "@/components/admin/ChallengeForm";
import {
  ProgressDistributionChart,
  DailyJoinRateChart,
  ProgressTrendChart,
} from "@/components/admin/ChallengeCharts";
import Link from "next/link";
import { notFound } from "next/navigation";

const STATUS_BADGE: Record<string, { variant: "success" | "info" | "warning" | "neutral" | "forest" | "danger"; label: string }> = {
  DRAFT: { variant: "neutral", label: "Draft" },
  PENDING_REVIEW: { variant: "warning", label: "Pending Review" },
  APPROVED: { variant: "info", label: "Approved" },
  ACTIVE: { variant: "success", label: "Active" },
  COMPLETED: { variant: "forest", label: "Completed" },
  ARCHIVED: { variant: "neutral", label: "Archived" },
};

export default async function AdminChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const isSuperAdmin = admin.role === "superadmin" || admin.role === "developer";

  // Fetch challenge with all participants for charts, and top 20 for leaderboard
  const [challengeData, allParticipants] = await Promise.all([
    db.challenge.findUnique({
      where: { id },
      include: {
        _count: { select: { participants: true } },
        participants: {
          include: { user: { select: { id: true, name: true, displayName: true, image: true } } },
          orderBy: { progress: "desc" },
          take: 20,
        },
      },
    }),
    db.challengeParticipant.findMany({
      where: { challengeId: id },
      select: { progress: true, joinedAt: true },
    }),
  ]);

  if (!challengeData) notFound();
  const challenge = challengeData;

  const cat = CATEGORIES[challenge.category as ActivityCategory];
  const statusBadge = STATUS_BADGE[challenge.status] ?? STATUS_BADGE.DRAFT;
  const canEdit = ["DRAFT", "PENDING_REVIEW"].includes(challenge.status);
  const formatDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // Analytics
  const totalParticipants = challenge._count.participants;
  const completedCount = allParticipants.filter(
    (p) => p.progress >= challenge.targetValue,
  ).length;
  const completionRate = totalParticipants > 0 ? Math.round((completedCount / totalParticipants) * 100) : 0;
  const avgProgress = totalParticipants > 0
    ? Math.round(
        allParticipants.reduce(
          (sum, p) => sum + Math.min((p.progress / challenge.targetValue) * 100, 100),
          0,
        ) / totalParticipants,
      )
    : 0;

  // Chart data: Progress Distribution
  const bucketFills = ["#E5E7EB", "#52B788", "#2D6A4F", "#1B4965"];
  const progressBuckets = [
    { range: "0-25%", count: 0, fill: bucketFills[0] },
    { range: "25-50%", count: 0, fill: bucketFills[1] },
    { range: "50-75%", count: 0, fill: bucketFills[2] },
    { range: "75-100%", count: 0, fill: bucketFills[3] },
  ];
  for (const p of allParticipants) {
    const pct = Math.min(100, (p.progress / challenge.targetValue) * 100);
    if (pct < 25) progressBuckets[0].count++;
    else if (pct < 50) progressBuckets[1].count++;
    else if (pct < 75) progressBuckets[2].count++;
    else progressBuckets[3].count++;
  }

  // Chart data: Daily Join Rate
  const joinMap = new Map<string, number>();
  for (const p of allParticipants) {
    const key = p.joinedAt.toISOString().split("T")[0];
    joinMap.set(key, (joinMap.get(key) ?? 0) + 1);
  }
  const joinRateData = Array.from(joinMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, joins]) => ({
      date: new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      joins,
    }));

  // Chart data: Progress Trend (simulated as cumulative avg at join milestones)
  const sortedByJoin = [...allParticipants].sort(
    (a, b) => a.joinedAt.getTime() - b.joinedAt.getTime(),
  );
  const progressTrendData: { date: string; avgProgress: number }[] = [];
  let runningSum = 0;
  for (let i = 0; i < sortedByJoin.length; i++) {
    runningSum += Math.min(100, (sortedByJoin[i].progress / challenge.targetValue) * 100);
    // Sample at intervals to keep chart readable
    if (sortedByJoin.length <= 20 || i % Math.max(1, Math.floor(sortedByJoin.length / 20)) === 0 || i === sortedByJoin.length - 1) {
      progressTrendData.push({
        date: sortedByJoin[i].joinedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        avgProgress: Math.round(runningSum / (i + 1)),
      });
    }
  }

  const showCharts = totalParticipants > 0 && ["ACTIVE", "COMPLETED"].includes(challenge.status);

  // Fetch creator/approver names
  const [creator, approver] = await Promise.all([
    challenge.createdById
      ? db.user.findUnique({ where: { id: challenge.createdById }, select: { name: true, displayName: true } })
      : null,
    challenge.approvedById
      ? db.user.findUnique({ where: { id: challenge.approvedById }, select: { name: true, displayName: true } })
      : null,
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/challenges"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate hover:text-charcoal transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Back to Challenges
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sunshine/15">
              <FontAwesomeIcon icon={faTrophy} className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-charcoal">{challenge.title}</h1>
                <Badge variant={statusBadge.variant} size="sm">{statusBadge.label}</Badge>
              </div>
              <p className="text-sm text-slate">
                {cat?.icon} {cat?.label ?? challenge.category} · {formatDate(challenge.startDate)} – {formatDate(challenge.endDate)}
              </p>
            </div>
          </div>
          {canEdit && (
            <Link
              href="#edit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-slate transition-colors hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faPen} className="h-3 w-3" />
              Edit
            </Link>
          )}
        </div>
      </div>

      {/* Workflow Actions */}
      <div className="mb-6">
        <ChallengeActions
          challengeId={challenge.id}
          status={challenge.status}
          isSuperAdmin={isSuperAdmin}
        />
      </div>

      {/* Rejection reason */}
      {challenge.rejectionReason && challenge.status === "DRAFT" && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <FontAwesomeIcon icon={faCircleExclamation} className="mt-0.5 h-4 w-4 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Returned for revision</p>
              <p className="mt-1 text-sm text-amber-700">{challenge.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info + Analytics Grid */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Challenge Info */}
        <Card variant="default" className="p-5 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate/60">Details</h2>
          <p className="mb-4 text-sm leading-relaxed text-charcoal">{challenge.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate">Category</p>
              <p className="font-medium text-charcoal">{cat?.icon} {cat?.label ?? challenge.category}</p>
            </div>
            <div>
              <p className="text-xs text-slate">Target</p>
              <p className="font-medium text-charcoal">{challenge.targetValue} {cat?.unitLabel?.toLowerCase() ?? "units"}</p>
            </div>
            <div>
              <p className="text-xs text-slate">Created by</p>
              <p className="font-medium text-charcoal">{creator?.displayName || creator?.name || "System"}</p>
            </div>
            {approver && (
              <div>
                <p className="text-xs text-slate">Approved by</p>
                <p className="font-medium text-charcoal">{approver.displayName || approver.name}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Stats */}
        <Card variant="default" className="p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate/60">Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate">Participants</span>
              <span className="text-lg font-bold text-charcoal">{totalParticipants}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate">Completion Rate</span>
              <span className="text-lg font-bold text-forest">{completionRate}%</span>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-slate">Avg Progress</span>
                <span className="text-sm font-medium text-charcoal">{avgProgress}%</span>
              </div>
              <ProgressBar value={avgProgress} color="forest" size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate">Completed</span>
              <span className="text-sm font-medium text-charcoal">{completedCount} / {totalParticipants}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Challenge Charts */}
      {showCharts && (
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ProgressDistributionChart data={progressBuckets} />
          <DailyJoinRateChart data={joinRateData} />
          <ProgressTrendChart data={progressTrendData} />
        </div>
      )}

      {/* Participant Leaderboard */}
      {totalParticipants > 0 && (
        <Card variant="default" className="mb-6 overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5 text-slate/50" />
              Top Participants
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate/70">#</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate/70">Member</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate/70">Progress</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate/70">Status</th>
                </tr>
              </thead>
              <tbody>
                {challenge.participants.map((p, i) => {
                  const pct = Math.min(100, Math.round((p.progress / challenge.targetValue) * 100));
                  const isComplete = p.progress >= challenge.targetValue;
                  return (
                    <tr key={p.id} className="border-b border-gray-100">
                      <td className="px-4 py-2.5 font-medium text-slate">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <span className="font-medium text-charcoal">
                          {p.user.displayName || p.user.name || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <ProgressBar value={pct} color="forest" size="sm" />
                          </div>
                          <span className="text-xs text-slate">
                            {p.progress}/{challenge.targetValue} ({pct}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        {isComplete ? (
                          <Badge variant="success" size="sm">
                            <FontAwesomeIcon icon={faCircleCheck} className="h-2.5 w-2.5" />
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="neutral" size="sm">In Progress</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Form (when editable) */}
      {canEdit && (
        <div id="edit">
          <Card variant="default" className="p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate/60">Edit Challenge</h2>
            <ChallengeForm
              mode="edit"
              challengeId={challenge.id}
              isSuperAdmin={isSuperAdmin}
              initialData={{
                title: challenge.title,
                description: challenge.description,
                category: challenge.category,
                targetValue: challenge.targetValue,
                startDate: challenge.startDate.toISOString().split("T")[0],
                endDate: challenge.endDate.toISOString().split("T")[0],
              }}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
