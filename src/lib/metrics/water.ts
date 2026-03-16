/**
 * Water metric conversions
 * Base unit: Litres (L)
 */

interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
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
      comparison: `That's enough to fill ${pools.toFixed(1)} swimming pool${pools >= 2 ? "s" : ""}!`,
      icon: "pool",
    };
  }

  if (litres >= CONVERSIONS.bathtub * 10) {
    const baths = Math.round(litres / CONVERSIONS.bathtub);
    return {
      value: `${baths} bathtubs`,
      comparison: `Enough to fill ${baths} bathtubs!`,
      icon: "bathtub",
    };
  }

  if (litres >= CONVERSIONS.bathtub) {
    const baths = (litres / CONVERSIONS.bathtub).toFixed(1);
    return {
      value: `${baths} bathtub${Number(baths) >= 2 ? "s" : ""}`,
      comparison: `That's about ${baths} bathtub${Number(baths) >= 2 ? "s" : ""} of water`,
      icon: "bathtub",
    };
  }

  if (litres >= CONVERSIONS.shower) {
    const showers = Math.round(litres / CONVERSIONS.shower);
    return {
      value: `${showers} shower${showers >= 2 ? "s" : ""}`,
      comparison: `Equivalent to ${showers} 8-minute shower${showers >= 2 ? "s" : ""}`,
      icon: "shower",
    };
  }

  const glasses = Math.round(litres / CONVERSIONS.glass);
  return {
    value: `${glasses} glasses`,
    comparison: `That's about ${glasses} glasses of water`,
    icon: "glass",
  };
}
