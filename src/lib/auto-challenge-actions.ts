"use server";

import { db } from "./db";
import { requireAdmin, requireSuperAdmin, createAuditLog } from "./admin";
import { revalidatePath } from "next/cache";

// ---------------------------------------------------------------------------
// Get auto-generate configuration (admin+)
// ---------------------------------------------------------------------------

export async function getAutoGenerateConfig() {
  await requireAdmin();

  const setting = await db.appSetting.findUnique({
    where: { key: "challenge_auto_generate_enabled" },
  });

  const templates = await db.challengeTemplate.findMany({
    orderBy: { category: "asc" },
  });

  return {
    globalEnabled: setting?.value === "true",
    templates,
  };
}

// ---------------------------------------------------------------------------
// Toggle auto-generate on/off (superadmin only)
// ---------------------------------------------------------------------------

export async function toggleAutoGenerate(enabled: boolean) {
  const admin = await requireSuperAdmin();

  await db.appSetting.upsert({
    where: { key: "challenge_auto_generate_enabled" },
    update: { value: enabled ? "true" : "false" },
    create: { key: "challenge_auto_generate_enabled", value: enabled ? "true" : "false" },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "toggle_auto_generate",
    targetType: "app_setting",
    details: { enabled },
  });

  revalidatePath("/admin/challenges");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Update a challenge template (superadmin only)
// ---------------------------------------------------------------------------

export async function updateTemplate(
  category: string,
  data: {
    titlePattern: string;
    description: string;
    targetValue: number;
    isEnabled: boolean;
  },
) {
  const admin = await requireSuperAdmin();

  if (!data.titlePattern.trim()) throw new Error("Title pattern is required");
  if (!data.description.trim()) throw new Error("Description is required");
  if (data.targetValue <= 0) throw new Error("Target must be a positive number");

  const template = await db.challengeTemplate.update({
    where: { category },
    data: {
      titlePattern: data.titlePattern.trim(),
      description: data.description.trim(),
      targetValue: data.targetValue,
      isEnabled: data.isEnabled,
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "update_challenge_template",
    targetId: template.id,
    targetType: "challenge_template",
    details: { category, titlePattern: data.titlePattern, isEnabled: data.isEnabled },
  });

  revalidatePath("/admin/challenges");
  return { success: true };
}
