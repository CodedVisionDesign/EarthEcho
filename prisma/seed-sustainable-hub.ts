/**
 * Seed data for the Sustainable Living Hub resources.
 * Run with: npx ts-node prisma/seed-sustainable-hub.ts
 * Or import the data array into your existing seed script.
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const SUSTAINABLE_HUB_RESOURCES = [
  // ♻️ Recycling Tools
  {
    name: "WhollyShrink",
    description:
      "A soft plastic compactor that helps you reduce household plastic waste volume by up to 90%, making recycling easier and more efficient.",
    url: "https://www.whollyshrink.com",
    category: "recycling_tools",
    image: "https://logo.clearbit.com/whollyshrink.com",
  },

  // 🌿 Wildlife & Environmental Organisations
  {
    name: "RSPB Shop",
    description:
      "Support UK wildlife conservation through ethically sourced bird care, garden supplies, and nature-inspired gifts from the Royal Society for the Protection of Birds.",
    url: "https://shopping.rspb.org.uk",
    category: "wildlife",
    image: "https://logo.clearbit.com/rspb.org.uk",
  },
  {
    name: "WWF – Adopt an Animal",
    description:
      "Symbolically adopt endangered species through WWF and directly fund critical conservation programmes protecting habitats worldwide.",
    url: "https://support.wwf.org.uk/adopt-an-animal",
    category: "wildlife",
    image: "https://logo.clearbit.com/wwf.org.uk",
  },
  {
    name: "Woodland Trust",
    description:
      "The UK's largest woodland conservation charity, dedicated to protecting ancient woods and planting native trees across the country.",
    url: "https://www.woodlandtrust.org.uk",
    category: "wildlife",
    image: "https://logo.clearbit.com/woodlandtrust.org.uk",
  },
  {
    name: "Butterfly Conservation",
    description:
      "A charity committed to saving butterflies, moths, and their habitats through research, conservation projects, and community engagement.",
    url: "https://butterfly-conservation.org",
    category: "wildlife",
    image: "https://logo.clearbit.com/butterfly-conservation.org",
  },
  {
    name: "Bumblebee Conservation Trust",
    description:
      "Working to increase bumblebee populations across the UK through habitat creation, research, and public awareness campaigns.",
    url: "https://www.bumblebeeconservation.org",
    category: "wildlife",
    image: "https://logo.clearbit.com/bumblebeeconservation.org",
  },

  // 🌍 Ethical / Fair Trade Shopping
  {
    name: "Oxfam Shop",
    description:
      "Shop pre-loved fashion, books, and fair trade goods — every purchase supports Oxfam's work tackling global poverty and inequality.",
    url: "https://www.oxfam.org.uk/shop",
    category: "ethical_shopping",
    image: "https://logo.clearbit.com/oxfam.org.uk",
  },
  {
    name: "Ethical Superstore",
    description:
      "The UK's leading online retailer for fair trade, organic, and eco-friendly products across home, beauty, food, and lifestyle.",
    url: "https://www.ethicalsuperstore.com",
    category: "ethical_shopping",
    image: "https://logo.clearbit.com/ethicalsuperstore.com",
  },
  {
    name: "We Are Fairtrade",
    description:
      "Discover Fairtrade-certified products and learn how your shopping choices empower farmers and workers in developing countries.",
    url: "https://www.fairtrade.org.uk",
    category: "ethical_shopping",
    image: "https://logo.clearbit.com/fairtrade.org.uk",
  },
  {
    name: "EthicalShop.org",
    description:
      "A curated marketplace bringing together ethical, sustainable, and socially responsible brands in one convenient shop.",
    url: "https://www.ethicalshop.org",
    category: "ethical_shopping",
    image: "https://logo.clearbit.com/ethicalshop.org",
  },
  {
    name: "Shared Earth",
    description:
      "Fair trade gifts, homeware, and accessories sourced from artisan communities worldwide, promoting sustainable livelihoods.",
    url: "https://www.sharedearth.co.uk",
    category: "ethical_shopping",
    image: "https://logo.clearbit.com/sharedearth.co.uk",
  },

  // 💸 Impact Investing
  {
    name: "Lend With Care",
    description:
      "Make microloans to entrepreneurs in developing countries through CARE International, helping people lift themselves out of poverty.",
    url: "https://lendwithcare.org",
    category: "impact_investing",
    image: "https://logo.clearbit.com/lendwithcare.org",
  },

  // 🥗 Vegan & Plant-Based Living
  {
    name: "Vegan Society",
    description:
      "The world's oldest vegan organisation offering plant-based recipes, nutrition guidance, and their trusted Vegan Trademark certification.",
    url: "https://www.vegansociety.com",
    category: "vegan",
    image: "https://logo.clearbit.com/vegansociety.com",
  },
  {
    name: "Vegetarian Society",
    description:
      "Inspiring and supporting people to embrace meat-free living through recipes, campaigns, and professional cookery courses since 1847.",
    url: "https://vegsoc.org",
    category: "vegan",
    image: "https://logo.clearbit.com/vegsoc.org",
  },
  {
    name: "Planthood",
    description:
      "Convenient plant-based meal kits delivered to your door, making it simple to enjoy delicious, sustainable food every day.",
    url: "https://www.planthood.com",
    category: "vegan",
    image: "https://logo.clearbit.com/planthood.com",
  },

  // 🔁 Reduce Waste & Second-Hand
  {
    name: "Oddbox",
    description:
      "Rescues wonky and surplus fruit and veg that would otherwise go to waste, delivering seasonal produce boxes to your door across the UK.",
    url: "https://www.oddbox.co.uk",
    category: "reduce_waste",
    image: "https://logo.clearbit.com/oddbox.co.uk",
  },
  {
    name: "Wonky Coffee",
    description:
      "Premium coffee made from beans that would otherwise be discarded for cosmetic imperfections — great taste, zero waste.",
    url: "https://www.wonkycoffee.com",
    category: "reduce_waste",
    image: "https://logo.clearbit.com/wonkycoffee.com",
  },
  {
    name: "Buy Whole Foods Online",
    description:
      "Bulk and plastic-free wholefoods, organic ingredients, and pantry staples delivered across the UK with minimal packaging.",
    url: "https://www.buywholefoodsonline.co.uk",
    category: "reduce_waste",
    image: "https://logo.clearbit.com/buywholefoodsonline.co.uk",
  },
  {
    name: "MusicMagpie",
    description:
      "Buy and sell refurbished tech, phones, games, and media — extending product lifecycles and keeping electronics out of landfill.",
    url: "https://www.musicmagpie.co.uk",
    category: "reduce_waste",
    image: "https://logo.clearbit.com/musicmagpie.co.uk",
  },
  {
    name: "World of Books",
    description:
      "The UK's largest second-hand book retailer, giving pre-loved books a new home and diverting millions from recycling each year.",
    url: "https://www.worldofbooks.com",
    category: "reduce_waste",
    image: "https://logo.clearbit.com/worldofbooks.com",
  },
];

async function seed() {
  console.log("Seeding Sustainable Living Hub resources...");

  for (const resource of SUSTAINABLE_HUB_RESOURCES) {
    await db.resource.upsert({
      where: { name: resource.name },
      update: {
        description: resource.description,
        url: resource.url,
        category: resource.category,
        image: resource.image,
      },
      create: {
        ...resource,
        isActive: true,
      },
    });
    console.log(`  ✓ ${resource.name}`);
  }

  console.log(`\nDone! Seeded ${SUSTAINABLE_HUB_RESOURCES.length} resources.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
