"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  from?: number;
  /** Duration in ms (converted to spring params internally) */
  duration?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
  direction?: "up" | "down";
  delay?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export function AnimatedCounter({
  value,
  from = 0,
  duration = 1500,
  prefix = "",
  suffix = "",
  separator = ",",
  className = "",
  direction = "up",
  delay = 0,
  onStart,
  onEnd,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // Convert ms duration to spring params
  const durationSec = duration / 1000;
  const damping = 20 + 40 * (1 / durationSec);
  const stiffness = 100 * (1 / durationSec);

  const motionValue = useMotionValue(direction === "down" ? value : from);
  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num: number) => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(value));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;
      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };
      const formatted = Intl.NumberFormat("en-US", options).format(latest);
      return separator ? formatted.replace(/,/g, separator) : formatted;
    },
    [maxDecimals, separator],
  );

  // Set initial text content
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = `${prefix}${formatValue(direction === "down" ? value : from)}${suffix}`;
    }
  }, [from, value, direction, formatValue, prefix, suffix]);

  // Trigger animation when in view
  useEffect(() => {
    if (isInView) {
      onStart?.();

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : value);
      }, delay);

      const endTimeoutId = setTimeout(() => {
        onEnd?.();
      }, delay + duration);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(endTimeoutId);
      };
    }
  }, [isInView, motionValue, direction, from, value, delay, onStart, onEnd, duration]);

  // Subscribe to spring changes and update text
  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${formatValue(latest)}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [springValue, formatValue, prefix, suffix]);

  return <span className={`tabular-nums ${className}`} ref={ref} />;
}
