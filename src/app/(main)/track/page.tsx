import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
  faArrowTrendUp,
  faArrowTrendDown,
  faLeaf,
} from "@/lib/fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { getCurrentUser, getUserCategoryTotal, getUserCategorySparkline, getUserCategoryTrend } from "@/lib/queries";
import { toHumanReadable, type MetricCategory } from "@/lib/metrics/converters";
import type { ActivityCategory } from "@/lib/categories";
import { TrackHubSparkline } from "@/components/tracking/TrackHubSparkline";

interface CategoryCard {
  href: string;
  label: string;
  description: string;
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  category: ActivityCategory;
}

const CATEGORY_CARDS: CategoryCard[] = [
  {
    href: "/track/water",
    label: "Water",
    description: "Track litres of water saved",
    icon: faDroplet,
    iconBg: "bg-ocean/10",
    iconColor: "text-ocean",
    accentColor: "#1B4965",
    category: "WATER",
  },
  {
    href: "/track/carbon",
    label: "Carbon",
    description: "Track kg CO\u2082 reduced",
    icon: faEarthAmericas,
    iconBg: "bg-forest/10",
    iconColor: "text-forest",
    accentColor: "#2D6A4F",
    category: "CARBON",
  },
  {
    href: "/track/plastic",
    label: "Plastic",
    description: "Track plastic items avoided",
    icon: faBagShopping,
    iconBg: "bg-amber/10",
    iconColor: "text-amber",
    accentColor: "#FFB703",
    category: "PLASTIC",
  },
  {
    href: "/track/recycling",
    label: "Recycling",
    description: "Track kg of materials recycled",
    icon: faRecycle,
    iconBg: "bg-leaf/10",
    iconColor: "text-leaf",
    accentColor: "#52B788",
    category: "RECYCLING",
  },
  {
    href: "/track/transport",
    label: "Transport",
    description: "Track green km travelled",
    icon: faCar,
    iconBg: "bg-ocean-light/10",
    iconColor: "text-ocean-light",
    accentColor: "#1B4965",
    category: "TRANSPORT",
  },
  {
    href: "/track/shopping",
    label: "Fashion",
    description: "Track sustainable fashion choices",
    icon: faShirt,
    iconBg: "bg-forest-light/10",
    iconColor: "text-forest-light",
    accentColor: "#2D6A4F",
    category: "FASHION",
  },
];

export default async function TrackHubPage() {
  const user = await getCurrentUser();

  const totals = await Promise.all(
    CATEGORY_CARDS.map(async (card) => {
      const [total, sparkline, trend] = await Promise.all([
        getUserCategoryTotal(user.id, card.category),
        getUserCategorySparkline(user.id, card.category, 7),
        getUserCategoryTrend(user.id, card.category),
      ]);
      const human = toHumanReadable(card.category as MetricCategory, total);
      return { category: card.category, value: human.value, sparkline, trend };
    })
  );

  const dataMap = Object.fromEntries(
    totals.map((t) => [t.category, t])
  );

  // Find which category has been least active (for suggestion)
  const totalActivities = totals.reduce((sum, t) => sum + t.sparkline.reduce((a, b) => a + b, 0), 0);
  const leastActive = [...totals].sort((a, b) =>
    a.sparkline.reduce((s, v) => s + v, 0) - b.sparkline.reduce((s, v) => s + v, 0)
  )[0];
  const leastActiveCard = CATEGORY_CARDS.find((c) => c.category === leastActive?.category);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Track Your Impact</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Choose a category to log your sustainable actions
          </p>
        </div>
      </FadeIn>

      {/* Overall impact summary bar */}
      {totalActivities > 0 && (
        <FadeIn delay={0.05}>
          <div className="flex items-center gap-3 rounded-xl border border-forest/10 bg-forest/5 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest/10">
              <FontAwesomeIcon icon={faLeaf} className="h-4 w-4 text-forest" aria-hidden />
            </div>
            <div className="flex-1 text-sm text-charcoal">
              <span className="font-semibold">This week:</span>{" "}
              You&apos;ve been active across{" "}
              <span className="font-bold text-forest">
                {totals.filter((t) => t.sparkline.some((v) => v > 0)).length}
              </span>{" "}
              categories
              {leastActiveCard && leastActive.sparkline.every((v) => v === 0) && (
                <span className="text-slate">
                  {" "}&middot; Try logging some <Link href={leastActiveCard.href} className="font-medium text-forest underline decoration-forest/30 hover:decoration-forest">{leastActiveCard.label.toLowerCase()}</Link> activity!
                </span>
              )}
            </div>
          </div>
        </FadeIn>
      )}

      <StaggerGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {CATEGORY_CARDS.map((card) => {
          const data = dataMap[card.category];
          const hasSparkline = data?.sparkline.some((v) => v > 0);
          return (
            <StaggerItem key={card.href}>
              <Link href={card.href} className="block">
                <Card className="group relative overflow-hidden p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex flex-col items-center text-center gap-2">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg} transition-transform duration-200 group-hover:scale-110`}
                    >
                      <FontAwesomeIcon
                        icon={card.icon}
                        className={`h-5 w-5 ${card.iconColor}`}
                        aria-hidden
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-charcoal">
                        {card.label}
                      </h3>
                      <p className="mt-0.5 text-xs text-charcoal/50 hidden sm:block">
                        {card.description}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-charcoal/80">
                        {data?.value || "0"}
                      </span>
                      {data && data.trend !== 0 && (
                        <Badge
                          variant={data.trend > 0 ? "success" : "danger"}
                          size="sm"
                        >
                          <FontAwesomeIcon
                            icon={data.trend > 0 ? faArrowTrendUp : faArrowTrendDown}
                            className="h-2 w-2"
                            aria-hidden
                          />
                          {data.trend > 0 ? "+" : ""}{data.trend}%
                        </Badge>
                      )}
                    </div>

                    {/* Mini sparkline */}
                    {hasSparkline && (
                      <div className="h-6 w-full opacity-50 transition-opacity group-hover:opacity-80">
                        <TrackHubSparkline data={data.sparkline} color={card.accentColor} />
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </div>
  );
}
