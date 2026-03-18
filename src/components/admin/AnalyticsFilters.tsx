"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, type ActivityCategory } from "@/lib/categories";

const TIME_RANGES = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
  { value: "custom", label: "Custom" },
];

const CATEGORY_OPTIONS: { value: string; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "🌍" },
  ...Object.values(CATEGORIES).map((c) => ({
    value: c.key,
    label: c.label.split(" ")[0],
    icon: c.icon,
  })),
];

export function AnalyticsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "month";
  const currentCategory = searchParams.get("category") || "all";
  const customFrom = searchParams.get("from") || "";
  const customTo = searchParams.get("to") || "";

  const [from, setFrom] = useState(customFrom);
  const [to, setTo] = useState(customTo);

  function navigate(overrides: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(overrides)) {
      if (v && v !== "all" && v !== "month") {
        params.set(k, v);
      } else {
        params.delete(k);
      }
    }
    // Reset page when filters change
    params.delete("page");
    router.push(`/admin/analytics?${params.toString()}`);
  }

  return (
    <div className="mb-6 space-y-3">
      {/* Time range */}
      <div className="flex flex-wrap items-center gap-1.5">
        {TIME_RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => navigate({ range: r.value })}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              currentRange === r.value
                ? "bg-forest text-white shadow-sm"
                : "bg-gray-100 text-slate hover:bg-gray-200"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Custom date pickers */}
      {currentRange === "custom" && (
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          />
          <span className="text-xs text-slate">to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          />
          <button
            onClick={() => navigate({ range: "custom", from, to })}
            className="rounded-lg bg-forest px-3 py-1.5 text-xs font-medium text-white hover:bg-forest/90"
          >
            Apply
          </button>
        </div>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORY_OPTIONS.map((c) => (
          <button
            key={c.value}
            onClick={() => navigate({ category: c.value })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              currentCategory === c.value
                ? "bg-ocean text-white shadow-sm"
                : "bg-gray-100 text-slate hover:bg-gray-200"
            }`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
