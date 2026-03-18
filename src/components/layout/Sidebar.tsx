"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
  faCircleUser,
  faGear,
  faBars,
  faXmark,
  faRightFromBracket,
  faShieldHalved,
} from "@/lib/fontawesome";

interface SidebarProps {
  userName?: string;
  userImage?: string;
  userRole?: string;
}

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
            ? "bg-forest/15 text-forest"
            : "text-charcoal/70 hover:bg-white/50 hover:text-charcoal"
        }`}
      >
        {/* Active indicator bar */}
        {isActive && (
          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-forest shadow-[0_0_8px_rgba(45,106,79,0.4)]" />
        )}
        <FontAwesomeIcon
          icon={item.icon}
          className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
            isActive
              ? "text-forest"
              : "text-charcoal/40 group-hover:text-charcoal/70"
          }`}
          aria-hidden
        />
        {item.label}
      </Link>
    </li>
  );
}

export function Sidebar({ userName, userImage, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = userRole === "admin" || userRole === "superadmin" || userRole === "developer";

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="border-b border-white/30 px-6 py-4">
        <Link href="/dashboard" className="inline-flex">
          <Logo size="md" textClassName="text-charcoal" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            <h3 className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal/35">
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

        {/* Admin link */}
        {isAdmin && (
          <div className="mb-5">
            <h3 className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal/35">
              Admin
            </h3>
            <ul className="space-y-0.5">
              <NavLink
                item={{ href: "/admin", label: "Admin Panel", icon: faShieldHalved }}
                pathname={pathname}
              />
            </ul>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-white/30 p-3">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-white/40"
        >
          {userImage ? (
            <Image
              src={userImage}
              alt={userName || "User avatar"}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover ring-2 ring-white/40"
            />
          ) : (
            <FontAwesomeIcon
              icon={faCircleUser}
              className="h-7 w-7 text-charcoal/30"
              aria-hidden
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium text-charcoal">
              {userName || "My Profile"}
            </div>
            <div className="text-[11px] text-charcoal/40">View settings</div>
          </div>
          <FontAwesomeIcon
            icon={faGear}
            className="h-3.5 w-3.5 text-charcoal/25"
            aria-hidden
          />
        </Link>

        {/* Sign out button */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal/60 transition-colors duration-200 hover:bg-coral/10 hover:text-coral"
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="h-4 w-4"
            aria-hidden
          />
          Sign out
        </button>
      </div>
    </>
  );

  /* Shared glass inline styles */
  const glassStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.45)",
    backdropFilter: "blur(20px) saturate(1.4)",
    WebkitBackdropFilter: "blur(20px) saturate(1.4)",
    boxShadow:
      "inset 0 1px 0 0 rgba(255,255,255,0.6), inset 0 -1px 0 0 rgba(255,255,255,0.2), 8px 0 32px rgba(0,0,0,0.04)",
    borderRight: "1px solid rgba(255, 255, 255, 0.35)",
  };

  return (
    <>
      {/* Mobile hamburger button - glass pill */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105 md:hidden"
        style={{
          background: "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(16px) saturate(1.4)",
          WebkitBackdropFilter: "blur(16px) saturate(1.4)",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 0 rgba(255,255,255,0.6)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
        }}
        aria-label="Open navigation menu"
      >
        <FontAwesomeIcon icon={faBars} className="h-4 w-4 text-charcoal" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile sidebar - glass */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          ...glassStyle,
          borderRight: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-charcoal/50 transition-colors hover:bg-white/40 hover:text-charcoal"
          aria-label="Close navigation menu"
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar - glass */}
      <aside
        className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col md:flex"
        style={glassStyle}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
