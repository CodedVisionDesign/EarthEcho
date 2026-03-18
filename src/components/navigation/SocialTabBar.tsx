"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faTrophy,
  faComments,
} from "@/lib/fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface SocialTab {
  href: string;
  label: string;
  icon: IconDefinition;
}

const SOCIAL_TABS: SocialTab[] = [
  { href: "/challenges", label: "Challenges", icon: faBullseye },
  { href: "/leaderboard", label: "Leaderboard", icon: faTrophy },
  { href: "/forum", label: "Forum", icon: faComments },
];

export function SocialTabBar() {
  const pathname = usePathname();

  return (
    <div className="mb-4 -mx-4 px-4 md:mx-0 md:px-0">
      <nav
        className="flex gap-1 rounded-xl bg-white/40 p-1"
        aria-label="Social sections"
      >
        {SOCIAL_TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white text-forest shadow-sm"
                  : "text-charcoal/50 hover:text-charcoal/70"
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="h-3.5 w-3.5" aria-hidden />
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
