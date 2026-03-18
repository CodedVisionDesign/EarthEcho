import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { requireSuperAdmin } from "@/lib/admin";
import { CATEGORIES, type ActivityCategory } from "@/lib/categories";
import {
  getCommunityTotalsByCategory,
  getCommunityImpactOverTime,
  getTopContributors,
  getActivityTypeBreakdown,
  getTransportModeComparison,
  getActivityGrowthTrend,
} from "@/lib/queries";
import { AnalyticsFilters } from "@/components/admin/AnalyticsFilters";
import {
  ImpactOverTimeChart,
  CategoryBreakdownDonut,
  TopContributorsChart,
  ActivityGrowthChart,
  TransportModeChart,
  ActivityTypeChart,
} from "@/components/admin/AnalyticsCharts";
import Link from "next/link";
import { Suspense } from "react";

function getDateRange(range: string, customFrom?: string, customTo?: string): { from: Date; to: Date } {
  const now = new Date();
  const to = new Date(now);
  to.setHours(23, 59, 59, 999);

  const from = new Date(now);
  from.setHours(0, 0, 0, 0);

  switch (range) {
    case "day":
      // Already set to today
      break;
    case "week":
      from.setDate(from.getDate() - 7);
      break;
    case "year":
      from.setFullYear(from.getFullYear() - 1);
      break;
    case "custom":
      if (customFrom) from.setTime(new Date(customFrom).getTime());
      if (customTo) {
        to.setTime(new Date(customTo).getTime());
        to.setHours(23, 59, 59, 999);
      }
      break;
    case "month":
    default:
      from.setDate(from.getDate() - 30);
      break;
  }

  return { from, to };
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; category?: string; from?: string; to?: string }>;
}) {
  await requireSuperAdmin();
  const params = await searchParams;
  const range = params.range || "month";
  const categoryFilter = params.category || "all";
  const { from, to } = getDateRange(range, params.from, params.to);

  const selectedCategory = categoryFilter !== "all" ? categoryFilter : undefined;

  // Fetch all data in parallel
  const [
    categoryTotals,
    impactOverTime,
    topContributors,
    growthTrend,
    transportModes,
    activityTypes,
  ] = await Promise.all([
    getCommunityTotalsByCategory(from, to),
    getCommunityImpactOverTime(from, to, selectedCategory),
    getTopContributors(from, to, selectedCategory, 10),
    getActivityGrowthTrend(from, to, selectedCategory),
    getTransportModeComparison(from, to),
    selectedCategory
      ? getActivityTypeBreakdown(from, to, selectedCategory)
      : Promise.resolve([]),
  ]);

  // Format dates for charts
  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const impactChartData = impactOverTime.map((d) => ({
    ...d,
    date: formatDate(d.date),
  }));

  const activeCategories = selectedCategory
    ? [selectedCategory]
    : [...new Set(impactOverTime.flatMap((d) => Object.keys(d).filter((k) => k !== "date")))];

  const growthChartData = growthTrend.map((d) => ({
    ...d,
    date: formatDate(d.date),
  }));

  // Category breakdown for donut
  const donutData = categoryTotals.map((c) => {
    const cat = CATEGORIES[c.category as ActivityCategory];
    return {
      name: cat?.label?.split(" ")[0] ?? c.category,
      value: Math.round(c.total * 100) / 100,
    };
  });

  // Format transport mode names
  const modeLabels: Record<string, string> = {
    cycling: "Cycling",
    walking: "Walking",
    train: "Train",
    bus: "Bus",
    ev: "EV",
    e_scooter: "E-Scooter",
    hybrid_car: "Hybrid",
    petrol_car: "Petrol",
    diesel_car: "Diesel",
  };

  const transportChartData = transportModes.map((t) => ({
    ...t,
    mode: modeLabels[t.mode] ?? t.mode,
  }));

  // Format activity type names
  const activityTypeData = activityTypes.map((a) => ({
    ...a,
    type: a.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  // Range label for header
  const rangeLabels: Record<string, string> = {
    day: "Today",
    week: "Last 7 Days",
    month: "Last 30 Days",
    year: "Last Year",
    custom: "Custom Range",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean/10">
          <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-ocean" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-charcoal">Community Analytics</h1>
          <p className="text-sm text-slate">
            {rangeLabels[range] ?? "Last 30 Days"} — Platform-wide environmental impact
          </p>
        </div>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <AnalyticsFilters />
      </Suspense>

      {/* Category Overview Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Object.values(CATEGORIES).map((cat) => {
          const data = categoryTotals.find((c) => c.category === cat.key);
          const total = data?.total ?? 0;
          const count = data?.count ?? 0;
          const isSelected = categoryFilter === cat.key;

          return (
            <Link
              key={cat.key}
              href={`/admin/analytics?range=${range}${isSelected ? "" : `&category=${cat.key}`}${range === "custom" && params.from ? `&from=${params.from}` : ""}${range === "custom" && params.to ? `&to=${params.to}` : ""}`}
            >
              <Card
                variant="default"
                className={`p-3 transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-ocean ring-offset-1" : ""
                }`}
              >
                <p className="mb-1 text-lg">{cat.icon}</p>
                <p className="text-xs font-medium text-slate">{cat.label.split(" ")[0]}</p>
                <p className="text-lg font-bold text-charcoal">
                  {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : Math.round(total)}
                </p>
                <p className="text-[10px] text-slate">
                  {count} {count === 1 ? "activity" : "activities"}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ImpactOverTimeChart data={impactChartData} categories={activeCategories} />
        <CategoryBreakdownDonut data={donutData} />
        <TopContributorsChart data={topContributors} />
        <ActivityGrowthChart data={growthChartData} />

        {/* Transport only when no category filter or TRANSPORT selected */}
        {(!selectedCategory || selectedCategory === "TRANSPORT") && transportChartData.length > 0 && (
          <TransportModeChart data={transportChartData} />
        )}

        {/* Activity type breakdown when category selected */}
        {selectedCategory && activityTypeData.length > 0 && (
          <ActivityTypeChart data={activityTypeData} />
        )}
      </div>

      {/* Empty state */}
      {categoryTotals.length === 0 && (
        <Card variant="default" className="p-12 text-center">
          <FontAwesomeIcon icon={faChartLine} className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="text-sm text-slate">No activity data for this time range</p>
        </Card>
      )}
    </div>
  );
}
