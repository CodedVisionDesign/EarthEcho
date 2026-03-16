import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import type { Guide } from "./types";

export const waterSaving: Guide = {
  slug: "water-saving",
  title: "Saving Water at Home: Practical Tips for UK Households",
  subtitle:
    "Water butts, low-flow fixtures, garden tips, and free devices from your water company.",
  icon: faDroplet,
  category: "water",
  categoryLabel: "Water",
  readTimeMinutes: 8,
  introduction:
    "The average person in the UK uses about 145 litres of water every day. Parts of south-east England are already classified as \"seriously water-stressed\" by the Environment Agency, and climate change is making summers hotter and drier. The good news is that small changes at home can make a big difference to both your water bill and the environment.",
  sections: [
    {
      heading: "Why Water Saving Matters in the UK",
      paragraphs: [
        "Despite its rainy reputation, the UK faces genuine water scarcity. Population growth, climate change, and ageing infrastructure all put pressure on supplies. Water companies across England and Wales lose roughly 3 billion litres per day to leaks.",
        "The 2022 drought saw hosepipe bans across southern England, and water companies are planning for similar events to become more frequent. Reducing household water use is one of the most effective things individuals can do.",
      ],
      stats: [
        {
          figure: "145 litres",
          description: "Average daily water use per person in the UK",
          source: "Ofwat",
        },
        {
          figure: "3 billion litres/day",
          description: "Water lost to leaks across England and Wales",
          source: "Ofwat",
        },
      ],
      callout: {
        type: "uk",
        content:
          "Parts of south-east England are classified as \"seriously water-stressed\" by the Environment Agency. Even in wetter parts of the UK, saving water reduces the energy used to treat and pump it.",
      },
    },
    {
      heading: "Water Butts and Rainwater Harvesting",
      paragraphs: [
        "A water butt is one of the simplest and most effective water-saving measures. It connects to a roof downpipe and collects rainwater for use in the garden, washing the car, or cleaning outdoor surfaces.",
        "A typical water butt holds 100 to 300 litres and costs between \u00A325 and \u00A380. A standard UK roof can collect around 85,000 litres of rainwater per year, so even a modest water butt fills up quickly.",
        "Rainwater is actually better for plants than tap water. It contains no chlorine, has a slightly acidic pH that most plants prefer, and is at ambient temperature rather than cold from the mains.",
      ],
      stats: [
        {
          figure: "85,000 litres/year",
          description: "Rainwater a typical UK roof can collect annually",
          source: "Waterwise",
        },
        {
          figure: "\u00A325-\u00A380",
          description: "Cost of a standard water butt",
          source: "Waterwise",
        },
      ],
      callout: {
        type: "tip",
        content:
          "Check your water company's website. Many offer subsidised or free water butts to customers. Some councils also provide them at reduced prices.",
      },
    },
    {
      heading: "Low-Flow Fixtures",
      paragraphs: [
        "Aerated taps and showerheads mix air into the water flow, reducing water usage by 30 to 50% without a noticeable change in water pressure. They are inexpensive, easy to fit, and one of the most cost-effective water-saving measures.",
        "A standard showerhead uses 12 to 15 litres per minute. A low-flow showerhead uses 6 to 8 litres per minute. Over a year of daily showers, that difference adds up to thousands of litres.",
        "Dual-flush toilets save up to 5,000 litres per person per year compared to old single-flush cisterns. If you cannot replace your toilet, a cistern displacement device (a bag or brick that reduces the flush volume) can save over 1 litre per flush.",
      ],
      stats: [
        {
          figure: "5,000 litres/year",
          description: "Water saved per person by switching to dual-flush",
          source: "Waterwise",
        },
      ],
      callout: {
        type: "uk",
        content:
          "Most UK water companies offer free water-saving devices including aerated showerheads, tap inserts, shower timers, and cistern displacement bags. Visit your water company's website to order.",
      },
    },
    {
      heading: "In the Kitchen",
      paragraphs: [
        "A running tap wastes about 6 litres per minute. Filling a bowl or basin for washing up, rather than running the tap continuously, saves around 5,000 litres per year.",
        "A dripping tap wastes over 5,500 litres per year. Fixing a drip is usually a simple washer replacement and can save a surprising amount of water.",
        "Only run the dishwasher when full. A full dishwasher cycle uses 10 to 15 litres, compared to 50 or more litres for an equivalent amount of hand washing done inefficiently with a running tap.",
        "Only fill the kettle with the amount of water you actually need. This saves both water and the energy used to heat it.",
      ],
      stats: [
        {
          figure: "5,500 litres/year",
          description: "Water wasted by a single dripping tap",
          source: "Waterwise",
        },
        {
          figure: "6 litres/minute",
          description: "Water wasted by a running tap",
          source: "Energy Saving Trust",
        },
      ],
    },
    {
      heading: "In the Garden",
      paragraphs: [
        "Gardens account for a large proportion of household water use during summer months. A hosepipe uses around 1,000 litres per hour, so even 30 minutes of watering uses as much water as a family of four uses indoors in a day.",
        "Water in the early morning or evening when temperatures are lower and evaporation is reduced. Mulching around plants with bark, compost, or straw retains moisture and can reduce watering needs by 25%.",
        "Use a watering can rather than a hosepipe for targeted watering. Let your lawn go brown during dry spells. It looks dormant but will recover fully once rain returns.",
      ],
      stats: [
        {
          figure: "1,000 litres/hour",
          description: "Water used by a garden hosepipe",
          source: "Waterwise",
        },
      ],
      callout: {
        type: "tip",
        content:
          "Let your lawn go brown in summer. It is not dead; it is dormant. It will green up within days of rain returning. Watering a lawn is one of the most wasteful uses of treated drinking water.",
      },
    },
    {
      heading: "Water Meters",
      paragraphs: [
        "About 55% of households in England and Wales have a water meter. If you do not have one, you pay a fixed annual charge based on the rateable value of your property, regardless of how much water you use.",
        "Switching to a meter can save money if your household is small relative to your property size. You have a legal right to request a free water meter from your water supplier.",
        "Most water companies offer an online calculator to help you estimate whether you would save money on a meter. If you switch and find you are paying more, most companies allow you to switch back within 12 months.",
      ],
      callout: {
        type: "uk",
        content:
          "You have a legal right to request a free water meter from your water supplier. Use their online calculator to check if it would save you money.",
      },
    },
  ],
  quickTips: [
    "Order free water-saving devices from your water company's website",
    "Install a water butt. It pays for itself in one summer",
    "Take a 4-minute shower. Use a timer or a playlist of one song",
    "Fix dripping taps promptly. One drip per second wastes 5,500 litres per year",
    "Use a watering can in the garden instead of a hosepipe",
    "Only fill the kettle with the water you need",
    "Run the dishwasher and washing machine only when full",
    "Check if a water meter would save you money",
  ],
  sources: [
    { name: "Waterwise", url: "https://www.waterwise.org.uk/" },
    { name: "Ofwat", url: "https://www.ofwat.gov.uk/" },
    { name: "Energy Saving Trust", url: "https://energysavingtrust.org.uk/advice/water/" },
    { name: "Environment Agency", url: "https://www.gov.uk/government/organisations/environment-agency" },
  ],
  lastUpdated: "March 2026",
};
