import type { ReactNode } from "react";

const VARIANTS = {
  default:
    "rounded-2xl border border-gray-200 bg-white shadow-sm",
  glass:
    "rounded-2xl glass",
  interactive:
    "rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-250 hover:shadow-lg hover:-translate-y-0.5 hover:border-forest/20",
  gradient:
    "rounded-2xl text-white shadow-lg",
} as const;

interface CardProps {
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: ReactNode;
  gradient?: string;
}

export function Card({
  variant = "default",
  className = "",
  children,
  gradient,
}: CardProps) {
  const baseClass = VARIANTS[variant];
  const gradientStyle =
    variant === "gradient" && gradient ? { background: gradient } : undefined;

  return (
    <div className={`${baseClass} ${className}`} style={gradientStyle}>
      {children}
    </div>
  );
}
