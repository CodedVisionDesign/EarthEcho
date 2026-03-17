import { auth } from "./auth";
import { db } from "./db";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, email: true },
  });

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard");
  }

  return user;
}

export async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, email: true },
  });

  if (!user || user.role !== "superadmin") {
    redirect("/dashboard");
  }

  return user;
}

export async function createAuditLog(input: {
  adminId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details?: Record<string, unknown>;
}) {
  return db.auditLog.create({
    data: {
      adminId: input.adminId,
      action: input.action,
      targetId: input.targetId ?? null,
      targetType: input.targetType ?? null,
      details: input.details ? JSON.stringify(input.details) : null,
    },
  });
}
