"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleUser,
  faLink,
  faBookOpen,
  faShieldHalved,
  faRightFromBracket,
  faBell,
} from "@/lib/fontawesome";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
  userImage?: string;
  userRole?: string;
}

interface SheetItem {
  href: string;
  label: string;
  icon: IconDefinition;
}

export function BottomSheet({
  open,
  onClose,
  userName,
  userImage,
  userRole,
}: BottomSheetProps) {
  const pathname = usePathname();
  const sheetRef = useRef<HTMLDivElement>(null);

  const isAdmin =
    userRole === "admin" ||
    userRole === "superadmin" ||
    userRole === "developer";

  const items: SheetItem[] = [
    { href: "/profile", label: "Profile & Settings", icon: faCircleUser },
    { href: "/guides", label: "Guides", icon: faBookOpen },
    { href: "/resources", label: "Resources", icon: faLink },
  ];

  if (isAdmin) {
    items.push({ href: "/admin", label: "Admin Panel", icon: faShieldHalved });
  }

  // Close on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="absolute bottom-0 left-0 right-0 animate-slide-up rounded-t-2xl bg-white shadow-xl"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="More options"
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* User section */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 pb-4">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName || "User avatar"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-forest/20"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/10">
              <FontAwesomeIcon
                icon={faCircleUser}
                className="h-6 w-6 text-forest/40"
                aria-hidden
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-charcoal">
              {userName || "My Profile"}
            </div>
            <div className="text-xs text-slate">View profile & settings</div>
          </div>
        </div>

        {/* Menu items */}
        <div className="py-2">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-forest/5 text-forest"
                    : "text-charcoal/80 hover:bg-gray-50"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`h-5 w-5 ${
                    isActive ? "text-forest" : "text-charcoal/35"
                  }`}
                  aria-hidden
                />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Sign out */}
        <div className="border-t border-gray-100 px-5 py-3">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-coral transition-colors duration-150 hover:bg-coral/5"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="h-5 w-5"
              aria-hidden
            />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
