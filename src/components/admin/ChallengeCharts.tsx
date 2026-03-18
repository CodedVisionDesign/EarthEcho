"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Card } from "@/components/ui/Card";

const TOOLTIP_STYLE = { borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" };
const AXIS_TICK = { fontSize: 11, fill: "#6C757D" };

// Progress distribution buckets
interface ProgressBucket {
  range: string;
  count: number;
  fill: string;
}

export function ProgressDistributionChart({ data }: { data: ProgressBucket[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Progress Distribution</h3>
      <p className="mb-4 text-xs text-slate">How participants are spread across progress ranges</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="range" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="count" name="Participants" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// Daily join rate
interface JoinRatePoint {
  date: string;
  joins: number;
}

export function DailyJoinRateChart({ data }: { data: JoinRatePoint[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Daily Join Rate</h3>
      <p className="mb-4 text-xs text-slate">New participants joining per day</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line
              type="monotone"
              dataKey="joins"
              name="New Joins"
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

// Average progress over time
interface ProgressTrendPoint {
  date: string;
  avgProgress: number;
}

export function ProgressTrendChart({ data }: { data: ProgressTrendPoint[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Progress Trend</h3>
      <p className="mb-4 text-xs text-slate">Average participant progress over time</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} unit="%" />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "Avg Progress"]} />
            <Area
              type="monotone"
              dataKey="avgProgress"
              stroke="#2D6A4F"
              fill="#2D6A4F"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
