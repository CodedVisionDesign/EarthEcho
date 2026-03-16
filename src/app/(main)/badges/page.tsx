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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal">
            Badges
          </h1>
          <p className="mt-1 text-sm text-slate">
            Earn badges by tracking activities and reaching milestones
          </p>
        </div>
        <Badge variant="forest" size="md">
          <FontAwesomeIcon icon={faAward} className="h-3 w-3" aria-hidden />
          {earnedCount} / {badges.length} earned
        </Badge>
      </div>

      {/* Badge Sections */}
      <div className="space-y-10">
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped.get(cat);
          if (!items || items.length === 0) return null;

          return (
            <section key={cat}>
              <h2 className="mb-4 text-lg font-semibold text-charcoal">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {items.map((badge) => {
                  const iconStyle = BADGE_ICON_MAP[badge.icon] ?? {
                    icon: faMedal,
                    color: "bg-gray-100 text-gray-600",
                  };
                  const rarity = RARITY_STYLES[badge.rarity] ?? RARITY_STYLES.common;

                  return (
                    <Card
                      key={badge.id}
                      variant="default"
                      className={`p-5 ${!badge.earned ? "opacity-70" : ""}`}
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
                          ) : (
                            <div className="mt-3">
                              <div className="mb-1 flex justify-between text-xs text-slate">
                                <span>Progress</span>
                                <span className="font-medium">{badge.progress}%</span>
                              </div>
                              <ProgressBar
                                value={badge.progress}
                                color="forest"
                                size="sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
