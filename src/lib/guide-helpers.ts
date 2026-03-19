import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faSun,
  faCarrot,
  faRecycle,
  faDroplet,
  faShower,
  faBookOpen,
  faLeaf,
  faLightbulb,
  faSeedling,
  faEarthAmericas,
  faBicycle,
  faCar,
  faShirt,
} from "@/lib/fontawesome";
import type { Guide } from "@/lib/guides/types";

const ICON_MAP: Record<string, IconDefinition> = {
  faSun,
  faCarrot,
  faRecycle,
  faDroplet,
  faShower,
  faBookOpen,
  faLeaf,
  faLightbulb,
  faSeedling,
  faEarthAmericas,
  faBicycle,
  faCar,
  faShirt,
};

interface DbGuide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  category: string;
  categoryLabel: string;
  readTimeMinutes: number;
  introduction: string;
  sections: string;
  quickTips: string;
  sources: string;
  lastUpdated: string;
  isPublished: boolean;
}

/** Convert a database Guide row into the shape components expect */
export function dbGuideToGuide(row: DbGuide): Guide {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    icon: ICON_MAP[row.icon] ?? faBookOpen,
    category: row.category,
    categoryLabel: row.categoryLabel,
    readTimeMinutes: row.readTimeMinutes,
    introduction: row.introduction,
    sections: JSON.parse(row.sections),
    quickTips: JSON.parse(row.quickTips),
    sources: JSON.parse(row.sources),
    lastUpdated: row.lastUpdated,
  };
}

export { ICON_MAP };
