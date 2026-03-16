import { faSun } from "@fortawesome/free-solid-svg-icons";
import type { Guide } from "./types";

export const solarPanels: Guide = {
  slug: "solar-panels",
  title: "Solar Panels in the UK: A Homeowner's Complete Guide",
  subtitle:
    "Everything you need to know about costs, savings, government schemes, and choosing an installer.",
  icon: faSun,
  category: "energy",
  categoryLabel: "Energy",
  readTimeMinutes: 12,
  introduction:
    "Solar panels are one of the most impactful investments a UK homeowner can make for both their wallet and the planet. Despite the UK's reputation for grey skies, photovoltaic panels work on daylight rather than direct sunshine, making them a viable and increasingly popular option across the country. Over 1.3 million UK homes already have solar panels installed.",
  sections: [
    {
      heading: "How Solar Panels Work in the UK Climate",
      paragraphs: [
        "Photovoltaic (PV) solar panels convert daylight into electricity. They do not need direct sunshine to generate power, which makes them well suited to the UK climate. Even on overcast days, panels will produce electricity, albeit at a reduced rate.",
        "The UK receives between 900 and 1,300 kWh per square metre of solar irradiance per year, depending on location. Southern England receives the most, but panels are effective throughout the country.",
        "A typical domestic system is 3 to 4 kWp (kilowatt peak), which requires 10 to 14 panels. Ideally the roof should face south, south-east, or south-west at a pitch of 30 to 40 degrees and be free from significant shading.",
      ],
      stats: [
        {
          figure: "900-1,300 kWh/m\u00B2",
          description:
            "Annual solar irradiance across the UK",
          source: "Met Office",
        },
        {
          figure: "1.3 million",
          description: "UK homes with solar panels (as of 2024)",
          source: "Solar Energy UK",
        },
      ],
      callout: {
        type: "info",
        content:
          "You do not usually need planning permission for rooftop solar panels on a house. They are classed as permitted development. Listed buildings and conservation areas may have restrictions.",
      },
    },
    {
      heading: "Costs and Financial Returns",
      paragraphs: [
        "The average cost of a 4 kWp domestic solar panel system in the UK is between \u00A36,000 and \u00A38,000 fully installed. Prices have fallen significantly over the past decade, and the market is competitive, so getting multiple quotes is recommended.",
        "Since April 2022, there has been 0% VAT on domestic solar panel installations, which has been extended and remains in effect. This saves homeowners roughly \u00A31,000 to \u00A31,500 compared to the previous 5% VAT rate.",
        "The typical payback period for a domestic solar system is 9 to 12 years, after which the electricity generated is essentially free for the remaining 15 to 20 years of the panels' lifespan.",
      ],
      stats: [
        {
          figure: "\u00A36,000-\u00A38,000",
          description: "Typical cost of a 4 kWp system (installed)",
          source: "Energy Saving Trust",
        },
        {
          figure: "9-12 years",
          description: "Typical payback period",
          source: "Energy Saving Trust",
        },
      ],
      callout: {
        type: "uk",
        content:
          "Since April 2022, domestic solar panel installations in the UK carry 0% VAT, saving homeowners over \u00A31,000.",
      },
    },
    {
      heading: "How Much Can You Save?",
      paragraphs: [
        "A typical 4 kWp system generates around 4,200 kWh of electricity per year. How much of this you use directly (self-consumption) versus export to the grid determines your savings.",
        "If you are at home during the day and use appliances while the panels generate, you might self-consume 40 to 50% of the electricity. This could save you between \u00A3400 and \u00A3660 per year on electricity bills, depending on your tariff and usage patterns.",
        "In terms of carbon, a typical domestic solar installation saves roughly 1.5 to 2 tonnes of CO\u2082 per year, equivalent to taking a car off the road for several months.",
      ],
      stats: [
        {
          figure: "4,200 kWh/year",
          description: "Typical annual output of a 4 kWp system",
          source: "Energy Saving Trust",
        },
        {
          figure: "1.5-2 tonnes CO\u2082/year",
          description: "Carbon saving from a typical home solar system",
          source: "Carbon Trust",
        },
      ],
    },
    {
      heading: "Government Schemes and Incentives",
      paragraphs: [
        "The Smart Export Guarantee (SEG) requires large energy suppliers to pay you for electricity you export to the grid. Tariff rates vary between suppliers, typically from 3p to 15p per kWh. You must use an MCS-certified installer to qualify.",
        "The ECO4 scheme provides funding for energy efficiency measures, including solar panels, for eligible low-income households. Contact your energy supplier or local authority to check eligibility.",
        "The Boiler Upgrade Scheme (BUS) offers grants of up to \u00A37,500 towards heat pumps and can be combined with solar. Home Energy Scotland and Nest (Wales) offer additional grants and interest-free loans.",
      ],
      list: [
        "Smart Export Guarantee (SEG): paid for surplus electricity exported to the grid",
        "0% VAT on domestic solar installations",
        "ECO4 scheme for eligible low-income households",
        "Boiler Upgrade Scheme (BUS) grants for heat pumps",
        "No planning permission needed for most domestic rooftop solar",
      ],
      callout: {
        type: "tip",
        content:
          "Compare SEG tariffs across suppliers before signing up. Rates vary significantly, and you do not have to export to your own electricity supplier.",
      },
    },
    {
      heading: "Battery Storage",
      paragraphs: [
        "A home battery system stores surplus solar electricity generated during the day for use in the evening and overnight. This increases the proportion of solar electricity you use directly (self-consumption) from around 50% to 80% or more.",
        "Typical home batteries have a capacity of 5 to 13 kWh and cost between \u00A32,500 and \u00A36,000. Popular models include the Tesla Powerwall, GivEnergy, and Solax.",
        "Batteries pair well with time-of-use tariffs such as Octopus Agile, where you can charge from the grid at off-peak rates and use stored energy during expensive peak periods.",
      ],
      stats: [
        {
          figure: "50% \u2192 80%",
          description:
            "Increase in self-consumption when adding battery storage",
          source: "Energy Saving Trust",
        },
      ],
    },
    {
      heading: "Choosing an Installer",
      paragraphs: [
        "Always use an MCS-certified (Microgeneration Certification Scheme) installer. This is required to be eligible for the Smart Export Guarantee and ensures the installation meets quality standards.",
        "Get at least three quotes and check reviews. You can find certified installers through the MCS website, Which? Trusted Traders, or the Renewable Energy Consumer Code (RECC).",
        "Be wary of high-pressure sales tactics or companies offering very low prices. A quality installation should come with workmanship warranties of at least 10 years, and panels typically carry a 25-year performance warranty.",
      ],
      callout: {
        type: "warning",
        content:
          "Only use MCS-certified installers. Without MCS certification, you cannot claim the Smart Export Guarantee and may have issues with warranties and building regulations.",
      },
    },
  ],
  quickTips: [
    "Check your roof faces south, south-east, or south-west and is not heavily shaded",
    "Always use an MCS-certified installer to qualify for the Smart Export Guarantee",
    "Consider adding a battery if you are typically out during the day",
    "Compare SEG tariffs across suppliers. Rates vary significantly",
    "Get at least three quotes before committing",
    "Check if your council offers additional grants or green home improvement loans",
    "0% VAT applies automatically. You should not be charged VAT on a domestic installation",
  ],
  sources: [
    { name: "Energy Saving Trust", url: "https://energysavingtrust.org.uk/advice/solar-panels/" },
    { name: "Ofgem (Smart Export Guarantee)", url: "https://www.ofgem.gov.uk/environmental-and-social-schemes/smart-export-guarantee-seg" },
    { name: "MCS Certified", url: "https://mcscertified.com/" },
    { name: "Solar Energy UK", url: "https://solarenergyuk.org/" },
    { name: "GOV.UK (Planning Permission)", url: "https://www.gov.uk/government/publications/permitted-development-rights-for-householders-technical-guidance" },
    { name: "Carbon Trust", url: "https://www.carbontrust.com/" },
  ],
  lastUpdated: "March 2026",
};
