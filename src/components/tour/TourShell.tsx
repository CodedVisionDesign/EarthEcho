"use client";

import { useCallback, type ReactNode } from "react";
import { TourProvider } from "./TourProvider";
import { TourOverlay } from "./TourOverlay";
import { completeTour } from "@/lib/actions";

export function TourShell({ children }: { children: ReactNode }) {
  const handleComplete = useCallback(async () => {
    await completeTour();
  }, []);

  return (
    <TourProvider onComplete={handleComplete}>
      {children}
      <TourOverlay />
    </TourProvider>
  );
}
