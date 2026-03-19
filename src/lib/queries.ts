import { db } from "./db";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import type { ActivityCategory } from "./categories";

export function resolveUserImage(user: { customImage?: string | null; image?: string | null }): string | null {
  return user.customImage || user.image || null;
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      userBadges: { include: { badge: true }, orderBy: { earnedAt: "desc" } },
    },
  });

  if (!user) redirect("/login");
  return user;
}

export async function getSession() {
  return auth();
}

// ==========================================
// Activity Queries
// ==========================================

export async function getUserActivities(
  userId: string,
  category?: ActivityCategory,
  options?: { limit?: number; offset?: number; dateFrom?: Date; dateTo?: Date }
) {
  const { limit = 50, offset = 0, dateFrom, dateTo } = options ?? {};

  return db.activity.findMany({
    where: {
      userId,
      ...(category && { category }),
      ...(dateFrom || dateTo
        ? {
            date: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {}),
    },
    orderBy: { date: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getUserActivityCount(userId: string, category?: ActivityCategory) {
  return db.activity.count({
    where: { userId, ...(category && { category }) },
  });
}

export async function getUserCategoryTotal(
  userId: string,
  category: ActivityCategory,
  dateFrom?: Date,
  dateTo?: Date
) {
  const result = await db.activity.aggregate({
    where: {
      userId,
      category,
      ...(dateFrom || dateTo
        ? {
            date: {
              ...(dateFrom && { gte: dateFrom }),
              ...(dateTo && { lte: dateTo }),
            },
          }
        : {}),
    },
    _sum: { value: true },
  });
  return result._sum.value ?? 0;
}

export async function getUserCategoryTrend(
  userId: string,
  category: ActivityCategory
): Promise<number> {
  const now = new Date();
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const [thisWeek, lastWeek] = await Promise.all([
    getUserCategoryTotal(userId, category, thisWeekStart),
    getUserCategoryTotal(userId, category, lastWeekStart, thisWeekStart),
  ]);

  if (lastWeek === 0) return thisWeek > 0 ? 100 : 0;
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
}

export async function getUserWeeklyTrend(userId: string) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const activities = await db.activity.findMany({
    where: {
      userId,
      date: { gte: weekStart },
      category: { in: ["WATER", "CARBON", "PLASTIC"] },
    },
    orderBy: { date: "asc" },
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayMap = new Map<string, { water: number; carbon: number; plastic: number }>();

  for (const day of days) {
    dayMap.set(day, { water: 0, carbon: 0, plastic: 0 });
  }

  for (const activity of activities) {
    const dayName = days[((activity.date.getDay() + 6) % 7)]; // Mon=0
    const entry = dayMap.get(dayName)!;
    if (activity.category === "WATER") entry.water += activity.value;
    else if (activity.category === "CARBON") entry.carbon += activity.value;
    else if (activity.category === "PLASTIC") entry.plastic += activity.value;
  }

  return days.map((day) => ({ day, ...dayMap.get(day)! }));
}

export interface TrendDataPoint {
  label: string;
  water: number;
  carbon: number;
  plastic: number;
  recycling: number;
  transport: number;
  fashion: number;
}

export async function getUserTrendByRange(
  userId: string,
  days: number = 7
): Promise<TrendDataPoint[]> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const activities = await db.activity.findMany({
    where: { userId, date: { gte: start } },
    orderBy: { date: "asc" },
  });

  // Build day buckets
  const buckets: Map<string, TrendDataPoint> = new Map();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    const label = days <= 7
      ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]
      : `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, { label, water: 0, carbon: 0, plastic: 0, recycling: 0, transport: 0, fashion: 0 });
  }

  for (const a of activities) {
    const key = a.date.toISOString().split("T")[0];
    const bucket = buckets.get(key);
    if (!bucket) continue;
    const cat = a.category.toLowerCase();
    if (cat === "water" || cat === "carbon" || cat === "plastic" || cat === "recycling" || cat === "transport" || cat === "fashion") {
      bucket[cat] += a.value;
    }
  }

  return Array.from(buckets.values());
}

export async function getUserTransportBreakdown(userId: string) {
  const activities = await db.activity.findMany({
    where: { userId, category: "TRANSPORT", transportMode: { not: null } },
  });

  const modeMap = new Map<string, { totalKm: number; totalCO2Saved: number }>();

  for (const a of activities) {
    if (!a.transportMode) continue;
    const existing = modeMap.get(a.transportMode) ?? { totalKm: 0, totalCO2Saved: 0 };
    existing.totalKm += a.distanceKm ?? 0;
    existing.totalCO2Saved += a.co2Saved ?? 0;
    modeMap.set(a.transportMode, existing);
  }

  return Array.from(modeMap.entries()).map(([mode, data]) => ({
    mode,
    ...data,
  }));
}

export async function getUserCategoryDailyTrend(
  userId: string,
  category: ActivityCategory,
  days: number = 30
) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const activities = await db.activity.findMany({
    where: { userId, category, date: { gte: since } },
    orderBy: { date: "asc" },
  });

  const dayMap = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    dayMap.set(d.toISOString().split("T")[0], 0);
  }

  for (const a of activities) {
    const key = a.date.toISOString().split("T")[0];
    dayMap.set(key, (dayMap.get(key) ?? 0) + a.value);
  }

  return Array.from(dayMap.entries()).map(([date, value]) => ({ date, value }));
}

// ==========================================
// Badge Queries
// ==========================================

export async function getUserBadgesWithProgress(userId: string) {
  const [
    allBadges, earnedBadges, user, activityTotals,
    transportByMode, transportCountByMode,
    challengeParticipants, reactionsReceived,
    threadCount, replyCount,
  ] = await Promise.all([
    db.badge.findMany({ orderBy: { category: "asc" } }),
    db.userBadge.findMany({ where: { userId }, include: { badge: true } }),
    db.user.findUnique({ where: { id: userId } }),
    db.activity.groupBy({ by: ["category"], where: { userId }, _sum: { value: true }, _count: true }),
    db.activity.groupBy({ by: ["transportMode"], where: { userId, category: "TRANSPORT", transportMode: { not: null } }, _sum: { distanceKm: true } }),
    db.activity.groupBy({ by: ["transportMode"], where: { userId, category: "TRANSPORT", transportMode: { not: null } }, _count: true }),
    db.challengeParticipant.findMany({ where: { userId }, include: { challenge: true } }),
    db.reaction.groupBy({ by: ["type"], where: { reply: { userId } }, _count: true }),
    db.thread.count({ where: { userId } }),
    db.reply.count({ where: { userId } }),
  ]);

  const earnedIds = new Set(earnedBadges.map((ub) => ub.badgeId));
  const earnedMap = new Map(earnedBadges.map((ub) => [ub.badgeId, ub.earnedAt]));
  const totalsByCategory = new Map(
    activityTotals.map((t) => [t.category, { sum: t._sum.value ?? 0, count: t._count }])
  );
  const distanceByMode = new Map(transportByMode.map((t) => [t.transportMode, t._sum.distanceKm ?? 0]));
  const countByMode = new Map(transportCountByMode.map((t) => [t.transportMode, t._count]));
  const completedChallenges = challengeParticipants.filter((p) => p.progress >= p.challenge.targetValue).length;
  const reactionsByType = new Map(reactionsReceived.map((r) => [r.type, r._count]));
  const postsCount = threadCount + replyCount;

  return allBadges.map((badge) => {
    const earned = earnedIds.has(badge.id);
    let progress = 0;

    try {
      const criteria = JSON.parse(badge.criteria);
      switch (criteria.type) {
        case "first_activity": {
          const totalCount = Array.from(totalsByCategory.values()).reduce((s, t) => s + t.count, 0);
          progress = totalCount > 0 ? 100 : 0;
          break;
        }
        case "streak":
          progress = ((user?.streakDays ?? 0) / criteria.days) * 100;
          break;
        case "total": {
          const cat = totalsByCategory.get(criteria.category);
          progress = ((cat?.sum ?? 0) / criteria.value) * 100;
          break;
        }
        case "transport_distance":
          progress = ((distanceByMode.get(criteria.mode) ?? 0) / criteria.km) * 100;
          break;
        case "transport_count":
          progress = ((countByMode.get(criteria.mode) ?? 0) / criteria.count) * 100;
          break;
        case "challenges_completed":
          progress = (completedChallenges / criteria.count) * 100;
          break;
        case "reactions_received":
          progress = ((reactionsByType.get(criteria.reaction) ?? 0) / criteria.count) * 100;
          break;
        case "posts_count":
          progress = (postsCount / criteria.count) * 100;
          break;
        case "first_post":
          progress = postsCount >= 1 ? 100 : 0;
          break;
        case "profile_complete":
          progress = user?.displayName && user?.bio ? 100 : (user?.displayName || user?.bio ? 50 : 0);
          break;
        case "car_free_streak":
        case "flight_free_streak":
          progress = ((user?.streakDays ?? 0) / criteria.days) * 100;
          break;
      }
    } catch {
      // Invalid criteria JSON
    }

    return {
      ...badge,
      earned,
      earnedAt: earnedMap.get(badge.id) ?? null,
      progress: earned ? 100 : Math.min(100, Math.round(progress)),
    };
  });
}

// ==========================================
// Challenge Queries
// ==========================================

export async function getActiveChallenges() {
  // Auto-deactivate expired challenges (check-on-read, best-effort)
  try {
    await db.challenge.updateMany({
      where: { isActive: true, endDate: { lt: new Date() } },
      data: { isActive: false, status: "COMPLETED" },
    });
  } catch {
    // Neon HTTP adapter may not support updateMany — skip deactivation
  }

  return db.challenge.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { participants: true } },
    },
    orderBy: { startDate: "desc" },
  });
}

export async function getPastChallenges(limit = 10) {
  return db.challenge.findMany({
    where: { isActive: false, endDate: { lt: new Date() } },
    include: {
      _count: { select: { participants: true } },
    },
    orderBy: { endDate: "desc" },
    take: limit,
  });
}

export async function getChallengeById(challengeId: string) {
  return db.challenge.findUnique({
    where: { id: challengeId },
    include: { _count: { select: { participants: true } } },
  });
}

export async function getChallengeLeaderboard(challengeId: string) {
  return db.challengeParticipant.findMany({
    where: { challengeId },
    include: {
      user: { select: { id: true, name: true, displayName: true, image: true } },
    },
    orderBy: { progress: "desc" },
    take: 50,
  });
}

export async function getUserChallengeProgress(userId: string) {
  return db.challengeParticipant.findMany({
    where: { userId },
    include: {
      challenge: {
        include: { _count: { select: { participants: true } } },
      },
    },
    orderBy: { joinedAt: "desc" },
  });
}

// ==========================================
// Leaderboard Queries
// ==========================================

type LeaderboardEntry = {
  id: string;
  name: string | null;
  displayName: string | null;
  image: string | null;
  customImage: string | null;
  totalPoints: number;
  streakDays: number;
  _count: { userBadges: number };
};

export async function getLeaderboard(
  limit: number = 50,
  period: "all-time" | "monthly" | "weekly" = "all-time"
): Promise<LeaderboardEntry[]> {
  const excludeAdminRoles = { role: { notIn: ["superadmin", "developer"] } };

  if (period === "all-time") {
    return db.user.findMany({
      where: { isPublic: true, ...excludeAdminRoles },
      select: {
        id: true,
        name: true,
        displayName: true,
        image: true,
        customImage: true,
        totalPoints: true,
        streakDays: true,
        _count: { select: { userBadges: true } },
      },
      orderBy: { totalPoints: "desc" },
      take: limit,
    });
  }

  // For weekly/monthly, aggregate from PointTransaction
  const now = new Date();
  const periodStart = new Date(now);
  if (period === "weekly") {
    periodStart.setDate(now.getDate() - 7);
  } else {
    periodStart.setDate(now.getDate() - 30);
  }

  const pointsByUser = await db.pointTransaction.groupBy({
    by: ["userId"],
    where: { createdAt: { gte: periodStart } },
    _sum: { points: true },
    orderBy: { _sum: { points: "desc" } },
    take: limit,
  });

  const userIds = pointsByUser.map((p) => p.userId);
  const users = await db.user.findMany({
    where: { id: { in: userIds }, isPublic: true, ...excludeAdminRoles },
    select: {
      id: true,
      name: true,
      displayName: true,
      image: true,
      customImage: true,
      totalPoints: true,
      streakDays: true,
      _count: { select: { userBadges: true } },
    },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));
  return pointsByUser
    .filter((p) => userMap.has(p.userId))
    .map((p) => {
      const u = userMap.get(p.userId)!;
      return {
        ...u,
        totalPoints: p._sum.points ?? 0,
        _count: u._count,
      };
    });
}

export async function getUserRank(userId: string): Promise<number | null> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { totalPoints: true, isPublic: true } });
  if (!user || !user.isPublic) return null;

  const usersAbove = await db.user.count({
    where: { isPublic: true, role: { notIn: ["superadmin", "developer"] }, totalPoints: { gt: user.totalPoints } },
  });

  return usersAbove + 1;
}

// ==========================================
// Forum Queries
// ==========================================

export type ForumSort = "latest" | "popular" | "active";

export async function getForumThreads(
  category?: string,
  search?: string,
  limit: number = 20,
  offset: number = 0,
  sort: ForumSort = "latest"
) {
  const where = {
    ...(category ? { category } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  // Build sort order — pinned threads always float to top
  const sortOrder: Record<ForumSort, object[]> = {
    latest: [{ isPinned: "desc" }, { createdAt: "desc" }],
    popular: [{ isPinned: "desc" }, { replies: { _count: "desc" } }, { createdAt: "desc" }],
    active: [{ isPinned: "desc" }, { updatedAt: "desc" }],
  };

  const [threads, total] = await Promise.all([
    db.thread.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, displayName: true, image: true, customImage: true } },
        _count: { select: { replies: true } },
        replies: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            createdAt: true,
            user: { select: { displayName: true, name: true } },
          },
        },
      },
      orderBy: sortOrder[sort],
      take: limit,
      skip: offset,
    }),
    db.thread.count({ where }),
  ]);

  return { threads, total };
}

export async function getThread(threadId: string) {
  return db.thread.findUnique({
    where: { id: threadId },
    include: {
      user: { select: { id: true, name: true, displayName: true, image: true, customImage: true } },
      replies: {
        include: {
          user: { select: { id: true, name: true, displayName: true, image: true, customImage: true } },
          reactions: true,
          parentReply: {
            select: {
              id: true,
              user: { select: { name: true, displayName: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

// ==========================================
// Resources Queries
// ==========================================

export async function getResources(category?: string) {
  return db.resource.findMany({
    where: { isActive: true, ...(category ? { category } : {}) },
    orderBy: { name: "asc" },
  });
}

// ==========================================
// Guide Comment Queries
// ==========================================

export async function getGuideComments(guideSlug: string) {
  return db.guideComment.findMany({
    where: { guideSlug },
    include: {
      user: {
        select: { id: true, name: true, displayName: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ==========================================
// Profile Queries
// ==========================================

export async function getUserProfile(userId: string) {
  const categories = ["WATER", "CARBON", "PLASTIC", "RECYCLING", "TRANSPORT", "FASHION"] as const;

  const [user, activityCount, badgeCount, challengeCount, linkedAccounts, rank, ...categoryTotals] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.activity.count({ where: { userId } }),
    db.userBadge.count({ where: { userId } }),
    db.challengeParticipant.count({ where: { userId } }),
    db.account.findMany({ where: { userId }, select: { provider: true } }),
    getUserRank(userId),
    ...categories.map((cat) => getUserCategoryTotal(userId, cat)),
  ]);

  const linkedProviders = linkedAccounts
    .map((a) => a.provider)
    .filter((p) => p !== "credentials");

  const categoryBreakdown = Object.fromEntries(
    categories.map((cat, i) => [cat, categoryTotals[i]])
  ) as Record<typeof categories[number], number>;

  return { user, activityCount, badgeCount, challengeCount, linkedProviders, rank, categoryBreakdown };
}

// ==========================================
// User Activity Type Breakdown (per category)
// ==========================================

export async function getUserActivityTypeBreakdown(
  userId: string,
  category: ActivityCategory,
) {
  const results = await db.activity.groupBy({
    by: ["type"],
    where: { userId, category },
    _sum: { value: true },
    _count: true,
    orderBy: { _sum: { value: "desc" } },
  });

  return results.map((r) => ({
    type: r.type,
    count: r._count,
    total: r._sum.value ?? 0,
  }));
}

// ==========================================
// Sparkline Data (7-day daily totals for a category)
// ==========================================

export async function getUserCategorySparkline(
  userId: string,
  category: ActivityCategory,
  days: number = 7
): Promise<number[]> {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const activities = await db.activity.findMany({
    where: { userId, category, date: { gte: since } },
    select: { date: true, value: true },
  });

  const dayValues: number[] = Array(days).fill(0);
  for (const a of activities) {
    const dayIndex = Math.floor(
      (a.date.getTime() - since.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (dayIndex >= 0 && dayIndex < days) {
      dayValues[dayIndex] += a.value;
    }
  }

  return dayValues;
}

// ==========================================
// Daily Activity Counts (Heatmap)
// ==========================================

export interface DailyActivityCount {
  date: string; // YYYY-MM-DD
  count: number;
  categories: string[];
}

export async function getUserDailyActivityCounts(
  userId: string,
  days: number = 365
): Promise<DailyActivityCount[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const activities = await db.activity.findMany({
    where: { userId, date: { gte: since } },
    select: { date: true, category: true },
    orderBy: { date: "asc" },
  });

  const buckets: Record<string, { count: number; categories: Set<string> }> = {};

  for (const a of activities) {
    const key = a.date.toISOString().slice(0, 10);
    if (!buckets[key]) buckets[key] = { count: 0, categories: new Set() };
    buckets[key].count++;
    buckets[key].categories.add(a.category);
  }

  return Object.entries(buckets).map(([date, { count, categories }]) => ({
    date,
    count,
    categories: Array.from(categories),
  }));
}

// ==========================================
// Recent Activity
// ==========================================

export async function getRecentActivities(userId: string, limit: number = 5) {
  return db.activity.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
  });
}

// ==========================================
// Community Analytics Queries
// ==========================================

export async function getCommunityTotalsByCategory(from: Date, to: Date) {
  const results = await db.activity.groupBy({
    by: ["category"],
    where: { date: { gte: from, lte: to } },
    _sum: { value: true },
    _count: true,
  });

  return results.map((r) => ({
    category: r.category,
    total: r._sum.value ?? 0,
    count: r._count,
  }));
}

export async function getCommunityImpactOverTime(
  from: Date,
  to: Date,
  category?: string,
) {
  const activities = await db.activity.findMany({
    where: {
      date: { gte: from, lte: to },
      ...(category ? { category } : {}),
    },
    select: { date: true, category: true, value: true },
    orderBy: { date: "asc" },
  });

  // Bucket by day
  const dayMap = new Map<string, Record<string, number>>();
  for (const a of activities) {
    const key = a.date.toISOString().split("T")[0];
    if (!dayMap.has(key)) dayMap.set(key, {});
    const bucket = dayMap.get(key)!;
    bucket[a.category] = (bucket[a.category] ?? 0) + a.value;
  }

  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, cats]) => ({ date, ...cats }));
}

export async function getTopContributors(
  from: Date,
  to: Date,
  category?: string,
  limit: number = 10,
) {
  const grouped = await db.activity.groupBy({
    by: ["userId"],
    where: {
      date: { gte: from, lte: to },
      ...(category ? { category } : {}),
    },
    _sum: { value: true },
    orderBy: { _sum: { value: "desc" } },
    take: limit,
  });

  const userIds = grouped.map((g) => g.userId);
  const users = await db.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, displayName: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u]));

  return grouped.map((g) => {
    const user = userMap.get(g.userId);
    return {
      userId: g.userId,
      name: user?.displayName || user?.name || "Unknown",
      total: g._sum.value ?? 0,
    };
  });
}

export async function getActivityTypeBreakdown(
  from: Date,
  to: Date,
  category: string,
) {
  const results = await db.activity.groupBy({
    by: ["type"],
    where: { date: { gte: from, lte: to }, category },
    _sum: { value: true },
    _count: true,
    orderBy: { _sum: { value: "desc" } },
  });

  return results.map((r) => ({
    type: r.type,
    count: r._count,
    total: r._sum.value ?? 0,
  }));
}

export async function getTransportModeComparison(from: Date, to: Date) {
  const results = await db.activity.groupBy({
    by: ["transportMode"],
    where: {
      date: { gte: from, lte: to },
      category: "TRANSPORT",
      transportMode: { not: null },
    },
    _sum: { co2Saved: true, distanceKm: true },
    orderBy: { _sum: { co2Saved: "desc" } },
  });

  return results.map((r) => ({
    mode: r.transportMode ?? "unknown",
    co2Saved: Math.round((r._sum.co2Saved ?? 0) * 100) / 100,
    totalKm: Math.round((r._sum.distanceKm ?? 0) * 100) / 100,
  }));
}

export async function getActivityGrowthTrend(
  from: Date,
  to: Date,
  category?: string,
) {
  const activities = await db.activity.findMany({
    where: {
      date: { gte: from, lte: to },
      ...(category ? { category } : {}),
    },
    select: { date: true },
    orderBy: { date: "asc" },
  });

  const dayMap = new Map<string, number>();
  for (const a of activities) {
    const key = a.date.toISOString().split("T")[0];
    dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
  }

  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}
