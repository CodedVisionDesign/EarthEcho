import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faArrowRight, faChevronLeft, faChevronRight } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import { getForumThreads, resolveUserImage } from "@/lib/queries";
import type { ForumSort } from "@/lib/queries";
import { ForumNewThreadToggle } from "@/components/forum/ForumNewThreadToggle";
import { ForumSearchBar } from "@/components/forum/ForumSearchBar";

const CATEGORIES = [
  { value: "", label: "All Topics" },
  { value: "tips", label: "Tips" },
  { value: "challenges", label: "Challenges" },
  { value: "wins", label: "Wins" },
  { value: "questions", label: "Questions" },
] as const;

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Replies" },
  { value: "active", label: "Recently Active" },
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

function truncateContent(content: string, maxLen: number = 120): string {
  if (content.length <= maxLen) return content;
  return content.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string; sort?: string }>;
}) {
  const { category, q, page, sort: rawSort } = await searchParams;
  const sort: ForumSort = (["latest", "popular", "active"].includes(rawSort ?? "")
    ? rawSort
    : "latest") as ForumSort;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const offset = (currentPage - 1) * PAGE_SIZE;

  const { threads, total } = await getForumThreads(
    category || undefined,
    q || undefined,
    PAGE_SIZE,
    offset,
    sort
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildUrl(overrides: { page?: number; sort?: string; category?: string; q?: string } = {}) {
    const params = new URLSearchParams();
    const cat = overrides.category ?? category;
    const search = overrides.q ?? q;
    const s = overrides.sort ?? rawSort;
    const p = overrides.page ?? undefined;

    if (cat) params.set("category", cat);
    if (search) params.set("q", search);
    if (s && s !== "latest") params.set("sort", s);
    if (p && p > 1) params.set("page", String(p));
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

      {/* Search + New Thread */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <ForumSearchBar />
        </div>
        <ForumNewThreadToggle />
      </div>

      {/* Filters Bar: Categories + Sort */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isActive =
              (!category && cat.value === "") ||
              category === cat.value;

            return (
              <Link
                key={cat.value}
                href={buildUrl({ category: cat.value || undefined, page: 1 })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-forest text-white shadow-sm"
                    : "bg-gray-100 text-slate hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-xs text-slate">Sort:</span>
          {SORT_OPTIONS.map((opt) => {
            const isActive = sort === opt.value;
            return (
              <Link
                key={opt.value}
                href={buildUrl({ sort: opt.value, page: 1 })}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-ocean/10 text-ocean"
                    : "text-slate hover:bg-gray-100 hover:text-charcoal"
                }`}
              >
                {opt.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      {(q || category) && (
        <div className="mb-4 flex items-center gap-2 text-xs text-slate">
          <span>
            {total} {total === 1 ? "thread" : "threads"} found
          </span>
          {q && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-charcoal">
              &ldquo;{q}&rdquo;
              <Link href={buildUrl({ q: undefined })} className="ml-1.5 text-slate hover:text-coral">
                &times;
              </Link>
            </span>
          )}
        </div>
      )}

      {/* Thread List */}
      {threads.length === 0 ? (
        <Card variant="default" className="p-12 text-center">
          <FontAwesomeIcon
            icon={faComments}
            className="mx-auto mb-3 h-8 w-8 text-gray-300"
            aria-hidden
          />
          <p className="mb-1 text-sm font-medium text-charcoal">
            {q ? "No matching threads" : "No threads yet"}
          </p>
          <p className="text-xs text-slate">
            {q
              ? `We couldn\u2019t find any threads matching \u201c${q}\u201d. Try a different search or start a new thread.`
              : "Be the first to start a conversation!"}
          </p>
        </Card>
      ) : (
        <>
          <StaggerGroup className="space-y-2.5" stagger={0.04}>
            {threads.map((thread) => {
              const badgeVariant =
                CATEGORY_BADGE_VARIANT[thread.category] ?? "neutral";
              const lastReply = thread.replies.length > 0 ? thread.replies[0] : null;

              return (
                <StaggerItem key={thread.id}>
                <Link
                  href={`/forum/${thread.id}`}
                  className="block"
                >
                  <Card
                    variant="interactive"
                    className="flex items-start gap-4 px-5 py-4"
                  >
                    {/* Pin indicator */}
                    {thread.isPinned && (
                      <div
                        className="mt-1 h-10 w-1 shrink-0 rounded-full bg-forest"
                        title="Pinned"
                      />
                    )}

                    {/* Author avatar */}
                    {resolveUserImage(thread.user) ? (
                      <Image
                        src={resolveUserImage(thread.user)!}
                        alt={thread.user.displayName || thread.user.name || "User"}
                        width={40}
                        height={40}
                        className="mt-0.5 h-10 w-10 shrink-0 rounded-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean/10 text-xs font-semibold text-ocean">
                        {getInitials(thread.user.displayName || thread.user.name)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      {/* Badges row */}
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

                      {/* Title */}
                      <h3 className="mt-1 truncate text-sm font-semibold text-charcoal">
                        {thread.title}
                      </h3>

                      {/* Content preview */}
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate/70">
                        {truncateContent(thread.content)}
                      </p>

                      {/* Meta info */}
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate">
                        <span className="font-medium">
                          {thread.user.displayName || thread.user.name}
                        </span>
                        <span>{timeAgo(thread.createdAt)}</span>
                        {lastReply && (
                          <span className="text-slate/60">
                            Last reply {timeAgo(lastReply.createdAt)} by{" "}
                            {lastReply.user.displayName || lastReply.user.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reply count + Arrow */}
                    <div className="flex shrink-0 items-center gap-3 pt-1">
                      <div className="text-center">
                        <div className={`text-sm font-semibold ${thread._count.replies > 0 ? "text-charcoal" : "text-gray-300"}`}>
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
                <Link href={buildUrl({ page: currentPage - 1 })}>
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
                <Link href={buildUrl({ page: currentPage + 1 })}>
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
