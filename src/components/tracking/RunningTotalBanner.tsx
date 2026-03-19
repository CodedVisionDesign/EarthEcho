import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faArrowTrendUp, faArrowTrendDown } from "@/lib/fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Tooltip } from "@/components/ui/Tooltip";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface RunningTotalBannerProps {
  icon: IconDefinition;
  label: string;
  humanValue: string;
  comparison: string;
  iconBg: string;
  iconColor: string;
  calculationTooltip?: string;
  gradient?: string;
  rawTotal?: number;
  trend?: number;
  unit?: string;
}

const DEFAULT_GRADIENT = "from-forest via-forest/90 to-ocean";

// Define milestone thresholds per unit type
function getNextMilestone(total: number, unit?: string): { target: number; label: string } | null {
  const milestones: number[] = (() => {
    switch (unit) {
      case "litres":
        return [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
      case "kg_co2":
        return [5, 10, 25, 50, 100, 250, 500, 1000];
      case "items":
        return [10, 25, 50, 100, 250, 500, 1000];
      case "kg":
        return [5, 10, 25, 50, 100, 250, 500, 1000];
      case "km":
        return [10, 50, 100, 250, 500, 1000, 2500, 5000];
      default:
        return [10, 25, 50, 100, 250, 500, 1000, 5000];
    }
  })();

  const next = milestones.find((m) => m > total);
  if (!next) return null;

  const unitLabel = unit === "kg_co2" ? "kg CO\u2082" : unit ?? "";
  return { target: next, label: `${next} ${unitLabel}` };
}

export function RunningTotalBanner({
  icon,
  label,
  humanValue,
  comparison,
  calculationTooltip,
  gradient,
  rawTotal,
  trend,
  unit,
}: RunningTotalBannerProps) {
  const milestone = rawTotal !== undefined ? getNextMilestone(rawTotal, unit) : null;
  const milestoneProgress = milestone && rawTotal !== undefined
    ? Math.min(100, (rawTotal / milestone.target) * 100)
    : 0;

  return (
    <div className={`w-full overflow-hidden rounded-2xl bg-gradient-to-br ${gradient ?? DEFAULT_GRADIENT} p-6 text-white shadow-lg`}>
      <div className="flex items-center gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
          <FontAwesomeIcon
            icon={icon}
            className="h-6 w-6"
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wider text-white/60">
            {label}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold">{humanValue}</span>
            {trend !== undefined && trend !== 0 && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                trend > 0 ? "bg-white/20 text-white" : "bg-red-400/20 text-red-200"
              }`}>
                <FontAwesomeIcon
                  icon={trend > 0 ? faArrowTrendUp : faArrowTrendDown}
                  className="h-2.5 w-2.5"
                  aria-hidden
                />
                {trend > 0 ? "+" : ""}{trend}% vs last week
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-white/70">
            <span>{comparison}</span>
            {calculationTooltip && (
              <div className="group">
                <Tooltip content={calculationTooltip} position="bottom">
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className="h-3 w-3 cursor-help text-white/40 transition-colors group-hover:text-white/70"
                    aria-hidden
                  />
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Milestone progress */}
      {milestone && rawTotal !== undefined && (
        <div className="mt-4 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-white/80">
            <span>Next milestone: {milestone.label}</span>
            <span className="font-bold">{Math.round(milestoneProgress)}%</span>
          </div>
          <ProgressBar value={milestoneProgress} color="sunshine" size="sm" />
          <div className="mt-1 text-[10px] text-white/50">
            {Math.max(0, Math.round((milestone.target - rawTotal) * 100) / 100)} {unit === "kg_co2" ? "kg CO\u2082" : unit ?? ""} to go
          </div>
        </div>
      )}
    </div>
  );
}
