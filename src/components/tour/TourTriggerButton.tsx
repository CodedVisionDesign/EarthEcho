"use client";

import { useTour } from "./TourProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute } from "@/lib/fontawesome";

/**
 * Button users can click to re-take the tour.
 * Rendered inside the Getting Started Guide or profile.
 */
export function TourTriggerButton() {
  const { start, isActive } = useTour();

  if (isActive) return null;

  return (
    <button
      type="button"
      onClick={start}
      className="inline-flex items-center gap-2 rounded-xl border border-forest/20 bg-forest/5 px-4 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-forest/10"
    >
      <FontAwesomeIcon icon={faRoute} className="h-3.5 w-3.5" />
      Take a Tour
    </button>
  );
}
