/**
 * Carbon metric conversions
 * Base unit: kg CO2 equivalent (kg CO2e)
 */

interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
}

const CONVERSIONS = {
  balloon: 0.014, // 1 party balloon of CO2
  kettle: 0.015, // boiling one kettle
  carMile: 0.404, // average car per mile
  carJourneyAvg: 3.5, // average commute ~8.7 miles
  trainJourneyAvg: 0.5, // per average train commute
  flightDomestic: 250, // one-way domestic flight UK
  flightEurope: 500, // return flight London-Paris
  flightLongHaul: 2_000, // return transatlantic
  treeYear: 22, // kg CO2 absorbed by one tree per year
  householdDay: 17, // average UK household daily emissions
};

export function carbonToHuman(kgCO2: number): HumanMetric {
  if (kgCO2 >= CONVERSIONS.flightLongHaul) {
    const flights = (kgCO2 / CONVERSIONS.flightLongHaul).toFixed(1);
    return {
      value: `${flights} transatlantic flight${Number(flights) >= 2 ? "s" : ""}`,
      comparison: `Equivalent to ${flights} return flight${Number(flights) >= 2 ? "s" : ""} across the Atlantic`,
      icon: "plane",
    };
  }

  if (kgCO2 >= CONVERSIONS.flightEurope) {
    const flights = (kgCO2 / CONVERSIONS.flightEurope).toFixed(1);
    return {
      value: `${flights} European flight${Number(flights) >= 2 ? "s" : ""}`,
      comparison: `Like flying to Europe and back ${flights} time${Number(flights) >= 2 ? "s" : ""}`,
      icon: "plane",
    };
  }

  if (kgCO2 >= CONVERSIONS.treeYear) {
    const trees = (kgCO2 / CONVERSIONS.treeYear).toFixed(1);
    return {
      value: `${trees} tree-year${Number(trees) >= 2 ? "s" : ""}`,
      comparison: `Would take ${trees} tree${Number(trees) >= 2 ? "s" : ""} a whole year to absorb`,
      icon: "tree",
    };
  }

  if (kgCO2 >= CONVERSIONS.carJourneyAvg) {
    const trips = Math.round(kgCO2 / CONVERSIONS.carJourneyAvg);
    return {
      value: `${trips} car commute${trips >= 2 ? "s" : ""}`,
      comparison: `Same as driving to work ${trips} time${trips >= 2 ? "s" : ""}`,
      icon: "car",
    };
  }

  const kettles = Math.round(kgCO2 / CONVERSIONS.kettle);
  return {
    value: `${kettles} kettle boil${kettles >= 2 ? "s" : ""}`,
    comparison: `Like boiling the kettle ${kettles} time${kettles >= 2 ? "s" : ""}`,
    icon: "kettle",
  };
}
