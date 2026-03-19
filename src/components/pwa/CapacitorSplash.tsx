"use client";

import { useEffect, useState } from "react";
import { AnimatedSplash } from "./AnimatedSplash";

/**
 * Shows the animated splash screen for native apps and installed PWAs.
 *
 * Displays when:
 *   1. Running inside Capacitor (native iOS/Android)
 *   2. Installed as a PWA (display-mode: standalone)
 *
 * Does NOT display for regular browser visits.
 *
 * Set NEXT_PUBLIC_SPLASH_PREVIEW=true in .env.local to force-show on web for testing.
 */
export function CapacitorSplash() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const isNative = !!(window as unknown as Record<string, unknown>).Capacitor;
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as Record<string, unknown>).standalone === true;
    const isPreview = process.env.NEXT_PUBLIC_SPLASH_PREVIEW === "true";
    setShowSplash(isNative || isPWA || isPreview);
  }, []);

  if (!showSplash) return null;

  return <AnimatedSplash />;
}
