/**
 * Plastic metric conversions
 * Base unit: number of single-use items avoided
 */

interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
}

const CONVERSIONS = {
  shoppingBag: 1,
  waterBottle: 1,
  binBag: 30, // items to fill one bin bag
  wheelieBin: 150, // items to fill a wheelie bin
  footballPitch: 50_000, // plastic items to cover a football pitch one layer
};

export function plasticToHuman(items: number): HumanMetric {
  if (items >= CONVERSIONS.wheelieBin) {
    const bins = (items / CONVERSIONS.wheelieBin).toFixed(1);
    return {
      value: `${bins} wheelie bin${Number(bins) >= 2 ? "s" : ""}`,
      comparison: `Enough plastic to fill ${bins} wheelie bin${Number(bins) >= 2 ? "s" : ""}`,
      icon: "bin",
    };
  }

  if (items >= CONVERSIONS.binBag) {
    const bags = Math.round(items / CONVERSIONS.binBag);
    return {
      value: `${bags} bin bag${bags >= 2 ? "s" : ""}`,
      comparison: `You've avoided filling ${bags} bin bag${bags >= 2 ? "s" : ""} with plastic`,
      icon: "bag",
    };
  }

  if (items >= 10) {
    return {
      value: `${items} plastic items`,
      comparison: `That's ${items} single-use items kept out of landfill`,
      icon: "bottle",
    };
  }

  return {
    value: `${items} item${items !== 1 ? "s" : ""}`,
    comparison: `Every item counts. ${items} fewer in the ocean`,
    icon: "leaf",
  };
}
