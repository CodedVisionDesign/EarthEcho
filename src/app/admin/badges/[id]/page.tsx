import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faArrowLeft,
  faUsers,
  faPen,
  faTrashCan,
  faMedal,
  faDroplet,
  faFire,
  faBicycle,
  faLeaf,
  faTrophy,
  faBolt,
  faPersonWalking,
  faEarthAmericas,
  faCar,
  faUser,
  faTrain,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireSuperAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { BadgeForm } from "@/components/admin/BadgeForm";
import { BadgeGrantForm, RevokeButton } from "@/components/admin/BadgeGrantForm";
import { DeleteBadgeButton } from "./DeleteBadgeButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const BADGE_ICON_MAP: Record<string, { icon: IconDefinition; color: string }> = {
  footprints: { icon: faPersonWalking, color: "bg-forest/10 text-forest" },
  flame: { icon: faFire, color: "bg-coral/10 text-coral" },
  droplet: { icon: faDroplet, color: "bg-ocean/10 text-ocean" },
  droplets: { icon: faDroplet, color: "bg-ocean/10 text-ocean" },
  bike: { icon: faBicycle, color: "bg-leaf/10 text-leaf" },
  leaf: { icon: faLeaf, color: "bg-leaf/10 text-leaf" },
  trophy: { icon: faTrophy, color: "bg-sunshine/15 text-amber-600" },
  medal: { icon: faMedal, color: "bg-sunshine/15 text-amber-600" },
  crown: { icon: faTrophy, color: "bg-sunshine/15 text-amber-600" },
  zap: { icon: faBolt, color: "bg-ocean/10 text-ocean" },
  shield: { icon: faLeaf, color: "bg-forest/10 text-forest" },
  waves: { icon: faDroplet, color: "bg-ocean/10 text-ocean" },
  "user-check": { icon: faUser, color: "bg-forest/10 text-forest" },
  "message-circle": { icon: faUsers, color: "bg-ocean/10 text-ocean" },
  "heart-handshake": { icon: faUsers, color: "bg-coral/10 text-coral" },
  star: { icon: faTrophy, color: "bg-sunshine/15 text-amber-600" },
  globe: { icon: faEarthAmericas, color: "bg-forest/10 text-forest" },
  train: { icon: faTrain, color: "bg-forest/10 text-forest" },
  "car-off": { icon: faCar, color: "bg-leaf/10 text-leaf" },
};

const RARITY_STYLES: Record<string, { variant: "neutral" | "success" | "info" | "forest" | "warning"; label: string }> = {
  common: { variant: "neutral", label: "Common" },
  uncommon: { variant: "success", label: "Uncommon" },
  rare: { variant: "info", label: "Rare" },
  epic: { variant: "forest", label: "Epic" },
  legendary: { variant: "warning", label: "Legendary" },
};

const CATEGORY_LABELS: Record<string, string> = {
  starter: "Getting Started",
  streak: "Streak",
  impact: "Impact",
  transport: "Transport",
  challenge: "Challenge",
  community: "Community",
};

function describeCriteria(criteriaStr: string): string {
  try {
    const c = JSON.parse(criteriaStr);
    switch (c.type) {
      case "first_activity": return "Log first activity";
      case "profile_complete": return "Complete profile";
      case "first_post": return "Make first forum post";
      case "streak": return `${c.days}-day activity streak`;
      case "total": return `Accumulate ${c.value} in ${c.category}`;
      case "transport_distance": return `Travel ${c.km} km by ${c.mode}`;
      case "transport_count": return `Take ${c.count} ${c.mode} trips`;
      case "challenges_completed": return `Complete ${c.count} challenges`;
      case "reactions_received": return `Receive ${c.count} "${c.reaction}" reactions`;
      case "posts_count": return `Make ${c.count} forum posts`;
      case "car_free_streak": return `${c.days}-day car-free streak`;
      case "flight_free_streak": return `${c.days}-day flight-free streak`;
      default: return c.type;
    }
  } catch {
    return "Custom criteria";
  }
}

export default async function AdminBadgeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSuperAdmin();
  const { id } = await params;

  const badge = await db.badge.findUnique({
    where: { id },
    include: {
      _count: { select: { userBadges: true } },
      userBadges: {
        include: {
          user: { select: { id: true, name: true, displayName: true, email: true, image: true } },
        },
        orderBy: { earnedAt: "desc" },
        take: 50,
      },
    },
  });

  if (!badge) notFound();

  const totalUsers = await db.user.count();
  const iconStyle = BADGE_ICON_MAP[badge.icon] ?? { icon: faMedal, color: "bg-gray-100 text-gray-600" };
  const rarity = RARITY_STYLES[badge.rarity] ?? RARITY_STYLES.common;
  const earnedCount = badge._count.userBadges;
  const pctEarned = totalUsers > 0 ? Math.round((earnedCount / totalUsers) * 100) : 0;

  const firstEarned = badge.userBadges.length > 0
    ? badge.userBadges[badge.userBadges.length - 1].earnedAt
    : null;
  const lastEarned = badge.userBadges.length > 0
    ? badge.userBadges[0].earnedAt
    : null;
  const formatDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/badges"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate hover:text-charcoal transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Back to Badges
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconStyle.color}`}>
              <FontAwesomeIcon icon={iconStyle.icon} className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-charcoal">{badge.name}</h1>
                <Badge variant={rarity.variant} size="sm">{rarity.label}</Badge>
              </div>
              <p className="text-sm text-slate">
                {CATEGORY_LABELS[badge.category] ?? badge.category} · {describeCriteria(badge.criteria)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DeleteBadgeButton badgeId={badge.id} badgeName={badge.name} />
          </div>
        </div>
      </div>

      {/* Info + Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card variant="default" className="p-5 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate/60">Details</h2>
          <p className="mb-4 text-sm leading-relaxed text-charcoal">{badge.description}</p>
          <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate">Category</p>
              <p className="font-medium text-charcoal">{CATEGORY_LABELS[badge.category] ?? badge.category}</p>
            </div>
            <div>
              <p className="text-xs text-slate">Rarity</p>
              <p className="font-medium text-charcoal capitalize">{badge.rarity}</p>
            </div>
            <div>
              <p className="text-xs text-slate">Icon</p>
              <p className="font-medium text-charcoal">{badge.icon}</p>
            </div>
            <div>
              <p className="text-xs text-slate">Criteria</p>
              <p className="font-medium text-charcoal">{describeCriteria(badge.criteria)}</p>
            </div>
          </div>
        </Card>

        <Card variant="default" className="p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate/60">Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate">Earned By</span>
              <span className="text-lg font-bold text-charcoal">{earnedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate">% of Users</span>
              <span className="text-lg font-bold text-forest">{pctEarned}%</span>
            </div>
            {firstEarned && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate">First Earned</span>
                <span className="text-sm font-medium text-charcoal">{formatDate(firstEarned)}</span>
              </div>
            )}
            {lastEarned && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate">Last Earned</span>
                <span className="text-sm font-medium text-charcoal">{formatDate(lastEarned)}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Grant Badge */}
      <Card variant="default" className="mb-6 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate/60">Grant Badge</h2>
        <p className="mb-3 text-xs text-slate">Manually award this badge to a user by searching for them below.</p>
        <BadgeGrantForm badgeId={badge.id} />
      </Card>

      {/* Earned By Table */}
      {earnedCount > 0 && (
        <Card variant="default" className="mb-6 overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-charcoal">
              <FontAwesomeIcon icon={faUsers} className="h-3.5 w-3.5 text-slate/50" />
              Earned By ({earnedCount})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate/70">User</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate/70">Email</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate/70">Earned</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {badge.userBadges.map((ub) => (
                  <tr key={ub.id} className="border-b border-gray-100">
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-charcoal">
                        {ub.user.displayName || ub.user.name || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate">{ub.user.email}</td>
                    <td className="px-4 py-2.5 text-xs text-slate">{formatDate(ub.earnedAt)}</td>
                    <td className="px-4 py-2.5">
                      <RevokeButton badgeId={badge.id} userId={ub.user.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Form */}
      <div id="edit">
        <Card variant="default" className="p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate/60">
            <FontAwesomeIcon icon={faPen} className="mr-1.5 h-3 w-3" />
            Edit Badge
          </h2>
          <BadgeForm
            mode="edit"
            badgeId={badge.id}
            initialData={{
              name: badge.name,
              description: badge.description,
              icon: badge.icon,
              category: badge.category,
              rarity: badge.rarity,
              criteria: badge.criteria,
            }}
          />
        </Card>
      </div>
    </div>
  );
}
