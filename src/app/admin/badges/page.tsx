import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faPlus,
  faMedal,
  faDroplet,
  faFire,
  faBicycle,
  faLeaf,
  faTrophy,
  faBolt,
  faPersonWalking,
  faUsers,
  faEarthAmericas,
  faCar,
  faUser,
  faTrain,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireSuperAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import Link from "next/link";
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

const CATEGORY_TABS = [
  { value: "all", label: "All" },
  { value: "starter", label: "Starter" },
  { value: "streak", label: "Streak" },
  { value: "impact", label: "Impact" },
  { value: "transport", label: "Transport" },
  { value: "challenge", label: "Challenge" },
  { value: "community", label: "Community" },
];

export default async function AdminBadgesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await requireSuperAdmin();
  const { category } = await searchParams;
  const categoryFilter = CATEGORY_TABS.some((t) => t.value === category) ? category : "all";

  const where = categoryFilter !== "all" ? { category: categoryFilter } : {};

  const [badges, totalUsers, totalEarned] = await Promise.all([
    db.badge.findMany({
      where,
      include: { _count: { select: { userBadges: true } } },
      orderBy: [{ category: "asc" }, { rarity: "asc" }, { name: "asc" }],
    }),
    db.user.count(),
    db.userBadge.count(),
  ]);

  function buildUrl(cat: string) {
    return cat === "all" ? "/admin/badges" : `/admin/badges?category=${cat}`;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sunshine/15">
            <FontAwesomeIcon icon={faAward} className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-charcoal">Badge Management</h1>
            <p className="text-sm text-slate">
              {badges.length} badges · {totalEarned} earned across all users
            </p>
          </div>
        </div>
        <Link
          href="/admin/badges/new"
          className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
          Create Badge
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card variant="default" className="p-4 text-center">
          <p className="text-2xl font-bold text-charcoal">{badges.length}</p>
          <p className="text-xs text-slate">Total Badges</p>
        </Card>
        <Card variant="default" className="p-4 text-center">
          <p className="text-2xl font-bold text-forest">{totalEarned}</p>
          <p className="text-xs text-slate">Badges Earned</p>
        </Card>
        <Card variant="default" className="p-4 text-center">
          <p className="text-2xl font-bold text-ocean">{totalUsers}</p>
          <p className="text-xs text-slate">Total Users</p>
        </Card>
        <Card variant="default" className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {totalUsers > 0 ? Math.round((totalEarned / (badges.length * totalUsers)) * 100) : 0}%
          </p>
          <p className="text-xs text-slate">Avg Completion</p>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {CATEGORY_TABS.map((tab) => {
          const isActive = categoryFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={buildUrl(tab.value)}
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

      {/* Badge Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => {
          const iconStyle = BADGE_ICON_MAP[badge.icon] ?? { icon: faMedal, color: "bg-gray-100 text-gray-600" };
          const rarity = RARITY_STYLES[badge.rarity] ?? RARITY_STYLES.common;
          const earnedCount = badge._count.userBadges;
          const pctEarned = totalUsers > 0 ? Math.round((earnedCount / totalUsers) * 100) : 0;

          return (
            <Link key={badge.id} href={`/admin/badges/${badge.id}`}>
              <Card variant="default" className="p-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle.color}`}>
                    <FontAwesomeIcon icon={iconStyle.icon} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-charcoal">{badge.name}</span>
                      <Badge variant={rarity.variant} size="sm">{rarity.label}</Badge>
                    </div>
                    <p className="mb-2 line-clamp-2 text-xs text-slate">{badge.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate">
                      <span className="inline-flex items-center gap-1">
                        <FontAwesomeIcon icon={faUsers} className="h-3 w-3" />
                        {earnedCount} earned ({pctEarned}%)
                      </span>
                      <span className="text-slate/50">·</span>
                      <span>{CATEGORY_LABELS[badge.category] ?? badge.category}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {badges.length === 0 && (
        <Card variant="default" className="p-12 text-center">
          <FontAwesomeIcon icon={faAward} className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="mb-4 text-sm text-slate">
            {categoryFilter !== "all" ? `No ${categoryFilter} badges` : "No badges yet"}
          </p>
          <Link
            href="/admin/badges/new"
            className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90"
          >
            <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
            Create First Badge
          </Link>
        </Card>
      )}
    </div>
  );
}
