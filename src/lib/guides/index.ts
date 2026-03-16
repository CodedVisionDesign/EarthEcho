import type { Guide } from "./types";
import { solarPanels } from "./solar-panels";
import { homesteading } from "./homesteading";
import { recycling } from "./recycling";
import { waterSaving } from "./water-saving";
import { showeringVsBathing } from "./showering-vs-bathing";

export type { Guide } from "./types";
export type { GuideSection, GuideStat, GuideSource, GuideCallout } from "./types";

export const GUIDES: Record<string, Guide> = {
  "solar-panels": solarPanels,
  homesteading: homesteading,
  recycling: recycling,
  "water-saving": waterSaving,
  "showering-vs-bathing": showeringVsBathing,
};

export const GUIDE_LIST: Guide[] = Object.values(GUIDES);
