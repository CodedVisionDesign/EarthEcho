"use server";

import { db } from "./db";
import { auth } from "./auth";
import { checkBanned } from "./auth-guard";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  activitySchema,
  updateActivitySchema,
  threadSchema,
  replySchema,
  reactionSchema,
  editThreadSchema,
  editReplySchema,
  profileSchema,
  registerSchema,
  guideCommentSchema,
  DAILY_POINT_CAP,
  ANOMALY_THRESHOLDS,
} from "./validations";
import { calculateCO2Saved } from "./metrics/transport";
import { sendWelcomeEmail, sendPasswordResetEmail } from "./email";
import { createNotification, notifyMany } from "./notifications";
import { isRateLimited } from "./rate-limit";

// ==========================================
// Activity Actions
// ==========================================

export async function logActivity(input: {
  category: string;
  type: string;
  value: number;
  unit: string;
  note?: string;
  date?: string;
  transportMode?: string;
  distanceKm?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };
  if (isRateLimited(`activity:${session.user.id}`, 20, 60_000)) return { error: "Too many requests. Please slow down." };

  const parsed = activitySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;
  let co2Saved: number | undefined;

  if (data.category === "TRANSPORT" && data.transportMode && data.distanceKm) {
    co2Saved = calculateCO2Saved(data.transportMode, data.distanceKm);
  }

  const activity = await db.activity.create({
    data: {
      userId: session.user.id,
      category: data.category,
      type: data.type,
      value: data.value,
      unit: data.unit,
      note: data.note || null,
      date: data.date ? new Date(data.date) : new Date(),
      transportMode: data.transportMode || null,
      distanceKm: data.distanceKm || null,
      co2Saved: co2Saved || null,
    },
  });

  // Anomaly flagging: flag suspicious values for admin review (non-blocking)
  const anomalyThreshold = ANOMALY_THRESHOLDS[data.category];
  if (anomalyThreshold && data.value > anomalyThreshold) {
    db.flaggedActivity.create({
      data: {
        activityId: activity.id,
        userId: session.user.id,
        reason: `Value ${data.value} exceeds anomaly threshold of ${anomalyThreshold} for ${data.category}`,
        category: data.category,
        value: data.value,
      },
    }).catch(() => {});
  }

  // Daily point cap enforcement (OWASP: business logic abuse prevention)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const todayPoints = await db.pointTransaction.aggregate({
    where: {
      userId: session.user.id,
      createdAt: { gte: todayStart, lt: todayEnd },
      points: { gt: 0 },
    },
    _sum: { points: true },
  });

  const earnedToday = todayPoints._sum.points ?? 0;
  const rawPoints = calculatePointsForCategory(data.category, data.value);
  const cappedPoints = earnedToday >= DAILY_POINT_CAP
    ? 0
    : Math.min(rawPoints, DAILY_POINT_CAP - earnedToday);

  const cappedMessage = cappedPoints < rawPoints
    ? "Daily points limit reached. Your activity is still recorded for streaks and challenges."
    : undefined;

  if (cappedPoints > 0) {
    await db.pointTransaction.create({
      data: { userId: session.user.id, points: cappedPoints, reason: `Logged ${data.category.toLowerCase()} activity` },
    });
  }

  // Update user points and streak
  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (user) {
    const now = new Date();
    const lastActive = user.lastActiveAt;
    let newStreak = user.streakDays;

    if (lastActive) {
      // Compare calendar dates (not timestamps) for accurate streak tracking
      const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      const diffDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) { /* Same day - keep streak, don't increment */ }
      else if (diffDays === 1) newStreak += 1;
      else newStreak = 1; // Streak broken
    } else {
      newStreak = 1;
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        ...(cappedPoints > 0 && { totalPoints: { increment: cappedPoints } }),
        streakDays: newStreak,
        lastActiveAt: now,
      },
    });

    // Streak milestone notifications
    const streakMilestones = [7, 14, 30, 60, 100, 365];
    if (streakMilestones.includes(newStreak) && newStreak !== user.streakDays) {
      createNotification({
        userId: session.user.id,
        type: "badge",
        title: `${newStreak}-Day Streak!`,
        body: `Amazing! You've logged activities for ${newStreak} days in a row. Keep the momentum going!`,
        href: "/dashboard",
      }).catch(() => {});
    }

    // Welcome back notification (3+ days inactive)
    if (lastActive) {
      const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastDate = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      const inactiveDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (inactiveDays >= 3) {
        createNotification({
          userId: session.user.id,
          type: "system",
          title: "Welcome Back!",
          body: `Great to see you again after ${inactiveDays} days! Every action counts toward a greener planet.`,
          href: "/dashboard",
        }).catch(() => {});
      }
    }
  }

  // First activity in a new category notification
  await checkFirstCategoryActivity(session.user.id, data.category);

  // Category milestone notifications
  await checkCategoryMilestone(session.user.id, data.category, data.value);

  // Check and award badges
  const newBadge = await checkAndAwardBadges(session.user.id);

  // Update challenge progress if applicable
  await updateChallengeProgress(session.user.id, data.category, data.value);

  revalidatePath("/dashboard");
  revalidatePath(`/track/${data.category.toLowerCase()}`);

  return { success: true, activity, newBadge, pointsEarned: cappedPoints, cappedMessage };
}

export async function updateActivity(input: {
  id: string;
  type?: string;
  value?: number;
  note?: string;
  date?: string;
  transportMode?: string;
  distanceKm?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };
  if (isRateLimited(`update-activity:${session.user.id}`, 15, 60_000)) return { error: "Too many requests. Please slow down." };

  const parsed = updateActivitySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await db.activity.findUnique({ where: { id: parsed.data.id } });
  if (!existing || existing.userId !== session.user.id) return { error: "Activity not found" };

  let co2Saved: number | undefined;
  const mode = parsed.data.transportMode ?? existing.transportMode;
  const dist = parsed.data.distanceKm ?? existing.distanceKm;
  if (existing.category === "TRANSPORT" && mode && dist) {
    co2Saved = calculateCO2Saved(mode, dist);
  }

  await db.activity.update({
    where: { id: parsed.data.id },
    data: {
      ...(parsed.data.type && { type: parsed.data.type }),
      ...(parsed.data.value && { value: parsed.data.value }),
      ...(parsed.data.note !== undefined && { note: parsed.data.note || null }),
      ...(parsed.data.date && { date: new Date(parsed.data.date) }),
      ...(parsed.data.transportMode && { transportMode: parsed.data.transportMode }),
      ...(parsed.data.distanceKm && { distanceKm: parsed.data.distanceKm }),
      ...(co2Saved !== undefined && { co2Saved }),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/track/${existing.category.toLowerCase()}`);
  return { success: true };
}

export async function deleteActivity(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };
  if (isRateLimited(`delete-activity:${session.user.id}`, 10, 60_000)) return { error: "Too many requests. Please slow down." };

  const existing = await db.activity.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) return { error: "Activity not found" };

  await db.activity.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath(`/track/${existing.category.toLowerCase()}`);
  return { success: true };
}

export async function bulkDeleteActivities(ids: string[]) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };
  if (isRateLimited(`bulk-delete:${session.user.id}`, 3, 60_000)) return { error: "Too many requests. Please slow down." };
  if (ids.length === 0) return { error: "No activities selected" };
  if (ids.length > 100) return { error: "Cannot delete more than 100 at once" };

  // Verify all activities belong to user
  const activities = await db.activity.findMany({
    where: { id: { in: ids }, userId: session.user.id },
  });
  if (activities.length !== ids.length) return { error: "Some activities not found" };

  // Calculate points to deduct
  const pointsToDeduct = activities.reduce((sum, a) => {
    return sum + calculatePointsForCategory(a.category, a.value);
  }, 0);

  // Delete activities and adjust points in transaction
  await db.$transaction([
    db.activity.deleteMany({ where: { id: { in: ids }, userId: session.user.id } }),
    db.pointTransaction.create({
      data: { userId: session.user.id, points: -pointsToDeduct, reason: `Deleted ${ids.length} activities` },
    }),
    db.user.update({
      where: { id: session.user.id },
      data: { totalPoints: { decrement: pointsToDeduct } },
    }),
  ]);

  revalidatePath("/dashboard");
  return { success: true, deletedCount: ids.length };
}

// ==========================================
// Challenge Actions
// ==========================================

export async function joinChallenge(challengeId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  const challenge = await db.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge || !challenge.isActive) return { error: "Challenge not available" };

  const existing = await db.challengeParticipant.findUnique({
    where: { userId_challengeId: { userId: session.user.id, challengeId } },
  });
  if (existing) return { error: "Already joined" };

  await db.challengeParticipant.create({
    data: { userId: session.user.id, challengeId },
  });

  revalidatePath("/challenges");
  revalidatePath("/dashboard");
  return { success: true };
}

// ==========================================
// Forum Actions
// ==========================================

export async function createThread(input: {
  title: string;
  content: string;
  category: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };
  if (isRateLimited(`thread:${session.user.id}`, 5, 60_000)) return { error: "Too many requests. Please slow down." };

  const parsed = threadSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Check for auto-blocked moderation words
  const banWords = await db.moderationWord.findMany({ where: { type: "ban" } });
  const textToCheck = `${parsed.data.title} ${parsed.data.content}`.toLowerCase();
  const blocked = banWords.find((w) => textToCheck.includes(w.word));
  if (blocked) return { error: "Your post contains content that is not allowed." };

  const thread = await db.thread.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      content: parsed.data.content,
      category: parsed.data.category,
    },
  });

  // Check for forum-related badges (first_post, posts_count)
  const newBadge = await checkAndAwardBadges(session.user.id);

  revalidatePath("/forum");
  return { success: true, threadId: thread.id, newBadge };
}

export async function createReply(input: { threadId: string; content: string; parentReplyId?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };
  if (isRateLimited(`reply:${session.user.id}`, 10, 60_000)) return { error: "Too many requests. Please slow down." };

  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const thread = await db.thread.findUnique({
    where: { id: parsed.data.threadId },
    select: { id: true, userId: true, title: true },
  });
  if (!thread) return { error: "Thread not found" };

  // Check for auto-blocked moderation words
  const banWords = await db.moderationWord.findMany({ where: { type: "ban" } });
  if (banWords.some((w) => parsed.data.content.toLowerCase().includes(w.word))) {
    return { error: "Your reply contains content that is not allowed." };
  }

  const reply = await db.reply.create({
    data: {
      threadId: parsed.data.threadId,
      userId: session.user.id,
      content: parsed.data.content,
      parentReplyId: parsed.data.parentReplyId || null,
    },
  });

  // Check for forum-related badges
  await checkAndAwardBadges(session.user.id);

  // --- Notifications (non-blocking) ---
  const replierName = session.user.name || "Someone";
  const threadHref = `/forum/${thread.id}`;

  // 1. Notify thread author (if not the replier)
  if (thread.userId !== session.user.id) {
    createNotification({
      userId: thread.userId,
      type: "reply",
      title: "New reply to your thread",
      body: `${replierName} replied to "${thread.title}"`,
      href: threadHref,
    }).catch(() => {});
  }

  // 2. If this is a nested reply, notify the parent reply author
  if (parsed.data.parentReplyId) {
    const parentReply = await db.reply.findUnique({
      where: { id: parsed.data.parentReplyId },
      select: { userId: true },
    });
    if (parentReply && parentReply.userId !== session.user.id && parentReply.userId !== thread.userId) {
      createNotification({
        userId: parentReply.userId,
        type: "reply",
        title: "Someone replied to your comment",
        body: `${replierName} replied to your comment in "${thread.title}"`,
        href: threadHref,
      }).catch(() => {});
    }
  }

  // 3. Notify other thread followers (people who previously replied)
  const previousRepliers = await db.reply.findMany({
    where: { threadId: thread.id, id: { not: reply.id } },
    select: { userId: true },
    distinct: ["userId"],
  });
  const followerIds = previousRepliers
    .map((r) => r.userId)
    .filter((id) => id !== thread.userId); // thread author already notified above

  if (followerIds.length > 0) {
    notifyMany(followerIds, session.user.id, {
      type: "thread_follow",
      title: "New activity in a thread you follow",
      body: `${replierName} replied in "${thread.title}"`,
      href: threadHref,
    }).catch(() => {});
  }

  revalidatePath(`/forum/${parsed.data.threadId}`);
  return { success: true };
}

export async function toggleReaction(input: { replyId: string; type: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };
  if (isRateLimited(`reaction:${session.user.id}`, 30, 60_000)) return { error: "Too many requests. Please slow down." };

  const parsed = reactionSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await db.reaction.findUnique({
    where: {
      replyId_userId_type: {
        replyId: parsed.data.replyId,
        userId: session.user.id,
        type: parsed.data.type,
      },
    },
  });

  if (existing) {
    await db.reaction.delete({ where: { id: existing.id } });
  } else {
    await db.reaction.create({
      data: {
        replyId: parsed.data.replyId,
        userId: session.user.id,
        type: parsed.data.type,
      },
    });
  }

  const reply = await db.reply.findUnique({
    where: { id: parsed.data.replyId },
    include: { thread: { select: { title: true } } },
  });
  if (reply) {
    // Check badges for the reply author (reactions_received)
    await checkAndAwardBadges(reply.userId);
    revalidatePath(`/forum/${reply.threadId}`);

    // Notify reply author about the reaction (only when adding, not removing)
    if (!existing && reply.userId !== session.user.id) {
      const emojiMap: Record<string, string> = { cheer: "👏", helpful: "💡", inspiring: "⭐" };
      const emoji = emojiMap[parsed.data.type] || "";
      createNotification({
        userId: reply.userId,
        type: "reaction",
        title: "Someone reacted to your reply",
        body: `${session.user.name || "Someone"} reacted ${emoji} to your reply in "${reply.thread.title}"`,
        href: `/forum/${reply.threadId}`,
      }).catch(() => {});
    }
  }
  return { success: true };
}

export async function editThread(input: { id: string; title?: string; content?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  const parsed = editThreadSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const thread = await db.thread.findUnique({ where: { id: parsed.data.id } });
  if (!thread) return { error: "Thread not found" };
  if (thread.userId !== session.user.id) return { error: "Not authorized" };

  await db.thread.update({
    where: { id: parsed.data.id },
    data: {
      ...(parsed.data.title && { title: parsed.data.title }),
      ...(parsed.data.content && { content: parsed.data.content }),
    },
  });

  revalidatePath("/forum");
  revalidatePath(`/forum/${parsed.data.id}`);
  return { success: true };
}

export async function deleteThread(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  const thread = await db.thread.findUnique({ where: { id } });
  if (!thread) return { error: "Thread not found" };
  if (thread.userId !== session.user.id) return { error: "Not authorized" };

  await db.thread.delete({ where: { id } });

  revalidatePath("/forum");
  return { success: true };
}

export async function editReply(input: { id: string; content: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  const parsed = editReplySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const reply = await db.reply.findUnique({ where: { id: parsed.data.id } });
  if (!reply) return { error: "Reply not found" };
  if (reply.userId !== session.user.id) return { error: "Not authorized" };

  await db.reply.update({
    where: { id: parsed.data.id },
    data: { content: parsed.data.content },
  });

  revalidatePath(`/forum/${reply.threadId}`);
  return { success: true };
}

export async function deleteReply(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  const reply = await db.reply.findUnique({ where: { id } });
  if (!reply) return { error: "Reply not found" };
  if (reply.userId !== session.user.id) return { error: "Not authorized" };

  const threadId = reply.threadId;
  await db.reply.delete({ where: { id } });

  revalidatePath(`/forum/${threadId}`);
  return { success: true };
}

// ==========================================
// Profile Actions
// ==========================================

export async function updateProfile(input: {
  displayName?: string;
  bio?: string;
  isPublic?: boolean;
  dateOfBirth?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // GDPR data minimisation: only store DOB for users under 18
  let dobData: { dateOfBirth?: Date | null } = {};
  if (parsed.data.dateOfBirth) {
    const dob = new Date(parsed.data.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    dobData = age < 18 ? { dateOfBirth: dob } : { dateOfBirth: null };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(parsed.data.displayName !== undefined && { displayName: parsed.data.displayName }),
      ...(parsed.data.bio !== undefined && { bio: parsed.data.bio }),
      ...(parsed.data.isPublic !== undefined && { isPublic: parsed.data.isPublic }),
      ...dobData,
    },
  });

  // Check for profile_complete badge
  await checkAndAwardBadges(session.user.id);

  revalidatePath("/profile");
  return { success: true };
}

// ==========================================
// Auth Actions
// ==========================================

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
}) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    // Check if the existing account is banned
    if (existing.banned) {
      return { error: "This account has been suspended and cannot be used. Please contact support if you believe this is an error." };
    }
    return { error: "An account with this email already exists" };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  // Store DOB only for users under 18 (data minimisation per GDPR)
  const dob = new Date(parsed.data.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
      ...(age < 18 && { dateOfBirth: dob }),
    },
  });

  // Send welcome email (best-effort)
  sendWelcomeEmail(parsed.data.name, parsed.data.email).catch(() => {});

  return { success: true };
}

// ==========================================
// Account Deletion (Apple/Google Store requirement)
// ==========================================

export async function deleteOwnAccount(input: { password?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, password: true },
  });
  if (!user) return { error: "User not found" };

  // If user has a password, require it for confirmation
  if (user.password) {
    if (!input.password) return { error: "Password is required to confirm account deletion" };
    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) return { error: "Incorrect password" };
  }

  // All relations have onDelete: Cascade — this removes all user data
  await db.user.delete({ where: { id: session.user.id } });

  return { success: true };
}

// ==========================================
// Onboarding Actions
// ==========================================

export async function completeOnboarding(input: {
  displayName?: string;
  bio?: string;
  interests?: string[];
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, onboardingCompleted: true },
  });

  if (!user) return { error: "User not found" };
  if (user.onboardingCompleted) return { success: true };

  // Update profile fields if provided
  const updateData: Record<string, unknown> = {
    onboardingCompleted: true,
    totalPoints: { increment: 50 },
  };
  if (input.displayName?.trim()) updateData.displayName = input.displayName.trim();
  if (input.bio?.trim()) updateData.bio = input.bio.trim();

  await db.user.update({
    where: { id: session.user.id },
    data: updateData,
  });

  // Record the points transaction
  await db.pointTransaction.create({
    data: {
      userId: session.user.id,
      points: 50,
      reason: "Completed onboarding",
    },
  });

  // Check for profile_complete badge
  await checkAndAwardBadges(session.user.id);

  revalidatePath("/dashboard");
  return { success: true };
}

// ==========================================
// Tour Actions
// ==========================================

export async function completeTour() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, tourCompleted: true },
  });

  if (!user) return { error: "User not found" };
  if (user.tourCompleted) return { success: true }; // Already awarded, no double points

  await db.user.update({
    where: { id: session.user.id },
    data: {
      tourCompleted: true,
      totalPoints: { increment: 25 },
    },
  });

  await db.pointTransaction.create({
    data: {
      userId: session.user.id,
      points: 25,
      reason: "Completed platform tour",
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// ==========================================
// Password Reset Actions (OWASP compliant)
// ==========================================

export async function requestPasswordReset(input: { email: string }) {
  const email = input.email?.trim().toLowerCase();
  if (!email) return { error: "Email is required" };

  // Rate limit: max 3 reset requests per email per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentRequests = await db.passwordResetToken.count({
    where: { email, createdAt: { gte: oneHourAgo } },
  });
  if (recentRequests >= 3) {
    // Return success to prevent enumeration - silently rate limit
    return { success: true };
  }

  const user = await db.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration (OWASP)
  if (!user || !user.password) {
    return { success: true };
  }

  // Generate cryptographically secure token
  const token = crypto.randomBytes(48).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Invalidate previous tokens for this email
  await db.passwordResetToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  await db.passwordResetToken.create({
    data: { email, token, expires },
  });

  // Build reset URL
  const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  // Send email (best-effort)
  sendPasswordResetEmail(user.name ?? "there", email, resetUrl).catch(() => {});

  return { success: true };
}

export async function resetPassword(input: { token: string; password: string }) {
  if (!input.token || !input.password) {
    return { error: "Invalid request" };
  }

  if (input.password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const record = await db.passwordResetToken.findUnique({
    where: { token: input.token },
  });

  if (!record || record.used || record.expires < new Date()) {
    return { error: "This reset link has expired or is invalid. Please request a new one." };
  }

  const user = await db.user.findUnique({ where: { email: record.email } });
  if (!user) {
    return { error: "Account not found" };
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  // Update password, clear any admin-issued reset token, and mark token as used
  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    }),
    db.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
  ]);

  return { success: true };
}

// ==========================================
// Change Password (logged-in users)
// ==========================================

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };

  if (!input.currentPassword || !input.newPassword) {
    return { error: "All fields are required" };
  }

  if (input.newPassword.length < 8) {
    return { error: "New password must be at least 8 characters" };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user?.password) {
    return { error: "Your account uses social login and has no password to change. Set a password via the forgot password flow." };
  }

  const isValid = await bcrypt.compare(input.currentPassword, user.password);
  if (!isValid) {
    return { error: "Current password is incorrect" };
  }

  const hashedPassword = await bcrypt.hash(input.newPassword, 12);
  await db.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

// ==========================================
// Guide Comment Actions
// ==========================================

export async function createGuideComment(input: {
  guideSlug: string;
  content: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  const banned = await checkBanned(session.user.id);
  if (banned) return { error: banned };
  if (isRateLimited(`guide-comment:${session.user.id}`, 5, 60_000)) return { error: "Too many requests. Please slow down." };

  const parsed = guideCommentSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.guideComment.create({
    data: {
      guideSlug: parsed.data.guideSlug,
      userId: session.user.id,
      content: parsed.data.content,
    },
  });

  revalidatePath(`/guides/${parsed.data.guideSlug}`);
  return { success: true };
}

// ==========================================
// Internal Helpers
// ==========================================

function calculatePointsForCategory(category: string, value: number): number {
  switch (category) {
    case "WATER": return Math.max(5, Math.round(value / 10)); // 1pt per 10 litres
    case "CARBON": return Math.max(5, Math.round(value * 10)); // 10pt per kg CO2
    case "PLASTIC": return Math.max(5, Math.round(value * 3)); // 3pt per item
    case "RECYCLING": return Math.max(5, Math.round(value * 2)); // 2pt per kg
    case "TRANSPORT": return Math.max(5, Math.round(value)); // 1pt per km
    case "FASHION": return Math.max(5, Math.round(value * 5)); // 5pt per item
    default: return 10;
  }
}

async function checkAndAwardBadges(userId: string): Promise<{ name: string; icon: string } | null> {
  // Pre-fetch all data needed for every criteria type in parallel
  const [
    user,
    allBadges,
    earnedBadges,
    activityTotals,
    activityCount,
    transportByMode,
    transportCountByMode,
    challengesCompleted,
    reactionsReceived,
    threadCount,
    replyCount,
  ] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.badge.findMany(),
    db.userBadge.findMany({ where: { userId } }),
    db.activity.groupBy({
      by: ["category"],
      where: { userId },
      _sum: { value: true },
    }),
    db.activity.count({ where: { userId } }),
    // Transport distance by mode
    db.activity.groupBy({
      by: ["transportMode"],
      where: { userId, category: "TRANSPORT", transportMode: { not: null } },
      _sum: { distanceKm: true },
    }),
    // Transport count by mode
    db.activity.groupBy({
      by: ["transportMode"],
      where: { userId, category: "TRANSPORT", transportMode: { not: null } },
      _count: true,
    }),
    // Completed challenges (progress >= target)
    db.challengeParticipant.findMany({
      where: { userId },
      include: { challenge: true },
    }),
    // Reactions received on user's replies
    db.reaction.groupBy({
      by: ["type"],
      where: { reply: { userId } },
      _count: true,
    }),
    db.thread.count({ where: { userId } }),
    db.reply.count({ where: { userId } }),
  ]);

  if (!user) return null;

  const earnedIds = new Set(earnedBadges.map((ub) => ub.badgeId));
  const totalsByCategory = new Map(activityTotals.map((t) => [t.category, t._sum.value ?? 0]));
  const distanceByMode = new Map(transportByMode.map((t) => [t.transportMode, t._sum.distanceKm ?? 0]));
  const countByMode = new Map(transportCountByMode.map((t) => [t.transportMode, t._count]));
  const completedChallengeCount = challengesCompleted.filter(
    (p) => p.progress >= p.challenge.targetValue
  ).length;
  const reactionsByType = new Map(reactionsReceived.map((r) => [r.type, r._count]));
  const postsCount = threadCount + replyCount;

  for (const badge of allBadges) {
    if (earnedIds.has(badge.id)) continue;

    try {
      const criteria = JSON.parse(badge.criteria);
      let met = false;

      switch (criteria.type) {
        case "first_activity":
          met = activityCount >= 1;
          break;

        case "streak":
          met = user.streakDays >= criteria.days;
          break;

        case "total": {
          const total = totalsByCategory.get(criteria.category) ?? 0;
          met = total >= criteria.value;
          break;
        }

        case "transport_distance": {
          const km = distanceByMode.get(criteria.mode) ?? 0;
          met = km >= criteria.km;
          break;
        }

        case "transport_count": {
          const count = countByMode.get(criteria.mode) ?? 0;
          met = count >= criteria.count;
          break;
        }

        case "car_free_streak":
        case "flight_free_streak": {
          // Simplified: check days since last car/flight activity
          const modes = criteria.type === "car_free_streak"
            ? ["petrol_car", "diesel_car", "hybrid_car"]
            : ["domestic_flight", "short_haul_flight", "long_haul_flight"];
          const lastActivity = await db.activity.findFirst({
            where: { userId, transportMode: { in: modes } },
            orderBy: { date: "desc" },
          });
          const daysSince = lastActivity
            ? Math.floor((Date.now() - lastActivity.date.getTime()) / (1000 * 60 * 60 * 24))
            : (user.createdAt ? Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 0);
          met = daysSince >= criteria.days;
          break;
        }

        case "challenges_completed":
          met = completedChallengeCount >= criteria.count;
          break;

        case "reactions_received": {
          const count = reactionsByType.get(criteria.reaction) ?? 0;
          met = count >= criteria.count;
          break;
        }

        case "posts_count":
        case "first_post":
          met = criteria.type === "first_post" ? postsCount >= 1 : postsCount >= criteria.count;
          break;

        case "profile_complete":
          met = !!(user.displayName && user.bio);
          break;
      }

      if (met) {
        await db.userBadge.create({ data: { userId, badgeId: badge.id } });

        // Notify user about earning a badge
        createNotification({
          userId,
          type: "badge",
          title: "Badge Earned!",
          body: `You earned the "${badge.name}" badge. Keep up the great work!`,
          href: "/badges",
        }).catch(() => {});

        return { name: badge.name, icon: badge.icon };
      }
    } catch {
      // Invalid criteria
    }
  }

  return null;
}

// ==========================================
// Category Milestone Check
// ==========================================

const CATEGORY_MILESTONES: Record<string, { thresholds: number[]; unit: string }> = {
  WATER: { thresholds: [50, 100, 500, 1000, 5000], unit: "litres of water" },
  CARBON: { thresholds: [10, 50, 100, 500, 1000], unit: "kg CO\u2082" },
  PLASTIC: { thresholds: [25, 50, 100, 500, 1000], unit: "plastic items" },
  RECYCLING: { thresholds: [10, 50, 100, 500, 1000], unit: "kg recycled" },
  TRANSPORT: { thresholds: [50, 100, 500, 1000, 5000], unit: "green km" },
  FASHION: { thresholds: [10, 25, 50, 100, 500], unit: "sustainable fashion items" },
};

async function checkCategoryMilestone(userId: string, category: string, addedValue: number) {
  const milestoneConfig = CATEGORY_MILESTONES[category];
  if (!milestoneConfig) return;

  const result = await db.activity.aggregate({
    where: { userId, category },
    _sum: { value: true },
  });

  const newTotal = result._sum.value ?? 0;
  const previousTotal = newTotal - addedValue;

  for (const threshold of milestoneConfig.thresholds) {
    if (newTotal >= threshold && previousTotal < threshold) {
      createNotification({
        userId,
        type: "badge",
        title: `Milestone Reached!`,
        body: `You've hit ${threshold} ${milestoneConfig.unit}! That's a real impact.`,
        href: `/track/${category.toLowerCase() === "fashion" ? "shopping" : category.toLowerCase()}`,
      }).catch(() => {});
      break; // Only notify for the highest milestone crossed
    }
  }
}

async function updateChallengeProgress(userId: string, category: string, value: number) {
  const participants = await db.challengeParticipant.findMany({
    where: { userId },
    include: { challenge: true },
  });

  for (const p of participants) {
    if (p.challenge.category === category && p.challenge.isActive) {
      const previousProgress = p.progress;
      const updated = await db.challengeParticipant.update({
        where: { id: p.id },
        data: { progress: { increment: value } },
      });

      // Check if just completed (crossed the target threshold)
      if (updated.progress >= p.challenge.targetValue && previousProgress < p.challenge.targetValue) {
        // Award bonus points for completion
        const bonusPoints = 100;
        await db.pointTransaction.create({
          data: { userId, points: bonusPoints, reason: `Completed challenge: ${p.challenge.title}` },
        });
        await db.user.update({
          where: { id: userId },
          data: { totalPoints: { increment: bonusPoints } },
        });

        // Check for challenges_completed badge
        await checkAndAwardBadges(userId);
      }
    }
  }
}

const CATEGORY_NAMES: Record<string, string> = {
  WATER: "Water Conservation",
  CARBON: "Carbon Reduction",
  PLASTIC: "Plastic Avoidance",
  RECYCLING: "Recycling",
  TRANSPORT: "Eco Transport",
  FASHION: "Sustainable Fashion",
};

async function checkFirstCategoryActivity(userId: string, category: string) {
  // Count how many activities this user has in this category
  const count = await db.activity.count({
    where: { userId, category },
  });

  // If this is the first activity (count === 1 since we just created one), notify
  if (count === 1) {
    const label = CATEGORY_NAMES[category] ?? category;
    createNotification({
      userId,
      type: "badge",
      title: `New Category Unlocked!`,
      body: `You logged your first ${label} activity! Explore more ways to make an impact in this category.`,
      href: `/track/${category.toLowerCase() === "fashion" ? "shopping" : category.toLowerCase()}`,
    }).catch(() => {});
  }
}
