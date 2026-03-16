"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const SIZES = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
  "2xl": "h-8 w-8",
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
