import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Guide } from "@/lib/guides";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  energy: { bg: "bg-coral/10", text: "text-coral" },
  food: { bg: "bg-leaf/10", text: "text-leaf" },
  waste: { bg: "bg-sunshine/15", text: "text-amber-600" },
  water: { bg: "bg-ocean/10", text: "text-ocean" },
};

export function GuideCard({ guide }: { guide: Guide }) {
  const colors = CATEGORY_COLORS[guide.category] ?? {
    bg: "bg-gray-100",
    text: "text-gray-600",
  };

  return (
    <Link href={`/guides/${guide.slug}`}>
      <Card variant="interactive" className="flex h-full flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}
          >
            <FontAwesomeIcon
              icon={guide.icon}
              className={`h-4.5 w-4.5 ${colors.text}`}
              aria-hidden
            />
          </div>
          <Badge variant="neutral" size="sm">
            {guide.readTimeMinutes} min read
          </Badge>
        </div>
        <Badge
          variant="neutral"
          size="sm"
          className="mb-3 self-start"
        >
          {guide.categoryLabel}
        </Badge>
        <h3 className="mb-2 text-[15px] font-semibold leading-snug text-charcoal">
          {guide.title}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate">
          {guide.subtitle}
        </p>
        <div className="flex items-center gap-1.5 text-sm font-medium text-forest">
          Read guide
          <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" aria-hidden />
        </div>
      </Card>
    </Link>
  );
}
