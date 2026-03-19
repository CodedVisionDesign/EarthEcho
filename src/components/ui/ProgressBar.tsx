"use client";

import { useState, useEffect } from "react";

const COLORS = {
  forest: "bg-forest",
  ocean: "bg-ocean",
  sunshine: "bg-sunshine",
  leaf: "bg-leaf",
  coral: "bg-coral",
  amber: "bg-amber",
} as const;

const SIZES = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
} as const;

interface ProgressBarProps {
  value: number; // 0–100
  color?: keyof typeof COLORS;
  size?: keyof typeof SIZES;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  color = "forest",
  size = "md",
  showLabel,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className={className}>
      <div
        className={`overflow-hidden rounded-full bg-gray-200 ${SIZES[size]}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${COLORS[color]} ${SIZES[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: mounted ? `${clamped}%` : "0%" }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs font-medium text-slate">
          {clamped}%
        </div>
      )}
    </div>
  );
}
