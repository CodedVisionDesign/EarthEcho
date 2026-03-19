import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faFire,
  faRecycle,
  faCar,
  faBagShopping,
  faShirt,
  faArrowUpRightFromSquare,
  faRocket,
  faTree,
  faGlobe,
  faChartLine,
  faSeedling,
  faRotateRight,
  faLeaf,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { getCurrentUser, getResources, getUserProfile } from "@/lib/queries";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const CATEGORY_CONFIG: Record<
  string,
  {
    label: string;
    icon: IconDefinition;
    color: string;
    iconColor: string;
    description?: string;
    cta?: string;
  }
> = {
  // Original categories
  energy: {
    label: "Energy",
    icon: faFire,
    color: "bg-coral/10",
    iconColor: "text-coral",
  },
  water: {
    label: "Water",
    icon: faDroplet,
    color: "bg-ocean/10",
    iconColor: "text-ocean",
  },
  recycling: {
    label: "Recycling",
    icon: faRecycle,
    color: "bg-leaf/10",
    iconColor: "text-leaf",
  },
  transport: {
    label: "Transport",
    icon: faCar,
    color: "bg-ocean/10",
    iconColor: "text-ocean",
  },
  shopping: {
    label: "Shopping",
    icon: faBagShopping,
    color: "bg-sunshine/15",
    iconColor: "text-amber-600",
  },
  food_waste: {
    label: "Food Waste",
    icon: faShirt,
    color: "bg-forest/10",
    iconColor: "text-forest",
  },
  // Sustainable Living Hub categories
  recycling_tools: {
    label: "Recycling Tools",
    icon: faRecycle,
    color: "bg-leaf/10",
    iconColor: "text-leaf",
    description:
      "Practical tools and gadgets to make recycling at home easier and more effective.",
    cta: "Explore",
  },
  wildlife: {
    label: "Wildlife & Environment",
    icon: faTree,
    color: "bg-forest/10",
    iconColor: "text-forest",
    description:
      "Support UK conservation charities protecting birds, bees, butterflies, and woodland habitats.",
    cta: "Support",
  },
  ethical_shopping: {
    label: "Ethical / Fair Trade",
    icon: faGlobe,
    color: "bg-ocean/10",
    iconColor: "text-ocean",
    description:
      "Shop with purpose — fair trade, ethical, and socially responsible brands that make a difference.",
    cta: "Shop",
  },
  impact_investing: {
    label: "Impact Investing",
    icon: faChartLine,
    color: "bg-sunshine/15",
    iconColor: "text-amber-600",
    description:
      "Put your money to work for good through microloans and community investment platforms.",
    cta: "Invest",
  },
  vegan: {
    label: "Vegan & Plant-Based",
    icon: faSeedling,
    color: "bg-forest/10",
    iconColor: "text-forest-light",
    description:
      "Recipes, resources, and meal kits to help you explore plant-based living at your own pace.",
    cta: "Discover",
  },
  reduce_waste: {
    label: "Reduce Waste & Second-Hand",
    icon: faRotateRight,
    color: "bg-leaf/10",
    iconColor: "text-leaf",
    description:
      "Buy second-hand, shop wonky, and choose refurbished — small changes that cut waste dramatically.",
    cta: "Browse",
  },
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG);

// Map tracking categories to resource categories for recommendations
const ACTIVITY_TO_RESOURCE: Record<string, string> = {
  WATER: "water",
  CARBON: "energy",
  PLASTIC: "shopping",
  RECYCLING: "recycling",
  TRANSPORT: "transport",
  FASHION: "shopping",
};

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: activeCategory } = await searchParams;
  const [resources, user] = await Promise.all([
    getResources(activeCategory),
    getCurrentUser(),
  ]);
  const profile = await getUserProfile(user.id);

  // Determine recommended resource category from user's top activity
  const topActivityCategory = Object.entries(profile.categoryBreakdown)
    .filter(([, total]) => total > 0)
    .sort(([, a], [, b]) => b - a)[0]?.[0];
  const recommendedResourceCat = topActivityCategory
    ? ACTIVITY_TO_RESOURCE[topActivityCategory]
    : null;

  // Group resources by category
  const grouped = new Map<string, typeof resources>();
  for (const resource of resources) {
    const cat = resource.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(resource);
  }

  return (
    <div>
      {/* Header */}
      <FadeIn variant="fade-up">
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-forest via-forest/90 to-ocean/70 p-6 text-white shadow-lg md:p-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <FontAwesomeIcon
                icon={faLeaf}
                className="h-5 w-5"
                aria-hidden
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Sustainable Living Hub
              </h1>
              <p className="text-sm text-white/70">
                Curated organisations, tools, and shops to help you live more
                sustainably
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Cross-link to Eco App Directory */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-forest/10 bg-forest/5 px-4 py-3">
        <p className="text-sm text-charcoal">
          Looking for eco-friendly mobile apps?
        </p>
        <a
          href="/apps"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition-colors hover:text-forest-light"
        >
          Browse App Directory
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" aria-hidden />
        </a>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        <a
          href="/resources"
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            !activeCategory
              ? "bg-forest text-white"
              : "bg-gray-100 text-slate hover:bg-gray-200"
          }`}
        >
          All
        </a>
        {CATEGORIES.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const isActive = activeCategory === cat;
          return (
            <a
              key={cat}
              href={`/resources?category=${cat}`}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-forest text-white"
                  : "bg-gray-100 text-slate hover:bg-gray-200"
              }`}
            >
              <FontAwesomeIcon
                icon={config.icon}
                className={`h-3 w-3 ${isActive ? "text-white" : config.iconColor}`}
                aria-hidden
              />
              {config.label}
            </a>
          );
        })}
      </div>

      {/* Recommended for you */}
      {!activeCategory &&
        recommendedResourceCat &&
        (() => {
          const recommended = resources
            .filter((r) => r.category === recommendedResourceCat)
            .slice(0, 3);
          if (recommended.length === 0) return null;
          const catConfig = CATEGORY_CONFIG[recommendedResourceCat];
          return (
            <div className="mb-10">
              <div className="mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faRocket}
                  className="h-3.5 w-3.5 text-forest"
                  aria-hidden
                />
                <h2 className="text-sm font-semibold text-charcoal">
                  Recommended for You
                </h2>
                {catConfig && (
                  <Badge variant="forest" size="sm">
                    Based on your {catConfig.label.toLowerCase()} activity
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    recommended
                  />
                ))}
              </div>
            </div>
          );
        })()}

      {/* Resources */}
      {resources.length === 0 ? (
        <Card variant="default" className="p-8 text-center">
          <p className="text-sm text-slate">
            No resources found
            {activeCategory
              ? ` for "${CATEGORY_CONFIG[activeCategory]?.label ?? activeCategory}"`
              : ""}
            . Check back soon!
          </p>
        </Card>
      ) : activeCategory ? (
        /* Single category view */
        <div>
          {CATEGORY_CONFIG[activeCategory]?.description && (
            <p className="mb-6 text-sm leading-relaxed text-slate">
              {CATEGORY_CONFIG[activeCategory].description}
            </p>
          )}
          <StaggerGroup
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.05}
          >
            {resources.map((resource) => (
              <StaggerItem key={resource.id}>
                <ResourceCard resource={resource} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      ) : (
        /* All categories grouped */
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([cat, items]) => {
            const config = CATEGORY_CONFIG[cat];
            return (
              <section key={cat}>
                <div className="mb-2 flex items-center gap-3">
                  {config && (
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.color}`}
                    >
                      <FontAwesomeIcon
                        icon={config.icon}
                        className={`h-4 w-4 ${config.iconColor}`}
                        aria-hidden
                      />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-charcoal">
                    {config?.label ?? cat}
                  </h2>
                </div>
                {config?.description && (
                  <p className="mb-4 ml-12 text-sm text-slate">
                    {config.description}
                  </p>
                )}
                <StaggerGroup
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  stagger={0.05}
                >
                  {items.map((resource) => (
                    <StaggerItem key={resource.id}>
                      <ResourceCard resource={resource} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResourceCard({
  resource,
  recommended,
}: {
  resource: {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    image?: string | null;
  };
  recommended?: boolean;
}) {
  const domain = getDomain(resource.url);
  const catConfig = CATEGORY_CONFIG[resource.category];
  const ctaText = catConfig?.cta ?? "Visit";

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <Card
        variant="interactive"
        className={`flex h-full flex-col justify-between p-5 transition-shadow duration-300 group-hover:shadow-md ${recommended ? "border-forest/20 ring-1 ring-forest/10" : ""}`}
      >
        <div className="mb-4">
          {/* Logo / Favicon row */}
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ${catConfig?.color ?? "bg-gray-100"}`}
            >
              {resource.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={resource.image}
                  alt=""
                  className="h-6 w-6 rounded object-contain"
                  width={24}
                  height={24}
                  loading="lazy"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                  alt=""
                  className="h-5 w-5 rounded-sm"
                  width={20}
                  height={20}
                  loading="lazy"
                />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold text-charcoal">
                {resource.name}
              </h3>
              <span className="text-[11px] text-slate">{domain}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-slate">
            {resource.description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-forest transition-colors group-hover:text-forest-light">
          <span>{ctaText}</span>
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </div>
      </Card>
    </a>
  );
}
