import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTrophy,
  faFire,
  faLeaf,
  faAward,
  faUsers,
  faChartLine,
  faCircleInfo,
  faMedal,
  faKey,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCurrentUser, getUserProfile, resolveUserImage } from "@/lib/queries";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { LinkedAccountsCard } from "@/components/profile/LinkedAccountsCard";
import { NotificationPreferences } from "@/components/notifications/NotificationPreferences";
import { PasskeyManager } from "@/components/profile/PasskeyManager";
import { ImpactSummaryCard } from "@/components/profile/ImpactSummaryCard";
import { DeleteAccountSection } from "@/components/profile/DeleteAccountSection";
import { CookiePreferences } from "@/components/profile/CookiePreferences";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface StatCardProps {
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number | string;
}

function StatCard({ icon, iconBg, iconColor, label, value }: StatCardProps) {
  return (
    <Card variant="default" className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          <FontAwesomeIcon
            icon={icon}
            className={`h-4 w-4 ${iconColor}`}
            aria-hidden
          />
        </div>
        <div>
          <div className="text-xl font-bold text-charcoal">{value}</div>
          <div className="text-xs text-slate">{label}</div>
        </div>
      </div>
    </Card>
  );
}

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();
  const profile = await getUserProfile(currentUser.id);
  const user = profile.user!;

  const userImage = resolveUserImage(user);

  const memberSince = user.createdAt.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const isProfileIncomplete = !user.displayName || !user.bio;

  // Recent badges (last 3)
  const recentBadges = currentUser.userBadges.slice(0, 3);

  const stats: StatCardProps[] = [
    {
      icon: faTrophy,
      iconBg: "bg-sunshine/15",
      iconColor: "text-amber-600",
      label: "Total Points",
      value: user.totalPoints.toLocaleString(),
    },
    {
      icon: faChartLine,
      iconBg: "bg-ocean/10",
      iconColor: "text-ocean",
      label: "Leaderboard Rank",
      value: profile.rank ? `#${profile.rank}` : "Unranked",
    },
    {
      icon: faFire,
      iconBg: "bg-coral/10",
      iconColor: "text-coral",
      label: "Streak Days",
      value: user.streakDays,
    },
    {
      icon: faLeaf,
      iconBg: "bg-forest/10",
      iconColor: "text-forest",
      label: "Activities Logged",
      value: profile.activityCount.toLocaleString(),
    },
    {
      icon: faAward,
      iconBg: "bg-ocean/10",
      iconColor: "text-ocean",
      label: "Badges Earned",
      value: profile.badgeCount,
    },
    {
      icon: faUsers,
      iconBg: "bg-leaf/10",
      iconColor: "text-leaf",
      label: "Challenges Joined",
      value: profile.challengeCount,
    },
  ];

  return (
    <div>
      {/* Header */}
      <FadeIn variant="fade-up">
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-forest via-forest/90 to-leaf p-6 text-white shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <FontAwesomeIcon icon={faUser} className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Profile
              </h1>
              <p className="text-sm text-white/70">
                Manage your account and view your stats
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Profile completeness nudge */}
      {isProfileIncomplete && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-forest/20 bg-forest/5 px-4 py-3">
          <FontAwesomeIcon icon={faCircleInfo} className="h-4 w-4 text-forest" aria-hidden />
          <div className="flex-1">
            <p className="text-sm font-medium text-forest">
              Complete your profile to earn the <span className="font-bold">Profile Complete</span> badge!
            </p>
            <p className="text-xs text-forest/70">
              {!user.displayName && !user.bio
                ? "Add a display name and bio below."
                : !user.displayName
                  ? "Add a display name below."
                  : "Add a bio below."}
            </p>
          </div>
          <Badge variant="forest" size="sm">
            <FontAwesomeIcon icon={faMedal} className="h-2.5 w-2.5" aria-hidden />
            Badge
          </Badge>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - User info + Linked Accounts */}
        <div className="space-y-6 lg:col-span-1">
          <Card variant="default" className="p-6">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <AvatarUpload
                currentImage={userImage}
                userName={user.displayName || user.name || "User"}
              />

              <h2 className="text-lg font-bold text-charcoal">
                {user.displayName || user.name || "Anonymous"}
              </h2>
              <p className="mt-0.5 text-sm text-slate">{user.email}</p>

              {user.bio && (
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  {user.bio}
                </p>
              )}

              <div className="mt-4 flex flex-col items-center gap-1 text-xs text-slate">
                <div className="flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUser} className="h-3 w-3" aria-hidden />
                  Member since {memberSince}
                </div>
                {user.lastActiveAt && (
                  <div className="text-slate/60">
                    Last active{" "}
                    {user.lastActiveAt.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                )}
              </div>

              {/* Recent badges */}
              {recentBadges.length > 0 && (
                <div className="mt-4 w-full border-t border-gray-100 pt-4">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate/60">
                    Recent Badges
                  </p>
                  <div className="flex justify-center gap-2">
                    {recentBadges.map((ub) => (
                      <div
                        key={ub.badge.id}
                        className="flex flex-col items-center gap-1"
                        title={`${ub.badge.name} - ${ub.badge.description}`}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sunshine/15">
                          <FontAwesomeIcon
                            icon={faMedal}
                            className="h-4 w-4 text-amber-600"
                            aria-hidden
                          />
                        </div>
                        <span className="max-w-[4rem] truncate text-[10px] font-medium text-charcoal">
                          {ub.badge.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Connected Accounts */}
          <LinkedAccountsCard linkedProviders={profile.linkedProviders} />
        </div>

        {/* Right column - Stats + Impact + Edit form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Impact Summary */}
          <ImpactSummaryCard categoryBreakdown={profile.categoryBreakdown} />

          {/* Edit profile form */}
          <Card variant="default" className="p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-charcoal">
              Edit Profile
            </h3>
            <ProfileEditForm
              displayName={user.displayName ?? ""}
              bio={user.bio ?? ""}
              isPublic={user.isPublic}
              dateOfBirth={user.dateOfBirth ? user.dateOfBirth.toISOString().split("T")[0] : ""}
            />
          </Card>

          {/* Passkeys / Biometric Login */}
          <PasskeyManager />

          {/* Change Password */}
          <Card variant="default" className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faKey} className="h-4 w-4 text-forest" aria-hidden />
              <h3 className="text-[15px] font-semibold text-charcoal">
                Change Password
              </h3>
            </div>
            <ChangePasswordForm hasPassword={!!user.password} />
          </Card>

          {/* Notification Preferences */}
          <NotificationPreferences />

          {/* Cookie Preferences */}
          <CookiePreferences />

          {/* Delete Account */}
          <DeleteAccountSection hasPassword={!!user.password} />
        </div>
      </div>
    </div>
  );
}
