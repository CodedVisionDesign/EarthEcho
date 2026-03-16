"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const REFERENCE_DATA = [
  { mode: "Walk", co2: 0, color: "#52B788" },
  { mode: "Cycle", co2: 0, color: "#52B788" },
  { mode: "E-Scoot", co2: 0.05, color: "#74C69D" },
  { mode: "Train", co2: 0.35, color: "#40916C" },
  { mode: "Bus", co2: 0.89, color: "#2D6A4F" },
  { mode: "EV", co2: 0.5, color: "#1B4965" },
  { mode: "Hybrid", co2: 1.05, color: "#FFB703" },
  { mode: "Diesel", co2: 1.55, color: "#FB8500" },
  { mode: "Petrol", co2: 1.7, color: "#E63946" },
  { mode: "Flight", co2: 2.55, color: "#C1121F" },
];

interface TransportData {
  mode: string;
  co2: number;
  color: string;
}

export function TransportComparisonChart({ data }: { data?: TransportData[] }) {
  const chartData = data && data.length > 0 ? data : REFERENCE_DATA;
  const title = data && data.length > 0 ? "Your Transport CO2" : "Transport CO2 Comparison";
  const subtitle = data && data.length > 0
    ? "CO2 emissions from your logged journeys"
    : "kg CO2 per 10km journey. See the difference your choice makes";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-charcoal">{title}</h3>
      <p className="mb-4 text-xs text-slate">{subtitle}</p>
      <div>
        <ResponsiveContainer width="100%" height={256}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#6C757D" }}
              axisLine={false}
              tickLine={false}
              unit=" kg"
            />
            <YAxis
              type="category"
              dataKey="mode"
              tick={{ fontSize: 11, fill: "#6C757D" }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
              formatter={(value) => [`${value} kg CO2`, "Emissions"]}
            />
            <Bar dataKey="co2" radius={[0, 4, 4, 0]} barSize={18}>
              {chartData.map((entry) => (
                <Cell key={entry.mode} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
