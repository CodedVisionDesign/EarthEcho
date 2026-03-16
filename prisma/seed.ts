import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ==========================================
  // Transport Modes
  // ==========================================
  const transportModes = [
    { slug: "petrol_car", name: "Petrol Car", co2PerKm: 0.170, icon: "car", category: "car", isZeroEmission: false },
    { slug: "diesel_car", name: "Diesel Car", co2PerKm: 0.155, icon: "car", category: "car", isZeroEmission: false },
    { slug: "hybrid_car", name: "Hybrid Car", co2PerKm: 0.105, icon: "car", category: "car", isZeroEmission: false },
    { slug: "ev", name: "Electric Vehicle", co2PerKm: 0.050, icon: "zap", category: "car", isZeroEmission: false },
    { slug: "bus", name: "Bus", co2PerKm: 0.089, icon: "bus", category: "public", isZeroEmission: false },
    { slug: "train", name: "Train", co2PerKm: 0.035, icon: "train", category: "public", isZeroEmission: false },
    { slug: "domestic_flight", name: "Domestic Flight", co2PerKm: 0.255, icon: "plane", category: "flight", isZeroEmission: false },
    { slug: "short_haul_flight", name: "Short-Haul Flight", co2PerKm: 0.156, icon: "plane", category: "flight", isZeroEmission: false },
    { slug: "long_haul_flight", name: "Long-Haul Flight", co2PerKm: 0.150, icon: "plane", category: "flight", isZeroEmission: false },
    { slug: "cycling", name: "Cycling", co2PerKm: 0, icon: "bike", category: "active", isZeroEmission: true },
    { slug: "walking", name: "Walking", co2PerKm: 0, icon: "footprints", category: "active", isZeroEmission: true },
    { slug: "e_scooter", name: "E-Scooter / E-Bike", co2PerKm: 0.005, icon: "zap", category: "active", isZeroEmission: false },
  ];

  for (const mode of transportModes) {
    await prisma.transportMode.upsert({
      where: { slug: mode.slug },
      update: mode,
      create: mode,
    });
  }
  console.log(`  Seeded ${transportModes.length} transport modes`);

  // ==========================================
  // Badges
  // ==========================================
  const badges = [
    // Starter badges
    { name: "First Step", description: "Log your first activity", icon: "footprints", category: "starter", criteria: '{"type":"first_activity"}', rarity: "common" },
    { name: "Profile Complete", description: "Fill in your profile details", icon: "user-check", category: "starter", criteria: '{"type":"profile_complete"}', rarity: "common" },
    { name: "Forum Debut", description: "Make your first forum post", icon: "message-circle", category: "starter", criteria: '{"type":"first_post"}', rarity: "common" },

    // Streak badges
    { name: "Week Warrior", description: "Log activities 7 days in a row", icon: "flame", category: "streak", criteria: '{"type":"streak","days":7}', rarity: "common" },
    { name: "Month Master", description: "Log activities 30 days in a row", icon: "flame", category: "streak", criteria: '{"type":"streak","days":30}', rarity: "uncommon" },
    { name: "Quarter Champion", description: "Log activities 90 days in a row", icon: "flame", category: "streak", criteria: '{"type":"streak","days":90}', rarity: "rare" },
    { name: "Year Legend", description: "Log activities 365 days in a row", icon: "crown", category: "streak", criteria: '{"type":"streak","days":365}', rarity: "legendary" },

    // Water badges
    { name: "Water Watcher", description: "Save 100 litres of water", icon: "droplet", category: "impact", criteria: '{"type":"total","category":"WATER","value":100}', rarity: "common" },
    { name: "Water Guardian", description: "Save 1,000 litres of water", icon: "droplets", category: "impact", criteria: '{"type":"total","category":"WATER","value":1000}', rarity: "uncommon" },
    { name: "Water Hero", description: "Save 10,000 litres of water (a swimming pool!)", icon: "waves", category: "impact", criteria: '{"type":"total","category":"WATER","value":10000}', rarity: "epic" },

    // Plastic badges
    { name: "Plastic Reducer", description: "Avoid 50 single-use plastic items", icon: "leaf", category: "impact", criteria: '{"type":"total","category":"PLASTIC","value":50}', rarity: "common" },
    { name: "Plastic Fighter", description: "Avoid 500 single-use plastic items", icon: "shield", category: "impact", criteria: '{"type":"total","category":"PLASTIC","value":500}', rarity: "rare" },

    // Transport badges
    { name: "Pedal Power", description: "Cycle 100 km", icon: "bike", category: "transport", criteria: '{"type":"transport_distance","mode":"cycling","km":100}', rarity: "common" },
    { name: "Century Cyclist", description: "Cycle 1,000 km", icon: "bike", category: "transport", criteria: '{"type":"transport_distance","mode":"cycling","km":1000}', rarity: "rare" },
    { name: "Train Brain", description: "Take 50 train journeys", icon: "train", category: "transport", criteria: '{"type":"transport_count","mode":"train","count":50}', rarity: "uncommon" },
    { name: "Car-Free Week", description: "Go 7 days without logging a car journey", icon: "car-off", category: "transport", criteria: '{"type":"car_free_streak","days":7}', rarity: "uncommon" },
    { name: "EV Pioneer", description: "Log 1,000 km in an electric vehicle", icon: "zap", category: "transport", criteria: '{"type":"transport_distance","mode":"ev","km":1000}', rarity: "rare" },
    { name: "Mile Walker", description: "Walk 500 km", icon: "footprints", category: "transport", criteria: '{"type":"transport_distance","mode":"walking","km":500}', rarity: "rare" },
    { name: "Flight-Free Year", description: "Go 365 days without flying", icon: "globe", category: "transport", criteria: '{"type":"flight_free_streak","days":365}', rarity: "legendary" },

    // Challenge badges
    { name: "Challenger", description: "Complete your first monthly challenge", icon: "trophy", category: "challenge", criteria: '{"type":"challenges_completed","count":1}', rarity: "common" },
    { name: "Challenge Veteran", description: "Complete 6 monthly challenges", icon: "medal", category: "challenge", criteria: '{"type":"challenges_completed","count":6}', rarity: "uncommon" },
    { name: "Challenge Legend", description: "Complete 12 monthly challenges", icon: "crown", category: "challenge", criteria: '{"type":"challenges_completed","count":12}', rarity: "epic" },

    // Community badges
    { name: "Helpful Hand", description: "Get 10 'helpful' reactions on your replies", icon: "heart-handshake", category: "community", criteria: '{"type":"reactions_received","reaction":"helpful","count":10}', rarity: "uncommon" },
    { name: "Community Star", description: "Make 50 forum posts or replies", icon: "star", category: "community", criteria: '{"type":"posts_count","count":50}', rarity: "rare" },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: badge,
      create: badge,
    });
  }
  console.log(`  Seeded ${badges.length} badges`);

  // ==========================================
  // Resources (signposted websites)
  // ==========================================
  const resources = [
    { name: "Energy Saving Trust", description: "Expert advice on saving energy at home and choosing greener transport", url: "https://energysavingtrust.org.uk", category: "energy" },
    { name: "Carbon Trust", description: "Resources for understanding and reducing your carbon footprint", url: "https://www.carbontrust.com", category: "energy" },
    { name: "Waterwise", description: "Tips and tools for reducing water usage in your home", url: "https://www.waterwise.org.uk", category: "water" },
    { name: "WRAP - Recycle Now", description: "Find out what you can recycle and where, with local council lookup", url: "https://www.recyclenow.com", category: "recycling" },
    { name: "Love Food Hate Waste", description: "Recipes and tips to reduce food waste and save money", url: "https://www.lovefoodhatewaste.com", category: "food_waste" },
    { name: "Sustrans", description: "Charity making it easier to walk and cycle, with route planners", url: "https://www.sustrans.org.uk", category: "transport" },
    { name: "National Cycle Network", description: "Find cycling routes near you across the UK", url: "https://www.sustrans.org.uk/national-cycle-network", category: "transport" },
    { name: "Vinted", description: "Buy and sell secondhand clothes to reduce fashion waste", url: "https://www.vinted.co.uk", category: "shopping" },
    { name: "Charity Retail Association", description: "Find charity shops near you", url: "https://www.charityretail.org.uk", category: "shopping" },
    { name: "Ecosia", description: "Search engine that plants trees with its ad revenue", url: "https://www.ecosia.org", category: "energy" },
    { name: "Gold Standard Offsets", description: "Verified carbon offset projects you can support", url: "https://www.goldstandard.org", category: "energy" },
    { name: "Zap-Map", description: "Find EV charging points across the UK", url: "https://www.zap-map.com", category: "transport" },
  ];

  for (const resource of resources) {
    const existing = await prisma.resource.findFirst({
      where: { url: resource.url },
    });
    if (!existing) {
      await prisma.resource.create({ data: resource });
    }
  }
  console.log(`  Seeded ${resources.length} resources`);

  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
