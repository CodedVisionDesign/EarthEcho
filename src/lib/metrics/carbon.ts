/**
 * Carbon metric conversions
 * Base unit: kg CO2 equivalent (kg CO2e)
 */

interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
  tooltip: string;
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
      tooltip: `${kgCO2.toLocaleString()}kg CO₂ ÷ 2,000kg per return transatlantic flight = ${flights} flights`,
    };
  }

  if (kgCO2 >= CONVERSIONS.flightEurope) {
    const flights = (kgCO2 / CONVERSIONS.flightEurope).toFixed(1);
    return {
      value: `${flights} European flight${Number(flights) >= 2 ? "s" : ""}`,
      comparison: `Like flying to Europe and back ${flights} time${Number(flights) >= 2 ? "s" : ""}`,
      icon: "plane",
      tooltip: `${kgCO2.toLocaleString()}kg CO₂ ÷ 500kg per return European flight = ${flights} flights`,
    };
  }

  // 250–500 → domestic flights
  if (kgCO2 >= CONVERSIONS.flightDomestic) {
    const flights = (kgCO2 / CONVERSIONS.flightDomestic).toFixed(1);
    return {
      value: `${flights} domestic flight${Number(flights) >= 2 ? "s" : ""}`,
      comparison: `Same as ${flights} one-way domestic flight${Number(flights) >= 2 ? "s" : ""}`,
      icon: "plane",
      tooltip: `${kgCO2.toLocaleString()}kg CO₂ ÷ 250kg per domestic flight = ${flights} flights`,
    };
  }

  // 100–250 → household days (17kg/day avg UK)
  if (kgCO2 >= 100) {
    const days = Math.round(kgCO2 / CONVERSIONS.householdDay);
    return {
      value: `${days} day${days >= 2 ? "s" : ""} of household emissions`,
      comparison: `Equal to ${days} day${days >= 2 ? "s" : ""} of an average UK household's total carbon footprint`,
      icon: "home",
      tooltip: `${kgCO2.toLocaleString()}kg CO₂ ÷ 17kg average UK household daily emissions = ${days} days`,
    };
  }

  if (kgCO2 >= CONVERSIONS.treeYear) {
    const trees = (kgCO2 / CONVERSIONS.treeYear).toFixed(1);
    return {
      value: `${trees} tree-year${Number(trees) >= 2 ? "s" : ""}`,
      comparison: `Would take ${trees} tree${Number(trees) >= 2 ? "s" : ""} a whole year to absorb`,
      icon: "tree",
      tooltip: `${kgCO2.toLocaleString()}kg CO₂ ÷ 22kg absorbed per tree per year = ${trees} tree-years`,
    };
  }

  if (kgCO2 >= CONVERSIONS.carJourneyAvg) {
    const trips = Math.round(kgCO2 / CONVERSIONS.carJourneyAvg);
    return {
      value: `${trips} car commute${trips >= 2 ? "s" : ""}`,
      comparison: `Same as driving to work ${trips} time${trips >= 2 ? "s" : ""}`,
      icon: "car",
      tooltip: `${kgCO2.toLocaleString()}kg CO₂ ÷ 3.5kg per average car commute (~8.7 miles) = ${trips} trips`,
    };
  }

  // 0.5–3.5 → train commutes
  if (kgCO2 >= CONVERSIONS.trainJourneyAvg) {
    const trains = (kgCO2 / CONVERSIONS.trainJourneyAvg).toFixed(1);
    return {
      value: `${trains} train commute${Number(trains) >= 2 ? "s" : ""}`,
      comparison: `Same carbon as ${trains} average train commute${Number(trains) >= 2 ? "s" : ""}`,
      icon: "train",
      tooltip: `${kgCO2.toLocaleString()}kg CO₂ ÷ 0.5kg per train commute = ${trains} commutes`,
    };
  }

  const kettles = Math.round(kgCO2 / CONVERSIONS.kettle);
  return {
    value: `${kettles} kettle boil${kettles >= 2 ? "s" : ""}`,
    comparison: `Like boiling the kettle ${kettles} time${kettles >= 2 ? "s" : ""}`,
    icon: "kettle",
    tooltip: `${kgCO2}kg CO₂ ÷ 0.015kg per kettle boil = ${kettles} boils`,
  };
}
