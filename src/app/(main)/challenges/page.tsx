import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBullseye,
  faUsers,
  faDroplet,
  faRecycle,
  faCar,
  faBagShopping,
  faShirt,
  faEarthAmericas,
  faPersonWalking,
  faFire,
  faCircleCheck,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import {
  getCurrentUser,
  getActiveChallenges,
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

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", opts);
  const endStr = end.toLocaleDateString("en-US", {
    ...opts,
    year: "numeric",
  });
  return `${startStr} \u2013 ${endStr}`;
}

export default async function ChallengesPage() {
  const user = await getCurrentUser();

  const [challenges, userProgress] = await Promise.all([
    getActiveChallenges(),
    getUserChallengeProgress(user.id),
  ]);

  const joinedMap = new Map(
    userProgress.map((p) => [p.challenge.id, p])
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10">
            <FontAwesomeIcon
              icon={faBullseye}
              className="h-5 w-5 text-forest"
              aria-hidden
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-charcoal">
              Challenges
            </h1>
            <p className="text-sm text-slate">
              Join community challenges and make a bigger impact together
            </p>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      {challenges.length === 0 ? (
        <Card variant="default" className="p-12 text-center">
          <FontAwesomeIcon
            icon={faBullseye}
            className="mx-auto mb-3 h-8 w-8 text-gray-300"
            aria-hidden
          />
          <p className="text-sm text-slate">
            No active challenges right now. Check back soon!
          </p>
        </Card>
      ) : (
        <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {challenges.map((challenge) => {
            const participation = joinedMap.get(challenge.id);
            const hasJoined = !!participation;
            const progressPct = hasJoined
              ? Math.min(
                  100,
                  (participation.progress / challenge.targetValue) * 100
                )
              : 0;
            const isCompleted = progressPct >= 100;
            const categoryIcon =
              CATEGORY_ICONS[challenge.category] ?? faBullseye;

            return (
              <StaggerItem key={challenge.id}>
              <Link
                href={`/challenges/${challenge.id}`}
                className="block"
              >
                <Card
                  variant="interactive"
                  className="flex h-full flex-col p-5"
                >
                  {/* Category + Participant count */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest/8">
                      <FontAwesomeIcon
                        icon={categoryIcon}
                        className="h-4 w-4 text-forest"
                        aria-hidden
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <Badge variant="success" size="sm">
                          <FontAwesomeIcon icon={faCircleCheck} className="h-2.5 w-2.5" aria-hidden />
                          Completed
                        </Badge>
                      )}
                      <Badge variant="neutral" size="sm">
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="h-2.5 w-2.5"
                          aria-hidden
                        />
                        {challenge._count.participants}
                      </Badge>
                    </div>
                  </div>

                  {/* Title + Description */}
                  <h3 className="mb-1 text-[15px] font-semibold text-charcoal">
                    {challenge.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-xs text-slate">
                    {challenge.description}
                  </p>

                  {/* Date Range */}
                  <div className="mb-4 text-[11px] font-medium text-slate">
                    {formatDateRange(challenge.startDate, challenge.endDate)}
                  </div>

                  {/* Progress or Join */}
                  <div className="mt-auto">
                    {hasJoined ? (
                      isCompleted ? (
                        <div className="flex items-center gap-2 rounded-lg bg-forest/5 p-3">
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="h-5 w-5 text-forest"
                            aria-hidden
                          />
                          <div>
                            <p className="text-sm font-semibold text-forest">Challenge Complete!</p>
                            <p className="text-[11px] text-slate">
                              {Math.round(participation.progress)} / {challenge.targetValue} (+100 bonus pts)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-1.5 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate">
                              <FontAwesomeIcon
                                icon={faFire}
                                className="h-3 w-3 text-coral"
                                aria-hidden
                              />
                              Your progress
                            </span>
                            <span className="font-medium text-charcoal">
                              {Math.round(progressPct)}%
                            </span>
                          </div>
                          <ProgressBar
                            value={progressPct}
                            color="forest"
                            size="md"
                          />
                          <p className="mt-1.5 text-right text-[11px] text-slate" title={`${Math.round(participation.progress)} out of ${challenge.targetValue}`}>
                            {Math.round(Math.min(participation.progress, challenge.targetValue))}{" "}
                            / {challenge.targetValue}
                          </p>
                        </div>
                      )
                    ) : (
                      <JoinChallengeButton challengeId={challenge.id} />
                    )}
                  </div>
                </Card>
              </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      )}
    </div>
  );
}
