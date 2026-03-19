"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faSeedling,
  faTrashCan,
  faRecycle,
  faBicycle,
  faShirt,
  faTrophy,
  faChevronDown,
  faCircleInfo,
  faBolt,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ScoringCategory {
  label: string;
  key: string;
  icon: IconDefinition;
  rate: string;
  detail: string;
  color: string;
  bg: string;
  border: string;
}

const SCORING_CATEGORIES: ScoringCategory[] = [
  {
    label: "Carbon",
    key: "carbon",
    icon: faSeedling,
    rate: "10 pts",
    detail: "per kg CO\u2082 saved",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    label: "Fashion",
    key: "fashion",
    icon: faShirt,
    rate: "5 pts",
    detail: "per item reused",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    label: "Plastic",
    key: "plastic",
    icon: faTrashCan,
    rate: "3 pts",
    detail: "per item avoided",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
  {
    label: "Recycling",
    key: "recycling",
    icon: faRecycle,
    rate: "2 pts",
    detail: "per kg recycled",
    color: "text-lime-600",
    bg: "bg-lime-50",
    border: "border-lime-100",
  },
  {
    label: "Transport",
    key: "transport",
    icon: faBicycle,
    rate: "1 pt",
    detail: "per green km",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    label: "Water",
    key: "water",
    icon: faDroplet,
    rate: "1 pt",
    detail: "per 10 litres saved",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
];

export function ScoringBreakdown() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card variant="default" className="mt-8 overflow-hidden">
      {/* Header - always visible, acts as toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50/60"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="h-4 w-4 text-sky-600"
              aria-hidden
            />
          </div>
          <h2 className="text-base font-semibold text-charcoal">
            How Scoring Works
          </h2>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            className="h-3.5 w-3.5 text-slate"
            aria-hidden
          />
        </motion.div>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="scoring-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-6 pb-6 pt-5">
              <p className="mb-5 text-sm leading-relaxed text-slate">
                Points are earned every time you log an eco-friendly activity.
                The amount depends on the category and the size of your
                contribution:
              </p>

              {/* Category cards grid */}
              <StaggerGroup
                className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3"
                stagger={0.06}
                itemVariant="scale"
              >
                {SCORING_CATEGORIES.map((cat) => (
                  <StaggerItem key={cat.key}>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={`rounded-xl border ${cat.border} ${cat.bg} px-3.5 py-3 cursor-default`}
                    >
                      <div className="mb-1.5 flex items-center gap-2">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${cat.bg} ${cat.color}`}
                        >
                          <FontAwesomeIcon
                            icon={cat.icon}
                            className="h-3.5 w-3.5"
                            aria-hidden
                          />
                        </div>
                        <span className="text-xs font-semibold text-charcoal">
                          {cat.label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-lg font-bold tracking-tight ${cat.color}`}
                        >
                          {cat.rate}
                        </span>
                      </div>
                      <p className="text-[11px] leading-snug text-slate">
                        {cat.detail}
                      </p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerGroup>

              {/* Bonus info pills */}
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-forest/5 px-3 py-1.5">
                  <FontAwesomeIcon
                    icon={faBolt}
                    className="h-3 w-3 text-forest"
                    aria-hidden
                  />
                  <span className="text-xs font-medium text-charcoal">
                    Minimum <strong>5 pts</strong> per activity
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sunshine/30 bg-sunshine/10 px-3 py-1.5">
                  <FontAwesomeIcon
                    icon={faTrophy}
                    className="h-3 w-3 text-amber-600"
                    aria-hidden
                  />
                  <span className="text-xs font-medium text-charcoal">
                    <strong>100 bonus pts</strong> for completing a challenge
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5">
                  <FontAwesomeIcon
                    icon={faCircleInfo}
                    className="h-3 w-3 text-sky-600"
                    aria-hidden
                  />
                  <span className="text-xs font-medium text-charcoal">
                    Daily cap: <strong>500 pts</strong>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
