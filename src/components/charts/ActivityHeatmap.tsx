"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import type { DailyActivityCount } from "@/lib/queries";

interface ActivityHeatmapProps {
  data: DailyActivityCount[];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

function getIntensity(count: number, max: number): string {
  if (count === 0) return "bg-gray-100";
  const ratio = count / max;
  if (ratio <= 0.25) return "bg-forest/20";
  if (ratio <= 0.5) return "bg-forest/40";
  if (ratio <= 0.75) return "bg-forest/70";
  return "bg-forest";
}

interface CellData {
  date: string;
  count: number;
  categories: string[];
  weekIndex: number;
  dayIndex: number;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const { cells, maxCount, weekCount, monthLabels } = useMemo(() => {
    // Build lookup from data
    const lookup: Record<string, DailyActivityCount> = {};
    for (const d of data) lookup[d.date] = d;

    // Generate grid: 52 weeks ending today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the start: go back ~52 weeks to nearest Sunday
    const totalWeeks = 52;
    const start = new Date(today);
    const todayDow = today.getDay(); // 0=Sun
    start.setDate(start.getDate() - (totalWeeks * 7) - todayDow);

    const cells: CellData[] = [];
    let max = 1;
    const monthPositions: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    const cursor = new Date(start);
    let weekIdx = 0;
    while (cursor <= today) {
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        if (cursor > today) break;

        const month = cursor.getMonth();
        if (month !== lastMonth) {
          monthPositions.push({ label: MONTHS[month], weekIndex: weekIdx });
          lastMonth = month;
        }

        const key = cursor.toISOString().slice(0, 10);
        const entry = lookup[key];
        const count = entry?.count ?? 0;
        if (count > max) max = count;

        cells.push({
          date: key,
          count,
          categories: entry?.categories ?? [],
          weekIndex: weekIdx,
          dayIndex: dayIdx,
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weekIdx++;
    }

    return { cells, maxCount: max, weekCount: weekIdx, monthLabels: monthPositions };
  }, [data]);

  const totalActivities = data.reduce((sum, d) => sum + d.count, 0);
  const activeDays = data.filter((d) => d.count > 0).length;

  return (
    <Card variant="default" className="p-6">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-charcoal">Activity Calendar</h3>
        <div className="flex items-center gap-3 text-[11px] text-slate">
          <span><span className="font-semibold text-charcoal">{totalActivities}</span> activities</span>
          <span><span className="font-semibold text-charcoal">{activeDays}</span> active days</span>
        </div>
      </div>
      <p className="mb-4 text-xs text-slate">Your activity over the past year</p>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-0.5">
          {/* Day labels */}
          <div className="mr-1 flex flex-col gap-0.5 pt-4">
            {DAYS.map((d, i) => (
              <div key={i} className="flex h-[13px] w-6 items-center text-[9px] text-slate">
                {d}
              </div>
            ))}
          </div>

          {/* Weeks grid */}
          <div>
            {/* Month labels */}
            <div className="relative mb-0.5 h-4">
              {monthLabels.map((m, i) => (
                <span
                  key={`${m.label}-${i}`}
                  className="absolute text-[9px] text-slate"
                  style={{ left: m.weekIndex * 15 }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-[2px]">
              {Array.from({ length: weekCount }, (_, wk) => (
                <div key={wk} className="flex flex-col gap-[2px]">
                  {Array.from({ length: 7 }, (_, day) => {
                    const cell = cells.find(
                      (c) => c.weekIndex === wk && c.dayIndex === day
                    );
                    if (!cell) return <div key={day} className="h-[13px] w-[13px]" />;
                    return (
                      <div
                        key={day}
                        className={`h-[13px] w-[13px] rounded-sm ${getIntensity(cell.count, maxCount)} transition-colors hover:ring-1 hover:ring-charcoal/30`}
                        title={`${cell.date}: ${cell.count} ${cell.count === 1 ? "activity" : "activities"}${cell.categories.length > 0 ? ` (${cell.categories.join(", ")})` : ""}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1 text-[9px] text-slate">
        <span>Less</span>
        <div className="h-[11px] w-[11px] rounded-sm bg-gray-100" />
        <div className="h-[11px] w-[11px] rounded-sm bg-forest/20" />
        <div className="h-[11px] w-[11px] rounded-sm bg-forest/40" />
        <div className="h-[11px] w-[11px] rounded-sm bg-forest/70" />
        <div className="h-[11px] w-[11px] rounded-sm bg-forest" />
        <span>More</span>
      </div>
    </Card>
  );
}
