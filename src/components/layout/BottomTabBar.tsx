"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse,
  faChartLine,
  faGlobe,
  faMedal,
  faBars,
} from "@/lib/fontawesome";
import { BottomSheet } from "./BottomSheet";

interface Tab {
  id: string;
  label: string;
  icon: IconDefinition;
  href?: string;
  matchPaths?: string[];
}

const TABS: Tab[] = [
  {
    id: "home",
    label: "Home",
    icon: faHouse,
    href: "/dashboard",
    matchPaths: ["/dashboard"],
  },
  {
    id: "track",
    label: "Track",
    icon: faChartLine,
    href: "/track",
    matchPaths: ["/track"],
  },
  {
    id: "social",
    label: "Social",
    icon: faGlobe,
    href: "/challenges",
    matchPaths: ["/challenges", "/leaderboard", "/forum"],
  },
  {
    id: "badges",
    label: "Badges",
    icon: faMedal,
    href: "/badges",
    matchPaths: ["/badges"],
  },
  {
    id: "more",
    label: "More",
    icon: faBars,
  },
];

interface BottomTabBarProps {
  userName?: string;
  userImage?: string;
  userRole?: string;
}

export function BottomTabBar({ userName, userImage, userRole }: BottomTabBarProps) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isTabActive = (tab: Tab) => {
    if (tab.id === "more") {
      // Active if on a "more" page (profile, resources, guides, admin)
      return ["/profile", "/resources", "/guides", "/admin"].some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      );
    }
    return tab.matchPaths?.some(
      (p) => pathname === p || pathname.startsWith(p + "/")
    );
  };

  return (
    <>
      <nav
        className="shrink-0 md:hidden"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          boxShadow:
            "0 -1px 0 0 rgba(0,0,0,0.06), 0 -4px 16px rgba(0,0,0,0.04)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        aria-label="Main navigation"
      >
        <div className="flex items-stretch">
          {TABS.map((tab) => {
            const active = isTabActive(tab);

            if (tab.id === "more") {
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-200 ${
                    active || sheetOpen
                      ? "text-forest"
                      : "text-slate hover:text-charcoal"
                  }`}
                  aria-label="More options"
                >
                  <FontAwesomeIcon
                    icon={tab.icon}
                    className="h-5 w-5"
                    aria-hidden
                  />
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.href!}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-200 ${
                  active
                    ? "text-forest"
                    : "text-slate hover:text-charcoal"
                }`}
              >
                <FontAwesomeIcon
                  icon={tab.icon}
                  className="h-5 w-5"
                  aria-hidden
                />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        userName={userName}
        userImage={userImage}
        userRole={userRole}
      />
    </>
  );
}
