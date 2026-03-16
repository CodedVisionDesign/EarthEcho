"use client";

interface ImpactSummaryCardProps {
  icon: string;
  label: string;
  humanValue: string;
  comparison: string;
  color: string;
  trend?: number;
}

export function ImpactSummaryCard({
  icon,
  label,
  humanValue,
  comparison,
  color,
  trend,
}: ImpactSummaryCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        {trend !== undefined && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              trend > 0
                ? "bg-green-100 text-green-700"
                : trend < 0
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <div className="mb-1 text-xs font-medium text-slate">{label}</div>
      <div className={`mb-2 text-xl font-bold ${color}`}>{humanValue}</div>
      <div className="text-xs text-slate">{comparison}</div>
    </div>
  );
}
