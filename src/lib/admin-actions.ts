"use server";

import { db } from "./db";
import { requireAdmin, requireSuperAdmin, requireDeveloper, createAuditLog } from "./admin";
import { revalidatePath } from "next/cache";
import { sendBanNotificationEmail, sendPasswordResetEmail, sendAdminInviteEmail } from "./email";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Ban / Unban
// ---------------------------------------------------------------------------

export async function banUser(userId: string, reason: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();

    const target = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, displayName: true, email: true, role: true },
    });

    if (!target) return { success: false, error: "User not found" };
    if (["admin", "superadmin", "developer"].includes(target.role)) {
      return { success: false, error: "Cannot ban an admin" };
    }

    await db.user.update({
      where: { id: userId },
      data: {
        banned: true,
        banReason: reason,
        bannedAt: new Date(),
        bannedBy: admin.id,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "ban_user",
      targetId: userId,
      targetType: "user",
      details: { reason, targetEmail: target.email, targetName: target.name },
    });

    // Send notification email (best-effort, don't block on failure)
    if (target.email) {
      sendBanNotificationEmail(
        target.name || target.displayName || "there",
        target.email,
        reason,
      ).catch(() => {
        /* email delivery failure is non-critical */
      });
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("[ADMIN] Ban user failed:", e);
    return { success: false, error: e instanceof Error ? e.message : "Failed to ban user" };
  }
}

export async function unbanUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();

    const target = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!target) return { success: false, error: "User not found" };

    await db.user.update({
      where: { id: userId },
      data: {
        banned: false,
        banReason: null,
        bannedAt: null,
        bannedBy: null,
      },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "unban_user",
      targetId: userId,
      targetType: "user",
      details: { targetEmail: target.email, targetName: target.name },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("[ADMIN] Unban user failed:", e);
    return { success: false, error: e instanceof Error ? e.message : "Failed to unban user" };
  }
}

// ---------------------------------------------------------------------------
// Forum moderation
// ---------------------------------------------------------------------------

export async function adminDeleteThread(threadId: string) {
  const admin = await requireAdmin();

  const thread = await db.thread.findUnique({
    where: { id: threadId },
    select: { id: true, title: true, userId: true },
  });

  if (!thread) throw new Error("Thread not found");

  await db.thread.delete({ where: { id: threadId } });

  await createAuditLog({
    adminId: admin.id,
    action: "delete_thread",
    targetId: threadId,
    targetType: "thread",
    details: { title: thread.title, authorId: thread.userId },
  });

  revalidatePath("/admin/forum");
  revalidatePath("/forum");
}

export async function adminDeleteReply(replyId: string) {
  const admin = await requireAdmin();

  const reply = await db.reply.findUnique({
    where: { id: replyId },
    select: { id: true, threadId: true, userId: true, content: true },
  });

  if (!reply) throw new Error("Reply not found");

  await db.reply.delete({ where: { id: replyId } });

  await createAuditLog({
    adminId: admin.id,
    action: "delete_reply",
    targetId: replyId,
    targetType: "reply",
    details: {
      threadId: reply.threadId,
      authorId: reply.userId,
      contentPreview: reply.content.slice(0, 100),
    },
  });

  revalidatePath("/admin/forum");
  revalidatePath(`/forum/${reply.threadId}`);
}

// ---------------------------------------------------------------------------
// Pin / Unpin threads
// ---------------------------------------------------------------------------

export async function togglePinThread(threadId: string) {
  const admin = await requireAdmin();

  const thread = await db.thread.findUnique({
    where: { id: threadId },
    select: { id: true, title: true, isPinned: true },
  });

  if (!thread) throw new Error("Thread not found");

  const newPinned = !thread.isPinned;

  await db.thread.update({
    where: { id: threadId },
    data: { isPinned: newPinned },
  });

  await createAuditLog({
    adminId: admin.id,
    action: newPinned ? "pin_thread" : "unpin_thread",
    targetId: threadId,
    targetType: "thread",
    details: { title: thread.title },
  });

  revalidatePath("/admin/forum");
  revalidatePath("/forum");

  return { isPinned: newPinned };
}

// ---------------------------------------------------------------------------
// Moderation words
// ---------------------------------------------------------------------------

export async function addModerationWord(word: string, type: "flag" | "ban") {
  await requireAdmin();
  const normalized = word.trim().toLowerCase();
  if (!normalized) throw new Error("Word cannot be empty");

  await db.moderationWord.upsert({
    where: { word: normalized },
    update: { type },
    create: { word: normalized, type },
  });

  revalidatePath("/admin/forum");
}

export async function removeModerationWord(id: string) {
  await requireAdmin();
  await db.moderationWord.delete({ where: { id } });
  revalidatePath("/admin/forum");
}

// ---------------------------------------------------------------------------
// Role management (superadmin / developer only)
// ---------------------------------------------------------------------------

const ASSIGNABLE_ROLES = ["user", "admin", "superadmin"] as const;
type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export async function changeUserRole(userId: string, newRole: AssignableRole): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireSuperAdmin();

    if (!ASSIGNABLE_ROLES.includes(newRole)) {
      return { success: false, error: "Invalid role" };
    }

    if (userId === admin.id) {
      return { success: false, error: "You cannot change your own role" };
    }

    const target = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!target) return { success: false, error: "User not found" };
    if (target.role === "developer") {
      return { success: false, error: "Cannot change the role of a developer account" };
    }
    if (target.role === newRole) {
      return { success: false, error: `User is already a ${newRole}` };
    }

    const previousRole = target.role;

    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    await createAuditLog({
      adminId: admin.id,
      action: "change_role",
      targetId: userId,
      targetType: "user",
      details: {
        targetEmail: target.email,
        targetName: target.name,
        previousRole,
        newRole,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("[ADMIN] Change role failed:", e);
    return { success: false, error: e instanceof Error ? e.message : "Failed to change role" };
  }
}

// ---------------------------------------------------------------------------
// Send password reset email (admin-triggered)
// ---------------------------------------------------------------------------

export async function adminSendPasswordReset(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireSuperAdmin();

    const target = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, displayName: true, email: true, password: true },
    });

    if (!target) return { success: false, error: "User not found" };
    if (!target.email) return { success: false, error: "User has no email address" };
    if (!target.password) return { success: false, error: "User uses social login - no password to reset" };

    // Generate a reset token
    const token = crypto.randomBytes(48).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any previous unused tokens for this email
    await db.passwordResetToken.updateMany({
      where: { email: target.email, used: false },
      data: { used: true },
    });

    // Create the token in the PasswordResetToken table (where resetPassword() looks it up)
    await db.passwordResetToken.create({
      data: {
        email: target.email,
        token,
        expires,
      },
    });

    // Also store on the User model so the admin UI can show "reset pending"
    await db.user.update({
      where: { id: userId },
      data: {
        resetToken: token,
        resetTokenExpiry: expires,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://earthecho.co.uk";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(
      target.name || target.displayName || "there",
      target.email,
      resetUrl,
    );

    await createAuditLog({
      adminId: admin.id,
      action: "admin_password_reset",
      targetId: userId,
      targetType: "user",
      details: { targetEmail: target.email, targetName: target.name },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    console.error("[ADMIN] Password reset failed:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return { success: false, error: `Failed to send reset email: ${message}` };
  }
}

// ---------------------------------------------------------------------------
// Invite admin (creates account + sends branded invite email)
// ---------------------------------------------------------------------------

export async function inviteAdmin(email: string, name: string) {
  const admin = await requireSuperAdmin();

  const normalized = email.trim().toLowerCase();
  if (!normalized) throw new Error("Email is required");

  const existing = await db.user.findUnique({ where: { email: normalized } });
  if (existing) throw new Error("A user with this email already exists");

  const tempPassword = crypto.randomBytes(8).toString("base64url");
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  const newAdmin = await db.user.create({
    data: {
      email: normalized,
      name: name.trim() || "Admin",
      displayName: name.trim() || "Admin",
      password: hashedPassword,
      role: "admin",
    },
  });

  await db.account.create({
    data: {
      userId: newAdmin.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: newAdmin.id,
    },
  });

  await sendAdminInviteEmail(normalized, tempPassword);

  await createAuditLog({
    adminId: admin.id,
    action: "invite_admin",
    targetId: newAdmin.id,
    targetType: "user",
    details: { email: normalized, name: name.trim() },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

// ---------------------------------------------------------------------------
// Delete user (developer only)
// ---------------------------------------------------------------------------

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireDeveloper();

    if (userId === admin.id) {
      return { success: false, error: "You cannot delete your own account" };
    }

    const target = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, displayName: true },
    });

    if (!target) return { success: false, error: "User not found" };
    if (target.role === "developer") {
      return { success: false, error: "Cannot delete a developer account" };
    }

    // Create audit log before deletion so we capture the target's details
    await createAuditLog({
      adminId: admin.id,
      action: "delete_user",
      targetId: userId,
      targetType: "user",
      details: {
        targetEmail: target.email,
        targetName: target.name || target.displayName,
        targetRole: target.role,
      },
    });

    // All relations have onDelete: Cascade - this removes all user data
    await db.user.delete({ where: { id: userId } });

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("[ADMIN] Delete user failed:", e);
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete user" };
  }
}
