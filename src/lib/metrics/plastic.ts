/**
 * Plastic metric conversions
 * Base unit: number of single-use items avoided
 */

interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
  tooltip: string;
}

const CONVERSIONS = {
  shoppingBag: 1,
  waterBottle: 1,
  binBag: 30, // items to fill one bin bag
  wheelieBin: 150, // items to fill a wheelie bin
  footballPitch: 50_000, // plastic items to cover a football pitch one layer
};

export function plasticToHuman(items: number): HumanMetric {
  // 1,000+ → body weight equivalent (~5g per item avg, 1,000 items ≈ 5kg)
  if (items >= 1_000) {
    const kg = Math.round(items * 0.005);
    return {
      value: `${kg}kg of plastic avoided`,
      comparison: `That's ${kg}kg of plastic kept out of landfill — heavier than a bowling ball`,
      icon: "weight",
      tooltip: `${items.toLocaleString()} items × 5g average weight = ${kg}kg total plastic avoided`,
    };
  }

  // 500–1,000 → shopping trolleys (about 500 items fills one)
  if (items >= 500) {
    const trolleys = (items / 500).toFixed(1);
    return {
      value: `${trolleys} shopping trolley${Number(trolleys) >= 2 ? "s" : ""} full`,
      comparison: `You've avoided filling ${trolleys} shopping trolley${Number(trolleys) >= 2 ? "s" : ""} with plastic waste`,
      icon: "trolley",
      tooltip: `${items.toLocaleString()} items ÷ ~500 items per trolley = ${trolleys} trolleys`,
    };
  }

  if (items >= CONVERSIONS.wheelieBin) {
    const bins = (items / CONVERSIONS.wheelieBin).toFixed(1);
    return {
      value: `${bins} wheelie bin${Number(bins) >= 2 ? "s" : ""}`,
      comparison: `Enough plastic to fill ${bins} wheelie bin${Number(bins) >= 2 ? "s" : ""}`,
      icon: "bin",
      tooltip: `${items} items ÷ 150 items per wheelie bin = ${bins} bins`,
    };
  }

  if (items >= CONVERSIONS.binBag) {
    const bags = Math.round(items / CONVERSIONS.binBag);
    return {
      value: `${bags} bin bag${bags >= 2 ? "s" : ""}`,
      comparison: `You've avoided filling ${bags} bin bag${bags >= 2 ? "s" : ""} with plastic`,
      icon: "bag",
      tooltip: `${items} items ÷ 30 items per bin bag = ${bags} bags`,
    };
  }

  if (items >= 10) {
    // Express as plastic bottles saved — most relatable
    return {
      value: `${items} plastic bottles`,
      comparison: `That's ${items} single-use plastic bottles kept out of the ocean`,
      icon: "bottle",
      tooltip: `Each item represents one single-use plastic item avoided (bottles, bags, cups, etc.)`,
    };
  }

  return {
    value: `${items} item${items !== 1 ? "s" : ""}`,
    comparison: `Every item counts — ${items} fewer piece${items !== 1 ? "s" : ""} of single-use plastic`,
    icon: "leaf",
    tooltip: `${items} single-use plastic item${items !== 1 ? "s" : ""} avoided`,
  };
}
