"use client";

import { useEffect } from "react";
import { subscribeToPush } from "@/lib/notification-actions";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then(async (reg) => {
        // Re-sync existing push subscription to the server on each visit.
        // This handles cases where the SW was updated, the subscription
        // rotated, or the DB record was cleaned up as expired.
        if ("PushManager" in window) {
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            const json = sub.toJSON();
            if (json.endpoint && json.keys) {
              subscribeToPush({
                endpoint: json.endpoint,
                keys: {
                  p256dh: json.keys.p256dh || "",
                  auth: json.keys.auth || "",
                },
              }).catch(() => {});
            }
          }
        }
      })
      .catch(() => {
        // Service worker registration failed — non-critical
      });
  }, []);

  return null;
}
