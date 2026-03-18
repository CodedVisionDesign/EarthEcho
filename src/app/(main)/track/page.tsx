import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
} from "@/lib/fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Card } from "@/components/ui/Card";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { getCurrentUser, getUserCategoryTotal } from "@/lib/queries";
import { toHumanReadable, type MetricCategory } from "@/lib/metrics/converters";
import type { ActivityCategory } from "@/lib/categories";

interface CategoryCard {
  href: string;
  label: string;
  description: string;
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
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
    category: "WATER",
  },
  {
    href: "/track/carbon",
    label: "Carbon",
    description: "Track kg CO\u2082 reduced",
    icon: faEarthAmericas,
    iconBg: "bg-forest/10",
    iconColor: "text-forest",
    category: "CARBON",
  },
  {
    href: "/track/plastic",
    label: "Plastic",
    description: "Track plastic items avoided",
    icon: faBagShopping,
    iconBg: "bg-amber/10",
    iconColor: "text-amber",
    category: "PLASTIC",
  },
  {
    href: "/track/recycling",
    label: "Recycling",
    description: "Track kg of materials recycled",
    icon: faRecycle,
    iconBg: "bg-leaf/10",
    iconColor: "text-leaf",
    category: "RECYCLING",
  },
  {
    href: "/track/transport",
    label: "Transport",
    description: "Track green km travelled",
    icon: faCar,
    iconBg: "bg-ocean-light/10",
    iconColor: "text-ocean-light",
    category: "TRANSPORT",
  },
  {
    href: "/track/shopping",
    label: "Fashion",
    description: "Track sustainable fashion choices",
    icon: faShirt,
    iconBg: "bg-forest-light/10",
    iconColor: "text-forest-light",
    category: "FASHION",
  },
];

export default async function TrackHubPage() {
  const user = await getCurrentUser();

  const totals = await Promise.all(
    CATEGORY_CARDS.map(async (card) => {
      const total = await getUserCategoryTotal(user.id, card.category);
      const human = toHumanReadable(card.category as MetricCategory, total);
      return { category: card.category, value: human.value };
    })
  );

  const totalMap = Object.fromEntries(
    totals.map((t) => [t.category, t.value])
  );

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

      <StaggerGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {CATEGORY_CARDS.map((card) => (
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
                  <div className="text-lg font-bold text-charcoal/80">
                    {totalMap[card.category] || "0"}
                  </div>
                </div>
              </Card>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
