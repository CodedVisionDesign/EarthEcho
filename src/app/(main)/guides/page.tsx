import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@/lib/fontawesome";
import { db } from "@/lib/db";
import { dbGuideToGuide } from "@/lib/guide-helpers";
import { GuideCard } from "@/components/guides/GuideCard";

export default async function GuidesPage() {
  const dbGuides = await db.guide.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "asc" },
  });

  const guides = dbGuides.map(dbGuideToGuide);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/8">
            <FontAwesomeIcon
              icon={faBookOpen}
              className="h-4.5 w-4.5 text-forest"
              aria-hidden
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-charcoal">
              Guides
            </h1>
            <p className="text-sm text-slate">
              Free, detailed advice to help you reduce your environmental impact
            </p>
          </div>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </div>
  );
}
