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
  faGlobe,
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
  streak: { icon: faTrophy, color: "bg-coral/10 text-coral" },
  milestone: { icon: faMedal, color: "bg-sunshine/15 text-amber-600" },
};

type TabKey = "all" | "badges" | "challenges" | "community";

const TABS: { key: TabKey; label: string; types: string[] }[] = [
  { key: "all", label: "All", types: [] },
  { key: "badges", label: "Badges", types: ["badge", "streak", "milestone"] },
  { key: "challenges", label: "Challenges", types: ["challenge"] },
  { key: "community", label: "Community", types: ["reply", "thread_follow", "reaction"] },
];

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

function groupConsecutive(notifications: Notification[]): (Notification | { grouped: true; count: number; representative: Notification })[] {
  const result: (Notification | { grouped: true; count: number; representative: Notification })[] = [];
  let i = 0;

  while (i < notifications.length) {
    let j = i + 1;
    // Group consecutive notifications of the same type with the same title
    while (
      j < notifications.length &&
      notifications[j].type === notifications[i].type &&
      notifications[j].title === notifications[i].title &&
      j - i < 5
    ) {
      j++;
    }

    if (j - i >= 3) {
      result.push({
        grouped: true,
        count: j - i,
        representative: notifications[i],
      });
    } else {
      for (let k = i; k < j; k++) {
        result.push(notifications[k]);
      }
    }
    i = j;
  }

  return result;
}

function isGrouped(item: Notification | { grouped: true; count: number; representative: Notification }): item is { grouped: true; count: number; representative: Notification } {
  return "grouped" in item && item.grouped === true;
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [isPending, startTransition] = useTransition();
  const bellRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(() => {
    getNotifications(30).then((data) => {
      setNotifications(data.notifications as Notification[]);
      setUnreadCount(data.unreadCount);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

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

  // Filter by active tab
  const tabConfig = TABS.find((t) => t.key === activeTab)!;
  const filteredNotifications = tabConfig.types.length > 0
    ? notifications.filter((n) => tabConfig.types.includes(n.type))
    : notifications;

  // Group similar notifications
  const displayItems = groupConsecutive(filteredNotifications);

  // Count unread per tab
  const tabUnreadCounts: Record<TabKey, number> = {
    all: notifications.filter((n) => !n.read).length,
    badges: notifications.filter((n) => !n.read && ["badge", "streak", "milestone"].includes(n.type)).length,
    challenges: notifications.filter((n) => !n.read && n.type === "challenge").length,
    community: notifications.filter((n) => !n.read && ["reply", "thread_follow", "reaction"].includes(n.type)).length,
  };

  const panel = open
    ? createPortal(
        <>
          <div
            className="fixed inset-0 z-[60] md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={panelRef}
            className="fixed inset-x-3 top-14 z-[70] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 sm:inset-x-auto sm:top-auto sm:w-96 md:w-[28rem]"
            style={
              typeof window !== "undefined" && window.innerWidth >= 640 && bellRef.current
                ? (() => {
                    const rect = bellRef.current.getBoundingClientRect();
                    const top = rect.bottom + 8;
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

            {/* Category tabs */}
            <div className="flex border-b border-gray-100 px-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex-1 px-2 py-2 text-[11px] font-medium transition-colors ${
                    activeTab === tab.key
                      ? "text-forest"
                      : "text-slate hover:text-charcoal"
                  }`}
                >
                  {tab.label}
                  {tabUnreadCounts[tab.key] > 0 && (
                    <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-coral px-1 text-[8px] font-bold text-white">
                      {tabUnreadCounts[tab.key]}
                    </span>
                  )}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-forest" />
                  )}
                </button>
              ))}
            </div>

            {/* Notification list */}
            <div className="max-h-[70vh] overflow-y-auto sm:max-h-96">
              {displayItems.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FontAwesomeIcon icon={faBell} className="mb-2 h-6 w-6 text-slate/20" />
                  <p className="text-sm text-slate">
                    {activeTab === "all" ? "No notifications yet" : `No ${tabConfig.label.toLowerCase()} notifications`}
                  </p>
                </div>
              ) : (
                <div>
                  {displayItems.map((item, idx) => {
                    if (isGrouped(item)) {
                      const typeStyle = TYPE_ICONS[item.representative.type] || TYPE_ICONS.system;
                      return (
                        <button
                          key={`group-${idx}`}
                          type="button"
                          onClick={() => {
                            if (item.representative.href) {
                              router.push(item.representative.href);
                              setOpen(false);
                            }
                          }}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 bg-forest/[0.03]"
                        >
                          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeStyle.color}`}>
                            <FontAwesomeIcon icon={typeStyle.icon} className="h-3.5 w-3.5" aria-hidden />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold leading-relaxed text-charcoal">
                              {item.count} {item.representative.title.toLowerCase().includes("reaction") ? "reactions" : "notifications"}
                            </p>
                            <p className="mt-0.5 text-[10px] text-slate">
                              {item.representative.title} and {item.count - 1} more
                            </p>
                          </div>
                        </button>
                      );
                    }

                    const notif = item;
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
