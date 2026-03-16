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
import { Card } from "@/components/ui/Card";

interface CategoryChartProps {
  data: Array<{ date: string; value: number }>;
  color: string;
  label: string;
}

function formatDateTick(dateStr: string): string {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

export function CategoryChart({ data, color, label }: CategoryChartProps) {
  return (
    <Card variant="default" className="p-6">
      <h3 className="mb-1 text-lg font-semibold text-charcoal">{label}</h3>
      <p className="mb-4 text-xs text-slate">Daily values over time</p>
      <div>
        <ResponsiveContainer width="100%" height={256}>
          <AreaChart data={data}>
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
              labelFormatter={(label) => formatDateTick(String(label))}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
            />
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
