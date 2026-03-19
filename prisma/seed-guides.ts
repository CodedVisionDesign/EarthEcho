/**
 * Seed script to migrate hardcoded guides into the database.
 * Run with: npx tsx prisma/seed-guides.ts
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// We need to import the guides data and extract the icon name
// Since the guides use FontAwesome icon objects, we map them manually
const GUIDES_DATA = [
  {
    slug: "solar-panels",
    icon: "faSun",
    category: "energy",
    categoryLabel: "Energy",
  },
  {
    slug: "homesteading",
    icon: "faCarrot",
    category: "food",
    categoryLabel: "Food",
  },
  {
    slug: "recycling",
    icon: "faRecycle",
    category: "waste",
    categoryLabel: "Waste",
  },
  {
    slug: "water-saving",
    icon: "faDroplet",
    category: "water",
    categoryLabel: "Water",
  },
  {
    slug: "showering-vs-bathing",
    icon: "faShower",
    category: "water",
    categoryLabel: "Water",
  },
];

async function main() {
  // Dynamically import all guides
  const { solarPanels } = await import("../src/lib/guides/solar-panels");
  const { homesteading } = await import("../src/lib/guides/homesteading");
  const { recycling } = await import("../src/lib/guides/recycling");
  const { waterSaving } = await import("../src/lib/guides/water-saving");
  const { showeringVsBathing } = await import("../src/lib/guides/showering-vs-bathing");

  const guides = [solarPanels, homesteading, recycling, waterSaving, showeringVsBathing];

  for (let i = 0; i < guides.length; i++) {
    const guide = guides[i];
    const meta = GUIDES_DATA[i];

    // Strip the icon (FontAwesome object) and convert sections/quickTips/sources to JSON strings
    const data = {
      slug: guide.slug,
      title: guide.title,
      subtitle: guide.subtitle,
      icon: meta.icon,
      category: meta.category,
      categoryLabel: meta.categoryLabel,
      readTimeMinutes: guide.readTimeMinutes,
      introduction: guide.introduction,
      sections: JSON.stringify(guide.sections),
      quickTips: JSON.stringify(guide.quickTips),
      sources: JSON.stringify(guide.sources),
      lastUpdated: guide.lastUpdated,
      isPublished: true,
    };

    await db.guide.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });

    console.log(`✓ Seeded guide: ${data.title}`);
  }

  console.log("\nDone! All guides seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
