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
 *
 * Renders a solid blocking layer during the initial "checking" frame to prevent
 * page content (e.g. login screen) from flashing before the animated splash mounts.
 * On regular browser visits this layer is removed after one frame and is imperceptible.
 */
export function CapacitorSplash() {
  const [state, setState] = useState<"checking" | "show" | "hide">("checking");

  useEffect(() => {
    const isNative = !!(window as unknown as Record<string, unknown>).Capacitor;
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as Record<string, unknown>).standalone === true;
    const isPreview = process.env.NEXT_PUBLIC_SPLASH_PREVIEW === "true";
    setState(isNative || isPWA || isPreview ? "show" : "hide");
  }, []);

  if (state === "hide") return null;

  // During "checking" render a solid blocker that matches the splash background.
  // This covers the page for a single frame until useEffect resolves.
  if (state === "checking") {
    return (
      <div
        className="fixed inset-0 z-[9999] bg-[#0a1a12]"
        aria-hidden="true"
      />
    );
  }

  return <AnimatedSplash />;
}
