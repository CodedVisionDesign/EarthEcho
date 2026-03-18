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
  faAward,
  faBullseye,
} from "@/lib/fontawesome";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { TourStarter } from "@/components/tour/TourStarter";
import { TourTriggerButton } from "@/components/tour/TourTriggerButton";
import { GettingStartedGuide } from "@/components/dashboard/GettingStartedGuide";
import { ImpactSummaryCard } from "@/components/charts/ImpactSummaryCard";
import { WeeklyTrendChart } from "@/components/charts/WeeklyTrendChart";
import { TransportComparisonChart } from "@/components/charts/TransportComparisonChart";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  getCurrentUser,
  getUserCategoryTotal,
  getUserCategoryTrend,
  getUserWeeklyTrend,
  getUserChallengeProgress,
  getRecentActivities,
  getUserBadgesWithProgress,
} from "@/lib/queries";
import { toHumanReadable, type MetricCategory } from "@/lib/metrics/converters";
import { CATEGORIES as TRACK_CATEGORIES, type ActivityCategory } from "@/lib/categories";

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

  const [totalsAndTrends, weeklyTrend, challengeProgress, recentActivities, allBadges] = await Promise.all([
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
    getRecentActivities(user.id, 5),
    getUserBadgesWithProgress(user.id),
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
      calculationTooltip: humanMetric.tooltip,
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

  // Active challenges from real data (all joined + active)
  const activeChallenges = challengeProgress.filter(
    (cp) => cp.challenge.isActive && cp.progress < cp.challenge.targetValue
  );

  // Next badge to earn (closest to completion, not yet earned)
  const nextBadge = allBadges
    .filter((b) => !b.earned && b.progress > 0)
    .sort((a, b) => b.progress - a.progress)[0] ?? null;

  const isNewUser = !user.onboardingCompleted;
  const hasNoActivities = recentActivities.length === 0;

  return (
    <div>
      {/* Onboarding Modal for new users */}
      {isNewUser && <OnboardingModal userName={user.name || "Explorer"} />}

      {/* Tour auto-start for users who completed onboarding but not the tour */}
      <TourStarter
        tourCompleted={user.tourCompleted}
        autoStart={!isNewUser && !user.tourCompleted}
      />

      {/* Hero Header */}
      <FadeIn variant="fade-up">
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-forest via-forest/90 to-ocean p-6 text-white shadow-lg sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Welcome back, {user.name || user.displayName || "Explorer"}!
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Here&apos;s your environmental impact this week
              </p>
            </div>
            {user.streakDays > 0 && (
              <div className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold backdrop-blur-sm">
                <FontAwesomeIcon
                  icon={faFire}
                  className="mr-1.5 h-3 w-3 animate-pulse-glow text-sunshine"
                  aria-hidden
                />
                {user.streakDays}-day streak
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-5 flex flex-wrap gap-2" data-tour-step="quick-actions">
            {QUICK_ACTIONS.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                size="sm"
                leftIcon={action.icon}
                href={action.href}
                className="border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Impact Cards Grid */}
      <div data-tour-step="impact-cards">
      <StaggerGroup className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
        {impactCards.map((card) => (
          <StaggerItem key={card.label}>
            <ImpactSummaryCard {...card} />
          </StaggerItem>
        ))}
      </StaggerGroup>
      </div>

      {/* Getting Started Guide (shown to new users with no activities) */}
      {hasNoActivities && (
        <FadeIn className="mb-8" delay={0.1}>
          <GettingStartedGuide userName={user.name || "Explorer"} />
        </FadeIn>
      )}

      {/* Charts Row */}
      {!hasNoActivities && (
        <FadeIn className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2" delay={0.15} cinematic>
          <WeeklyTrendChart data={weeklyTrend} />
          <TransportComparisonChart />
        </FadeIn>
      )}

      {/* Recent Activity + Next Badge Row */}
      <FadeIn className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2" delay={0.2}>
        {/* Recent Activity */}
        <Card variant="default" className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-leaf/10">
              <FontAwesomeIcon icon={faLeaf} className="h-4 w-4 text-leaf" aria-hidden />
            </div>
            <h3 className="text-[15px] font-semibold text-charcoal">Recent Activity</h3>
          </div>
          {recentActivities.length > 0 ? (
            <div className="space-y-2">
              {recentActivities.map((activity) => {
                const catIcons = CATEGORY_ICON_MAP[activity.category];
                const catConfig = TRACK_CATEGORIES[activity.category as ActivityCategory];
                return (
                  <div key={activity.id} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${catIcons?.iconBg ?? "bg-gray-100"}`}>
                      <FontAwesomeIcon
                        icon={catIcons?.icon ?? faLeaf}
                        className={`h-3 w-3 ${catIcons?.iconColor ?? "text-slate"}`}
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-charcoal">
                        {catConfig?.activityTypes.find((t) => t.value === activity.type)?.label ?? activity.type}
                      </div>
                      <div className="text-[11px] text-slate">
                        {activity.value} {catConfig?.unitLabel?.toLowerCase() ?? activity.unit} &middot; {timeAgo(activity.date)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-slate">
              No activities logged yet. Start tracking to see your history!
            </p>
          )}
        </Card>

        {/* Next Badge Progress */}
        <Card variant="default" className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sunshine/15">
              <FontAwesomeIcon icon={faAward} className="h-4 w-4 text-amber-600" aria-hidden />
            </div>
            <h3 className="text-[15px] font-semibold text-charcoal">Next Badge</h3>
          </div>
          {nextBadge ? (
            <div>
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-r from-sunshine/5 to-amber-50 px-4 py-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${(BADGE_ICON_MAP[nextBadge.icon] ?? { color: "bg-gray-100 text-gray-600" }).color}`}>
                  <FontAwesomeIcon
                    icon={(BADGE_ICON_MAP[nextBadge.icon] ?? { icon: faMedal }).icon}
                    className="h-5 w-5"
                    aria-hidden
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-charcoal">{nextBadge.name}</div>
                  <div className="text-xs text-slate">{nextBadge.description}</div>
                </div>
              </div>
              <div className="mb-1.5 flex justify-between text-xs text-slate">
                <span>{nextBadge.progress}% complete</span>
                <span className="font-medium">{nextBadge.progress >= 75 ? "Almost there!" : "Keep going!"}</span>
              </div>
              <ProgressBar
                value={nextBadge.progress}
                color={nextBadge.progress >= 75 ? "sunshine" : "forest"}
                size="sm"
              />
              <Button variant="ghost" size="sm" href="/badges" rightIcon={faTrophy} className="mt-3 w-full">
                View All Badges
              </Button>
            </div>
          ) : recentBadges.length > 0 ? (
            <div className="space-y-2.5">
              {recentBadges.map((badge) => (
                <div key={badge.name} className="flex items-center gap-3 rounded-xl bg-gray-50/80 px-4 py-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${badge.color}`}>
                    <FontAwesomeIcon icon={badge.icon} className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-charcoal">{badge.name}</div>
                    <div className="text-[11px] text-slate">Earned {badge.earnedAgo}</div>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" href="/badges" rightIcon={faTrophy} className="mt-3 w-full">
                View All Badges
              </Button>
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="mb-3 text-sm text-slate">Start logging activities to earn your first badge!</p>
              <Button variant="ghost" size="sm" href="/badges" rightIcon={faTrophy}>
                Browse Badges
              </Button>
            </div>
          )}
        </Card>
      </FadeIn>

      {/* Active Challenges */}
      <FadeIn delay={0.25}>
        <Card variant="default" className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest/8">
                <FontAwesomeIcon icon={faBullseye} className="h-4 w-4 text-forest" aria-hidden />
              </div>
              <h3 className="text-[15px] font-semibold text-charcoal">
                Active Challenges
              </h3>
            </div>
            <Button variant="ghost" size="sm" href="/challenges">
              View All
            </Button>
          </div>
          {activeChallenges.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeChallenges.map((cp) => {
                const pct = Math.min(100, (cp.progress / cp.challenge.targetValue) * 100);
                return (
                  <Card
                    key={cp.id}
                    variant="gradient"
                    gradient="linear-gradient(135deg, #2D6A4F 0%, #1B4965 100%)"
                    className="p-4"
                  >
                    <span className="mb-2 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {cp.challenge.category}
                    </span>
                    <div className="mb-1 text-sm font-bold text-white">
                      {cp.challenge.title}
                    </div>
                    <div className="mb-3 line-clamp-1 text-xs text-white/90">
                      {cp.challenge.description}
                    </div>
                    <div className="mb-1.5 flex justify-between text-[11px] font-medium text-white">
                      <span>
                        {Math.min(Math.round(cp.progress), cp.challenge.targetValue)} / {cp.challenge.targetValue}
                      </span>
                      <span className="font-bold">{Math.round(pct)}%</span>
                    </div>
                    <ProgressBar value={pct} color="sunshine" size="sm" />
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-white/90">
                      <FontAwesomeIcon icon={faUsers} className="h-2.5 w-2.5" aria-hidden />
                      {cp.challenge._count.participants} participants
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-5 text-center">
              <p className="mb-3 text-sm text-slate">No active challenges joined yet.</p>
              <Button variant="primary" size="sm" href="/challenges">
                Browse Challenges
              </Button>
            </div>
          )}
        </Card>
      </FadeIn>
    </div>
  );
}
