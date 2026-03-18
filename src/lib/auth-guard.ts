import { db } from "./db";

const BANNED_MESSAGE = "Your account has been suspended. Please contact support if you believe this is an error.";

/**
 * Checks if a user is banned. Returns an error string if banned, null if OK.
 * Designed to slot in right after the existing `auth()` check in server actions:
 *
 *   const session = await auth();
 *   if (!session?.user?.id) return { error: "Not authenticated" };
 *   const banned = await checkBanned(session.user.id);
 *   if (banned) return { error: banned };
 */
export async function checkBanned(userId: string): Promise<string | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { banned: true },
  });

  if (user?.banned) return BANNED_MESSAGE;
  return null;
}
