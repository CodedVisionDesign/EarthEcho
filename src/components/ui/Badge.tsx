import type { ReactNode } from "react";

const VARIANTS = {
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-gray-100 text-gray-600",
  forest: "bg-forest/10 text-forest",
  ocean: "bg-ocean/10 text-ocean",
  sunshine: "bg-sunshine/10 text-amber-700",
} as const;

const SIZES = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
} as const;

interface BadgeProps {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}

export function Badge({
  variant = "neutral",
  size = "md",
  className = "",
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </span>
  );
}
