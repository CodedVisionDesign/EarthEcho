"use client";

import { useCallback } from "react";
import { WeeklyTrendChart } from "./WeeklyTrendChart";
import { fetchTrendData } from "@/lib/dashboard-actions";
import type { TrendDataPoint } from "@/lib/queries";

interface DashboardTrendChartProps {
  initialData: TrendDataPoint[];
}

export function DashboardTrendChart({ initialData }: DashboardTrendChartProps) {
  const handleRangeChange = useCallback(async (days: number) => {
    return fetchTrendData(days);
  }, []);

  return (
    <WeeklyTrendChart
      data={initialData}
      onRangeChange={handleRangeChange}
    />
  );
}
