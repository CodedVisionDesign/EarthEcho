import { waterToHuman } from "./water";
import { carbonToHuman } from "./carbon";
import { plasticToHuman } from "./plastic";
import { transportToHuman } from "./transport";

export type MetricCategory = "WATER" | "CARBON" | "PLASTIC" | "RECYCLING" | "TRANSPORT" | "FASHION";

interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
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
      };
  }
}

function recyclingToHuman(kgRecycled: number): HumanMetric {
  const TREE_EQUIVALENT = 60; // kg of paper recycled = 1 tree saved
  const HOME_ENERGY_DAY = 5; // rough kg recycled = 1 day of home energy saved

  if (kgRecycled >= TREE_EQUIVALENT) {
    const trees = (kgRecycled / TREE_EQUIVALENT).toFixed(1);
    return {
      value: `${trees} tree${Number(trees) >= 2 ? "s" : ""} saved`,
      comparison: `Your recycling has saved the equivalent of ${trees} tree${Number(trees) >= 2 ? "s" : ""}`,
      icon: "tree",
    };
  }

  const days = Math.round(kgRecycled / HOME_ENERGY_DAY);
  return {
    value: `${days} day${days !== 1 ? "s" : ""} of energy`,
    comparison: `Enough saved energy to power a home for ${days} day${days !== 1 ? "s" : ""}`,
    icon: "bolt",
  };
}

function fashionToHuman(items: number): HumanMetric {
  const CO2_PER_NEW_GARMENT = 8; // kg CO2 for average new fast-fashion item

  const kgSaved = items * CO2_PER_NEW_GARMENT;

  if (kgSaved >= 100) {
    return {
      value: `${kgSaved}kg CO2 avoided`,
      comparison: `Buying ${items} items secondhand saved ${kgSaved}kg of CO2 vs buying new`,
      icon: "shirt",
    };
  }

  return {
    value: `${items} secondhand item${items !== 1 ? "s" : ""}`,
    comparison: `${items} item${items !== 1 ? "s" : ""} given a second life instead of fast fashion`,
    icon: "recycle",
  };
}
