"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faGauge,
  faUsers,
  faComments,
  faClipboardList,
  faArrowLeft,
  faBars,
  faXmark,
  faEnvelopeOpenText,
} from "@/lib/fontawesome";
import { Logo } from "@/components/ui/Logo";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface NavLink {
  href: string;
  label: string;
  icon: IconDefinition;
  superadminOnly?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "/admin", label: "Dashboard", icon: faGauge },
  { href: "/admin/users", label: "Users", icon: faUsers },
  { href: "/admin/forum", label: "Forum", icon: faComments },
  { href: "/admin/emails", label: "Emails", icon: faEnvelopeOpenText },
  { href: "/admin/audit", label: "Audit Log", icon: faClipboardList, superadminOnly: true },
];

interface AdminNavProps {
  role: string;
  userName: string;
  userImage: string | null;
}

export function AdminNav({ role, userName, userImage }: AdminNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isSuperAdmin = role === "superadmin" || role === "developer";
  const visibleLinks = NAV_LINKS.filter(
    (link) => !link.superadminOnly || isSuperAdmin,
  );

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-2.5">
            <Logo size="xs" showText={false} />
            <span className="text-base font-bold text-charcoal tracking-tight">
              EarthEcho <span className="text-forest">Admin</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-forest/10 text-forest"
                    : "text-slate hover:bg-gray-100 hover:text-charcoal"
                }`}
              >
                <FontAwesomeIcon icon={link.icon} className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User info + Back to app + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* User profile */}
            <div className="hidden items-center gap-2 md:flex">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest">
                  {userName[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-xs font-medium text-charcoal">{userName}</span>
            </div>
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-slate transition-colors hover:bg-gray-50 hover:text-charcoal md:flex"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
              Back to App
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate hover:bg-gray-100 md:hidden"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon
                icon={mobileOpen ? faXmark : faBars}
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-gray-100 bg-white px-4 pb-3 pt-2 md:hidden">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-forest/10 text-forest"
                    : "text-slate hover:bg-gray-50"
                }`}
              >
                <FontAwesomeIcon icon={link.icon} className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center gap-2.5 rounded-lg border-t border-gray-100 px-3 pt-3 pb-1 text-sm font-medium text-slate hover:text-charcoal"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
              Back to App
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
