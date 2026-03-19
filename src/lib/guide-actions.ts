"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { requireSuperAdmin, createAuditLog } from "./admin";

export async function getAdminGuides() {
  return db.guide.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getGuideById(id: string) {
  return db.guide.findUnique({ where: { id } });
}

export async function createGuide(formData: FormData) {
  const admin = await requireSuperAdmin();

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const slug = formData.get("slug") as string;
  const icon = formData.get("icon") as string;
  const category = formData.get("category") as string;
  const categoryLabel = formData.get("categoryLabel") as string;
  const readTimeMinutes = parseInt(formData.get("readTimeMinutes") as string) || 5;
  const introduction = formData.get("introduction") as string;
  const sections = formData.get("sections") as string;
  const quickTips = formData.get("quickTips") as string;
  const sources = formData.get("sources") as string;
  const isPublished = formData.get("isPublished") === "true";

  if (!title || !slug || !introduction || !category) {
    return { error: "Title, slug, category, and introduction are required" };
  }

  // Validate JSON
  try {
    if (sections) JSON.parse(sections);
    if (quickTips) JSON.parse(quickTips);
    if (sources) JSON.parse(sources);
  } catch {
    return { error: "Invalid JSON in sections, quick tips, or sources" };
  }

  const existing = await db.guide.findUnique({ where: { slug } });
  if (existing) return { error: "A guide with this slug already exists" };

  const guide = await db.guide.create({
    data: {
      title,
      subtitle: subtitle || "",
      slug,
      icon: icon || "faBookOpen",
      category,
      categoryLabel: categoryLabel || category,
      readTimeMinutes,
      introduction,
      sections: sections || "[]",
      quickTips: quickTips || "[]",
      sources: sources || "[]",
      lastUpdated: new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
      isPublished,
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "create_guide",
    targetId: guide.id,
    targetType: "guide",
    details: { title, slug },
  });

  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  return { success: true };
}

export async function updateGuide(formData: FormData) {
  const admin = await requireSuperAdmin();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const slug = formData.get("slug") as string;
  const icon = formData.get("icon") as string;
  const category = formData.get("category") as string;
  const categoryLabel = formData.get("categoryLabel") as string;
  const readTimeMinutes = parseInt(formData.get("readTimeMinutes") as string) || 5;
  const introduction = formData.get("introduction") as string;
  const sections = formData.get("sections") as string;
  const quickTips = formData.get("quickTips") as string;
  const sources = formData.get("sources") as string;
  const isPublished = formData.get("isPublished") === "true";

  if (!id || !title || !slug || !introduction || !category) {
    return { error: "Required fields missing" };
  }

  try {
    if (sections) JSON.parse(sections);
    if (quickTips) JSON.parse(quickTips);
    if (sources) JSON.parse(sources);
  } catch {
    return { error: "Invalid JSON in sections, quick tips, or sources" };
  }

  await db.guide.update({
    where: { id },
    data: {
      title,
      subtitle: subtitle || "",
      slug,
      icon: icon || "faBookOpen",
      category,
      categoryLabel: categoryLabel || category,
      readTimeMinutes,
      introduction,
      sections: sections || "[]",
      quickTips: quickTips || "[]",
      sources: sources || "[]",
      lastUpdated: new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
      isPublished,
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "update_guide",
    targetId: id,
    targetType: "guide",
    details: { title, slug },
  });

  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  revalidatePath(`/guides/${slug}`);
  return { success: true };
}

export async function deleteGuide(id: string) {
  const admin = await requireSuperAdmin();

  const guide = await db.guide.findUnique({ where: { id } });
  if (!guide) return { error: "Guide not found" };

  await db.guide.delete({ where: { id } });

  await createAuditLog({
    adminId: admin.id,
    action: "delete_guide",
    targetId: id,
    targetType: "guide",
    details: { title: guide.title, slug: guide.slug },
  });

  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  return { success: true };
}

export async function toggleGuidePublished(id: string) {
  const admin = await requireSuperAdmin();

  const guide = await db.guide.findUnique({ where: { id } });
  if (!guide) return { error: "Guide not found" };

  await db.guide.update({
    where: { id },
    data: { isPublished: !guide.isPublished },
  });

  await createAuditLog({
    adminId: admin.id,
    action: guide.isPublished ? "unpublish_guide" : "publish_guide",
    targetId: id,
    targetType: "guide",
    details: { title: guide.title },
  });

  revalidatePath("/admin/guides");
  revalidatePath("/guides");
  revalidatePath(`/guides/${guide.slug}`);
  return { success: true };
}
