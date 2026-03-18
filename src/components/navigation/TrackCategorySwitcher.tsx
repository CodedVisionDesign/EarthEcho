"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
} from "@/lib/fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface TrackCategory {
  href: string;
  label: string;
  icon: IconDefinition;
}

const TRACK_CATEGORIES: TrackCategory[] = [
  { href: "/track/water", label: "Water", icon: faDroplet },
  { href: "/track/carbon", label: "Carbon", icon: faEarthAmericas },
  { href: "/track/plastic", label: "Plastic", icon: faBagShopping },
  { href: "/track/recycling", label: "Recycling", icon: faRecycle },
  { href: "/track/transport", label: "Transport", icon: faCar },
  { href: "/track/shopping", label: "Fashion", icon: faShirt },
];

export function TrackCategorySwitcher() {
  const pathname = usePathname();

  // Don't show on the /track hub page itself
  const isHubPage = pathname === "/track";
  if (isHubPage) return null;

  return (
    <div className="mb-4 -mx-4 px-4 md:mx-0 md:px-0">
      <nav
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
        aria-label="Track categories"
      >
        {TRACK_CATEGORIES.map((cat) => {
          const isActive = pathname === cat.href || pathname.startsWith(cat.href + "/");
          return (
            <Link
              key={cat.href}
              href={cat.href}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-forest text-white shadow-sm"
                  : "bg-white/60 text-charcoal/70 hover:bg-white/80 hover:text-charcoal"
              }`}
            >
              <FontAwesomeIcon icon={cat.icon} className="h-3.5 w-3.5" aria-hidden />
              {cat.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
