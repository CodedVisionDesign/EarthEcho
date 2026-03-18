import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@/lib/fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";

interface RunningTotalBannerProps {
  icon: IconDefinition;
  label: string;
  humanValue: string;
  comparison: string;
  iconBg: string;
  iconColor: string;
  calculationTooltip?: string;
  gradient?: string;
}

const DEFAULT_GRADIENT = "from-forest via-forest/90 to-ocean";

export function RunningTotalBanner({
  icon,
  label,
  humanValue,
  comparison,
  calculationTooltip,
  gradient,
}: RunningTotalBannerProps) {
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
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wider text-white/60">
            {label}
          </div>
          <div className="text-2xl font-bold">{humanValue}</div>
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
    </div>
  );
}
