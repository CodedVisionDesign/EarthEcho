import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Card } from "@/components/ui/Card";

interface RunningTotalBannerProps {
  icon: IconDefinition;
  label: string;
  humanValue: string;
  comparison: string;
  iconBg: string;
  iconColor: string;
}

export function RunningTotalBanner({
  icon,
  label,
  humanValue,
  comparison,
  iconBg,
  iconColor,
}: RunningTotalBannerProps) {
  return (
    <Card variant="default" className="w-full p-6">
      <div className="flex items-center gap-5">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${iconBg}`}
        >
          <FontAwesomeIcon
            icon={icon}
            className={`h-6 w-6 ${iconColor}`}
            aria-hidden
          />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wider text-slate/60">
            {label}
          </div>
          <div className="text-2xl font-bold text-charcoal">{humanValue}</div>
          <div className="text-sm text-slate">{comparison}</div>
        </div>
      </div>
    </Card>
  );
}
