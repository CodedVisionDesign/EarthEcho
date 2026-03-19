"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface TrackHubSparklineProps {
  data: number[];
  color: string;
}

export function TrackHubSparkline({ data, color }: TrackHubSparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          fill={color}
          fillOpacity={0.15}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
