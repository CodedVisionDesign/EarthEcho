import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faCircleExclamation,
  faCircleInfo,
  faLeaf,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Guide, GuideCallout, GuideStat } from "@/lib/guides";

const CALLOUT_STYLES: Record<
  string,
  { bg: string; border: string; icon: typeof faLightbulb; iconColor: string; label: string }
> = {
  tip: {
    bg: "bg-green-50",
    border: "border-l-forest",
    icon: faLightbulb,
    iconColor: "text-forest",
    label: "Tip",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-l-amber",
    icon: faCircleExclamation,
    iconColor: "text-amber",
    label: "Important",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-l-ocean",
    icon: faCircleInfo,
    iconColor: "text-ocean",
    label: "Did you know?",
  },
  uk: {
    bg: "bg-forest/5",
    border: "border-l-forest",
    icon: faLeaf,
    iconColor: "text-forest",
    label: "UK-Specific",
  },
};

function CalloutBlock({ callout }: { callout: GuideCallout }) {
  const style = CALLOUT_STYLES[callout.type] ?? CALLOUT_STYLES.info;
  return (
    <div
      className={`my-5 rounded-lg border-l-4 ${style.border} ${style.bg} p-4`}
    >
      <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
        <FontAwesomeIcon
          icon={style.icon}
          className={`h-3.5 w-3.5 ${style.iconColor}`}
          aria-hidden
        />
        {style.label}
      </div>
      <p className="text-sm leading-relaxed text-charcoal/80">
        {callout.content}
      </p>
    </div>
  );
}

function StatBlock({ stat }: { stat: GuideStat }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 px-4 py-3">
      <span className="text-lg font-bold text-forest">{stat.figure}</span>
      <div>
        <p className="text-sm text-charcoal">{stat.description}</p>
        <p className="text-[11px] text-slate">Source: {stat.source}</p>
      </div>
    </div>
  );
}

export function GuideArticle({ guide }: { guide: Guide }) {
  return (
    <article>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="forest" size="sm">
            {guide.categoryLabel}
          </Badge>
          <Badge variant="neutral" size="sm">
            {guide.readTimeMinutes} min read
          </Badge>
          <Badge variant="neutral" size="sm">
            Updated {guide.lastUpdated}
          </Badge>
        </div>
        <h1 className="mb-3 text-2xl font-bold tracking-tight text-charcoal md:text-3xl">
          {guide.title}
        </h1>
        <p className="text-base leading-relaxed text-slate">
          {guide.introduction}
        </p>
      </div>

      {/* Quick Tips Summary */}
      <Card variant="default" className="mb-8 p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-forest">
          Quick Tips
        </h2>
        <ul className="space-y-2">
          {guide.quickTips.map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
              {tip}
            </li>
          ))}
        </ul>
      </Card>

      {/* Sections */}
      {guide.sections.map((section, i) => (
        <section key={i} className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-charcoal">
            {section.heading}
          </h2>

          {section.paragraphs.map((p, j) => (
            <p
              key={j}
              className="mb-3 text-sm leading-relaxed text-charcoal/80"
            >
              {p}
            </p>
          ))}

          {section.list && (
            <ul className="mb-3 space-y-1.5 pl-1">
              {section.list.map((item, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-charcoal/80"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate/30" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.stats && section.stats.length > 0 && (
            <div className="my-4 grid gap-3 sm:grid-cols-2">
              {section.stats.map((stat, j) => (
                <StatBlock key={j} stat={stat} />
              ))}
            </div>
          )}

          {section.callout && <CalloutBlock callout={section.callout} />}
        </section>
      ))}

      {/* Sources */}
      <Card variant="default" className="p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate">
          Sources
        </h2>
        <ol className="space-y-1.5">
          {guide.sources.map((source, i) => (
            <li key={i} className="text-sm">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest underline decoration-forest/30 transition-colors hover:text-forest-dark hover:decoration-forest"
              >
                {source.name}
              </a>
            </li>
          ))}
        </ol>
      </Card>
    </article>
  );
}
