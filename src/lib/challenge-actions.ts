"use server";

import { db } from "./db";
import { requireAdmin, requireSuperAdmin, createAuditLog } from "./admin";
import { createNotification, notifyMany } from "./notifications";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const challengeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  category: z.enum(["WATER", "CARBON", "PLASTIC", "RECYCLING", "TRANSPORT", "FASHION"]),
  targetValue: z.number().positive("Target must be a positive number"),
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z.string().transform((s) => new Date(s)),
}).refine((data) => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

// ---------------------------------------------------------------------------
// Create Challenge (admin creates a draft)
// ---------------------------------------------------------------------------

export async function createChallenge(input: {
  title: string;
  description: string;
  category: string;
  targetValue: number;
  startDate: string;
  endDate: string;
}) {
  const admin = await requireAdmin();
  const parsed = challengeSchema.parse(input);

  const challenge = await db.challenge.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      targetValue: parsed.targetValue,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      status: "DRAFT",
      createdById: admin.id,
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "create_challenge",
    targetId: challenge.id,
    targetType: "challenge",
    details: { title: parsed.title, category: parsed.category },
  });

  revalidatePath("/admin/challenges");
  return { success: true, challengeId: challenge.id };
}

// ---------------------------------------------------------------------------
// Update Challenge (only DRAFT or PENDING_REVIEW)
// ---------------------------------------------------------------------------

export async function updateChallenge(
  challengeId: string,
  input: {
    title: string;
    description: string;
    category: string;
    targetValue: number;
    startDate: string;
    endDate: string;
  },
) {
  const admin = await requireAdmin();
  const parsed = challengeSchema.parse(input);

  const challenge = await db.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found");
  if (!["DRAFT", "PENDING_REVIEW"].includes(challenge.status)) {
    throw new Error("Can only edit challenges in Draft or Pending Review status");
  }

  // Only creator or superadmin can edit
  const isSuperAdmin = admin.role === "superadmin" || admin.role === "developer";
  if (challenge.createdById !== admin.id && !isSuperAdmin) {
    throw new Error("Only the creator or a superadmin can edit this challenge");
  }

  await db.challenge.update({
    where: { id: challengeId },
    data: {
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      targetValue: parsed.targetValue,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      // Reset to draft if it was pending review and got edited
      ...(challenge.status === "PENDING_REVIEW" ? { status: "DRAFT", rejectionReason: null } : {}),
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "update_challenge",
    targetId: challengeId,
    targetType: "challenge",
    details: { title: parsed.title },
  });

  revalidatePath("/admin/challenges");
  revalidatePath(`/admin/challenges/${challengeId}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Submit for Review (DRAFT → PENDING_REVIEW)
// ---------------------------------------------------------------------------

export async function submitForReview(challengeId: string) {
  const admin = await requireAdmin();

  const challenge = await db.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found");
  if (challenge.status !== "DRAFT") {
    throw new Error("Only draft challenges can be submitted for review");
  }

  await db.challenge.update({
    where: { id: challengeId },
    data: { status: "PENDING_REVIEW", rejectionReason: null },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "submit_challenge_review",
    targetId: challengeId,
    targetType: "challenge",
    details: { title: challenge.title },
  });

  // Notify all superadmins
  const superadmins = await db.user.findMany({
    where: { role: { in: ["superadmin", "developer"] } },
    select: { id: true },
  });

  for (const sa of superadmins) {
    createNotification({
      userId: sa.id,
      type: "system",
      title: "Challenge Pending Review",
      body: `"${challenge.title}" has been submitted for review.`,
      href: `/admin/challenges/${challengeId}`,
    }).catch(() => {});
  }

  revalidatePath("/admin/challenges");
  revalidatePath(`/admin/challenges/${challengeId}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Approve Challenge (PENDING_REVIEW → APPROVED)
// ---------------------------------------------------------------------------

export async function approveChallenge(challengeId: string) {
  const admin = await requireSuperAdmin();

  const challenge = await db.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found");
  if (challenge.status !== "PENDING_REVIEW") {
    throw new Error("Only challenges pending review can be approved");
  }

  await db.challenge.update({
    where: { id: challengeId },
    data: {
      status: "APPROVED",
      approvedById: admin.id,
      approvedAt: new Date(),
      rejectionReason: null,
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "approve_challenge",
    targetId: challengeId,
    targetType: "challenge",
    details: { title: challenge.title },
  });

  // Notify the creator
  if (challenge.createdById) {
    createNotification({
      userId: challenge.createdById,
      type: "system",
      title: "Challenge Approved",
      body: `Your challenge "${challenge.title}" has been approved and is ready to activate.`,
      href: `/admin/challenges/${challengeId}`,
    }).catch(() => {});
  }

  revalidatePath("/admin/challenges");
  revalidatePath(`/admin/challenges/${challengeId}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Reject Challenge (PENDING_REVIEW → DRAFT)
// ---------------------------------------------------------------------------

export async function rejectChallenge(challengeId: string, reason: string) {
  const admin = await requireSuperAdmin();

  if (!reason.trim()) throw new Error("Rejection reason is required");

  const challenge = await db.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found");
  if (challenge.status !== "PENDING_REVIEW") {
    throw new Error("Only challenges pending review can be rejected");
  }

  await db.challenge.update({
    where: { id: challengeId },
    data: {
      status: "DRAFT",
      rejectionReason: reason.trim(),
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "reject_challenge",
    targetId: challengeId,
    targetType: "challenge",
    details: { title: challenge.title, reason },
  });

  // Notify the creator
  if (challenge.createdById) {
    createNotification({
      userId: challenge.createdById,
      type: "system",
      title: "Challenge Returned for Revision",
      body: `"${challenge.title}" needs changes: ${reason}`,
      href: `/admin/challenges/${challengeId}`,
    }).catch(() => {});
  }

  revalidatePath("/admin/challenges");
  revalidatePath(`/admin/challenges/${challengeId}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Activate Challenge (APPROVED → ACTIVE)
// ---------------------------------------------------------------------------

export async function activateChallenge(challengeId: string) {
  const admin = await requireSuperAdmin();

  const challenge = await db.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found");
  if (challenge.status !== "APPROVED") {
    throw new Error("Only approved challenges can be activated");
  }

  const now = new Date();
  if (challenge.endDate < now) {
    throw new Error("Cannot activate a challenge that has already ended");
  }

  await db.challenge.update({
    where: { id: challengeId },
    data: { status: "ACTIVE", isActive: true },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "activate_challenge",
    targetId: challengeId,
    targetType: "challenge",
    details: { title: challenge.title },
  });

  // Notify all users about the new challenge
  const allUsers = await db.user.findMany({
    select: { id: true },
    where: { role: { not: "BANNED" } },
  });
  const allUserIds = allUsers.map((u) => u.id);
  notifyMany(allUserIds, admin.id, {
    type: "challenge",
    title: "New Challenge Available!",
    body: `"${challenge.title}" is now live. Join now and compete with others!`,
    href: "/challenges",
  }).catch(() => {});

  revalidatePath("/admin/challenges");
  revalidatePath(`/admin/challenges/${challengeId}`);
  revalidatePath("/challenges");
  revalidatePath("/dashboard");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Deactivate Challenge (ACTIVE → COMPLETED)
// ---------------------------------------------------------------------------

export async function deactivateChallenge(challengeId: string) {
  const admin = await requireSuperAdmin();

  const challenge = await db.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found");
  if (challenge.status !== "ACTIVE") {
    throw new Error("Only active challenges can be deactivated");
  }

  await db.challenge.update({
    where: { id: challengeId },
    data: { status: "COMPLETED", isActive: false },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "deactivate_challenge",
    targetId: challengeId,
    targetType: "challenge",
    details: { title: challenge.title },
  });

  revalidatePath("/admin/challenges");
  revalidatePath(`/admin/challenges/${challengeId}`);
  revalidatePath("/challenges");
  revalidatePath("/dashboard");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Archive Challenge (COMPLETED → ARCHIVED)
// ---------------------------------------------------------------------------

export async function archiveChallenge(challengeId: string) {
  const admin = await requireSuperAdmin();

  const challenge = await db.challenge.findUnique({
    where: { id: challengeId },
  });

  if (!challenge) throw new Error("Challenge not found");
  if (challenge.status !== "COMPLETED") {
    throw new Error("Only completed challenges can be archived");
  }

  await db.challenge.update({
    where: { id: challengeId },
    data: { status: "ARCHIVED" },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "archive_challenge",
    targetId: challengeId,
    targetType: "challenge",
    details: { title: challenge.title },
  });

  revalidatePath("/admin/challenges");
  revalidatePath(`/admin/challenges/${challengeId}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Quick Create (superadmin bypass - creates as APPROVED or ACTIVE)
// ---------------------------------------------------------------------------

export async function quickCreateChallenge(input: {
  title: string;
  description: string;
  category: string;
  targetValue: number;
  startDate: string;
  endDate: string;
}) {
  const admin = await requireSuperAdmin();
  const parsed = challengeSchema.parse(input);

  const now = new Date();
  const isWithinDateRange = parsed.startDate <= now && parsed.endDate > now;

  const challenge = await db.challenge.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      targetValue: parsed.targetValue,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      status: isWithinDateRange ? "ACTIVE" : "APPROVED",
      isActive: isWithinDateRange,
      createdById: admin.id,
      approvedById: admin.id,
      approvedAt: new Date(),
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "quick_create_challenge",
    targetId: challenge.id,
    targetType: "challenge",
    details: {
      title: parsed.title,
      category: parsed.category,
      activatedImmediately: isWithinDateRange,
    },
  });

  revalidatePath("/admin/challenges");
  if (isWithinDateRange) {
    revalidatePath("/challenges");
    revalidatePath("/dashboard");
  }

  return { success: true, challengeId: challenge.id };
}
