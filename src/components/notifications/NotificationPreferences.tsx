"use client";

import { useState, useEffect, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faEnvelope, faCircleCheck } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/notification-actions";

interface Prefs {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Prefs>({ inApp: true, email: true, push: true });
  const [pushSupported, setPushSupported] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load preferences
    getNotificationPreferences().then((data) => {
      if (data) setPrefs({ inApp: data.inApp, email: data.email, push: data.push });
    });

    // Check push support
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

      // Handle push subscription toggle
      if (key === "push" && pushSupported) {
        const reg = await navigator.serviceWorker.ready;
        if (newPrefs.push) {
          // Subscribe
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
            // User denied permission or error
            setPrefs((p) => ({ ...p, push: false }));
            await updateNotificationPreferences({ push: false });
          }
        } else {
          // Unsubscribe
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

  const options = [
    {
      key: "inApp" as const,
      label: "In-App Notifications",
      description: "Show notifications in the notification bell",
      icon: faBell,
    },
    {
      key: "email" as const,
      label: "Email Notifications",
      description: "Receive email alerts for replies, reactions, and badges",
      icon: faEnvelope,
    },
    {
      key: "push" as const,
      label: "Push Notifications",
      description: pushSupported
        ? "Get push notifications on this device (even when the app is closed)"
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

      <div className="space-y-3">
        {options.map((opt) => (
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
            <button
              type="button"
              onClick={() => handleToggle(opt.key)}
              disabled={isPending || opt.disabled}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                prefs[opt.key] ? "bg-forest" : "bg-gray-300"
              } ${isPending || opt.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              role="switch"
              aria-checked={prefs[opt.key]}
              aria-label={opt.label}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  prefs[opt.key] ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
