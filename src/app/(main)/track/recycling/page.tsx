import { getCurrentUser, getUserActivities, getUserCategoryTotal, getUserCategoryDailyTrend, getUserCategoryTrend, getUserActivityTypeBreakdown } from "@/lib/queries";
import { toHumanReadable, type MetricCategory } from "@/lib/metrics/converters";
import { CATEGORIES } from "@/lib/categories";
import { faRecycle } from "@/lib/fontawesome";
import { RunningTotalBanner } from "@/components/tracking/RunningTotalBanner";
import { ActivityLogForm } from "@/components/tracking/ActivityLogForm";
import { ActivityHistoryTable } from "@/components/tracking/ActivityHistoryTable";
import { CategoryChart } from "@/components/tracking/CategoryChart";
import { ActivityTypeChart } from "@/components/tracking/ActivityTypeChart";

export default async function RecyclingTrackingPage() {
  const user = await getCurrentUser();
  const category = "RECYCLING" as const;
  const config = CATEGORIES[category];

  const [activities, total, trendData, weekTrend, typeBreakdown] = await Promise.all([
    getUserActivities(user.id, category, { limit: 50 }),
    getUserCategoryTotal(user.id, category),
    getUserCategoryDailyTrend(user.id, category, 30),
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
        icon={faRecycle}
        label={config.label}
        humanValue={humanMetric.value}
        comparison={humanMetric.comparison}
        calculationTooltip={humanMetric.tooltip}
        iconBg="bg-leaf/10"
        iconColor="text-leaf"
        gradient="from-leaf via-leaf/90 to-forest"
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
        />
        <CategoryChart data={trendData} color="#52B788" label={config.label} category={category} unitLabel={config.unitLabel} />
      </div>
      {typeBreakdown.length > 0 && (
        <ActivityTypeChart
          data={typeBreakdown.map((t) => ({
            ...t,
            label: config.activityTypes.find((at) => at.value === t.type)?.label ?? t.type.replace(/_/g, " "),
          }))}
          color="#52B788"
          unitLabel={config.unitLabel}
        />
      )}
      <ActivityHistoryTable activities={serializedActivities} unitLabel={config.unitLabel} />
    </div>
  );
}
