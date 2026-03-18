"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faEarthAmericas,
  faRoute,
  faRecycle,
  faTrophy,
  faComments,
  faArrowRight,
  faRocket,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { TourTriggerButton } from "@/components/tour/TourTriggerButton";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface GettingStartedGuideProps {
  userName: string;
}

const STEPS: {
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}[] = [
  {
    icon: faDroplet,
    iconBg: "bg-ocean/10",
    iconColor: "text-ocean",
    title: "Log your first water saving",
    description: "Track a shorter shower, turning off the tap, or any water conservation effort.",
    href: "/track/water",
    cta: "Track Water",
  },
  {
    icon: faEarthAmericas,
    iconBg: "bg-forest/10",
    iconColor: "text-forest",
    title: "Reduce your carbon footprint",
    description: "Log a meatless meal, energy saving, or any action that cuts CO\u2082.",
    href: "/track/carbon",
    cta: "Track Carbon",
  },
  {
    icon: faRoute,
    iconBg: "bg-ocean/10",
    iconColor: "text-ocean",
    title: "Choose eco-friendly transport",
    description: "Walked, cycled, or took public transit? Log it and see the impact.",
    href: "/track/transport",
    cta: "Track Transport",
  },
  {
    icon: faRecycle,
    iconBg: "bg-leaf/10",
    iconColor: "text-leaf",
    title: "Recycle or compost something",
    description: "Every item you recycle or compost counts towards your impact score.",
    href: "/track/recycling",
    cta: "Track Recycling",
  },
  {
    icon: faTrophy,
    iconBg: "bg-sunshine/15",
    iconColor: "text-amber-600",
    title: "Join a challenge",
    description: "Compete with the community in monthly eco-challenges for bonus points.",
    href: "/challenges",
    cta: "Browse Challenges",
  },
  {
    icon: faComments,
    iconBg: "bg-forest/10",
    iconColor: "text-forest",
    title: "Introduce yourself",
    description: "Say hello in the forum and connect with fellow eco-warriors.",
    href: "/forum",
    cta: "Visit Forum",
  },
];

export function GettingStartedGuide({ userName }: GettingStartedGuideProps) {
  return (
    <Card variant="default" className="overflow-hidden p-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest/5 via-ocean/5 to-leaf/5 px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-forest to-ocean">
              <FontAwesomeIcon icon={faRocket} className="h-4 w-4 text-white" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-bold text-charcoal">
                Getting Started
              </h2>
              <p className="text-sm text-slate">
                Here are some things to try first, {userName}
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <TourTriggerButton />
          </div>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step) => (
          <Link
            key={step.title}
            href={step.href}
            className="group flex flex-col bg-white p-5 transition-colors hover:bg-gray-50/80"
          >
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${step.iconBg}`}>
              <FontAwesomeIcon
                icon={step.icon}
                className={`h-4 w-4 ${step.iconColor}`}
                aria-hidden
              />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-charcoal">
              {step.title}
            </h3>
            <p className="mb-3 flex-1 text-xs leading-relaxed text-slate">
              {step.description}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest transition-colors group-hover:text-forest-dark">
              {step.cta}
              <FontAwesomeIcon
                icon={faArrowRight}
                className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
