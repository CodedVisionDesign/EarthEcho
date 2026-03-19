"use client";

import { useState, useTransition, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TrendDataPoint } from "@/lib/queries";

interface CategoryConfig {
  key: keyof Omit<TrendDataPoint, "label">;
  name: string;
  color: string;
}

const CATEGORIES: CategoryConfig[] = [
  { key: "water", name: "Water (L)", color: "#1B4965" },
  { key: "carbon", name: "Carbon (kg)", color: "#2D6A4F" },
  { key: "plastic", name: "Plastic (items)", color: "#FFB703" },
  { key: "recycling", name: "Recycling (kg)", color: "#52B788" },
  { key: "transport", name: "Transport (km)", color: "#468FAF" },
  { key: "fashion", name: "Fashion (items)", color: "#40916C" },
];

const TIME_RANGES = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
] as const;

interface WeeklyTrendChartProps {
  data: TrendDataPoint[];
  onRangeChange?: (days: number) => Promise<TrendDataPoint[]>;
}

export function WeeklyTrendChart({ data: initialData, onRangeChange }: WeeklyTrendChartProps) {
  const [data, setData] = useState(initialData);
  const [activeDays, setActiveDays] = useState(7);
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggleCategory = useCallback((key: string) => {
    setHiddenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        // Don't allow hiding all categories
        const visibleCount = CATEGORIES.length - next.size;
        if (visibleCount > 1) next.add(key);
      }
      return next;
    });
  }, []);

  const handleRangeChange = useCallback((days: number) => {
    if (days === activeDays || !onRangeChange) return;
    setActiveDays(days);
    startTransition(async () => {
      const newData = await onRangeChange(days);
      setData(newData);
    });
  }, [activeDays, onRangeChange]);

  const visibleCategories = CATEGORIES.filter((c) => !hiddenCategories.has(c.key));

  // Determine title based on active range
  const title = activeDays <= 7
    ? "This Week\u2019s Impact"
    : activeDays <= 30
      ? "Last 30 Days"
      : "Last 90 Days";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
          <p className="text-xs text-slate">
            Your daily savings across categories
          </p>
        </div>
        {/* Time range selector */}
        {onRangeChange && (
          <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
            {TIME_RANGES.map((range) => (
              <button
                key={range.days}
                type="button"
                onClick={() => handleRangeChange(range.days)}
                disabled={isPending}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  activeDays === range.days
                    ? "bg-white text-charcoal shadow-sm"
                    : "text-slate hover:text-charcoal"
                } disabled:opacity-50`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Toggleable legend */}
      <div className="mb-3 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isHidden = hiddenCategories.has(cat.key);
          // Check if this category has any data
          const hasData = data.some((d) => d[cat.key] > 0);
          if (!hasData) return null;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => toggleCategory(cat.key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                isHidden
                  ? "bg-gray-100 text-slate/50 line-through"
                  : "bg-gray-50 text-charcoal"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full transition-opacity"
                style={{
                  backgroundColor: cat.color,
                  opacity: isHidden ? 0.3 : 1,
                }}
              />
              {cat.name.split(" (")[0]}
            </button>
          );
        })}
      </div>

      <div className={isPending ? "opacity-50 transition-opacity" : ""}>
        <ResponsiveContainer width="100%" height={256}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6C757D" }}
              axisLine={false}
              tickLine={false}
              interval={activeDays > 30 ? Math.floor(activeDays / 10) : undefined}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6C757D" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
            />
            {visibleCategories.map((cat) => (
              <Area
                key={cat.key}
                type="monotone"
                dataKey={cat.key}
                name={cat.name}
                stroke={cat.color}
                fill={cat.color}
                fillOpacity={0.08}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
