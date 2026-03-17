import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Audit log retention: 90 days
// Call this endpoint via cron (e.g., daily) or manually
// Protected by a secret key to prevent unauthorized access
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.CRON_SECRET || "earthecho-cleanup-key";

  if (authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const retentionDays = 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);

  // Delete audit logs older than retention period
  const deletedLogs = await db.auditLog.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  // Delete expired/used password reset tokens (older than 24 hours)
  const tokenCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const deletedTokens = await db.passwordResetToken.deleteMany({
    where: {
      OR: [
        { expires: { lt: new Date() } },
        { used: true, createdAt: { lt: tokenCutoff } },
      ],
    },
  });

  return NextResponse.json({
    success: true,
    deletedAuditLogs: deletedLogs.count,
    deletedTokens: deletedTokens.count,
    retentionDays,
  });
}
