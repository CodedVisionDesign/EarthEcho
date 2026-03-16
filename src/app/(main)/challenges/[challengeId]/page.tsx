import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBullseye,
  faDroplet,
  faRecycle,
  faCar,
  faBagShopping,
  faShirt,
  faEarthAmericas,
  faPersonWalking,
  faArrowRight,
  faTrophy,
  faMedal,
  faCircleCheck,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  getCurrentUser,
  getChallengeById,
  getChallengeLeaderboard,
  getUserChallengeProgress,
} from "@/lib/queries";
import { JoinChallengeButton } from "@/components/challenges/JoinChallengeButton";

const CATEGORY_ICONS: Record<string, IconDefinition> = {
  WATER: faDroplet,
  CARBON: faEarthAmericas,
  PLASTIC: faBagShopping,
  RECYCLING: faRecycle,
  TRANSPORT: faCar,
  FASHION: faShirt,
  WALKING: faPersonWalking,
};

const RANK_STYLES: Record<number, string> = {
  1: "text-amber-500",
  2: "text-gray-400",
  3: "text-amber-700",
};

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = await params;
  const [challenge, leaderboard, user] = await Promise.all([
    getChallengeById(challengeId),
    getChallengeLeaderboard(challengeId),
    getCurrentUser(),
  ]);

  if (!challenge) notFound();

  const userProgress = await getUserChallengeProgress(user.id);
  const participation = userProgress.find((p) => p.challenge.id === challengeId);
  const hasJoined = !!participation;
  const progressPct = hasJoined
    ? Math.min(100, (participation.progress / challenge.targetValue) * 100)
    : 0;
  const isCompleted = progressPct >= 100;
  const categoryIcon = CATEGORY_ICONS[challenge.category] ?? faBullseye;

  const startStr = challenge.startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const endStr = challenge.endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div>
      {/* Back link */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" href="/challenges" leftIcon={faArrowRight} className="rotate-180-icon">
          Back to Challenges
        </Button>
      </div>

      {/* Challenge Header */}
      <Card variant="default" className="mb-6 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10">
            <FontAwesomeIcon icon={categoryIcon} className="h-6 w-6 text-forest" aria-hidden />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-charcoal">{challenge.title}</h1>
              {isCompleted && (
                <Badge variant="success" size="sm">
                  <FontAwesomeIcon icon={faCircleCheck} className="h-2.5 w-2.5" aria-hidden />
                  Completed
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate">{challenge.description}</p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-medium uppercase text-slate">Category</p>
            <p className="text-sm font-semibold text-charcoal">{challenge.category}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase text-slate">Target</p>
            <p className="text-sm font-semibold text-charcoal">{challenge.targetValue}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase text-slate">Start</p>
            <p className="text-sm font-semibold text-charcoal">{startStr}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase text-slate">End</p>
            <p className="text-sm font-semibold text-charcoal">{endStr}</p>
          </div>
        </div>

        {/* User's progress or join button */}
        {hasJoined ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate">Your progress</span>
              <span className="font-semibold text-charcoal">
                {Math.round(participation.progress)} / {challenge.targetValue} ({Math.round(progressPct)}%)
              </span>
            </div>
            <ProgressBar value={progressPct} color="forest" size="lg" />
          </div>
        ) : challenge.isActive ? (
          <JoinChallengeButton challengeId={challenge.id} />
        ) : (
          <Badge variant="neutral" size="md">Challenge Ended</Badge>
        )}
      </Card>

      {/* Challenge Leaderboard */}
      <Card variant="default" className="overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-charcoal">
            Participants ({challenge._count.participants})
          </h2>
        </div>

        {leaderboard.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate">No participants yet. Be the first!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-slate">#</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-slate">Member</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase text-slate">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.userId === user.id;
                const pct = Math.min(100, (entry.progress / challenge.targetValue) * 100);
                const displayName = entry.user.displayName || entry.user.name || "Anonymous";

                return (
                  <tr
                    key={entry.id}
                    className={isCurrentUser ? "border-l-2 border-l-forest bg-forest/5" : "hover:bg-gray-50/50"}
                  >
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${RANK_STYLES[rank] ?? "text-slate"}`}>
                        {rank <= 3 && (
                          <FontAwesomeIcon
                            icon={rank === 1 ? faTrophy : faMedal}
                            className="mr-1.5 h-3 w-3"
                            aria-hidden
                          />
                        )}
                        {rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold ${
                          isCurrentUser ? "bg-forest/15 text-forest" : "bg-gray-100 text-slate"
                        }`}>
                          {getInitials(displayName)}
                        </div>
                        <span className="text-sm font-medium text-charcoal">
                          {displayName}
                        </span>
                        {isCurrentUser && <Badge variant="forest" size="sm">You</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="hidden w-24 sm:block">
                          <ProgressBar value={pct} color="forest" size="sm" />
                        </div>
                        <span className="min-w-[3rem] text-sm font-semibold text-charcoal">
                          {Math.round(pct)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
