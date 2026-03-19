"use server";

import { db } from "./db";
import { requireSuperAdmin, createAuditLog } from "./admin";
import { createNotification } from "./notifications";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VALID_ICONS = [
  "footprints", "flame", "droplet", "droplets", "bike", "leaf", "trophy",
  "medal", "crown", "zap", "shield", "waves", "user-check", "message-circle",
  "heart-handshake", "star", "globe", "train", "car-off",
];

const VALID_CATEGORIES = ["starter", "streak", "impact", "community", "challenge", "transport"];
const VALID_RARITIES = ["common", "uncommon", "rare", "epic", "legendary"];
const VALID_CRITERIA_TYPES = [
  "first_activity", "streak", "total", "transport_distance", "transport_count",
  "challenges_completed", "reactions_received", "posts_count", "car_free_streak",
  "flight_free_streak", "profile_complete", "first_post",
];

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const badgeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().min(5, "Description must be at least 5 characters").max(500),
  icon: z.string().refine((v) => VALID_ICONS.includes(v), "Invalid icon"),
  category: z.string().refine((v) => VALID_CATEGORIES.includes(v), "Invalid category"),
  rarity: z.string().refine((v) => VALID_RARITIES.includes(v), "Invalid rarity"),
  criteria: z.string().refine((v) => {
    try {
      const parsed = JSON.parse(v);
      if (!parsed.type || !VALID_CRITERIA_TYPES.includes(parsed.type)) return false;

      // Validate required numeric fields per criteria type (OWASP: input validation)
      const posInt = (n: unknown, max = 1_000_000) =>
        typeof n === "number" && Number.isFinite(n) && n > 0 && n <= max;
      const isStr = (s: unknown) => typeof s === "string" && (s as string).length > 0;

      switch (parsed.type) {
        case "streak":
        case "car_free_streak":
        case "flight_free_streak":
          return posInt(parsed.days, 3650);
        case "total":
          return isStr(parsed.category) && posInt(parsed.value);
        case "transport_distance":
          return isStr(parsed.mode) && posInt(parsed.km);
        case "transport_count":
          return isStr(parsed.mode) && posInt(parsed.count, 100_000);
        case "challenges_completed":
          return posInt(parsed.count, 1000);
        case "reactions_received":
          return isStr(parsed.reaction) && posInt(parsed.count, 100_000);
        case "posts_count":
          return posInt(parsed.count, 100_000);
        case "first_activity":
        case "first_post":
        case "profile_complete":
          return true;
        default:
          return false;
      }
    } catch {
      return false;
    }
  }, "Invalid criteria JSON — must include a valid type with required fields"),
});

// ---------------------------------------------------------------------------
// Create Badge
// ---------------------------------------------------------------------------

export async function createBadge(input: {
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  criteria: string;
}) {
  const admin = await requireSuperAdmin();
  const parsed = badgeSchema.parse(input);

  // Check unique name
  const existing = await db.badge.findUnique({ where: { name: parsed.name } });
  if (existing) throw new Error("A badge with this name already exists");

  const badge = await db.badge.create({
    data: {
      name: parsed.name,
      description: parsed.description,
      icon: parsed.icon,
      category: parsed.category,
      rarity: parsed.rarity,
      criteria: parsed.criteria,
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "create_badge",
    targetId: badge.id,
    targetType: "badge",
    details: { name: parsed.name, category: parsed.category, rarity: parsed.rarity },
  });

  revalidatePath("/admin/badges");
  revalidatePath("/badges");
  return { success: true, badgeId: badge.id };
}

// ---------------------------------------------------------------------------
// Update Badge
// ---------------------------------------------------------------------------

export async function updateBadge(
  badgeId: string,
  input: {
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: string;
    criteria: string;
  },
) {
  const admin = await requireSuperAdmin();
  const parsed = badgeSchema.parse(input);

  const badge = await db.badge.findUnique({ where: { id: badgeId } });
  if (!badge) throw new Error("Badge not found");

  // Check unique name (excluding self)
  if (parsed.name !== badge.name) {
    const existing = await db.badge.findUnique({ where: { name: parsed.name } });
    if (existing) throw new Error("A badge with this name already exists");
  }

  await db.badge.update({
    where: { id: badgeId },
    data: {
      name: parsed.name,
      description: parsed.description,
      icon: parsed.icon,
      category: parsed.category,
      rarity: parsed.rarity,
      criteria: parsed.criteria,
    },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "update_badge",
    targetId: badgeId,
    targetType: "badge",
    details: { name: parsed.name },
  });

  revalidatePath("/admin/badges");
  revalidatePath(`/admin/badges/${badgeId}`);
  revalidatePath("/badges");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Delete Badge
// ---------------------------------------------------------------------------

export async function deleteBadge(badgeId: string) {
  const admin = await requireSuperAdmin();

  const badge = await db.badge.findUnique({
    where: { id: badgeId },
    include: { _count: { select: { userBadges: true } } },
  });

  if (!badge) throw new Error("Badge not found");

  // Delete user badges first (cascade), then badge
  await db.userBadge.deleteMany({ where: { badgeId } });
  await db.badge.delete({ where: { id: badgeId } });

  await createAuditLog({
    adminId: admin.id,
    action: "delete_badge",
    targetId: badgeId,
    targetType: "badge",
    details: { name: badge.name, earnedByCount: badge._count.userBadges },
  });

  revalidatePath("/admin/badges");
  revalidatePath("/badges");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Grant Badge to User
// ---------------------------------------------------------------------------

export async function grantBadge(badgeId: string, userId: string) {
  const admin = await requireSuperAdmin();

  const [badge, user] = await Promise.all([
    db.badge.findUnique({ where: { id: badgeId } }),
    db.user.findUnique({ where: { id: userId }, select: { id: true, name: true } }),
  ]);

  if (!badge) throw new Error("Badge not found");
  if (!user) throw new Error("User not found");

  // Check if already earned
  const existing = await db.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId } },
  });
  if (existing) throw new Error("User already has this badge");

  await db.userBadge.create({
    data: { userId, badgeId },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "grant_badge",
    targetId: badgeId,
    targetType: "badge",
    details: { badgeName: badge.name, userId, userName: user.name },
  });

  // Notify the user
  createNotification({
    userId,
    type: "badge",
    title: `Badge Earned: ${badge.name}`,
    body: `You've been awarded the "${badge.name}" badge by an admin!`,
    href: "/badges",
  }).catch(() => {});

  revalidatePath(`/admin/badges/${badgeId}`);
  revalidatePath("/badges");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Revoke Badge from User
// ---------------------------------------------------------------------------

export async function revokeBadge(badgeId: string, userId: string) {
  const admin = await requireSuperAdmin();

  const userBadge = await db.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId } },
    include: { badge: { select: { name: true } }, user: { select: { name: true } } },
  });

  if (!userBadge) throw new Error("User does not have this badge");

  await db.userBadge.delete({
    where: { userId_badgeId: { userId, badgeId } },
  });

  await createAuditLog({
    adminId: admin.id,
    action: "revoke_badge",
    targetId: badgeId,
    targetType: "badge",
    details: { badgeName: userBadge.badge.name, userId, userName: userBadge.user.name },
  });

  revalidatePath(`/admin/badges/${badgeId}`);
  revalidatePath("/badges");
  return { success: true };
}

// ---------------------------------------------------------------------------
// Search Users (for grant form)
// ---------------------------------------------------------------------------

export async function searchUsersForGrant(query: string) {
  await requireSuperAdmin();

  if (!query || query.length < 2) return [];

  return db.user.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
        { displayName: { contains: query } },
      ],
    },
    select: { id: true, name: true, displayName: true },
    take: 10,
  });
}
