"use server";

import { db } from "./db";
import { auth } from "./auth";
import { checkBanned } from "./auth-guard";
import { revalidatePath } from "next/cache";

// ==========================================
// Notification Queries
// ==========================================

export async function getNotifications(limit = 20) {
  const session = await auth();
  if (!session?.user?.id) return { notifications: [], unreadCount: 0 };

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    db.notification.count({
      where: { userId: session.user.id, read: false },
    }),
  ]);

  return { notifications, unreadCount };
}

export async function getUnreadCount() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  return db.notification.count({
    where: { userId: session.user.id, read: false },
  });
}

// ==========================================
// Notification Mutations
// ==========================================

export async function markNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await db.notification.updateMany({
    where: { id: notificationId, userId: session.user.id },
    data: { read: true },
  });

  return { success: true };
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await db.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/");
  return { success: true };
}

// ==========================================
// Notification Preferences
// ==========================================

export async function getNotificationPreferences() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const prefs = await db.notificationPreference.findUnique({
    where: { userId: session.user.id },
  });

  // Return defaults if no record
  return prefs || { inApp: true, email: true, push: true };
}

export async function updateNotificationPreferences(input: {
  inApp?: boolean;
  email?: boolean;
  push?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  await db.notificationPreference.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      inApp: input.inApp ?? true,
      email: input.email ?? true,
      push: input.push ?? true,
    },
    update: {
      ...(input.inApp !== undefined && { inApp: input.inApp }),
      ...(input.email !== undefined && { email: input.email }),
      ...(input.push !== undefined && { push: input.push }),
    },
  });

  return { success: true };
}

// ==========================================
// Push Subscription Management
// ==========================================

export async function subscribeToPush(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  // Upsert based on userId + endpoint
  const existing = await db.pushSubscription.findFirst({
    where: {
      userId: session.user.id,
      endpoint: subscription.endpoint,
    },
  });

  if (!existing) {
    await db.pushSubscription.create({
      data: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });
  }

  // Also ensure push is enabled in preferences
  await db.notificationPreference.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, push: true },
    update: { push: true },
  });

  return { success: true };
}

export async function unsubscribeFromPush(endpoint: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  await db.pushSubscription.deleteMany({
    where: { userId: session.user.id, endpoint },
  });

  return { success: true };
}
