"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Demo data — will be replaced with real data from the database
const DEMO_DATA = [
  { day: "Mon", water: 30, carbon: 2.5, plastic: 4 },
  { day: "Tue", water: 45, carbon: 1.8, plastic: 6 },
  { day: "Wed", water: 20, carbon: 3.2, plastic: 3 },
  { day: "Thu", water: 55, carbon: 2.1, plastic: 8 },
  { day: "Fri", water: 40, carbon: 1.5, plastic: 5 },
  { day: "Sat", water: 60, carbon: 0.8, plastic: 7 },
  { day: "Sun", water: 35, carbon: 1.2, plastic: 4 },
];

export function WeeklyTrendChart() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-charcoal">
        This Week&apos;s Impact
      </h3>
      <p className="mb-4 text-xs text-slate">
        Your daily savings across categories
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DEMO_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="day"
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
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="water"
              name="Water (L)"
              stroke="#1B4965"
              fill="#1B4965"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="carbon"
              name="Carbon (kg)"
              stroke="#2D6A4F"
              fill="#2D6A4F"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="plastic"
              name="Plastic (items)"
              stroke="#FFB703"
              fill="#FFB703"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
