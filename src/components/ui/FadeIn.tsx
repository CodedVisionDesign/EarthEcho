"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode, CSSProperties, ElementType } from "react";

/* ── Cinematic entrance variants (AOS-style) ── */

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

const zoomInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(6px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
};

const slideUpBigVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const flipUpVariants: Variants = {
  hidden: { opacity: 0, rotateX: -20, y: 30 },
  visible: { opacity: 1, rotateX: 0, y: 0 },
};

const blurInVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
};

const slideUpFadeVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const VARIANT_MAP = {
  "fade-up": fadeUpVariants,
  fade: fadeVariants,
  scale: scaleVariants,
  "slide-left": slideLeftVariants,
  "slide-right": slideRightVariants,
  "zoom-in": zoomInVariants,
  "slide-up-big": slideUpBigVariants,
  "flip-up": flipUpVariants,
  "blur-in": blurInVariants,
  "slide-up-fade": slideUpFadeVariants,
} as const;

/* ── Easing presets ── */
const EASE_CINEMATIC: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_SMOOTH: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface FadeInProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Animation variant. Default: "fade-up" */
  variant?: keyof typeof VARIANT_MAP;
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Render as a different element */
  as?: ElementType;
  /** IntersectionObserver margin */
  viewMargin?: string;
  /** Use cinematic (dramatic) easing */
  cinematic?: boolean;
}

export function FadeIn({
  children,
  className,
  style,
  variant = "fade-up",
  delay = 0,
  duration = 0.55,
  as = "div",
  viewMargin = "-60px",
  cinematic = false,
}: FadeInProps) {
  const prefersReduced = useReducedMotion();
  const Component = motion.create(as);
  const variants = VARIANT_MAP[variant];

  if (prefersReduced) {
    const El = as as ElementType;
    return (
      <El className={className} style={style}>
        {children}
      </El>
    );
  }

  return (
    <Component
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewMargin }}
      transition={{
        duration: cinematic ? Math.max(duration, 0.7) : duration,
        delay,
        ease: cinematic ? EASE_CINEMATIC : EASE_SMOOTH,
      }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
}

/* ── Stagger container for lists/grids ── */

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_SMOOTH } },
};

const staggerScaleItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_SMOOTH } },
};

const staggerSlideLeftItemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_CINEMATIC } },
};

const staggerSlideRightItemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_CINEMATIC } },
};

const staggerZoomItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(4px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE_CINEMATIC } },
};

const staggerFlipItemVariants: Variants = {
  hidden: { opacity: 0, rotateX: -15, y: 20 },
  visible: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.5, ease: EASE_CINEMATIC } },
};

type StaggerItemVariantType = "fade-up" | "scale" | "slide-left" | "slide-right" | "zoom-in" | "flip-up";

const STAGGER_ITEM_MAP: Record<StaggerItemVariantType, Variants> = {
  "fade-up": staggerItemVariants,
  scale: staggerScaleItemVariants,
  "slide-left": staggerSlideLeftItemVariants,
  "slide-right": staggerSlideRightItemVariants,
  "zoom-in": staggerZoomItemVariants,
  "flip-up": staggerFlipItemVariants,
};

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  /** Stagger delay between children in seconds */
  stagger?: number;
  /** Item animation style */
  itemVariant?: StaggerItemVariantType;
  viewMargin?: string;
}

export function StaggerGroup({
  children,
  className,
  style,
  as = "div",
  stagger = 0.06,
  itemVariant = "fade-up",
  viewMargin = "-60px",
}: StaggerGroupProps) {
  const prefersReduced = useReducedMotion();
  const Component = motion.create(as);

  if (prefersReduced) {
    const El = as as ElementType;
    return (
      <El className={className} style={style}>
        {children}
      </El>
    );
  }

  const containerVars: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  };

  return (
    <Component
      variants={containerVars}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewMargin }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
  variant?: StaggerItemVariantType;
}

export function StaggerItem({
  children,
  className,
  style,
  as = "div",
  variant = "fade-up",
}: StaggerItemProps) {
  const Component = motion.create(as);
  const vars = STAGGER_ITEM_MAP[variant];

  return (
    <Component variants={vars} className={className} style={style}>
      {children}
    </Component>
  );
}
