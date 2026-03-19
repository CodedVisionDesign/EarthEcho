"use server";

import { auth } from "./auth";
import { getUserTrendByRange, getUserActivities, getUserCategoryDailyTrend, getChallengeLeaderboard, type TrendDataPoint } from "./queries";
import type { ActivityCategory } from "./categories";

export async function fetchTrendData(days: number): Promise<TrendDataPoint[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  return getUserTrendByRange(session.user.id, days);
}

export interface SerializedActivity {
  id: string;
  category: string;
  type: string;
  value: number;
  unit: string;
  date: string;
  note: string | null;
}

export async function fetchActivities(options: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<SerializedActivity[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const activities = await getUserActivities(
    session.user.id,
    options.category ? (options.category as ActivityCategory) : undefined,
    { limit: options.limit ?? 10, offset: options.offset ?? 0 }
  );

  return activities.map((a) => ({
    id: a.id,
    category: a.category,
    type: a.type,
    value: a.value,
    unit: a.unit,
    date: a.date.toISOString(),
    note: a.note,
  }));
}

export async function fetchCategoryTrend(
  category: string,
  days: number
): Promise<Array<{ date: string; value: number }>> {
  const session = await auth();
  if (!session?.user?.id) return [];
  return getUserCategoryDailyTrend(session.user.id, category as ActivityCategory, days);
}
