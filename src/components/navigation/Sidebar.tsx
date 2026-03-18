"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Logo } from "@/components/ui/Logo";
import {
  faChartLine,
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
  faTrophy,
  faBullseye,
  faMedal,
  faComments,
  faLink,
  faBookOpen,
  faCircleUser,
  faGear,
  faBars,
  faXmark,
} from "@/lib/fontawesome";

interface NavItem {
  href: string;
  label: string;
  icon: IconDefinition;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: faChartLine },
    ],
  },
  {
    title: "Track",
    items: [
      { href: "/track/water", label: "Water", icon: faDroplet },
      { href: "/track/carbon", label: "Carbon", icon: faEarthAmericas },
      { href: "/track/plastic", label: "Plastic", icon: faBagShopping },
      { href: "/track/recycling", label: "Recycling", icon: faRecycle },
      { href: "/track/transport", label: "Transport", icon: faCar },
      { href: "/track/shopping", label: "Fashion", icon: faShirt },
    ],
  },
  {
    title: "Community",
    items: [
      { href: "/challenges", label: "Challenges", icon: faBullseye },
      { href: "/leaderboard", label: "Leaderboard", icon: faTrophy },
      { href: "/badges", label: "Badges", icon: faMedal },
      { href: "/forum", label: "Forum", icon: faComments },
    ],
  },
  {
    title: "More",
    items: [
      { href: "/guides", label: "Guides", icon: faBookOpen },
      { href: "/resources", label: "Resources", icon: faLink },
    ],
  },
];

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <li>
      <Link
        href={item.href}
        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-forest/8 text-forest"
            : "text-slate hover:bg-gray-100 hover:text-charcoal"
        }`}
      >
        {/* Active indicator bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-forest" />
        )}
        <FontAwesomeIcon
          icon={item.icon}
          className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
            isActive
              ? "text-forest"
              : "text-slate/60 group-hover:text-charcoal"
          }`}
          aria-hidden
        />
        {item.label}
      </Link>
    </li>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="border-b border-gray-200/80 px-6 py-4">
        <Link href="/dashboard" className="inline-flex">
          <Logo size="md" textClassName="text-charcoal" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            <h3 className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate/50">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200/80 p-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-gray-100"
        >
          <FontAwesomeIcon
            icon={faCircleUser}
            className="h-7 w-7 text-slate/40"
            aria-hidden
          />
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium text-charcoal">
              My Profile
            </div>
            <div className="text-[11px] text-slate/60">View settings</div>
          </div>
          <FontAwesomeIcon
            icon={faGear}
            className="h-3.5 w-3.5 text-slate/30"
            aria-hidden
          />
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md transition-transform duration-200 hover:scale-105 md:hidden"
        aria-label="Open navigation menu"
      >
        <FontAwesomeIcon icon={faBars} className="h-4 w-4 text-charcoal" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate/60 transition-colors hover:bg-gray-100 hover:text-charcoal"
          aria-label="Close navigation menu"
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200/80 bg-white md:flex">
        {sidebarContent}
      </aside>
    </>
  );
}
