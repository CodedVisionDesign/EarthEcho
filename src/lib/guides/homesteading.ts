import { faCarrot } from "@fortawesome/free-solid-svg-icons";
import type { Guide } from "./types";

export const homesteading: Guide = {
  slug: "homesteading",
  title: "Growing Your Own Food in the UK: A Beginner's Guide",
  subtitle:
    "From windowsill herbs to allotment plots. How to grow food, compost waste, and cut your food miles.",
  icon: faCarrot,
  category: "food",
  categoryLabel: "Food & Growing",
  readTimeMinutes: 10,
  introduction:
    "Homesteading in the UK is not about moving to the countryside and living off-grid. It is about growing some of your own food, composting kitchen waste, reducing food miles, and building a bit more self-sufficiency into everyday life. You can start on a windowsill, a small garden, a balcony, or an allotment plot.",
  sections: [
    {
      heading: "What Homesteading Means in a UK Context",
      paragraphs: [
        "In the UK, homesteading is a broad term covering anything from growing a few herbs on a windowsill to managing a full allotment plot. The core idea is reducing your reliance on supermarket supply chains by growing food closer to home.",
        "The UK food system accounts for roughly 20% of the country's greenhouse gas emissions. Growing even a small proportion of your own food can reduce your carbon footprint by cutting transport, packaging, refrigeration, and food waste.",
      ],
      stats: [
        {
          figure: "20%",
          description: "Share of UK greenhouse gas emissions from the food system",
          source: "WRAP",
        },
      ],
    },
    {
      heading: "Starting a Vegetable Garden",
      paragraphs: [
        "The best beginner crops for the UK climate are potatoes, runner beans, courgettes, lettuce, tomatoes (in a greenhouse or sunny spot), and herbs such as mint, rosemary, and parsley. These are forgiving, productive, and well suited to British weather.",
        "The UK growing season broadly runs from March to October. Start seeds indoors in February or March, and plant out after the last frost, which is typically late April or May depending on your region.",
        "Raised beds are excellent for beginners as they warm up faster in spring, provide good drainage, and make it easier to manage soil quality. Container growing on patios or balconies is another option, especially for tomatoes, herbs, and salad leaves.",
      ],
      callout: {
        type: "tip",
        content:
          "Start small. Three pots of herbs and a grow bag of tomatoes will teach you more in one season than any book. Expand as your confidence grows.",
      },
    },
    {
      heading: "Allotments",
      paragraphs: [
        "There are around 330,000 allotment plots in England. They are managed by local councils or parish councils and provide a dedicated growing space, typically 250 square metres (a full plot) or 125 square metres (half plot).",
        "Demand is high. Average waiting times in urban areas are 2 to 5 years, though rural areas may have shorter queues. Annual rent is typically between \u00A325 and \u00A3100 depending on the council.",
        "To apply, contact your local council or parish council. Some areas also have community growing spaces run by organisations like Incredible Edible, which are open to all and have no waiting lists.",
      ],
      stats: [
        {
          figure: "330,000",
          description: "Allotment plots in England",
          source: "National Allotment Society",
        },
        {
          figure: "\u00A325-\u00A3100/year",
          description: "Typical annual allotment rent",
          source: "National Allotment Society",
        },
      ],
      callout: {
        type: "uk",
        content:
          "Under the Allotments Act 1908, local authorities in England have a legal duty to provide allotments if there is sufficient demand. If your council has a long waiting list, you can petition them to provide more plots.",
      },
    },
    {
      heading: "Composting at Home",
      paragraphs: [
        "Composting turns kitchen and garden waste into nutrient-rich soil improver. It diverts waste from landfill (where it produces methane, a potent greenhouse gas) and reduces your need for shop-bought compost.",
        "UK households throw away 6.6 million tonnes of food waste per year. Home composting can divert roughly 150 kg of waste per household per year from landfill.",
        "You can compost fruit and vegetable peelings, coffee grounds, tea bags (check they are plastic-free), eggshells, garden cuttings, and shredded cardboard. Do not compost meat, dairy, cooked food, diseased plants, or pet waste.",
      ],
      stats: [
        {
          figure: "6.6 million tonnes",
          description: "Food waste from UK households per year",
          source: "WRAP",
        },
        {
          figure: "150 kg",
          description: "Waste diverted from landfill per household per year by composting",
          source: "WRAP",
        },
      ],
      list: [
        "Compost: fruit/veg peelings, coffee grounds, eggshells, garden waste, shredded cardboard",
        "Do not compost: meat, dairy, cooked food, diseased plants, pet waste",
        "Many councils offer subsidised compost bins for \u00A315-20",
      ],
      callout: {
        type: "tip",
        content:
          "Check your council's website for subsidised compost bins. Many offer them for \u00A315 to \u00A320, a fraction of the retail price.",
      },
    },
    {
      heading: "Reducing Food Miles",
      paragraphs: [
        "The average UK food item travels around 1,500 miles from farm to plate. By buying locally and seasonally, you can dramatically reduce the transport emissions associated with your food.",
        "Seasonal eating means choosing food that is naturally in season in the UK. For example, strawberries in June, not January. This avoids the emissions from air freight and heated greenhouses.",
        "Local box schemes, farm shops, and farmers' markets connect you directly with growers. Community Supported Agriculture (CSA) schemes let you pay a subscription and receive a regular share of a local farm's harvest.",
      ],
      stats: [
        {
          figure: "1,500 miles",
          description: "Average distance UK food travels from farm to plate",
          source: "Sustain",
        },
      ],
    },
    {
      heading: "The Carbon Impact of Growing Your Own",
      paragraphs: [
        "Growing your own salad can reduce its carbon footprint by up to 90% compared to supermarket-bought salad, which typically involves transport, plastic packaging, and cold storage.",
        "Beyond carbon, growing food at home supports biodiversity. Gardens and allotments provide habitats for pollinators, which are in serious decline in the UK. Planting flowers alongside vegetables boosts both yields and wildlife.",
      ],
      stats: [
        {
          figure: "Up to 90%",
          description: "Carbon reduction from home-grown vs. supermarket salad",
          source: "Garden Organic",
        },
      ],
    },
  ],
  quickTips: [
    "Start small: a few pots of herbs and salad leaves on a windowsill",
    "Get a compost bin from your council at a subsidised price",
    "Join a local seed swap or gardening group to share knowledge and surplus crops",
    "Plant pollinator-friendly flowers alongside vegetables to boost yields",
    "Keep a growing diary to track what works in your specific microclimate",
    "Buy seeds from UK-based suppliers for varieties suited to the British climate",
    "Consider a water butt to irrigate your garden with free rainwater",
  ],
  sources: [
    { name: "RHS (Royal Horticultural Society)", url: "https://www.rhs.org.uk/vegetables" },
    { name: "WRAP", url: "https://wrap.org.uk/" },
    { name: "National Allotment Society", url: "https://www.nsalg.org.uk/" },
    { name: "Sustain", url: "https://www.sustainweb.org/" },
    { name: "Garden Organic", url: "https://www.gardenorganic.org.uk/" },
    { name: "GOV.UK (Allotments)", url: "https://www.gov.uk/guidance/allotments" },
  ],
  lastUpdated: "March 2026",
};
