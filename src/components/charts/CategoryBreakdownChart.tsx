"use client";

import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";

interface CategoryData {
  category: string;
  label: string;
  total: number;
  color: string;
  href: string;
}

interface CategoryBreakdownChartProps {
  data: CategoryData[];
  totalPoints: number;
}

export function CategoryBreakdownChart({ data, totalPoints }: CategoryBreakdownChartProps) {
  const router = useRouter();
  const hasData = data.some((d) => d.total > 0);

  if (!hasData) return null;

  // Normalize values for the donut - show proportional contribution
  // Use percentage of total across categories
  const totalValue = data.reduce((sum, d) => sum + d.total, 0);
  const chartData = data
    .filter((d) => d.total > 0)
    .map((d) => ({
      ...d,
      value: d.total,
      pct: totalValue > 0 ? Math.round((d.total / totalValue) * 100) : 0,
    }));

  return (
    <Card variant="default" className="p-6">
      <h3 className="mb-1 text-lg font-semibold text-charcoal">
        Impact Breakdown
      </h3>
      <p className="mb-4 text-xs text-slate">
        Your contribution across categories
      </p>
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              nameKey="label"
              cursor="pointer"
              onClick={(entry) => {
                if (entry?.href) router.push(entry.href);
              }}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
                    <div className="font-semibold text-charcoal">{d.label}</div>
                    <div className="text-slate">{d.pct}% of total</div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Centre label */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-charcoal">
              {totalPoints.toLocaleString()}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-slate/60">
              Total Points
            </div>
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {chartData.map((d) => (
          <div key={d.category} className="flex items-center gap-1.5 text-[11px] text-slate">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span>{d.label}</span>
            <span className="font-semibold text-charcoal">{d.pct}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
