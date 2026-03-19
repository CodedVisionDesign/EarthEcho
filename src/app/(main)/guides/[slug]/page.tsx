import { notFound } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@/lib/fontawesome";
import { db } from "@/lib/db";
import { dbGuideToGuide } from "@/lib/guide-helpers";
import { getGuideComments } from "@/lib/queries";
import { auth } from "@/lib/auth";
import { GuideArticle } from "@/components/guides/GuideArticle";
import { GuideCommentSection } from "@/components/guides/GuideCommentSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;

  const dbGuide = await db.guide.findUnique({
    where: { slug },
  });

  if (!dbGuide || !dbGuide.isPublished) {
    notFound();
  }

  const guide = dbGuideToGuide(dbGuide);

  const [comments, session] = await Promise.all([
    getGuideComments(slug),
    auth(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate">
        <Link href="/guides" className="hover:text-forest hover:underline">
          Guides
        </Link>
        <FontAwesomeIcon icon={faArrowRight} className="h-2.5 w-2.5" aria-hidden />
        <span className="text-charcoal">{guide.title}</span>
      </nav>

      <GuideArticle guide={guide} />

      <GuideCommentSection
        guideSlug={slug}
        comments={comments}
        isAuthenticated={!!session?.user?.id}
      />
    </div>
  );
}
