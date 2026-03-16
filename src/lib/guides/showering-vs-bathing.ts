import { faShower } from "@fortawesome/free-solid-svg-icons";
import type { Guide } from "./types";

export const showeringVsBathing: Guide = {
  slug: "showering-vs-bathing",
  title: "Showering vs Bathing: Which Uses Less Water and Energy?",
  subtitle:
    "A detailed comparison of water usage, energy costs, and carbon emissions for showers and baths.",
  icon: faShower,
  category: "water",
  categoryLabel: "Water",
  readTimeMinutes: 6,
  introduction:
    "\"Just take a shower instead of a bath\" is common advice, but the reality is more nuanced than that. A short shower does use less water and energy than a bath, but a long power shower can actually use more. Here is a detailed breakdown to help you make informed choices.",
  sections: [
    {
      heading: "The Quick Answer",
      paragraphs: [
        "A 4-minute shower with a standard showerhead uses roughly 32 to 60 litres of water, depending on the type of shower. A typical bath uses 80 to 150 litres, with the commonly cited average being about 80 litres for a modestly filled bath.",
        "So a short shower wins comfortably. However, an 8-minute or longer power shower can easily use 120 to 160 litres, which is as much as or more than a bath. The type of shower and the duration are what really matter.",
      ],
      stats: [
        {
          figure: "32-60 litres",
          description: "Water used by a 4-minute shower (varies by type)",
          source: "Energy Saving Trust",
        },
        {
          figure: "80-150 litres",
          description: "Water used by a typical bath",
          source: "Waterwise",
        },
      ],
    },
    {
      heading: "Water Usage by Shower Type",
      paragraphs: [
        "Not all showers are equal. The type of shower you have makes a huge difference to water consumption:",
        "This means a 4-minute electric shower uses roughly 32 to 36 litres, while a 4-minute power shower uses 60 to 80 litres. A 10-minute mixer shower uses 120 to 150 litres, which exceeds an average bath.",
      ],
      list: [
        "Electric shower: 8 to 9 litres per minute (heats water on demand, lower flow rate)",
        "Mixer or thermostatic shower: 12 to 15 litres per minute (uses your hot water supply)",
        "Power shower: 15 to 20+ litres per minute (has a built-in pump for high pressure)",
      ],
      stats: [
        {
          figure: "8-9 L/min",
          description: "Flow rate of a typical electric shower",
          source: "Energy Saving Trust",
        },
        {
          figure: "15-20+ L/min",
          description: "Flow rate of a power shower",
          source: "Energy Saving Trust",
        },
      ],
      callout: {
        type: "info",
        content:
          "To check your shower's flow rate, hold a bucket under the showerhead for 30 seconds and measure the water collected, then double it. If it is more than 10 litres per minute, a low-flow showerhead would make a significant difference.",
      },
    },
    {
      heading: "Energy and Cost Comparison",
      paragraphs: [
        "Heating water accounts for roughly 12 to 18% of household energy bills. The energy cost depends on the volume of water heated and the energy source (gas combi boiler, immersion heater, or electric shower).",
        "Heating 80 litres of water for a bath using a gas combi boiler costs approximately 12 to 16p at current tariffs. A 4-minute electric shower costs approximately 8 to 12p.",
        "Over a year, switching from a daily bath to a 4-minute shower can save approximately \u00A340 to \u00A350 in energy bills, plus significant water savings if you are on a water meter.",
      ],
      stats: [
        {
          figure: "12-18%",
          description: "Share of household energy bills spent on heating water",
          source: "Energy Saving Trust",
        },
        {
          figure: "\u00A340-\u00A350/year",
          description: "Energy bill saving from switching daily bath to 4-min shower",
          source: "Energy Saving Trust",
        },
      ],
    },
    {
      heading: "The Environmental Bottom Line",
      paragraphs: [
        "Combining water and energy savings, a daily 4-minute shower instead of a daily bath saves approximately 15,000 litres of water and over 250 kg of CO\u2082 per year.",
        "That water saving is equivalent to about 190 bathtubs of water per year. The carbon saving is roughly equivalent to driving 1,000 miles in a petrol car.",
        "Of course, you do not have to give up baths entirely. Even reducing from daily baths to baths once or twice a week, with short showers on other days, makes a meaningful difference.",
      ],
      stats: [
        {
          figure: "~15,000 litres/year",
          description: "Water saved by switching from daily bath to daily 4-min shower",
          source: "Waterwise",
        },
        {
          figure: "~250 kg CO\u2082/year",
          description: "Carbon saved from the same switch",
          source: "Energy Saving Trust",
        },
      ],
    },
    {
      heading: "Tips to Reduce Impact",
      paragraphs: [
        "Whether you prefer showers or baths, there are ways to reduce the water and energy you use:",
      ],
      list: [
        "Use a shower timer or play one 4-minute song as your cue to finish",
        "Install a low-flow showerhead (free from most UK water companies)",
        "Turn off the water while lathering or shampooing",
        "Do not overfill the bath. Half-full (around 40 to 50 litres) is enough",
        "Reuse bathwater for watering the garden (greywater) if you have not used heavily perfumed products",
        "For families with young children: sharing bathwater between children is common and efficient",
      ],
      callout: {
        type: "tip",
        content:
          "Most UK water companies will send you a free low-flow showerhead and a 4-minute shower timer. These two items alone can save a family of four over 20,000 litres per year.",
      },
    },
    {
      heading: "Navy Showers: The Ultra-Efficient Option",
      paragraphs: [
        "A \"navy shower\" involves turning the water on briefly to get wet, turning it off while you soap and shampoo, then turning it back on to rinse. This technique uses only 8 to 12 litres total.",
        "Originally used on naval vessels where fresh water is limited, it is an effective technique during droughts or for anyone who wants to minimise their water use. It takes some getting used to but becomes second nature quickly.",
      ],
      stats: [
        {
          figure: "8-12 litres",
          description: "Total water used in a navy shower",
          source: "Waterwise",
        },
      ],
    },
  ],
  quickTips: [
    "Keep showers under 4 minutes. Use a timer or a single song",
    "If you love baths, limit them to once or twice a week with short showers on other days",
    "Install a low-flow showerhead (free from most UK water companies)",
    "Do not overfill the bath. Halfway is enough",
    "Check your shower type. Mixer and power showers use far more water than electric",
    "Try a navy shower: wet, turn off, lather, turn on, rinse. Uses only 8 to 12 litres.",
  ],
  sources: [
    { name: "Energy Saving Trust", url: "https://energysavingtrust.org.uk/advice/water/" },
    { name: "Waterwise", url: "https://www.waterwise.org.uk/save-water/" },
    { name: "Ofwat", url: "https://www.ofwat.gov.uk/" },
    { name: "GOV.UK (Energy Tariff Data)", url: "https://www.gov.uk/government/statistical-data-sets/annual-domestic-energy-price-statistics" },
  ],
  lastUpdated: "March 2026",
};
