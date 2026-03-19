"use server";

import { db } from "./db";
import { requireAdmin, createAuditLog } from "./admin";

/**
 * Get flagged activities for admin review.
 * Supports filtering by status (PENDING, REVIEWED, DISMISSED).
 */
export async function getFlaggedActivities(status?: string) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  const where = status ? { status } : {};

  const flagged = await db.flaggedActivity.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return { success: true, flagged };
}

/**
 * Review a flagged activity: approve, dismiss, or delete the activity.
 * - approve: marks as REVIEWED, activity stays
 * - dismiss: marks as DISMISSED, activity stays
 * - delete: removes the activity, reverses points, marks as REVIEWED
 */
export async function reviewFlaggedActivity(input: {
  id: string;
  action: "approve" | "dismiss" | "delete";
  note?: string;
}) {
  const admin = await requireAdmin();
  if (!admin) return { error: "Not authorized" };

  const flag = await db.flaggedActivity.findUnique({ where: { id: input.id } });
  if (!flag) return { error: "Flagged activity not found" };
  if (flag.status !== "PENDING") return { error: "Already reviewed" };

  const now = new Date();

  if (input.action === "delete") {
    // Find the activity to calculate points to reverse
    const activity = await db.activity.findUnique({ where: { id: flag.activityId } });

    if (activity) {
      // Calculate points that were awarded for this activity
      const points = calculatePointsForCategory(activity.category, activity.value);

      // Reverse points and delete activity in a transaction
      await db.$transaction([
        db.activity.delete({ where: { id: flag.activityId } }),
        db.pointTransaction.create({
          data: {
            userId: flag.userId,
            points: -points,
            reason: `Admin removed flagged ${activity.category.toLowerCase()} activity`,
          },
        }),
        db.user.update({
          where: { id: flag.userId },
          data: { totalPoints: { decrement: points } },
        }),
        db.flaggedActivity.update({
          where: { id: input.id },
          data: {
            status: "REVIEWED",
            reviewedBy: admin.id,
            reviewedAt: now,
            reviewNote: input.note || "Activity deleted by admin",
          },
        }),
      ]);
    } else {
      // Activity already deleted — just update the flag
      await db.flaggedActivity.update({
        where: { id: input.id },
        data: {
          status: "REVIEWED",
          reviewedBy: admin.id,
          reviewedAt: now,
          reviewNote: input.note || "Activity already deleted",
        },
      });
    }
  } else {
    // approve or dismiss
    await db.flaggedActivity.update({
      where: { id: input.id },
      data: {
        status: input.action === "approve" ? "REVIEWED" : "DISMISSED",
        reviewedBy: admin.id,
        reviewedAt: now,
        reviewNote: input.note || null,
      },
    });
  }

  await createAuditLog({
    adminId: admin.id,
    action: `flagged_activity_${input.action}`,
    targetId: flag.activityId,
    targetType: "activity",
    details: {
      flagId: flag.id,
      userId: flag.userId,
      category: flag.category,
      value: flag.value,
      reason: flag.reason,
      note: input.note,
    },
  });

  return { success: true };
}

// Local copy to avoid circular dependency with actions.ts
function calculatePointsForCategory(category: string, value: number): number {
  switch (category) {
    case "WATER": return Math.max(5, Math.round(value / 10));
    case "CARBON": return Math.max(5, Math.round(value * 10));
    case "PLASTIC": return Math.max(5, Math.round(value * 3));
    case "RECYCLING": return Math.max(5, Math.round(value * 2));
    case "TRANSPORT": return Math.max(5, Math.round(value));
    case "FASHION": return Math.max(5, Math.round(value * 5));
    default: return 10;
  }
}
