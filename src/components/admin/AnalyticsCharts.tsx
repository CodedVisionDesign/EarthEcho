"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Card } from "@/components/ui/Card";

const COLORS = ["#1B4965", "#2D6A4F", "#FFB703", "#52B788", "#E63946", "#457B9D"];
const TOOLTIP_STYLE = { borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" };
const AXIS_TICK = { fontSize: 11, fill: "#6C757D" };

// Stacked Area - Impact Over Time
interface ImpactPoint {
  date: string;
  [category: string]: string | number;
}

export function ImpactOverTimeChart({ data, categories }: { data: ImpactPoint[]; categories: string[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Impact Over Time</h3>
      <p className="mb-4 text-xs text-slate">Daily contributions across categories</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            {categories.map((cat, i) => (
              <Area
                key={cat}
                type="monotone"
                dataKey={cat}
                stackId="1"
                stroke={COLORS[i % COLORS.length]}
                fill={COLORS[i % COLORS.length]}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// Donut - Category Breakdown
interface CategorySlice {
  name: string;
  value: number;
}

export function CategoryBreakdownDonut({ data }: { data: CategorySlice[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Category Breakdown</h3>
      <p className="mb-4 text-xs text-slate">Share of impact by category</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {item.name}
          </div>
        ))}
      </div>
    </Card>
  );
}

// Horizontal Bar - Top Contributors
interface Contributor {
  name: string;
  total: number;
}

export function TopContributorsChart({ data }: { data: Contributor[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Top Contributors</h3>
      <p className="mb-4 text-xs text-slate">Most active community members</p>
      <div>
        <ResponsiveContainer width="100%" height={Math.max(220, data.length * 32)}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis type="number" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="total" name="Impact" fill="#2D6A4F" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// Line - Activity Growth Trend
interface GrowthPoint {
  date: string;
  count: number;
}

export function ActivityGrowthChart({ data }: { data: GrowthPoint[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Activity Growth</h3>
      <p className="mb-4 text-xs text-slate">Activities logged per day</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey="count"
              name="Activities"
              stroke="#1B4965"
              strokeWidth={2}
              dot={{ fill: "#1B4965", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// Bar - Transport Mode Comparison
interface TransportMode {
  mode: string;
  co2Saved: number;
  totalKm: number;
}

export function TransportModeChart({ data }: { data: TransportMode[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Transport Modes</h3>
      <p className="mb-4 text-xs text-slate">CO₂ saved by transport mode (kg)</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="mode" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="co2Saved" name="CO₂ Saved (kg)" fill="#52B788" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// Bar - Activity Type Breakdown
interface ActivityType {
  type: string;
  total: number;
  count: number;
}

export function ActivityTypeChart({ data }: { data: ActivityType[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Activity Types</h3>
      <p className="mb-4 text-xs text-slate">Impact breakdown by activity type</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="type" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="total" name="Total Impact" fill="#457B9D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
