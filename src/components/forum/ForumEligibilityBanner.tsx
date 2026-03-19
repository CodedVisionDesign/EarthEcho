import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@/lib/fontawesome";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function ForumEligibilityBanner() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true, dateOfBirth: true },
  });
  if (!user) return null;

  const issues: string[] = [];

  if (!user.emailVerified) {
    issues.push("verify your email");
  }

  if (user.dateOfBirth) {
    const setting = await db.appSetting.findUnique({ where: { key: "forum_min_age" } });
    const minAge = setting ? Math.max(13, Math.min(18, parseInt(setting.value, 10) || 16)) : 16;
    const today = new Date();
    let age = today.getFullYear() - user.dateOfBirth.getFullYear();
    const m = today.getMonth() - user.dateOfBirth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < user.dateOfBirth.getDate())) age--;
    if (age < minAge) {
      issues.push(`be at least ${minAge} years old`);
    }
  }

  if (issues.length === 0) return null;

  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-800">
          You can browse the forum, but you need to {issues.join(" and ")} before you can post or reply.
        </p>
        {!user.emailVerified && (
          <Link href="/profile" className="mt-1 inline-block text-sm font-medium text-forest hover:underline">
            Go to Profile to verify your email
          </Link>
        )}
      </div>
    </div>
  );
}
