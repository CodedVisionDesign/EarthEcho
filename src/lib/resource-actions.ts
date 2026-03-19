"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { requireSuperAdmin, createAuditLog } from "./admin";

export async function getAdminResources() {
  return db.resource.findMany({ orderBy: { name: "asc" } });
}

export async function createResource(formData: FormData) {
  const admin = await requireSuperAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;
  const image = (formData.get("image") as string) || null;

  if (!name || !description || !url || !category) {
    return { error: "All fields are required" };
  }

  const resource = await db.resource.create({
    data: { name, description, url, category, image, isActive: true },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "create_resource",
    targetId: resource.id,
    targetType: "resource",
    details: { name, category },
  });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}

export async function updateResource(formData: FormData) {
  const admin = await requireSuperAdmin();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;
  const image = (formData.get("image") as string) || null;

  if (!id || !name || !description || !url || !category) {
    return { error: "All fields are required" };
  }

  await db.resource.update({
    where: { id },
    data: { name, description, url, category, image },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "update_resource",
    targetId: id,
    targetType: "resource",
    details: { name, category },
  });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}

export async function deleteResource(id: string) {
  const admin = await requireSuperAdmin();

  const resource = await db.resource.findUnique({ where: { id } });
  if (!resource) return { error: "Resource not found" };

  await db.resource.delete({ where: { id } });

  await createAuditLog({
    adminId: admin.id,
    action: "delete_resource",
    targetId: id,
    targetType: "resource",
    details: { name: resource.name },
  });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}

export async function toggleResourceActive(id: string) {
  const admin = await requireSuperAdmin();

  const resource = await db.resource.findUnique({ where: { id } });
  if (!resource) return { error: "Resource not found" };

  await db.resource.update({
    where: { id },
    data: { isActive: !resource.isActive },
  });

  await createAuditLog({
    adminId: admin.id,
    action: resource.isActive ? "deactivate_resource" : "activate_resource",
    targetId: id,
    targetType: "resource",
    details: { name: resource.name },
  });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}
