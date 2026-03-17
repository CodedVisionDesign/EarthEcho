import { waterToHuman } from "./water";
import { carbonToHuman } from "./carbon";
import { plasticToHuman } from "./plastic";
import { transportToHuman } from "./transport";

export type MetricCategory = "WATER" | "CARBON" | "PLASTIC" | "RECYCLING" | "TRANSPORT" | "FASHION";

export interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
  tooltip: string;
}

/**
 * Convert a raw metric value to a human-readable format.
 * This is the main entry point for metric conversions.
 */
export function toHumanReadable(
  category: MetricCategory,
  rawValue: number
): HumanMetric {
  switch (category) {
    case "WATER":
      return waterToHuman(rawValue);
    case "CARBON":
      return carbonToHuman(rawValue);
    case "TRANSPORT":
      return transportToHuman(rawValue);
    case "PLASTIC":
      return plasticToHuman(rawValue);
    case "RECYCLING":
      return recyclingToHuman(rawValue);
    case "FASHION":
      return fashionToHuman(rawValue);
    default:
      return {
        value: `${rawValue}`,
        comparison: `${rawValue} units`,
        icon: "leaf",
        tooltip: `Raw value: ${rawValue}`,
      };
  }
}

function recyclingToHuman(kgRecycled: number): HumanMetric {
  const TREE_EQUIVALENT = 60; // kg of paper recycled = 1 tree saved
  const HOME_ENERGY_DAY = 5; // rough kg recycled = 1 day of home energy saved
  const ALUMINIUM_CAN_KG = 0.015; // weight of one aluminium can
  const NEWSPAPER_KG = 0.4; // weight of one newspaper

  // 500+ kg → trees saved (woodland scale)
  if (kgRecycled >= 500) {
    const trees = Math.round(kgRecycled / TREE_EQUIVALENT);
    return {
      value: `${trees} trees saved`,
      comparison: `Your recycling has saved the equivalent of ${trees} trees — a small woodland`,
      icon: "tree",
      tooltip: `${kgRecycled.toLocaleString()}kg ÷ 60kg of paper per tree = ${trees} trees saved`,
    };
  }

  // 120–500 kg → bathtubs of landfill saved (1 bathtub ≈ 120kg of mixed waste)
  if (kgRecycled >= 120) {
    const bathtubs = (kgRecycled / 120).toFixed(1);
    return {
      value: `${bathtubs} bathtub${Number(bathtubs) >= 2 ? "s" : ""} of landfill saved`,
      comparison: `You've kept ${bathtubs} bathtub${Number(bathtubs) >= 2 ? "s" : ""} worth of waste out of landfill`,
      icon: "bathtub",
      tooltip: `${kgRecycled.toLocaleString()}kg ÷ 120kg per bathtub volume of waste = ${bathtubs} bathtubs`,
    };
  }

  // 60–120 kg → trees saved
  if (kgRecycled >= TREE_EQUIVALENT) {
    const trees = (kgRecycled / TREE_EQUIVALENT).toFixed(1);
    return {
      value: `${trees} tree${Number(trees) >= 2 ? "s" : ""} saved`,
      comparison: `Your recycling has saved the equivalent of ${trees} tree${Number(trees) >= 2 ? "s" : ""}`,
      icon: "tree",
      tooltip: `${kgRecycled.toLocaleString()}kg ÷ 60kg of paper per tree = ${trees} trees`,
    };
  }

  // 20–60 kg → home energy days
  if (kgRecycled >= 20) {
    const days = Math.round(kgRecycled / HOME_ENERGY_DAY);
    return {
      value: `${days} days of energy saved`,
      comparison: `Enough saved energy to power a home for ${days} days`,
      icon: "bolt",
      tooltip: `${kgRecycled.toLocaleString()}kg recycled ÷ ~5kg per day of home energy equivalent = ${days} days`,
    };
  }

  // 5–20 kg → newspapers saved
  if (kgRecycled >= 5) {
    const papers = Math.round(kgRecycled / NEWSPAPER_KG);
    return {
      value: `${papers} newspapers recycled`,
      comparison: `That's the weight of ${papers} newspapers kept out of landfill`,
      icon: "newspaper",
      tooltip: `${kgRecycled.toLocaleString()}kg ÷ 0.4kg per newspaper = ${papers} newspapers`,
    };
  }

  // <5 kg → aluminium cans
  const cans = Math.round(kgRecycled / ALUMINIUM_CAN_KG);
  return {
    value: `${cans} can${cans !== 1 ? "s" : ""} worth`,
    comparison: `Equivalent to recycling ${cans} aluminium can${cans !== 1 ? "s" : ""}`,
    icon: "recycle",
    tooltip: `${kgRecycled}kg ÷ 0.015kg per aluminium can = ${cans} cans`,
  };
}

function fashionToHuman(items: number): HumanMetric {
  const CO2_PER_NEW_GARMENT = 8; // kg CO2 for average new fast-fashion item
  const WATER_PER_TSHIRT = 2_700; // litres of water for one cotton t-shirt
  const WATER_PER_JEANS = 7_500; // litres of water for one pair of jeans

  const kgSaved = items * CO2_PER_NEW_GARMENT;
  const waterSaved = items * WATER_PER_TSHIRT; // conservative estimate using t-shirt baseline

  const baseTooltip = `${items} items × ${CO2_PER_NEW_GARMENT}kg CO₂ per new garment = ${kgSaved}kg saved. Water: ${items} × ${WATER_PER_TSHIRT.toLocaleString()}L per cotton t-shirt = ${waterSaved.toLocaleString()}L`;

  // 50+ items → wardrobe equivalent + water impact
  if (items >= 50) {
    const wardrobes = (items / 50).toFixed(1);
    return {
      value: `${wardrobes} wardrobe${Number(wardrobes) >= 2 ? "s" : ""} worth`,
      comparison: `${items} secondhand items saved ${kgSaved}kg CO₂ and ${Math.round(waterSaved / 1000).toLocaleString()}k litres of water vs buying new`,
      icon: "wardrobe",
      tooltip: `${baseTooltip}. ~50 items per wardrobe`,
    };
  }

  // 20–50 items → suitcases + CO2
  if (items >= 20) {
    const suitcases = Math.round(items / 20);
    return {
      value: `${suitcases} suitcase${suitcases >= 2 ? "s" : ""} of secondhand clothes`,
      comparison: `${items} items saved ${kgSaved}kg CO₂ — like taking a car off the road for ${Math.round(kgSaved / 4.6)} days`,
      icon: "suitcase",
      tooltip: `${baseTooltip}. Car-free days: ${kgSaved}kg ÷ 4.6kg daily car CO₂`,
    };
  }

  // 5–20 items → CO2 savings in relatable terms
  if (items >= 5) {
    const showers = Math.round(waterSaved / 65);
    return {
      value: `${items} secondhand finds`,
      comparison: `Saved ${kgSaved}kg CO₂ and ${showers} showers' worth of water vs buying new`,
      icon: "shirt",
      tooltip: `${baseTooltip}. Showers: ${waterSaved.toLocaleString()}L ÷ 65L per shower = ${showers}`,
    };
  }

  // 1–4 items → per-item impact
  return {
    value: `${items} item${items !== 1 ? "s" : ""} given new life`,
    comparison: `Each secondhand item saves ~${CO2_PER_NEW_GARMENT}kg CO₂ and ~${WATER_PER_TSHIRT.toLocaleString()}L of water`,
    icon: "recycle",
    tooltip: `Each new garment produces ~${CO2_PER_NEW_GARMENT}kg CO₂ and uses ~${WATER_PER_TSHIRT.toLocaleString()}L of water to manufacture`,
  };
}
