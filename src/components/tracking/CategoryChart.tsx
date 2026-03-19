"use client";

import { useState, useMemo, useTransition, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { fetchCategoryTrend } from "@/lib/dashboard-actions";

interface CategoryChartProps {
  data: Array<{ date: string; value: number }>;
  color: string;
  label: string;
  category: string;
  unitLabel?: string;
}

const RANGES = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

function formatDateTick(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

export function CategoryChart({ data: initialData, color, label, category, unitLabel }: CategoryChartProps) {
  const [data, setData] = useState(initialData);
  const [activeDays, setActiveDays] = useState(30);
  const [isPending, startTransition] = useTransition();

  const handleRangeChange = useCallback((days: number) => {
    setActiveDays(days);
    startTransition(async () => {
      const newData = await fetchCategoryTrend(category, days);
      setData(newData);
    });
  }, [category]);

  // Calculate 7-day rolling average
  const chartData = useMemo(() => {
    return data.map((d, i) => {
      const window = data.slice(Math.max(0, i - 6), i + 1);
      const avg = window.reduce((sum, w) => sum + w.value, 0) / window.length;
      return { ...d, avg: Math.round(avg * 10) / 10 };
    });
  }, [data]);

  // Calculate overall average for reference line
  const overallAvg = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.round((data.reduce((sum, d) => sum + d.value, 0) / data.length) * 10) / 10;
  }, [data]);

  return (
    <Card variant="default" className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-charcoal">{label}</h3>
          <p className="text-xs text-slate">
            Daily values &middot; avg {overallAvg} {unitLabel?.toLowerCase() ?? ""}/day
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => handleRangeChange(r.days)}
              disabled={isPending}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                activeDays === r.days
                  ? "bg-white text-charcoal shadow-sm"
                  : "text-slate hover:text-charcoal"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className={isPending ? "opacity-50 transition-opacity" : ""}>
        <ResponsiveContainer width="100%" height={256}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateTick}
              tick={{ fontSize: 12, fill: "#6C757D" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6C757D" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label: tooltipLabel }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload as { date: string; value: number; avg: number };
                return (
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
                    <div className="font-semibold text-charcoal">{formatDateTick(String(tooltipLabel))}</div>
                    <div className="mt-1 text-slate">
                      <span style={{ color }}>Daily:</span> {d.value} {unitLabel?.toLowerCase() ?? ""}
                    </div>
                    <div className="text-slate">
                      <span className="text-gray-400">7d avg:</span> {d.avg} {unitLabel?.toLowerCase() ?? ""}
                    </div>
                  </div>
                );
              }}
            />
            {/* Average reference line */}
            {overallAvg > 0 && (
              <ReferenceLine
                y={overallAvg}
                stroke="#94A3B8"
                strokeDasharray="6 4"
                strokeWidth={1}
                label={{
                  value: `avg: ${overallAvg}`,
                  position: "right",
                  fontSize: 10,
                  fill: "#94A3B8",
                }}
              />
            )}
            {/* 7-day rolling average */}
            <Area
              type="monotone"
              dataKey="avg"
              name="7d Average"
              stroke="#94A3B8"
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
            />
            {/* Daily values */}
            <Area
              type="monotone"
              dataKey="value"
              name={label}
              stroke={color}
              fill={color}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
