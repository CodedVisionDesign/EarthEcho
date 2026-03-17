import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faDroplet,
  faFire,
  faRecycle,
  faCar,
  faShirt,
  faBagShopping,
  faArrowUpRightFromSquare,
  faRocket,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { getCurrentUser, getResources, getUserProfile } from "@/lib/queries";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: IconDefinition; color: string; iconColor: string }
> = {
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
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-ocean via-ocean/90 to-forest/70 p-6 text-white shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <FontAwesomeIcon icon={faLink} className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Resources
              </h1>
              <p className="text-sm text-white/70">
                Curated guides and tools to help reduce your environmental footprint
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

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
      {!activeCategory && recommendedResourceCat && (() => {
        const recommended = resources.filter(
          (r) => r.category === recommendedResourceCat
        ).slice(0, 3);
        if (recommended.length === 0) return null;
        const catConfig = CATEGORY_CONFIG[recommendedResourceCat];
        return (
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faRocket} className="h-3.5 w-3.5 text-forest" aria-hidden />
              <h2 className="text-sm font-semibold text-charcoal">
                Recommended for You
              </h2>
              {catConfig && (
                <Badge variant="forest" size="sm">
                  Based on your {catConfig.label.toLowerCase()} activity
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommended.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} recommended />
              ))}
            </div>
          </div>
        );
      })()}

      {/* Resources */}
      {resources.length === 0 ? (
        <Card variant="default" className="p-8 text-center">
          <p className="text-sm text-slate">
            No resources found{activeCategory ? ` for "${CATEGORY_CONFIG[activeCategory]?.label ?? activeCategory}"` : ""}. Check back soon!
          </p>
        </Card>
      ) : activeCategory ? (
        /* Single category view */
        <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-2" stagger={0.05}>
          {resources.map((resource) => (
            <StaggerItem key={resource.id}>
              <ResourceCard resource={resource} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        /* All categories grouped */
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([cat, items]) => {
            const config = CATEGORY_CONFIG[cat];
            return (
              <section key={cat}>
                <div className="mb-4 flex items-center gap-3">
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
                <StaggerGroup className="grid grid-cols-1 gap-4 md:grid-cols-2" stagger={0.05}>
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
  resource: { id: string; name: string; description: string; url: string };
  recommended?: boolean;
}) {
  const domain = getDomain(resource.url);

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card
        variant="interactive"
        className={`flex h-full flex-col justify-between p-5 ${recommended ? "border-forest/20 ring-1 ring-forest/10" : ""}`}
      >
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
              alt=""
              className="h-4 w-4 rounded-sm"
              width={16}
              height={16}
            />
            <span className="text-[11px] text-slate">{domain}</span>
          </div>
          <h3 className="text-[15px] font-semibold text-charcoal">
            {resource.name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate">
            {resource.description}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-forest">
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-3 w-3" aria-hidden />
          Visit Resource
        </div>
      </Card>
    </a>
  );
}
