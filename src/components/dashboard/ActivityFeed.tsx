"use client";

import { useState, useCallback, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
  faLeaf,
  faArrowsUpDown,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { fetchActivities, type SerializedActivity } from "@/lib/dashboard-actions";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const CATEGORY_META: Record<string, { icon: IconDefinition; iconBg: string; iconColor: string; label: string }> = {
  WATER: { icon: faDroplet, iconBg: "bg-ocean/10", iconColor: "text-ocean", label: "Water" },
  CARBON: { icon: faEarthAmericas, iconBg: "bg-forest/10", iconColor: "text-forest", label: "Carbon" },
  PLASTIC: { icon: faBagShopping, iconBg: "bg-sunshine/15", iconColor: "text-amber-600", label: "Plastic" },
  RECYCLING: { icon: faRecycle, iconBg: "bg-leaf/10", iconColor: "text-leaf", label: "Recycling" },
  TRANSPORT: { icon: faCar, iconBg: "bg-ocean/10", iconColor: "text-ocean", label: "Transport" },
  FASHION: { icon: faShirt, iconBg: "bg-forest/10", iconColor: "text-forest", label: "Fashion" },
};

const ALL_CATEGORIES = ["WATER", "CARBON", "PLASTIC", "RECYCLING", "TRANSPORT", "FASHION"] as const;

interface ActivityFeedProps {
  initialActivities: SerializedActivity[];
  activityTypeLabels: Record<string, string>;
  unitLabels: Record<string, string>;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export function ActivityFeed({ initialActivities, activityTypeLabels, unitLabels }: ActivityFeedProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortNewest, setSortNewest] = useState(true);
  const [hasMore, setHasMore] = useState(initialActivities.length >= 10);
  const [isPending, startTransition] = useTransition();

  const loadFiltered = useCallback((category: string | null) => {
    startTransition(async () => {
      const data = await fetchActivities({
        category: category ?? undefined,
        limit: 10,
        offset: 0,
      });
      setActivities(data);
      setHasMore(data.length >= 10);
    });
  }, []);

  function handleFilterClick(cat: string) {
    const newFilter = activeFilter === cat ? null : cat;
    setActiveFilter(newFilter);
    loadFiltered(newFilter);
  }

  function handleLoadMore() {
    startTransition(async () => {
      const data = await fetchActivities({
        category: activeFilter ?? undefined,
        limit: 10,
        offset: activities.length,
      });
      if (data.length < 10) setHasMore(false);
      setActivities((prev) => [...prev, ...data]);
    });
  }

  const sorted = sortNewest
    ? [...activities]
    : [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card variant="default" className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-leaf/10">
            <FontAwesomeIcon icon={faLeaf} className="h-4 w-4 text-leaf" aria-hidden />
          </div>
          <h3 className="text-[15px] font-semibold text-charcoal">Recent Activity</h3>
        </div>
        <button
          onClick={() => setSortNewest((p) => !p)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate transition-colors hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faArrowsUpDown} className="h-2.5 w-2.5" aria-hidden />
          {sortNewest ? "Newest" : "Oldest"}
        </button>
      </div>

      {/* Category filter chips */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {ALL_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => handleFilterClick(cat)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                isActive
                  ? "border-forest/30 bg-forest/10 text-forest"
                  : "border-gray-200 bg-white text-slate hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FontAwesomeIcon icon={meta.icon} className="h-2.5 w-2.5" aria-hidden />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Activity list */}
      {isPending ? (
        <div className="py-6 text-center text-sm text-slate">Loading...</div>
      ) : sorted.length > 0 ? (
        <div className="space-y-2">
          {sorted.map((activity) => {
            const meta = CATEGORY_META[activity.category] ?? { icon: faLeaf, iconBg: "bg-gray-100", iconColor: "text-slate" };
            const typeLabel = activityTypeLabels[activity.type] ?? activity.type.replace(/_/g, " ");
            const uLabel = unitLabels[activity.category] ?? activity.unit;
            return (
              <div key={activity.id} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${meta.iconBg}`}>
                  <FontAwesomeIcon icon={meta.icon} className={`h-3 w-3 ${meta.iconColor}`} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-charcoal">{typeLabel}</div>
                  <div className="text-[11px] text-slate">
                    {activity.value} {uLabel.toLowerCase()} &middot; {timeAgo(activity.date)}
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

      {/* Load More */}
      {hasMore && sorted.length > 0 && (
        <div className="mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoadMore}
            loading={isPending}
            className="w-full"
          >
            Load More
          </Button>
        </div>
      )}
    </Card>
  );
}
