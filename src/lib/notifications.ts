import webPush from "web-push";
import { db } from "./db";
import { sendNotificationEmail } from "./email";

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    `mailto:${process.env.SMTP_USER || "noreply@earthecho.co.uk"}`,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  body: string;
  href?: string;
}

/**
 * Creates an in-app notification, sends push notification, and optionally sends email.
 * Respects user notification preferences. Never throws — failures are silently logged.
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    // Don't notify the user about their own actions (caller should filter, but double-check)
    const prefs = await db.notificationPreference.findUnique({
      where: { userId: input.userId },
    });

    // Default: all enabled if no preference record exists
    const inApp = prefs?.inApp ?? true;
    const emailEnabled = prefs?.email ?? true;
    const pushEnabled = prefs?.push ?? true;

    // 1. Create in-app notification
    if (inApp) {
      await db.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          body: input.body,
          href: input.href,
        },
      });
    }

    // 2. Send push notification (non-blocking)
    if (pushEnabled && VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
      sendPushToUser(input.userId, {
        title: input.title,
        body: input.body,
        href: input.href,
        tag: `${input.type}-${Date.now()}`,
      }).catch(() => {});
    }

    // 3. Send email notification (non-blocking)
    if (emailEnabled) {
      const user = await db.user.findUnique({
        where: { id: input.userId },
        select: { email: true, name: true },
      });
      if (user?.email) {
        sendNotificationEmail({
          to: user.email,
          userName: user.name || "there",
          title: input.title,
          body: input.body,
          href: input.href,
        }).catch(() => {});
      }
    }
  } catch (error) {
    console.error("[NOTIFICATION ERROR]", error);
  }
}

/**
 * Send push notification to all of a user's subscribed devices.
 */
async function sendPushToUser(
  userId: string,
  payload: { title: string; body: string; href?: string; tag?: string }
) {
  const subscriptions = await db.pushSubscription.findMany({
    where: { userId },
  });

  const payload_str = JSON.stringify(payload);

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webPush
        .sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload_str
        )
        .catch(async (err) => {
          // If subscription is expired/invalid (410 Gone or 404), remove it
          if (err.statusCode === 410 || err.statusCode === 404) {
            await db.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
          }
        })
    )
  );

  return results;
}

/**
 * Notify multiple users at once (e.g., thread followers).
 * Filters out the excludeUserId (the person who triggered the action).
 */
export async function notifyMany(
  userIds: string[],
  excludeUserId: string,
  notification: Omit<CreateNotificationInput, "userId">
) {
  const uniqueIds = [...new Set(userIds)].filter((id) => id !== excludeUserId);

  // Fire all in parallel, non-blocking
  await Promise.allSettled(
    uniqueIds.map((userId) => createNotification({ ...notification, userId }))
  );
}
