import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BannedClient } from "./BannedClient";

export const metadata = {
  title: "Account Suspended | EarthEcho",
};

export default async function BannedPage() {
  const session = await auth();

  // If not logged in, redirect to login
  if (!session?.user?.id) redirect("/login");

  // Fetch ban details - wrapped in try/catch so a DB error still shows
  // a usable "suspended" screen instead of crashing to a white page
  let reason: string | undefined;
  let bannedAt: string | undefined;

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { banned: true, banReason: true, bannedAt: true },
    });

    // If user is not actually banned, redirect to dashboard
    if (!user?.banned) redirect("/dashboard");

    reason = user.banReason ?? undefined;
    bannedAt = user.bannedAt?.toISOString() ?? undefined;
  } catch (error) {
    // redirect() throws a special Next.js error - always rethrow it
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("[BannedPage] Failed to fetch ban details:", error);
    // Fall through - render the page with no reason/date rather than crash
  }

  return <BannedClient reason={reason} bannedAt={bannedAt} />;
}
