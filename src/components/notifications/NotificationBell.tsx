"use client";

import { useState, useEffect, useRef, useCallback, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faComments,
  faCircleCheck,
  faTrophy,
  faBullseye,
  faMedal,
  faXmark,
} from "@/lib/fontawesome";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/notification-actions";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: Date;
}

const TYPE_ICONS: Record<string, { icon: IconDefinition; color: string }> = {
  reply: { icon: faComments, color: "bg-ocean/10 text-ocean" },
  thread_follow: { icon: faComments, color: "bg-forest/10 text-forest" },
  reaction: { icon: faCircleCheck, color: "bg-sunshine/15 text-amber-600" },
  badge: { icon: faMedal, color: "bg-sunshine/15 text-amber-600" },
  challenge: { icon: faBullseye, color: "bg-forest/10 text-forest" },
  system: { icon: faTrophy, color: "bg-leaf/10 text-leaf" },
};

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const bellRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(() => {
    getNotifications(20).then((data) => {
      setNotifications(data.notifications as Notification[]);
      setUnreadCount(data.unreadCount);
    }).catch(() => {});
  }, []);

  // Fetch on mount and poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close panel when clicking outside (check both bell and panel)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current && !panelRef.current.contains(target) &&
        bellRef.current && !bellRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  function handleNotificationClick(notif: Notification) {
    if (!notif.read) {
      startTransition(async () => {
        await markNotificationRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      });
    }
    if (notif.href) {
      router.push(notif.href);
      setOpen(false);
    }
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    });
  }

  // Render the panel via a portal to document.body so it escapes any
  // containing block created by backdrop-filter / transform on parent elements.
  // This fixes the panel being clipped on iPhone where the bell lives inside
  // glass-styled containers with backdrop-filter.
  const panel = open
    ? createPortal(
        <>
          {/* Backdrop — closes panel on tap (mobile) */}
          <div
            className="fixed inset-0 z-[60] md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={panelRef}
            className="fixed inset-x-3 top-14 z-[70] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 sm:inset-x-auto sm:top-auto sm:w-96 md:w-[28rem]"
            style={
              // On sm+ screens, position the panel relative to the bell button
              typeof window !== "undefined" && window.innerWidth >= 640 && bellRef.current
                ? (() => {
                    const rect = bellRef.current.getBoundingClientRect();
                    const top = rect.bottom + 8;
                    // On desktop (md+), the bell is in the sidebar — anchor panel to the left
                    // so it appears beside/overlapping the main content area, not clipped
                    const isDesktop = window.innerWidth >= 768;
                    return {
                      position: "fixed" as const,
                      top,
                      ...(isDesktop
                        ? { left: Math.max(16, rect.left) }
                        : { right: Math.max(16, window.innerWidth - rect.right) }),
                    };
                  })()
                : undefined
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-charcoal">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={isPending}
                    className="text-[11px] font-medium text-forest hover:text-forest-dark"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-slate/50 hover:bg-gray-100 hover:text-slate"
                  aria-label="Close notifications"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="max-h-[70vh] overflow-y-auto sm:max-h-96">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FontAwesomeIcon icon={faBell} className="mb-2 h-6 w-6 text-slate/20" />
                  <p className="text-sm text-slate">No notifications yet</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notif) => {
                    const typeStyle = TYPE_ICONS[notif.type] || TYPE_ICONS.system;
                    return (
                      <button
                        key={notif.id}
                        type="button"
                        onClick={() => handleNotificationClick(notif)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                          !notif.read ? "bg-forest/[0.03]" : ""
                        }`}
                      >
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeStyle.color}`}>
                          <FontAwesomeIcon icon={typeStyle.icon} className="h-3.5 w-3.5" aria-hidden />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs leading-relaxed ${!notif.read ? "font-semibold text-charcoal" : "text-charcoal/80"}`}>
                              {notif.body}
                            </p>
                            {!notif.read && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-forest" />
                            )}
                          </div>
                          <p className="mt-0.5 text-[10px] text-slate">
                            {timeAgo(notif.createdAt)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2">
                <button
                  type="button"
                  onClick={() => {
                    router.push("/profile");
                    setOpen(false);
                  }}
                  className="w-full text-center text-[11px] font-medium text-forest hover:text-forest-dark"
                >
                  Notification Settings
                </button>
              </div>
            )}
          </div>
        </>,
        document.body
      )
    : null;

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={bellRef}
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) fetchNotifications();
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-charcoal/50 transition-colors hover:bg-white/50 hover:text-charcoal"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-coral text-[9px] font-bold text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {panel}
    </div>
  );
}
