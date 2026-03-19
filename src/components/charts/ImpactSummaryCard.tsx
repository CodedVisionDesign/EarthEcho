"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faArrowTrendDown, faCircleInfo } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ImpactSummaryCardProps {
  icon: IconDefinition;
  label: string;
  humanValue: string;
  numericValue?: number;
  comparison: string;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
  accentColor?: string;
  trend?: number;
  tooltip?: string;
  calculationTooltip?: string;
  href?: string;
  sparklineData?: number[];
}

export function ImpactSummaryCard({
  icon,
  label,
  humanValue,
  numericValue,
  comparison,
  iconBg,
  iconColor,
  accentBorder,
  accentColor = "#2D6A4F",
  trend,
  tooltip,
  calculationTooltip,
  href,
  sparklineData,
}: ImpactSummaryCardProps) {
  const hasSparkline = sparklineData && sparklineData.length > 0 && sparklineData.some((v) => v > 0);

  const cardContent = (
    <Card variant="interactive" className="group relative overflow-visible p-5">
      {/* Accent left border */}
      <div
        className={`absolute inset-y-0 left-0 w-[3px] rounded-l-2xl ${accentBorder} transition-all duration-300 group-hover:w-1`}
      />

      {/* Trend badge — top right */}
      {trend !== undefined && trend !== 0 && (
        <div className="absolute right-3 top-3">
          <Tooltip
            content={`${trend > 0 ? "Up" : "Down"} ${Math.abs(trend)}% vs last week`}
            position="left"
          >
            <Badge
              variant={trend > 0 ? "success" : "danger"}
              size="sm"
            >
              <FontAwesomeIcon
                icon={trend > 0 ? faArrowTrendUp : faArrowTrendDown}
                className="h-2.5 w-2.5"
                aria-hidden
              />
              {trend > 0 ? "+" : ""}
              {trend}%
            </Badge>
          </Tooltip>
        </div>
      )}
      {trend === 0 && (
        <div className="absolute right-3 top-3">
          <Tooltip content="No change compared to last week" position="left">
            <Badge variant="neutral" size="sm">
              No change
            </Badge>
          </Tooltip>
        </div>
      )}

      {/* Centered content */}
      <div className="flex flex-col items-center text-center">
        <div
          className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <FontAwesomeIcon
            icon={icon}
            className={`h-5 w-5 ${iconColor}`}
            aria-hidden
          />
        </div>
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate/60">
          {label}
        </div>
        <div className="mb-1.5 text-xl font-bold text-charcoal">
          {numericValue !== undefined && numericValue > 0 ? (
            <AnimatedCounter value={numericValue} duration={1200} separator="," />
          ) : (
            humanValue
          )}
        </div>
        <div className="flex items-center justify-center gap-1 text-xs text-slate">
          <span>{comparison}</span>
          {(calculationTooltip || tooltip) && (
            <Tooltip
              content={[tooltip, calculationTooltip].filter(Boolean).join(" · ")}
              position="top"
            >
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="h-2.5 w-2.5 cursor-help text-slate/40 transition-colors hover:text-slate/70"
                aria-hidden
              />
            </Tooltip>
          )}
        </div>

        {/* Mini sparkline */}
        {hasSparkline && (
          <div className="mt-3 h-8 w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData.map((v, i) => ({ i, v }))}>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={accentColor}
                  fill={accentColor}
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Clickable indicator */}
      {href && (
        <div className="absolute bottom-2 right-3 text-[10px] font-medium text-slate/0 transition-all duration-300 group-hover:text-slate/40">
          View details &rarr;
        </div>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
