import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faDroplet,
  faFire,
  faRecycle,
  faCar,
  faShirt,
  faBagShopping,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getResources } from "@/lib/queries";
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

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: activeCategory } = await searchParams;
  const resources = await getResources(activeCategory);

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-charcoal">
          Resources
        </h1>
        <p className="mt-1 text-sm text-slate">
          Curated guides and tools to help reduce your environmental footprint
        </p>
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

      {/* Resources */}
      {resources.length === 0 ? (
        <Card variant="default" className="p-8 text-center">
          <p className="text-sm text-slate">
            No resources found{activeCategory ? ` for "${CATEGORY_CONFIG[activeCategory]?.label ?? activeCategory}"` : ""}. Check back soon!
          </p>
        </Card>
      ) : activeCategory ? (
        /* Single category view */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {items.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
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
}: {
  resource: { id: string; name: string; description: string; url: string };
}) {
  return (
    <Card variant="interactive" className="flex flex-col justify-between p-5">
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-charcoal">
          {resource.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate">
          {resource.description}
        </p>
      </div>
      <Button
        variant="secondary"
        size="sm"
        leftIcon={faLink}
        href={resource.url}
        className="self-start"
      >
        Visit Resource
      </Button>
    </Card>
  );
}
