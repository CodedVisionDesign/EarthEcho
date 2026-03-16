import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface GuideSource {
  name: string;
  url: string;
}

export interface GuideStat {
  figure: string;
  description: string;
  source: string;
}

export interface GuideCallout {
  type: "tip" | "warning" | "info" | "uk";
  content: string;
}

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  stats?: GuideStat[];
  callout?: GuideCallout;
  list?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  icon: IconDefinition;
  category: string;
  categoryLabel: string;
  readTimeMinutes: number;
  introduction: string;
  sections: GuideSection[];
  quickTips: string[];
  sources: GuideSource[];
  lastUpdated: string;
}
