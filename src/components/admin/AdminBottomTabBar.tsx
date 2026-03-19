"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faGauge,
  faChartLine,
  faBookOpen,
  faUsers,
  faBars,
} from "@/lib/fontawesome";
import { AdminBottomSheet } from "./AdminBottomSheet";

interface Tab {
  id: string;
  label: string;
  icon: IconDefinition;
  href?: string;
  matchPaths?: string[];
}

const ADMIN_TABS: Tab[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: faGauge,
    href: "/admin",
    matchPaths: ["/admin"],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: faChartLine,
    href: "/admin/analytics",
    matchPaths: ["/admin/analytics"],
  },
  {
    id: "content",
    label: "Content",
    icon: faBookOpen,
    href: "/admin/guides",
    matchPaths: ["/admin/guides", "/admin/resources"],
  },
  {
    id: "users",
    label: "Users",
    icon: faUsers,
    href: "/admin/users",
    matchPaths: ["/admin/users"],
  },
  {
    id: "more",
    label: "More",
    icon: faBars,
  },
];

// Paths handled by the More sheet
const MORE_PATHS = [
  "/admin/forum",
  "/admin/challenges",
  "/admin/badges",
  "/admin/emails",
  "/admin/audit",
];

export function AdminBottomTabBar() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isTabActive = (tab: Tab) => {
    if (tab.id === "more") {
      return MORE_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      );
    }
    if (tab.id === "dashboard") {
      // Only exact match for /admin to avoid matching all admin sub-pages
      return pathname === "/admin";
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
        aria-label="Admin navigation"
      >
        <div className="flex items-stretch">
          {ADMIN_TABS.map((tab) => {
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

      <AdminBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
