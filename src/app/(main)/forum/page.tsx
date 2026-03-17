import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faArrowRight, faChevronLeft, faChevronRight } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { getForumThreads } from "@/lib/queries";
import { ForumNewThreadToggle } from "@/components/forum/ForumNewThreadToggle";
import { ForumSearchBar } from "@/components/forum/ForumSearchBar";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "tips", label: "Tips" },
  { value: "challenges", label: "Challenges" },
  { value: "wins", label: "Wins" },
  { value: "questions", label: "Questions" },
] as const;

const CATEGORY_BADGE_VARIANT: Record<string, "forest" | "ocean" | "sunshine" | "info" | "neutral"> = {
  tips: "forest",
  challenges: "ocean",
  wins: "sunshine",
  questions: "info",
};

const PAGE_SIZE = 20;

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const { threads, total } = await getForumThreads(
    category || undefined,
    q || undefined,
    PAGE_SIZE,
    offset
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildPageUrl(p: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/forum${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      {/* Header */}
      <FadeIn variant="fade-up">
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-ocean via-ocean/90 to-forest/70 p-6 text-white shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <FontAwesomeIcon
                icon={faComments}
                className="h-5 w-5"
                aria-hidden
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Community Forum
              </h1>
              <p className="text-sm text-white/70">
                Share tips, celebrate wins, and connect with fellow eco-warriors
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Search */}
      <div className="mb-4">
        <ForumSearchBar />
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive =
            (!category && cat.value === "") ||
            category === cat.value;

          return (
            <Link
              key={cat.value}
              href={
                cat.value ? `/forum?category=${cat.value}` : "/forum"
              }
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-forest text-white"
                  : "bg-gray-100 text-slate hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* New Thread Form */}
      <ForumNewThreadToggle />

      {/* Thread List */}
      {threads.length === 0 ? (
        <Card variant="default" className="p-12 text-center">
          <FontAwesomeIcon
            icon={faComments}
            className="mx-auto mb-3 h-8 w-8 text-gray-300"
            aria-hidden
          />
          <p className="text-sm text-slate">
            {q ? `No threads matching "${q}".` : "No threads yet. Start the conversation!"}
          </p>
        </Card>
      ) : (
        <>
          <StaggerGroup className="space-y-3" stagger={0.04}>
            {threads.map((thread) => {
              const badgeVariant =
                CATEGORY_BADGE_VARIANT[thread.category] ?? "neutral";

              return (
                <StaggerItem key={thread.id}>
                <Link
                  href={`/forum/${thread.id}`}
                  className="block"
                >
                  <Card
                    variant="interactive"
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    {/* Pin indicator */}
                    {thread.isPinned && (
                      <div
                        className="h-full w-1 shrink-0 rounded-full bg-forest"
                        title="Pinned"
                      />
                    )}

                    {/* Author avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocean/10 text-xs font-semibold text-ocean">
                      {getInitials(thread.user.displayName || thread.user.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {thread.isPinned && (
                          <Badge variant="forest" size="sm">
                            Pinned
                          </Badge>
                        )}
                        <Badge variant={badgeVariant} size="sm">
                          {thread.category}
                        </Badge>
                      </div>
                      <h3 className="mt-1 truncate text-sm font-semibold text-charcoal">
                        {thread.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate">
                        <span>
                          {thread.user.displayName || thread.user.name}
                        </span>
                        <span>{timeAgo(thread.createdAt)}</span>
                        {thread.replies.length > 0 && thread.replies[0] && (
                          <span className="text-slate/60">
                            Last reply {timeAgo(thread.replies[0].createdAt)} by{" "}
                            {thread.replies[0].user.displayName || thread.replies[0].user.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reply count + Arrow */}
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-charcoal">
                          {thread._count.replies}
                        </div>
                        <div className="text-[10px] text-slate">
                          {thread._count.replies === 1
                            ? "reply"
                            : "replies"}
                        </div>
                      </div>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="h-3 w-3 text-gray-300"
                        aria-hidden
                      />
                    </div>
                  </Card>
                </Link>
                </StaggerItem>
              );
            })}
          </StaggerGroup>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              {currentPage > 1 ? (
                <Link href={buildPageUrl(currentPage - 1)}>
                  <Button variant="secondary" size="sm" leftIcon={faChevronLeft}>
                    Previous
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" size="sm" leftIcon={faChevronLeft} disabled>
                  Previous
                </Button>
              )}
              <span className="text-sm text-slate">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link href={buildPageUrl(currentPage + 1)}>
                  <Button variant="secondary" size="sm" rightIcon={faChevronRight}>
                    Next
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" size="sm" rightIcon={faChevronRight} disabled>
                  Next
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
