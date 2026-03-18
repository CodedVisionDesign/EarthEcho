"use server";

import { db } from "./db";
import { auth } from "./auth";
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
} from "./validations";
import { calculateCO2Saved } from "./metrics/transport";
import { sendWelcomeEmail, sendPasswordResetEmail } from "./email";

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

  // Award points based on impact
  const points = calculatePointsForCategory(data.category, data.value);
  await db.pointTransaction.create({
    data: { userId: session.user.id, points, reason: `Logged ${data.category.toLowerCase()} activity` },
  });

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
      if (diffDays === 0) { /* Same day — keep streak, don't increment */ }
      else if (diffDays === 1) newStreak += 1;
      else newStreak = 1; // Streak broken
    } else {
      newStreak = 1;
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        totalPoints: { increment: points },
        streakDays: newStreak,
        lastActiveAt: now,
      },
    });
  }

  // Check and award badges
  const newBadge = await checkAndAwardBadges(session.user.id);

  // Update challenge progress if applicable
  await updateChallengeProgress(session.user.id, data.category, data.value);

  revalidatePath("/dashboard");
  revalidatePath(`/track/${data.category.toLowerCase()}`);

  return { success: true, activity, newBadge };
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

export async function createReply(input: { threadId: string; content: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const thread = await db.thread.findUnique({ where: { id: parsed.data.threadId } });
  if (!thread) return { error: "Thread not found" };

  // Check for auto-blocked moderation words
  const banWords = await db.moderationWord.findMany({ where: { type: "ban" } });
  if (banWords.some((w) => parsed.data.content.toLowerCase().includes(w.word))) {
    return { error: "Your reply contains content that is not allowed." };
  }

  await db.reply.create({
    data: {
      threadId: parsed.data.threadId,
      userId: session.user.id,
      content: parsed.data.content,
    },
  });

  // Check for forum-related badges
  await checkAndAwardBadges(session.user.id);

  revalidatePath(`/forum/${parsed.data.threadId}`);
  return { success: true };
}

export async function toggleReaction(input: { replyId: string; type: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

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

  const reply = await db.reply.findUnique({ where: { id: parsed.data.replyId } });
  if (reply) {
    // Check badges for the reply author (reactions_received)
    await checkAndAwardBadges(reply.userId);
    revalidatePath(`/forum/${reply.threadId}`);
  }
  return { success: true };
}

export async function editThread(input: { id: string; title?: string; content?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

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
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(parsed.data.displayName !== undefined && { displayName: parsed.data.displayName }),
      ...(parsed.data.bio !== undefined && { bio: parsed.data.bio }),
      ...(parsed.data.isPublic !== undefined && { isPublic: parsed.data.isPublic }),
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
}) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "An account with this email already exists" };

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashedPassword,
    },
  });

  // Send welcome email (best-effort)
  sendWelcomeEmail(parsed.data.name, parsed.data.email).catch(() => {});

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
    // Return success to prevent enumeration — silently rate limit
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
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3002";
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

  // Update password and mark token as used in transaction
  await db.$transaction([
    db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
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
        return { name: badge.name, icon: badge.icon };
      }
    } catch {
      // Invalid criteria
    }
  }

  return null;
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
