"use client";

import { useEffect, useRef } from "react";
import { useTour } from "./TourProvider";

interface TourStarterProps {
  /** Whether the user has already completed the tour */
  tourCompleted: boolean;
  /** Whether onboarding just finished (triggers auto-start after delay) */
  autoStart?: boolean;
}

/**
 * Invisible component that auto-starts the tour for users who haven't
 * completed it yet. Placed on the dashboard page.
 */
export function TourStarter({ tourCompleted, autoStart }: TourStarterProps) {
  const { start, isActive } = useTour();
  const hasStarted = useRef(false);

  useEffect(() => {
    // Only auto-start once, only on desktop, only if tour not completed
    if (hasStarted.current || tourCompleted || isActive) return;
    if (window.innerWidth < 768) return; // Skip on mobile

    if (autoStart) {
      hasStarted.current = true;
      // Small delay so the dashboard renders first
      const timer = setTimeout(() => start(), 800);
      return () => clearTimeout(timer);
    }
  }, [tourCompleted, autoStart, start, isActive]);

  return null;
}
