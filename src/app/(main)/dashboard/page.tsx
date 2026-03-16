import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
  faFire,
  faBicycle,
  faMedal,
  faPersonWalking,
  faUsers,
  faRoute,
  faTrophy,
  faLeaf,
  faBolt,
} from "@/lib/fontawesome";
import { ImpactSummaryCard } from "@/components/charts/ImpactSummaryCard";
import { WeeklyTrendChart } from "@/components/charts/WeeklyTrendChart";
import { TransportComparisonChart } from "@/components/charts/TransportComparisonChart";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  getCurrentUser,
  getUserCategoryTotal,
  getUserCategoryTrend,
  getUserWeeklyTrend,
  getUserChallengeProgress,
} from "@/lib/queries";
import { toHumanReadable, type MetricCategory } from "@/lib/metrics/converters";
import type { ActivityCategory } from "@/lib/categories";

const CATEGORY_ICON_MAP: Record<string, { icon: IconDefinition; iconBg: string; iconColor: string; accentBorder: string }> = {
  WATER: { icon: faDroplet, iconBg: "bg-ocean/10", iconColor: "text-ocean", accentBorder: "bg-ocean" },
  CARBON: { icon: faEarthAmericas, iconBg: "bg-forest/10", iconColor: "text-forest", accentBorder: "bg-forest" },
  PLASTIC: { icon: faBagShopping, iconBg: "bg-sunshine/15", iconColor: "text-amber-600", accentBorder: "bg-sunshine" },
  RECYCLING: { icon: faRecycle, iconBg: "bg-leaf/10", iconColor: "text-leaf", accentBorder: "bg-leaf" },
  TRANSPORT: { icon: faCar, iconBg: "bg-ocean/10", iconColor: "text-ocean", accentBorder: "bg-ocean" },
  FASHION: { icon: faShirt, iconBg: "bg-forest/10", iconColor: "text-forest", accentBorder: "bg-forest" },
};

const CATEGORY_LABELS: Record<string, string> = {
  WATER: "Water Saved",
  CARBON: "Carbon Reduced",
  PLASTIC: "Plastic Avoided",
  RECYCLING: "Recycling Impact",
  TRANSPORT: "Transport Savings",
  FASHION: "Fashion Impact",
};

const CATEGORY_TOOLTIPS: Record<string, string> = {
  WATER: "Total litres of water saved through conservation",
  CARBON: "Total kg of CO\u2082 prevented from being emitted",
  PLASTIC: "Single-use plastic items avoided",
  RECYCLING: "Total kg of materials recycled or composted",
  TRANSPORT: "Km saved using eco-friendly transport",
  FASHION: "Sustainable fashion choices made",
};

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
  "user-check": { icon: faPersonWalking, color: "bg-forest/10 text-forest" },
  "message-circle": { icon: faUsers, color: "bg-ocean/10 text-ocean" },
  "heart-handshake": { icon: faUsers, color: "bg-coral/10 text-coral" },
  star: { icon: faTrophy, color: "bg-sunshine/15 text-amber-600" },
  globe: { icon: faEarthAmericas, color: "bg-forest/10 text-forest" },
  train: { icon: faRoute, color: "bg-forest/10 text-forest" },
  "car-off": { icon: faCar, color: "bg-leaf/10 text-leaf" },
};

const QUICK_ACTIONS: { icon: IconDefinition; label: string; href: string; color: string }[] = [
  { icon: faDroplet, label: "Log Water", href: "/track/water", color: "bg-ocean/10 text-ocean hover:bg-ocean/15" },
  { icon: faEarthAmericas, label: "Log Carbon", href: "/track/carbon", color: "bg-forest/10 text-forest hover:bg-forest/15" },
  { icon: faRoute, label: "Log Transport", href: "/track/transport", color: "bg-ocean/10 text-ocean hover:bg-ocean/15" },
  { icon: faRecycle, label: "Log Recycling", href: "/track/recycling", color: "bg-leaf/10 text-leaf hover:bg-leaf/15" },
];

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const categories: ActivityCategory[] = ["WATER", "CARBON", "PLASTIC", "RECYCLING", "TRANSPORT", "FASHION"];

  const [totalsAndTrends, weeklyTrend, challengeProgress] = await Promise.all([
    Promise.all(
      categories.map(async (cat) => {
        const [total, trend] = await Promise.all([
          getUserCategoryTotal(user.id, cat),
          getUserCategoryTrend(user.id, cat),
        ]);
        return { category: cat, total, trend };
      })
    ),
    getUserWeeklyTrend(user.id),
    getUserChallengeProgress(user.id),
  ]);

  // Build impact cards from real data
  const impactCards = totalsAndTrends.map(({ category, total, trend }) => {
    const icons = CATEGORY_ICON_MAP[category];
    const humanMetric = toHumanReadable(category as MetricCategory, total);
    return {
      icon: icons.icon,
      label: CATEGORY_LABELS[category],
      humanValue: humanMetric.value,
      comparison: humanMetric.comparison,
      iconBg: icons.iconBg,
      iconColor: icons.iconColor,
      accentBorder: icons.accentBorder,
      trend,
      tooltip: CATEGORY_TOOLTIPS[category],
    };
  });

  // Recent badges from real user data
  const recentBadges = user.userBadges.slice(0, 3).map((ub) => {
    const badgeStyle = BADGE_ICON_MAP[ub.badge.icon] ?? { icon: faMedal, color: "bg-gray-100 text-gray-600" };
    return {
      name: ub.badge.name,
      icon: badgeStyle.icon,
      color: badgeStyle.color,
      earnedAgo: timeAgo(ub.earnedAt),
    };
  });

  // Active challenge from real data
  const activeChallenge = challengeProgress.find((cp) => cp.challenge.isActive);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal">
            Welcome back, {user.displayName || user.name || "Explorer"}!
          </h1>
          <p className="mt-1 text-sm text-slate">
            Here&apos;s your environmental impact this week
          </p>
        </div>
        {user.streakDays > 0 && (
          <Badge variant="warning" size="md">
            <FontAwesomeIcon
              icon={faFire}
              className="h-3 w-3 animate-pulse-glow"
              aria-hidden
            />
            {user.streakDays}-day streak
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            size="sm"
            leftIcon={action.icon}
            href={action.href}
            className={action.color}
          >
            {action.label}
          </Button>
        ))}
      </div>

      {/* Impact Cards Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {impactCards.map((card) => (
          <ImpactSummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyTrendChart data={weeklyTrend} />
        <TransportComparisonChart />
      </div>

      {/* Bottom Row: Badges + Active Challenge */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Badges */}
        <Card variant="default" className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sunshine/15">
              <FontAwesomeIcon
                icon={faMedal}
                className="h-4 w-4 text-amber-600"
                aria-hidden
              />
            </div>
            <h3 className="text-[15px] font-semibold text-charcoal">
              Recent Badges
            </h3>
          </div>
          {recentBadges.length > 0 ? (
            <div className="space-y-2.5">
              {recentBadges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex items-center gap-3 rounded-xl bg-gray-50/80 px-4 py-3 transition-colors hover:bg-gray-100/80"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${badge.color}`}
                  >
                    <FontAwesomeIcon
                      icon={badge.icon}
                      className="h-4 w-4"
                      aria-hidden
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-charcoal">
                      {badge.name}
                    </div>
                    <div className="text-[11px] text-slate">
                      Earned {badge.earnedAgo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-slate">
              No badges earned yet. Start logging activities to earn your first badge!
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            href="/badges"
            rightIcon={faTrophy}
            className="mt-4 w-full"
          >
            View All Badges
          </Button>
        </Card>

        {/* Active Challenge */}
        <Card variant="default" className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest/8">
              <FontAwesomeIcon
                icon={faPersonWalking}
                className="h-4 w-4 text-forest"
                aria-hidden
              />
            </div>
            <h3 className="text-[15px] font-semibold text-charcoal">
              Active Challenge
            </h3>
          </div>
          {activeChallenge ? (
            <Card
              variant="gradient"
              gradient="linear-gradient(135deg, #2D6A4F 0%, #1B4965 100%)"
              className="p-5"
            >
              <Badge variant="ocean" size="sm" className="mb-2">
                {activeChallenge.challenge.startDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </Badge>
              <div className="mb-1 text-lg font-bold text-white">
                {activeChallenge.challenge.title}
              </div>
              <div className="mb-5 text-sm text-white/70">
                {activeChallenge.challenge.description}
              </div>

              <div className="mb-3">
                <div className="mb-1.5 flex justify-between text-xs text-white/80">
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faPersonWalking} className="h-3 w-3" aria-hidden />
                    Your progress
                  </span>
                  <span className="font-medium">
                    {Math.min(activeChallenge.progress, activeChallenge.challenge.targetValue)} / {activeChallenge.challenge.targetValue}
                  </span>
                </div>
                <ProgressBar
                  value={Math.min(100, (activeChallenge.progress / activeChallenge.challenge.targetValue) * 100)}
                  color="sunshine"
                  size="sm"
                />
              </div>

              <div>
                <div className="mb-1.5 flex justify-between text-xs text-white/80">
                  <span className="flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faUsers} className="h-3 w-3" aria-hidden />
                    Community
                  </span>
                  <span className="font-medium">{activeChallenge.challenge._count.participants} participants</span>
                </div>
                <ProgressBar value={45} color="leaf" size="sm" />
              </div>
            </Card>
          ) : (
            <div className="rounded-lg bg-gray-50 p-5 text-center">
              <p className="mb-3 text-sm text-slate">No active challenges joined yet.</p>
              <Button variant="primary" size="sm" href="/challenges">
                Browse Challenges
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
