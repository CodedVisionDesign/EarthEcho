import { faRecycle } from "@fortawesome/free-solid-svg-icons";
import type { Guide } from "./types";

export const recycling: Guide = {
  slug: "recycling",
  title: "Recycling in the UK: What You Can and Can't Recycle",
  subtitle:
    "A clear guide to kerbside recycling, common mistakes, council differences, and what to do with tricky items.",
  icon: faRecycle,
  category: "waste",
  categoryLabel: "Waste & Recycling",
  readTimeMinutes: 9,
  introduction:
    "Recycling should be simple, but in the UK it can be confusing. With over 300 local councils in England alone, each running slightly different schemes, it is no wonder that around 82% of people admit to putting something wrong in their recycling bin. This guide cuts through the confusion with clear, practical advice.",
  sections: [
    {
      heading: "The State of UK Recycling",
      paragraphs: [
        "The UK household recycling rate stands at around 44% in England. Wales leads the UK at approximately 57%, Scotland sits at around 42%, and Northern Ireland at about 50%.",
        "Around 26 million tonnes of waste is produced by UK households each year. Of this, a significant proportion ends up in landfill or incineration despite being recyclable.",
        "Contamination is one of the biggest challenges. When non-recyclable items are mixed in with recycling, it can cause entire loads to be rejected and sent to landfill instead.",
      ],
      stats: [
        {
          figure: "44%",
          description: "Household recycling rate in England",
          source: "DEFRA",
        },
        {
          figure: "26 million tonnes",
          description: "Household waste produced in the UK per year",
          source: "DEFRA",
        },
        {
          figure: "82%",
          description: "Of people have put something wrong in their recycling",
          source: "WRAP",
        },
      ],
    },
    {
      heading: "What You CAN Typically Recycle at the Kerbside",
      paragraphs: [
        "While specific rules vary by council, the following items are accepted by the vast majority of UK kerbside recycling schemes:",
      ],
      list: [
        "Paper and cardboard (clean and dry, not food-soiled)",
        "Glass bottles and jars (rinsed, any colour)",
        "Metal tins, cans, and clean aluminium foil",
        "Plastic bottles (squashed, with lids left on)",
        "Plastic pots, tubs, and trays (check your council, most now accept these)",
        "Cartons and Tetra Paks (accepted by about 65% of councils)",
        "Aerosol cans (empty)",
      ],
      callout: {
        type: "tip",
        content:
          "Leave lids on plastic bottles. Loose lids are too small to be sorted and fall through the machinery. When left on, they are recycled along with the bottle.",
      },
    },
    {
      heading: "What You CANNOT Recycle at the Kerbside",
      paragraphs: [
        "These items cause contamination if placed in your kerbside recycling bin:",
      ],
      list: [
        "Black plastic (most optical sorting machines cannot detect it)",
        "Crisp packets, sweet wrappers, and pet food pouches (composite materials)",
        "Wet or food-soiled cardboard (e.g., greasy pizza boxes)",
        "Polystyrene (expanded or solid)",
        "Nappies and sanitary products",
        "Broken glass, ceramics, and Pyrex (different melting points from bottle glass)",
        "Soft plastics such as cling film, bread bags, and carrier bags",
      ],
      callout: {
        type: "warning",
        content:
          "\"Wish-cycling\" (putting items in recycling hoping they can be recycled) does more harm than good. Contaminated loads can cause entire batches to be rejected. When in doubt, leave it out.",
      },
    },
    {
      heading: "The Council Postcode Lottery",
      paragraphs: [
        "There are over 300 local councils in England, each with their own recycling rules. What is recyclable in one area may not be in another, which creates widespread confusion.",
        "The UK Government's Simpler Recycling legislation, being phased in from 2025 and 2026, aims to standardise kerbside collections across England so that all councils collect the same core set of materials. This should significantly reduce confusion.",
        "In the meantime, use the Recycle Now postcode lookup tool to check exactly what your specific council accepts. This is the most reliable way to avoid mistakes.",
      ],
      callout: {
        type: "uk",
        content:
          "Use the Recycle Now postcode lookup at recyclenow.com/recycling-locator to check exactly what your council accepts. Rules vary widely between areas.",
      },
    },
    {
      heading: "Common Recycling Mistakes",
      paragraphs: [
        "Understanding the most frequent mistakes can help you recycle more effectively and reduce contamination:",
      ],
      list: [
        "Not rinsing containers. Food residue contaminates entire batches. A quick rinse is enough.",
        "Putting recycling in plastic bags. Most sorting facilities cannot open bags, so the contents go to landfill. Put items loose in the bin.",
        "Assuming all plastics are recyclable. Only plastics marked 1 (PET) and 2 (HDPE) are widely recycled. Check the label.",
        "Putting broken drinking glasses or ceramics in with glass bottles. They have different melting points and contaminate the glass recycling.",
        "Putting small items like bottle caps loose in the bin. They fall through sorting equipment. Leave caps on bottles.",
      ],
    },
    {
      heading: "Beyond Kerbside: Other Recycling Options",
      paragraphs: [
        "Many items that cannot go in your kerbside bin can still be recycled through other channels:",
      ],
      list: [
        "Soft plastics: major supermarkets (Tesco, Sainsbury's, Co-op, Aldi) have collection points for bread bags, crisp multipack wrappers, and other soft plastics",
        "Household Waste Recycling Centres (HWRCs): for bulky items like furniture, timber, garden waste, and rubble",
        "Electricals: under WEEE regulations, retailers must accept old electricals when you buy a replacement. Most councils also collect small electricals at the kerbside.",
        "Textiles: charity shops, clothing banks, or council textile collections. Even worn-out clothes can be recycled into insulation or industrial rags.",
        "Batteries: collection points in supermarkets, shops, and some council buildings",
      ],
      callout: {
        type: "tip",
        content:
          "Save your soft plastics (bread bags, crisp wrappers, vegetable bags) and drop them at your nearest supermarket collection point on your weekly shop.",
      },
    },
  ],
  quickTips: [
    "Use the Recycle Now postcode lookup to check what your council accepts",
    "Rinse containers before recycling (they do not need to be spotless, just rinsed)",
    "Leave lids on plastic bottles",
    "Flatten cardboard boxes to save space in your bin",
    "Take soft plastics to supermarket collection points",
    "Never put recycling in plastic bags. Put items loose in the bin.",
    "When in doubt, leave it out. Contamination causes more damage than one missed item.",
  ],
  sources: [
    { name: "WRAP / Recycle Now", url: "https://www.recyclenow.com/" },
    { name: "Recycle Now Postcode Lookup", url: "https://www.recyclenow.com/recycling-locator" },
    { name: "DEFRA", url: "https://www.gov.uk/government/statistics/uk-waste-data" },
    { name: "OPRL (On-Pack Recycling Label)", url: "https://www.oprl.org.uk/" },
  ],
  lastUpdated: "March 2026",
};
