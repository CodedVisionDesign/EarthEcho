import type { ReactNode } from "react";
import dynamic from "next/dynamic";

const MagicCard = dynamic(
  () => import("./MagicCard").then((m) => m.MagicCard),
);

const VARIANTS = {
  default:
    "rounded-2xl border border-gray-200 bg-white shadow-sm",
  glass:
    "rounded-2xl glass",
  interactive:
    "rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-forest/20",
  gradient:
    "rounded-2xl text-white shadow-lg",
} as const;

interface CardProps {
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: ReactNode;
  gradient?: string;
  /** Enable MagicBento glow, tilt & ripple effects */
  magic?: boolean;
  /** RGB string for glow e.g. "45, 106, 79" */
  glowColor?: string;
  enableTilt?: boolean;
  enableRipple?: boolean;
}

export function Card({
  variant = "default",
  className = "",
  children,
  gradient,
  magic,
  glowColor,
  enableTilt,
  enableRipple,
}: CardProps) {
  const baseClass = VARIANTS[variant];
  const gradientStyle =
    variant === "gradient" && gradient ? { background: gradient } : undefined;

  if (magic) {
    return (
      <MagicCard
        className={`${baseClass} ${className}`}
        style={gradientStyle}
        glowColor={glowColor}
        enableTilt={enableTilt}
        enableRipple={enableRipple}
      >
        {children}
      </MagicCard>
    );
  }

  return (
    <div className={`${baseClass} ${className}`} style={gradientStyle}>
      {children}
    </div>
  );
}
