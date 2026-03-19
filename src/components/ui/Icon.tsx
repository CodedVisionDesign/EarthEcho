"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const SIZES = {
  xs: "h-3 w-3",       // 12px - inline tags, tiny badges
  sm: "h-4 w-4",       // 16px - buttons, form hints, compact UI
  md: "h-5 w-5",       // 20px - navigation, cards, tab bar
  lg: "h-6 w-6",       // 24px - headers, empty states
  xl: "h-8 w-8",       // 32px - feature highlights, onboarding
} as const;

interface IconProps {
  icon: IconDefinition;
  size?: keyof typeof SIZES;
  className?: string;
  label?: string;
  spin?: boolean;
}

export function Icon({ icon, size = "md", className = "", label, spin }: IconProps) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={`${SIZES[size]} ${className}`}
      aria-hidden={!label}
      aria-label={label}
      role={label ? "img" : undefined}
      spin={spin}
    />
  );
}
