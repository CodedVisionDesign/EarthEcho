"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/Card";

interface ActivityTypeData {
  type: string;
  label: string;
  total: number;
  count: number;
}

interface ActivityTypeChartProps {
  data: ActivityTypeData[];
  color: string;
  unitLabel: string;
}

export function ActivityTypeChart({ data, color, unitLabel }: ActivityTypeChartProps) {
  if (data.length === 0) return null;

  // Sort by total descending and take top 8
  const chartData = [...data]
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
    .map((d) => ({
      ...d,
      // Truncate long labels
      shortLabel: d.label.length > 20 ? d.label.slice(0, 18) + "..." : d.label,
    }));

  return (
    <Card variant="default" className="p-6">
      <h3 className="mb-1 text-lg font-semibold text-charcoal">
        Activity Breakdown
      </h3>
      <p className="mb-4 text-xs text-slate">
        Which actions contribute the most
      </p>
      <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 36)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#6C757D" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="shortLabel"
            tick={{ fontSize: 11, fill: "#6C757D" }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload as ActivityTypeData & { shortLabel: string };
              return (
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
                  <div className="font-semibold text-charcoal">{d.label}</div>
                  <div className="text-slate">
                    {d.total} {unitLabel.toLowerCase()} across {d.count} {d.count === 1 ? "entry" : "entries"}
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell
                key={entry.type}
                fill={color}
                fillOpacity={1 - index * 0.08}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
