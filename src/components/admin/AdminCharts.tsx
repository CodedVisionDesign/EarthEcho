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
} from "recharts";
import { Card } from "@/components/ui/Card";

interface UserGrowthData {
  month: string;
  users: number;
}

interface CategoryBreakdown {
  name: string;
  value: number;
}

interface ActivityTrendData {
  day: string;
  activities: number;
}

const COLORS = ["#1B4965", "#2D6A4F", "#FFB703", "#52B788", "#E63946", "#457B9D"];

export function UserGrowthChart({ data }: { data: UserGrowthData[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">User Growth</h3>
      <p className="mb-4 text-xs text-slate">New registrations per month</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6C757D" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6C757D" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" }} />
            <Bar dataKey="users" name="New Users" fill="#2D6A4F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function CategoryBreakdownChart({ data }: { data: CategoryBreakdown[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Activity Categories</h3>
      <p className="mb-4 text-xs text-slate">Distribution of tracked activities</p>
      <div className="flex items-center gap-4">
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
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {item.name} ({item.value})
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ActivityTrendChart({ data }: { data: ActivityTrendData[] }) {
  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-sm font-semibold text-charcoal">Daily Activity (Last 14 Days)</h3>
      <p className="mb-4 text-xs text-slate">Activities logged per day across all users</p>
      <div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6C757D" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6C757D" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "12px" }} />
            <Line type="monotone" dataKey="activities" name="Activities" stroke="#1B4965" strokeWidth={2} dot={{ fill: "#1B4965", r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
