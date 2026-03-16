import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTrophy,
  faFire,
  faLeaf,
  faAward,
  faUsers,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { getCurrentUser, getUserProfile, resolveUserImage } from "@/lib/queries";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
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

  const stats: StatCardProps[] = [
    {
      icon: faTrophy,
      iconBg: "bg-sunshine/15",
      iconColor: "text-amber-600",
      label: "Total Points",
      value: user.totalPoints.toLocaleString(),
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-charcoal">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate">
          Manage your account and view your stats
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - User info */}
        <div className="lg:col-span-1">
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

              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate">
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-3 w-3"
                  aria-hidden
                />
                Member since {memberSince}
              </div>
            </div>
          </Card>
        </div>

        {/* Right column - Stats + Edit form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Edit profile form */}
          <Card variant="default" className="p-6">
            <h3 className="mb-4 text-[15px] font-semibold text-charcoal">
              Edit Profile
            </h3>
            <ProfileEditForm
              displayName={user.displayName ?? ""}
              bio={user.bio ?? ""}
              isPublic={user.isPublic}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
