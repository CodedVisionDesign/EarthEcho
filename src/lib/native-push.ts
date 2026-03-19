"use client";

import { subscribeToPush } from "./notification-actions";

/**
 * Registers for native push notifications when running inside Capacitor.
 * Falls back silently on web (where the existing web-push flow handles it).
 *
 * Call this once after the user is authenticated (e.g., on dashboard mount).
 */
export async function registerNativePush() {
  try {
    const isNative = !!(window as unknown as Record<string, unknown>).Capacitor;
    if (!isNative) return;

    const { PushNotifications } = await import("@capacitor/push-notifications");

    // Request permission
    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== "granted") return;

    // Register with APNs / FCM
    await PushNotifications.register();

    // Listen for the registration token
    PushNotifications.addListener("registration", async (token) => {
      // Store the native push token as a push subscription on the server.
      // We use the token as both endpoint and key so the server can
      // distinguish native vs web subscriptions by endpoint prefix.
      await subscribeToPush({
        endpoint: `native://${token.value}`,
        keys: { p256dh: token.value, auth: "native" },
      }).catch(() => {});
    });

    // Handle notification received while app is in foreground
    PushNotifications.addListener("pushNotificationReceived", () => {
      // Foreground notification received — no action needed
    });

    // Handle notification tapped
    PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      const href = action.notification.data?.href || "/dashboard";
      window.location.href = href;
    });
  } catch {
    // Not in Capacitor or plugin not available — silent fallback
  }
}
