import { getCurrentUser, getUserActivities, getUserCategoryTotal, getUserCategoryDailyTrend, getUserCategoryTrend, getUserActivityTypeBreakdown } from "@/lib/queries";
import { toHumanReadable, type MetricCategory } from "@/lib/metrics/converters";
import { CATEGORIES } from "@/lib/categories";
import { faCar } from "@/lib/fontawesome";
import { db } from "@/lib/db";
import { RunningTotalBanner } from "@/components/tracking/RunningTotalBanner";
import { ActivityLogForm } from "@/components/tracking/ActivityLogForm";
import { ActivityHistoryTable } from "@/components/tracking/ActivityHistoryTable";
import { CategoryChart } from "@/components/tracking/CategoryChart";
import { ActivityTypeChart } from "@/components/tracking/ActivityTypeChart";

export default async function TransportTrackingPage() {
  const user = await getCurrentUser();
  const category = "TRANSPORT" as const;
  const config = CATEGORIES[category];

  const [activities, total, trendData, transportModes, weekTrend, typeBreakdown] = await Promise.all([
    getUserActivities(user.id, category, { limit: 50 }),
    getUserCategoryTotal(user.id, category),
    getUserCategoryDailyTrend(user.id, category, 30),
    db.transportMode.findMany({ orderBy: { co2PerKm: "asc" } }),
    getUserCategoryTrend(user.id, category),
    getUserActivityTypeBreakdown(user.id, category),
  ]);

  const humanMetric = toHumanReadable(category as MetricCategory, total);

  const serializedActivities = activities.map((a) => ({
    id: a.id,
    type: a.type,
    value: a.value,
    unit: a.unit,
    date: a.date.toISOString(),
    note: a.note ?? undefined,
    transportMode: a.transportMode ?? undefined,
    distanceKm: a.distanceKm ?? undefined,
  }));

  return (
    <div className="space-y-6">
      <RunningTotalBanner
        icon={faCar}
        label={config.label}
        humanValue={humanMetric.value}
        comparison={humanMetric.comparison}
        calculationTooltip={humanMetric.tooltip}
        iconBg="bg-ocean/10"
        iconColor="text-ocean"
        gradient="from-ocean via-ocean/90 to-forest/60"
        rawTotal={total}
        trend={weekTrend}
        unit={config.unit}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityLogForm
          category={category}
          activityTypes={config.activityTypes}
          unit={config.unit}
          unitLabel={config.unitLabel}
          transportModes={transportModes.map((m) => ({ slug: m.slug, name: m.name, co2PerKm: m.co2PerKm }))}
        />
        <CategoryChart data={trendData} color="#1B4965" label={config.label} category={category} unitLabel={config.unitLabel} />
      </div>
      {typeBreakdown.length > 0 && (
        <ActivityTypeChart
          data={typeBreakdown.map((t) => ({
            ...t,
            label: config.activityTypes.find((at) => at.value === t.type)?.label ?? t.type.replace(/_/g, " "),
          }))}
          color="#1B4965"
          unitLabel={config.unitLabel}
        />
      )}
      <ActivityHistoryTable activities={serializedActivities} unitLabel={config.unitLabel} />
    </div>
  );
}
