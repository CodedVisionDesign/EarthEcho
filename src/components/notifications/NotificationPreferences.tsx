"use client";

import { useState, useEffect, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelope,
  faCircleCheck,
  faMedal,
  faBullseye,
  faComments,
  faGlobe,
  faChevronDown,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/notification-actions";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface Prefs {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

const NOTIFICATION_TYPES: {
  icon: IconDefinition;
  label: string;
  description: string;
  types: string[];
  color: string;
}[] = [
  {
    icon: faMedal,
    label: "Badges & Milestones",
    description: "Badge unlocks, streak milestones, category milestones",
    types: ["badge", "streak", "milestone"],
    color: "text-amber-600",
  },
  {
    icon: faBullseye,
    label: "Challenges",
    description: "New challenges, progress updates, completions",
    types: ["challenge"],
    color: "text-forest",
  },
  {
    icon: faComments,
    label: "Community",
    description: "Forum replies, thread follows, reactions",
    types: ["reply", "thread_follow", "reaction"],
    color: "text-ocean",
  },
  {
    icon: faGlobe,
    label: "System",
    description: "Welcome back, account updates, announcements",
    types: ["system"],
    color: "text-leaf",
  },
];

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
        checked ? "bg-forest" : "bg-gray-300"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Prefs>({ inApp: true, email: true, push: true });
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [showTypes, setShowTypes] = useState(false);

  useEffect(() => {
    getNotificationPreferences().then((data) => {
      if (data) setPrefs({ inApp: data.inApp, email: data.email, push: data.push });
    });

    if ("serviceWorker" in navigator && "PushManager" in window) {
      setPushSupported(true);
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setPushSubscribed(!!sub);
        });
      });
    }
  }, []);

  function handleToggle(key: keyof Prefs) {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);

    startTransition(async () => {
      await updateNotificationPreferences(newPrefs);

      if (key === "push" && pushSupported) {
        const reg = await navigator.serviceWorker.ready;
        if (newPrefs.push) {
          try {
            const sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
            });
            const json = sub.toJSON();
            if (json.endpoint && json.keys) {
              await subscribeToPush({
                endpoint: json.endpoint,
                keys: {
                  p256dh: json.keys.p256dh || "",
                  auth: json.keys.auth || "",
                },
              });
              setPushSubscribed(true);
            }
          } catch {
            setPrefs((p) => ({ ...p, push: false }));
            await updateNotificationPreferences({ push: false });
          }
        } else {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            await unsubscribeFromPush(sub.endpoint);
            await sub.unsubscribe();
            setPushSubscribed(false);
          }
        }
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  const channels = [
    {
      key: "inApp" as const,
      label: "In-App Notifications",
      description: "Show notifications in the notification bell",
      icon: faBell,
    },
    {
      key: "email" as const,
      label: "Email Notifications",
      description: "Receive email alerts for important updates",
      icon: faEnvelope,
    },
    {
      key: "push" as const,
      label: "Push Notifications",
      description: pushSupported
        ? "Get push notifications on this device"
        : "Push notifications are not supported on this browser",
      icon: faBell,
      disabled: !pushSupported,
    },
  ];

  return (
    <Card variant="default" className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest/10">
            <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-forest" aria-hidden />
          </div>
          <h3 className="text-[15px] font-semibold text-charcoal">Notification Preferences</h3>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs font-medium text-forest animate-fade-in">
            <FontAwesomeIcon icon={faCircleCheck} className="h-3 w-3" />
            Saved
          </span>
        )}
      </div>

      {/* Channel toggles */}
      <div className="mb-4 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate/60">
          Delivery Channels
        </p>
        {channels.map((opt) => (
          <div
            key={opt.key}
            className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
              opt.disabled ? "opacity-50" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={opt.icon}
                className="h-3.5 w-3.5 text-slate"
                aria-hidden
              />
              <div>
                <p className="text-sm font-medium text-charcoal">{opt.label}</p>
                <p className="text-xs text-slate">{opt.description}</p>
              </div>
            </div>
            <Toggle
              checked={prefs[opt.key]}
              onChange={() => handleToggle(opt.key)}
              disabled={isPending || opt.disabled}
              label={opt.label}
            />
          </div>
        ))}
      </div>

      {/* Notification types info */}
      <div className="border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => setShowTypes(!showTypes)}
          className="flex w-full items-center justify-between text-left"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate/60">
            Notification Types
          </p>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`h-3 w-3 text-slate/40 transition-transform ${showTypes ? "rotate-180" : ""}`}
          />
        </button>

        {showTypes && (
          <div className="mt-3 space-y-2">
            {NOTIFICATION_TYPES.map((nt) => (
              <div
                key={nt.label}
                className="flex items-center gap-3 rounded-xl bg-gray-50/80 px-4 py-3"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm`}>
                  <FontAwesomeIcon icon={nt.icon} className={`h-3.5 w-3.5 ${nt.color}`} aria-hidden />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{nt.label}</p>
                  <p className="text-[11px] text-slate">{nt.description}</p>
                </div>
                <div className="flex gap-1.5">
                  {prefs.inApp && (
                    <span className="rounded bg-forest/10 px-1.5 py-0.5 text-[9px] font-semibold text-forest">
                      In-App
                    </span>
                  )}
                  {prefs.email && (
                    <span className="rounded bg-ocean/10 px-1.5 py-0.5 text-[9px] font-semibold text-ocean">
                      Email
                    </span>
                  )}
                  {prefs.push && pushSupported && (
                    <span className="rounded bg-sunshine/15 px-1.5 py-0.5 text-[9px] font-semibold text-amber-600">
                      Push
                    </span>
                  )}
                </div>
              </div>
            ))}
            <p className="mt-2 text-[10px] text-slate/60 italic">
              Channel toggles above apply to all notification types. Per-type channel control coming soon.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
