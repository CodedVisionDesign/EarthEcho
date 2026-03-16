import { getCurrentUser, getUserActivities, getUserCategoryTotal, getUserCategoryDailyTrend } from "@/lib/queries";
import { toHumanReadable, type MetricCategory } from "@/lib/metrics/converters";
import { CATEGORIES } from "@/lib/categories";
import { faDroplet } from "@/lib/fontawesome";
import { RunningTotalBanner } from "@/components/tracking/RunningTotalBanner";
import { ActivityLogForm } from "@/components/tracking/ActivityLogForm";
import { ActivityHistoryTable } from "@/components/tracking/ActivityHistoryTable";
import { CategoryChart } from "@/components/tracking/CategoryChart";

export default async function WaterTrackingPage() {
  const user = await getCurrentUser();
  const category = "WATER" as const;
  const config = CATEGORIES[category];

  const [activities, total, trendData] = await Promise.all([
    getUserActivities(user.id, category, { limit: 50 }),
    getUserCategoryTotal(user.id, category),
    getUserCategoryDailyTrend(user.id, category, 30),
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
        icon={faDroplet}
        label={config.label}
        humanValue={humanMetric.value}
        comparison={humanMetric.comparison}
        iconBg="bg-ocean/10"
        iconColor="text-ocean"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityLogForm
          category={category}
          activityTypes={config.activityTypes}
          unit={config.unit}
          unitLabel={config.unitLabel}
        />
        <CategoryChart data={trendData} color="#1B4965" label={config.label} />
      </div>
      <ActivityHistoryTable activities={serializedActivities} unitLabel={config.unitLabel} />
    </div>
  );
}
