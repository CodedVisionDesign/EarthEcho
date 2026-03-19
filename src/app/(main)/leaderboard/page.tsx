import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrophy,
  faMedal,
  faFire,
  faCircleInfo,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { FadeIn } from "@/components/ui/FadeIn";
import { getCurrentUser, getLeaderboard, getUserRank } from "@/lib/queries";
import { SocialTabBar } from "@/components/navigation/SocialTabBar";

const RANK_STYLES: Record<number, { color: string; label: string }> = {
  1: { color: "text-amber-500", label: "1st" },
  2: { color: "text-gray-400", label: "2nd" },
  3: { color: "text-amber-700", label: "3rd" },
};

const PERIODS = [
  { value: "all-time", label: "All Time" },
  { value: "monthly", label: "This Month" },
  { value: "weekly", label: "This Week" },
] as const;

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: rawPeriod } = await searchParams;
  const period = (["all-time", "monthly", "weekly"].includes(rawPeriod ?? "")
    ? rawPeriod
    : "all-time") as "all-time" | "monthly" | "weekly";

  const [user, leaderboard] = await Promise.all([
    getCurrentUser(),
    getLeaderboard(50, period),
  ]);

  const userInBoard = leaderboard.some((e) => e.id === user.id);
  const userRank = !userInBoard ? await getUserRank(user.id) : null;

  return (
    <div>
      <SocialTabBar />

      {/* Header */}
      <FadeIn variant="fade-up">
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-sunshine via-amber-500 to-amber-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <FontAwesomeIcon
                icon={faTrophy}
                className="h-5 w-5"
                aria-hidden
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Leaderboard
              </h1>
              <p className="text-sm text-white/70">
                See how you stack up against the community
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Period Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <Link
            key={p.value}
            href={p.value === "all-time" ? "/leaderboard" : `/leaderboard?period=${p.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              period === p.value
                ? "bg-forest text-white"
                : "bg-gray-100 text-slate hover:bg-gray-200"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>

      <FadeIn>
      <Card variant="default" className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate">
                Member
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate">
                <Tooltip content="Points earned from logging eco-friendly activities" position="bottom">
                  <span className="cursor-help">Points</span>
                </Tooltip>
              </th>
              <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate sm:table-cell">
                <Tooltip content="Consecutive days of logged activity" position="bottom">
                  <span className="cursor-help">Streak</span>
                </Tooltip>
              </th>
              <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate sm:table-cell">
                <Tooltip content="Total badges earned from achievements" position="bottom">
                  <span className="cursor-help">Badges</span>
                </Tooltip>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.id === user.id;
              const rankStyle = RANK_STYLES[rank];
              const displayName =
                entry.displayName || entry.name || "Anonymous";

              return (
                <tr
                  key={entry.id}
                  className={
                    isCurrentUser
                      ? "border-l-2 border-l-forest bg-forest/5"
                      : "transition-colors duration-150 hover:bg-gray-50/80"
                  }
                >
                  {/* Rank */}
                  <td className="px-4 py-3">
                    {rankStyle ? (
                      <span
                        className={`text-sm font-bold ${rankStyle.color}`}
                        title={rankStyle.label}
                      >
                        {rank <= 3 && (
                          <FontAwesomeIcon
                            icon={rank === 1 ? faTrophy : faMedal}
                            className="mr-1.5 h-3.5 w-3.5"
                            aria-hidden
                          />
                        )}
                        {rank}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-slate">
                        {rank}
                      </span>
                    )}
                  </td>

                  {/* Avatar + Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {entry.image ? (
                        <img
                          src={entry.image}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                            isCurrentUser
                              ? "bg-forest/15 text-forest"
                              : "bg-gray-100 text-slate"
                          }`}
                        >
                          {getInitials(displayName)}
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-charcoal">
                          {displayName}
                        </span>
                        {isCurrentUser && (
                          <Badge
                            variant="forest"
                            size="sm"
                            className="ml-2"
                          >
                            You
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Points */}
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-charcoal">
                      {entry.totalPoints.toLocaleString()}
                    </span>
                  </td>

                  {/* Streak */}
                  <td className="hidden px-4 py-3 text-right sm:table-cell">
                    {entry.streakDays > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                        <FontAwesomeIcon icon={faFire} className="h-3 w-3" aria-hidden />
                        {entry.streakDays}d
                      </span>
                    ) : (
                      <span className="text-xs text-slate">-</span>
                    )}
                  </td>

                  {/* Badge Count */}
                  <td className="hidden px-4 py-3 text-right sm:table-cell">
                    <Badge variant="sunshine" size="sm">
                      <FontAwesomeIcon
                        icon={faMedal}
                        className="h-2.5 w-2.5"
                        aria-hidden
                      />
                      {entry._count.userBadges}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {leaderboard.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm text-slate">
              No public profiles yet. Be the first on the leaderboard!
            </p>
          </div>
        )}
      </Card>
      </FadeIn>

      {/* User rank indicator when not in top 50 */}
      {!userInBoard && userRank && (
        <Card variant="default" className="mt-4 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/15 text-xs font-semibold text-forest">
              {getInitials(user.displayName || user.name)}
            </div>
            <div>
              <span className="text-sm font-medium text-charcoal">
                {user.displayName || user.name}
              </span>
              <Badge variant="forest" size="sm" className="ml-2">You</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-charcoal">
              Rank #{userRank}
            </div>
            <div className="text-xs text-slate">
              {user.totalPoints.toLocaleString()} points
            </div>
          </div>
        </Card>
      )}
      {/* How Scoring Works */}
      <FadeIn>
        <Card variant="default" className="mt-8 p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="h-4 w-4 text-sky-600"
                aria-hidden
              />
            </div>
            <h2 className="text-base font-semibold text-charcoal">
              How Scoring Works
            </h2>
          </div>

          <p className="mb-4 text-sm leading-relaxed text-slate">
            Points are earned every time you log an eco-friendly activity. The
            amount depends on the category and the size of your contribution:
          </p>

          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              { label: "Carbon", detail: "10 pts / kg CO\u2082 saved" },
              { label: "Fashion", detail: "5 pts / item reused" },
              { label: "Plastic", detail: "3 pts / item avoided" },
              { label: "Recycling", detail: "2 pts / kg recycled" },
              { label: "Transport", detail: "1 pt / green km" },
              { label: "Water", detail: "1 pt / 10 litres saved" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <p className="text-xs font-semibold text-charcoal">
                  {item.label}
                </p>
                <p className="text-[11px] text-slate">{item.detail}</p>
              </div>
            ))}
          </div>

          <p className="mb-2 text-sm leading-relaxed text-slate">
            Every activity earns a minimum of <strong className="text-charcoal">5 points</strong>.
            You also earn <strong className="text-charcoal">100 bonus points</strong> for
            completing a challenge.
          </p>
        </Card>
      </FadeIn>
    </div>
  );
}
