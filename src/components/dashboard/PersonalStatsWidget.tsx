"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faTrophy,
  faMedal,
  faChartLine,
} from "@/lib/fontawesome";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface StatItem {
  icon: IconDefinition;
  label: string;
  value: number;
  suffix?: string;
  iconBg: string;
  iconColor: string;
}

interface PersonalStatsWidgetProps {
  totalActivities: number;
  streakDays: number;
  totalPoints: number;
  badgesEarned: number;
  totalBadges: number;
  rank: number | null;
}

export function PersonalStatsWidget({
  totalActivities,
  streakDays,
  totalPoints,
  badgesEarned,
  totalBadges,
  rank,
}: PersonalStatsWidgetProps) {
  const stats: StatItem[] = [
    {
      icon: faChartLine,
      label: "Activities",
      value: totalActivities,
      iconBg: "bg-forest/10",
      iconColor: "text-forest",
    },
    {
      icon: faFire,
      label: "Streak",
      value: streakDays,
      suffix: streakDays === 1 ? " day" : " days",
      iconBg: "bg-coral/10",
      iconColor: "text-coral",
    },
    {
      icon: faTrophy,
      label: rank ? `Rank #${rank}` : "Points",
      value: totalPoints,
      suffix: " pts",
      iconBg: "bg-sunshine/15",
      iconColor: "text-amber-600",
    },
    {
      icon: faMedal,
      label: "Badges",
      value: badgesEarned,
      suffix: ` / ${totalBadges}`,
      iconBg: "bg-ocean/10",
      iconColor: "text-ocean",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
          >
            <FontAwesomeIcon
              icon={stat.icon}
              className={`h-4 w-4 ${stat.iconColor}`}
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <div className="text-lg font-bold leading-tight text-charcoal">
              <AnimatedCounter value={stat.value} duration={1000} />
              {stat.suffix && (
                <span className="text-sm font-medium text-slate">
                  {stat.suffix}
                </span>
              )}
            </div>
            <div className="text-[11px] font-medium text-slate/60">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
