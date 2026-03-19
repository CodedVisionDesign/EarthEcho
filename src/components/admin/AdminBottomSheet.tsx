"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faComments,
  faTrophy,
  faMedal,
  faEnvelopeOpenText,
  faClipboardList,
  faArrowLeft,
} from "@/lib/fontawesome";

interface AdminBottomSheetProps {
  open: boolean;
  onClose: () => void;
}

interface SheetItem {
  href: string;
  label: string;
  icon: IconDefinition;
}

const SHEET_ITEMS: SheetItem[] = [
  { href: "/admin/forum", label: "Forum Management", icon: faComments },
  { href: "/admin/challenges", label: "Challenges", icon: faTrophy },
  { href: "/admin/badges", label: "Badges", icon: faMedal },
  { href: "/admin/emails", label: "Emails", icon: faEnvelopeOpenText },
  { href: "/admin/audit", label: "Audit Log", icon: faClipboardList },
  { href: "/dashboard", label: "Back to App", icon: faArrowLeft },
];

export function AdminBottomSheet({ open, onClose }: AdminBottomSheetProps) {
  const pathname = usePathname();
  const sheetRef = useRef<HTMLDivElement>(null);

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
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        role="dialog"
        aria-modal="true"
        aria-label="More admin options"
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="border-b border-gray-100 px-5 pb-3">
          <h3 className="text-sm font-semibold text-charcoal">More Options</h3>
        </div>

        {/* Menu items */}
        <div className="py-2">
          {SHEET_ITEMS.map((item) => {
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
                    : item.href === "/dashboard"
                      ? "text-ocean hover:bg-ocean/5"
                      : "text-charcoal/80 hover:bg-gray-50"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-forest"
                      : item.href === "/dashboard"
                        ? "text-ocean"
                        : "text-charcoal/35"
                  }`}
                  aria-hidden
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
