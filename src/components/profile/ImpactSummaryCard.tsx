import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
  faChartLine,
  faCircleInfo,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Tooltip } from "@/components/ui/Tooltip";
import { toHumanReadable, type MetricCategory } from "@/lib/metrics/converters";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const CATEGORY_DISPLAY: Record<
  string,
  { icon: IconDefinition; label: string; iconBg: string; iconColor: string }
> = {
  WATER: { icon: faDroplet, label: "Water Saved", iconBg: "bg-ocean/10", iconColor: "text-ocean" },
  CARBON: { icon: faEarthAmericas, label: "Carbon Reduced", iconBg: "bg-forest/10", iconColor: "text-forest" },
  PLASTIC: { icon: faBagShopping, label: "Plastic Avoided", iconBg: "bg-sunshine/15", iconColor: "text-amber-600" },
  RECYCLING: { icon: faRecycle, label: "Recycled", iconBg: "bg-leaf/10", iconColor: "text-leaf" },
  TRANSPORT: { icon: faCar, label: "Green Transport", iconBg: "bg-ocean/10", iconColor: "text-ocean" },
  FASHION: { icon: faShirt, label: "Sustainable Fashion", iconBg: "bg-coral/10", iconColor: "text-coral" },
};

interface ImpactSummaryCardProps {
  categoryBreakdown: Record<string, number>;
}

export function ImpactSummaryCard({ categoryBreakdown }: ImpactSummaryCardProps) {
  const activeCategories = Object.entries(categoryBreakdown).filter(
    ([, total]) => total > 0,
  );

  if (activeCategories.length === 0) return null;

  return (
    <Card variant="default" className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <FontAwesomeIcon icon={faChartLine} className="h-3.5 w-3.5 text-forest" aria-hidden />
        <h3 className="text-sm font-semibold text-charcoal">Your Impact</h3>
      </div>

      <div className="space-y-3">
        {activeCategories.map(([category, total]) => {
          const display = CATEGORY_DISPLAY[category];
          if (!display) return null;
          const human = toHumanReadable(category as MetricCategory, total);

          return (
            <div key={category} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${display.iconBg}`}
              >
                <FontAwesomeIcon
                  icon={display.icon}
                  className={`h-3.5 w-3.5 ${display.iconColor}`}
                  aria-hidden
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-slate">{display.label}</div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-charcoal">
                  <span className="truncate" title={human.comparison}>{human.comparison}</span>
                  {human.tooltip && (
                    <Tooltip content={human.tooltip} position="bottom">
                      <FontAwesomeIcon
                        icon={faCircleInfo}
                        className="h-2.5 w-2.5 shrink-0 cursor-help text-slate/40 transition-colors hover:text-slate/70"
                        aria-hidden
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
