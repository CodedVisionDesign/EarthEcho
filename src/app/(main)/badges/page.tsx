import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
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
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { getCurrentUser, getUserBadgesWithProgress } from "@/lib/queries";
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
  streak: "Streak Achievements",
  impact: "Impact Milestones",
  transport: "Transport Champions",
  challenge: "Challenge Awards",
  community: "Community Spirit",
};

const CATEGORY_ORDER = ["starter", "streak", "impact", "transport", "challenge", "community"];

const UNIT_LABELS: Record<string, string> = {
  WATER: "litres",
  CARBON: "kg CO\u2082",
  PLASTIC: "items",
  RECYCLING: "kg",
  TRANSPORT: "km",
  FASHION: "items",
};

const MODE_LABELS: Record<string, string> = {
  cycling: "cycling",
  walking: "walking",
  ev: "EV",
  train: "train",
  bus: "bus",
};

function getNudgeText(criteria: string, progress: number): string | null {
  if (progress >= 100 || progress <= 0) return null;
  try {
    const c = JSON.parse(criteria);
    const remaining = Math.max(0, 100 - progress);
    switch (c.type) {
      case "first_activity":
        return "Log your first activity to earn this!";
      case "profile_complete":
        return "Complete your profile to earn this badge";
      case "first_post":
        return "Make your first forum post to earn this!";
      case "streak": {
        const daysLeft = Math.ceil((c.days * remaining) / 100);
        return `${daysLeft} more day${daysLeft !== 1 ? "s" : ""} to go`;
      }
      case "total": {
        const left = Math.ceil((c.value * remaining) / 100);
        const unit = UNIT_LABELS[c.category] ?? "units";
        return `${left.toLocaleString()} more ${unit} to go`;
      }
      case "transport_distance": {
        const kmLeft = Math.ceil((c.km * remaining) / 100);
        const mode = MODE_LABELS[c.mode] ?? c.mode;
        return `${kmLeft} more km ${mode} to go`;
      }
      case "transport_count": {
        const tripsLeft = Math.ceil((c.count * remaining) / 100);
        const mode = MODE_LABELS[c.mode] ?? c.mode;
        return `${tripsLeft} more ${mode} trip${tripsLeft !== 1 ? "s" : ""} to go`;
      }
      case "challenges_completed": {
        const left = Math.ceil((c.count * remaining) / 100);
        return `Complete ${left} more challenge${left !== 1 ? "s" : ""}`;
      }
      case "reactions_received": {
        const left = Math.ceil((c.count * remaining) / 100);
        return `${left} more '${c.reaction}' reaction${left !== 1 ? "s" : ""} needed`;
      }
      case "posts_count": {
        const left = Math.ceil((c.count * remaining) / 100);
        return `${left} more post${left !== 1 ? "s" : ""} to go`;
      }
      case "car_free_streak": {
        const daysLeft = Math.ceil((c.days * remaining) / 100);
        return `Keep going car-free! ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`;
      }
      case "flight_free_streak": {
        const daysLeft = Math.ceil((c.days * remaining) / 100);
        return `Stay flight-free! ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export default async function BadgesPage() {
  const user = await getCurrentUser();
  const badges = await getUserBadgesWithProgress(user.id);

  // Group badges by category
  const grouped = new Map<string, typeof badges>();
  for (const badge of badges) {
    const cat = badge.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(badge);
  }

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div>
      {/* Header */}
      <FadeIn variant="fade-up">
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-sunshine/90 via-amber-500 to-amber-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <FontAwesomeIcon icon={faAward} className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Badges
                </h1>
                <p className="text-sm text-white/70">
                  Earn badges by tracking activities and reaching milestones
                </p>
              </div>
            </div>
            <div className="shrink-0 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold backdrop-blur-sm">
              {earnedCount} / {badges.length} earned
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Badge Sections */}
      <div className="space-y-10">
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped.get(cat);
          if (!items || items.length === 0) return null;

          return (
            <section key={cat}>
              <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-charcoal">
                {CATEGORY_LABELS[cat] ?? cat}
                <span className="h-px flex-1 bg-gray-200" />
              </h2>
              <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-2" stagger={0.05}>
                {items.map((badge) => {
                  const iconStyle = BADGE_ICON_MAP[badge.icon] ?? {
                    icon: faMedal,
                    color: "bg-gray-100 text-gray-600",
                  };
                  const rarity = RARITY_STYLES[badge.rarity] ?? RARITY_STYLES.common;

                  return (
                    <StaggerItem key={badge.id}>
                    <Card
                      variant="default"
                      className={`p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${!badge.earned ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            badge.earned ? iconStyle.color : "bg-gray-100 text-gray-400"
                          } ${!badge.earned ? "grayscale" : ""}`}
                        >
                          <FontAwesomeIcon
                            icon={iconStyle.icon}
                            className="h-5 w-5"
                            aria-hidden
                          />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-[15px] font-semibold text-charcoal">
                              {badge.name}
                            </span>
                            <Badge variant={rarity.variant} size="sm">
                              {rarity.label}
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed text-slate">
                            {badge.description}
                          </p>

                          {badge.earned && badge.earnedAt ? (
                            <p className="mt-2 text-xs font-medium text-forest">
                              Earned{" "}
                              {badge.earnedAt.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          ) : (() => {
                            const nudge = getNudgeText(badge.criteria, badge.progress);
                            return (
                              <div className="mt-3">
                                <div className="mb-1 flex justify-between text-xs text-slate">
                                  <span>{nudge ?? "Progress"}</span>
                                  <span className="font-medium">{badge.progress}%</span>
                                </div>
                                <ProgressBar
                                  value={badge.progress}
                                  color={badge.progress >= 75 ? "sunshine" : "forest"}
                                  size="sm"
                                />
                                {badge.progress >= 75 && (
                                  <p className="mt-1 text-[11px] font-medium text-amber-600">
                                    Almost there!
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </Card>
                    </StaggerItem>

                  );
                })}
              </StaggerGroup>
            </section>
          );
        })}
      </div>
    </div>
  );
}
