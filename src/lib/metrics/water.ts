/**
 * Water metric conversions
 * Base unit: Litres (L)
 */

interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
  tooltip: string;
}

const CONVERSIONS = {
  glass: 0.25, // litres
  bathtub: 80,
  shower: 65, // average 8-minute shower
  swimmingPool: 50_000,
  gardenHose: 15, // per minute
  washingMachine: 50, // per cycle
  dishwasher: 13, // per cycle
  toilet: 6, // per flush
};

export function waterToHuman(litres: number): HumanMetric {
  if (litres >= CONVERSIONS.swimmingPool) {
    const pools = litres / CONVERSIONS.swimmingPool;
    return {
      value: `${pools.toFixed(1)} swimming pool${pools >= 2 ? "s" : ""}`,
      comparison: `That's enough to fill ${pools.toFixed(1)} Olympic-sized swimming pool${pools >= 2 ? "s" : ""}!`,
      icon: "pool",
      tooltip: `${litres.toLocaleString()}L ÷ 50,000L per pool = ${pools.toFixed(1)} pools`,
    };
  }

  // 10,000L+ → fire engine tanks (approx 1,800L each)
  if (litres >= 10_000) {
    const tanks = Math.round(litres / 1_800);
    return {
      value: `${tanks} fire engine tank${tanks >= 2 ? "s" : ""}`,
      comparison: `Enough to fill ${tanks} fire engine water tank${tanks >= 2 ? "s" : ""}`,
      icon: "truck",
      tooltip: `${litres.toLocaleString()}L ÷ 1,800L per fire engine tank = ${tanks} tanks`,
    };
  }

  // 2,000–10,000L → hot tubs (approx 1,500L each)
  if (litres >= 2_000) {
    const tubs = (litres / 1_500).toFixed(1);
    return {
      value: `${tubs} hot tub${Number(tubs) >= 2 ? "s" : ""}`,
      comparison: `That would fill ${tubs} hot tub${Number(tubs) >= 2 ? "s" : ""}`,
      icon: "hot-tub",
      tooltip: `${litres.toLocaleString()}L ÷ 1,500L per hot tub = ${tubs} tubs`,
    };
  }

  // 500–2,000L → washing machine loads (50L each)
  if (litres >= 500) {
    const loads = Math.round(litres / CONVERSIONS.washingMachine);
    return {
      value: `${loads} washing loads`,
      comparison: `Equivalent to ${loads} washing machine cycle${loads >= 2 ? "s" : ""}`,
      icon: "washing",
      tooltip: `${litres.toLocaleString()}L ÷ 50L per wash cycle = ${loads} loads`,
    };
  }

  // 150–500L → bathtubs
  if (litres >= 150) {
    const baths = (litres / CONVERSIONS.bathtub).toFixed(1);
    return {
      value: `${baths} bathtub${Number(baths) >= 2 ? "s" : ""}`,
      comparison: `Enough to fill ${baths} bathtub${Number(baths) >= 2 ? "s" : ""}`,
      icon: "bathtub",
      tooltip: `${litres.toLocaleString()}L ÷ 80L per bathtub = ${baths} baths`,
    };
  }

  // 65–150L → showers
  if (litres >= CONVERSIONS.shower) {
    const showers = (litres / CONVERSIONS.shower).toFixed(1);
    return {
      value: `${showers} shower${Number(showers) >= 2 ? "s" : ""}`,
      comparison: `Equivalent to ${showers} 8-minute shower${Number(showers) >= 2 ? "s" : ""}`,
      icon: "shower",
      tooltip: `${litres.toLocaleString()}L ÷ 65L per 8-min shower = ${showers} showers`,
    };
  }

  // 6–65L → toilet flushes
  if (litres >= CONVERSIONS.toilet) {
    const flushes = Math.round(litres / CONVERSIONS.toilet);
    return {
      value: `${flushes} toilet flush${flushes >= 2 ? "es" : ""}`,
      comparison: `Same as ${flushes} toilet flush${flushes >= 2 ? "es" : ""}`,
      icon: "droplet",
      tooltip: `${litres.toLocaleString()}L ÷ 6L per flush = ${flushes} flushes`,
    };
  }

  const glasses = Math.round(litres / CONVERSIONS.glass);
  return {
    value: `${glasses} glass${glasses >= 2 ? "es" : ""}`,
    comparison: `That's about ${glasses} glass${glasses >= 2 ? "es" : ""} of water`,
    icon: "glass",
    tooltip: `${litres}L ÷ 0.25L per glass = ${glasses} glasses`,
  };
}
