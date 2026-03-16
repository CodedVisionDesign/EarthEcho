/**
 * Transport metric conversions
 * Base unit: km travelled
 *
 * CO2 emission factors (kg CO2 per km) from UK Government GHG Conversion Factors.
 * These are averages — real values vary by vehicle model, occupancy, etc.
 */

interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
}

export interface TransportModeData {
  slug: string;
  name: string;
  co2PerKm: number;
  icon: string;
  category: "car" | "public" | "active" | "flight";
  isZeroEmission: boolean;
}

/**
 * Transport emission factors (kg CO2 per km per passenger)
 */
export const TRANSPORT_MODES: Record<string, TransportModeData> = {
  petrol_car: {
    slug: "petrol_car",
    name: "Petrol Car",
    co2PerKm: 0.170,
    icon: "car",
    category: "car",
    isZeroEmission: false,
  },
  diesel_car: {
    slug: "diesel_car",
    name: "Diesel Car",
    co2PerKm: 0.155,
    icon: "car",
    category: "car",
    isZeroEmission: false,
  },
  hybrid_car: {
    slug: "hybrid_car",
    name: "Hybrid Car",
    co2PerKm: 0.105,
    icon: "car",
    category: "car",
    isZeroEmission: false,
  },
  ev: {
    slug: "ev",
    name: "Electric Vehicle",
    co2PerKm: 0.050,
    icon: "zap",
    category: "car",
    isZeroEmission: false, // Grid-dependent, not truly zero
  },
  bus: {
    slug: "bus",
    name: "Bus",
    co2PerKm: 0.089,
    icon: "bus",
    category: "public",
    isZeroEmission: false,
  },
  train: {
    slug: "train",
    name: "Train",
    co2PerKm: 0.035,
    icon: "train",
    category: "public",
    isZeroEmission: false,
  },
  domestic_flight: {
    slug: "domestic_flight",
    name: "Domestic Flight",
    co2PerKm: 0.255,
    icon: "plane",
    category: "flight",
    isZeroEmission: false,
  },
  short_haul_flight: {
    slug: "short_haul_flight",
    name: "Short-Haul Flight",
    co2PerKm: 0.156,
    icon: "plane",
    category: "flight",
    isZeroEmission: false,
  },
  long_haul_flight: {
    slug: "long_haul_flight",
    name: "Long-Haul Flight",
    co2PerKm: 0.150,
    icon: "plane",
    category: "flight",
    isZeroEmission: false,
  },
  cycling: {
    slug: "cycling",
    name: "Cycling",
    co2PerKm: 0,
    icon: "bike",
    category: "active",
    isZeroEmission: true,
  },
  walking: {
    slug: "walking",
    name: "Walking",
    co2PerKm: 0,
    icon: "footprints",
    category: "active",
    isZeroEmission: true,
  },
  e_scooter: {
    slug: "e_scooter",
    name: "E-Scooter / E-Bike",
    co2PerKm: 0.005,
    icon: "zap",
    category: "active",
    isZeroEmission: false,
  },
};

// Reference mode for calculating savings (what the user would have driven otherwise)
const BASELINE_MODE = TRANSPORT_MODES.petrol_car;

/**
 * Calculate kg CO2 for a journey
 */
export function calculateJourneyCO2(modeSlug: string, distanceKm: number): number {
  const mode = TRANSPORT_MODES[modeSlug];
  if (!mode) return 0;
  return mode.co2PerKm * distanceKm;
}

/**
 * Calculate CO2 saved vs driving a petrol car
 */
export function calculateCO2Saved(modeSlug: string, distanceKm: number): number {
  const mode = TRANSPORT_MODES[modeSlug];
  if (!mode) return 0;
  const baseline = BASELINE_MODE.co2PerKm * distanceKm;
  const actual = mode.co2PerKm * distanceKm;
  return Math.max(0, baseline - actual);
}

/**
 * Compare all transport modes for a given distance
 */
export function compareAllModes(distanceKm: number): Array<{
  mode: TransportModeData;
  co2: number;
  savingsVsCar: number;
}> {
  return Object.values(TRANSPORT_MODES)
    .map((mode) => ({
      mode,
      co2: mode.co2PerKm * distanceKm,
      savingsVsCar: Math.max(0, (BASELINE_MODE.co2PerKm - mode.co2PerKm) * distanceKm),
    }))
    .sort((a, b) => a.co2 - b.co2);
}

/**
 * Convert transport CO2 savings to human-readable format
 */
export function transportToHuman(co2SavedKg: number): HumanMetric {
  if (co2SavedKg <= 0) {
    return {
      value: "0 savings",
      comparison: "Try walking, cycling, or public transport to see savings!",
      icon: "info",
    };
  }

  // Express as equivalent petrol car km avoided
  const carKmAvoided = co2SavedKg / BASELINE_MODE.co2PerKm;

  if (carKmAvoided >= 1000) {
    const trips = Math.round(carKmAvoided / 350); // London to Edinburgh ~570km, avg trip ~350km
    return {
      value: `${trips} road trip${trips >= 2 ? "s" : ""} worth`,
      comparison: `You've saved the emissions of ${trips} long car journey${trips >= 2 ? "s" : ""}`,
      icon: "map",
    };
  }

  if (carKmAvoided >= 100) {
    const commutes = Math.round(carKmAvoided / 15); // avg UK commute ~15km
    return {
      value: `${commutes} car commute${commutes >= 2 ? "s" : ""} avoided`,
      comparison: `Like taking ${commutes} car commute${commutes >= 2 ? "s" : ""} off the road`,
      icon: "car-off",
    };
  }

  if (carKmAvoided >= 10) {
    return {
      value: `${Math.round(carKmAvoided)} car-free km`,
      comparison: `${Math.round(carKmAvoided)} km of driving emissions avoided`,
      icon: "leaf",
    };
  }

  return {
    value: `${co2SavedKg.toFixed(2)} kg CO2 saved`,
    comparison: `Every kilometre counts — ${co2SavedKg.toFixed(2)} kg CO2 kept out of the atmosphere`,
    icon: "sparkle",
  };
}

/**
 * Convert active transport (walking/cycling) to health + environmental impact
 */
export function activeTransportToHuman(
  mode: "walking" | "cycling",
  distanceKm: number
): HumanMetric & { healthBenefit: string } {
  const co2Saved = calculateCO2Saved(mode, distanceKm);
  const metric = transportToHuman(co2Saved);

  // Approximate calorie calculations
  const caloriesPerKm = mode === "cycling" ? 50 : 65; // rough averages
  const calories = Math.round(distanceKm * caloriesPerKm);

  const healthBenefit =
    calories >= 500
      ? `Burned about ${calories} calories — that's a full meal's worth!`
      : calories >= 100
        ? `Burned about ${calories} calories — keep it up!`
        : `Burned about ${calories} calories`;

  return { ...metric, healthBenefit };
}

/**
 * EV-specific: calculate petrol equivalent saved
 */
export function evPetrolSaved(distanceKm: number): {
  litresSaved: number;
  costSaved: number;
  comparison: string;
} {
  const petrolCO2 = BASELINE_MODE.co2PerKm * distanceKm;
  const evCO2 = TRANSPORT_MODES.ev.co2PerKm * distanceKm;
  const co2Diff = petrolCO2 - evCO2;

  // Average petrol consumption: ~7L/100km, avg price £1.40/L
  const litresSaved = (distanceKm / 100) * 7;
  const costSaved = litresSaved * 1.4;

  return {
    litresSaved: Math.round(litresSaved * 10) / 10,
    costSaved: Math.round(costSaved * 100) / 100,
    comparison: `Your EV saved ${litresSaved.toFixed(1)}L of petrol (£${costSaved.toFixed(2)}) and ${co2Diff.toFixed(1)}kg CO2`,
  };
}

/**
 * Flight offset calculator
 */
export function flightOffset(distanceKm: number, flightType: "domestic_flight" | "short_haul_flight" | "long_haul_flight"): {
  co2Kg: number;
  treesToOffset: number;
  carFreeDaysToOffset: number;
  comparison: string;
} {
  const mode = TRANSPORT_MODES[flightType];
  const co2Kg = mode.co2PerKm * distanceKm;
  const treesPerYear = 22; // kg CO2 absorbed per tree per year
  const dailyCarCO2 = BASELINE_MODE.co2PerKm * 15; // 15km avg daily commute

  return {
    co2Kg: Math.round(co2Kg),
    treesToOffset: Math.ceil(co2Kg / treesPerYear),
    carFreeDaysToOffset: Math.round(co2Kg / dailyCarCO2),
    comparison: `This flight produces ${Math.round(co2Kg)}kg CO2. To offset: plant ${Math.ceil(co2Kg / treesPerYear)} trees, or go car-free for ${Math.round(co2Kg / dailyCarCO2)} days.`,
  };
}
