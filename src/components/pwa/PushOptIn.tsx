"use client";

import { useState, useEffect, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faXmark, faSpinner } from "@/lib/fontawesome";
import { subscribeToPush } from "@/lib/notification-actions";

const DISMISSED_KEY = "push-optin-dismissed";
const DISMISS_DAYS = 14;

/**
 * Shows a dismissible banner prompting the user to enable push notifications.
 * Only appears when:
 * - Browser supports push + service workers
 * - User hasn't already subscribed to push
 * - User hasn't dismissed the banner recently
 * - Notification permission is not permanently denied
 */
export function PushOptIn() {
  const [show, setShow] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Don't show if push isn't supported
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;

    // Don't show if already permanently denied
    if (Notification.permission === "denied") return;

    // Don't show if recently dismissed
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DAYS * 86400000) return;
    }

    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (!sub) setShow(true);
      });
    });
  }, []);

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setShow(false);
  }

  function handleEnable() {
    startTransition(async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
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
        }
        setShow(false);
      } catch {
        // User denied or error — hide the prompt
        handleDismiss();
      }
    });
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-slide-up sm:left-auto">
      <div className="flex items-start gap-3 rounded-2xl border border-forest/20 bg-white p-4 shadow-xl">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest/10">
          <FontAwesomeIcon icon={faBell} className="h-4.5 w-4.5 text-forest" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-charcoal">Enable notifications?</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate">
            Get notified about replies, badges, and challenges — even when the app is closed.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleEnable}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-50"
            >
              {isPending ? (
                <FontAwesomeIcon icon={faSpinner} className="h-3 w-3 animate-spin" />
              ) : null}
              Enable
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate transition-colors hover:bg-gray-100"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate/40 transition-colors hover:bg-gray-100 hover:text-slate"
          aria-label="Dismiss"
        >
          <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
