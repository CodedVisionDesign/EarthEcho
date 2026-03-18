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

  // Fetch ban details from DB (token may not have reason yet on first load)
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { banned: true, banReason: true, bannedAt: true },
  });

  // If user is not actually banned, redirect to dashboard
  if (!user?.banned) redirect("/dashboard");

  return (
    <BannedClient
      reason={user.banReason ?? undefined}
      bannedAt={user.bannedAt?.toISOString() ?? undefined}
    />
  );
}
