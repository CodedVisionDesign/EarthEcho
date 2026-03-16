import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL!, {});
const prisma = new PrismaClient({ adapter } as never);

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
  return d;
}

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
    { name: "First Step", description: "Log your first activity", icon: "footprints", category: "starter", criteria: '{"type":"first_activity"}', rarity: "common" },
    { name: "Profile Complete", description: "Fill in your profile details", icon: "user-check", category: "starter", criteria: '{"type":"profile_complete"}', rarity: "common" },
    { name: "Forum Debut", description: "Make your first forum post", icon: "message-circle", category: "starter", criteria: '{"type":"first_post"}', rarity: "common" },
    { name: "Week Warrior", description: "Log activities 7 days in a row", icon: "flame", category: "streak", criteria: '{"type":"streak","days":7}', rarity: "common" },
    { name: "Month Master", description: "Log activities 30 days in a row", icon: "flame", category: "streak", criteria: '{"type":"streak","days":30}', rarity: "uncommon" },
    { name: "Quarter Champion", description: "Log activities 90 days in a row", icon: "flame", category: "streak", criteria: '{"type":"streak","days":90}', rarity: "rare" },
    { name: "Year Legend", description: "Log activities 365 days in a row", icon: "crown", category: "streak", criteria: '{"type":"streak","days":365}', rarity: "legendary" },
    { name: "Water Watcher", description: "Save 100 litres of water", icon: "droplet", category: "impact", criteria: '{"type":"total","category":"WATER","value":100}', rarity: "common" },
    { name: "Water Guardian", description: "Save 1,000 litres of water", icon: "droplets", category: "impact", criteria: '{"type":"total","category":"WATER","value":1000}', rarity: "uncommon" },
    { name: "Water Hero", description: "Save 10,000 litres of water (a swimming pool!)", icon: "waves", category: "impact", criteria: '{"type":"total","category":"WATER","value":10000}', rarity: "epic" },
    { name: "Plastic Reducer", description: "Avoid 50 single-use plastic items", icon: "leaf", category: "impact", criteria: '{"type":"total","category":"PLASTIC","value":50}', rarity: "common" },
    { name: "Plastic Fighter", description: "Avoid 500 single-use plastic items", icon: "shield", category: "impact", criteria: '{"type":"total","category":"PLASTIC","value":500}', rarity: "rare" },
    { name: "Pedal Power", description: "Cycle 100 km", icon: "bike", category: "transport", criteria: '{"type":"transport_distance","mode":"cycling","km":100}', rarity: "common" },
    { name: "Century Cyclist", description: "Cycle 1,000 km", icon: "bike", category: "transport", criteria: '{"type":"transport_distance","mode":"cycling","km":1000}', rarity: "rare" },
    { name: "Train Brain", description: "Take 50 train journeys", icon: "train", category: "transport", criteria: '{"type":"transport_count","mode":"train","count":50}', rarity: "uncommon" },
    { name: "Car-Free Week", description: "Go 7 days without logging a car journey", icon: "car-off", category: "transport", criteria: '{"type":"car_free_streak","days":7}', rarity: "uncommon" },
    { name: "EV Pioneer", description: "Log 1,000 km in an electric vehicle", icon: "zap", category: "transport", criteria: '{"type":"transport_distance","mode":"ev","km":1000}', rarity: "rare" },
    { name: "Mile Walker", description: "Walk 500 km", icon: "footprints", category: "transport", criteria: '{"type":"transport_distance","mode":"walking","km":500}', rarity: "rare" },
    { name: "Flight-Free Year", description: "Go 365 days without flying", icon: "globe", category: "transport", criteria: '{"type":"flight_free_streak","days":365}', rarity: "legendary" },
    { name: "Challenger", description: "Complete your first monthly challenge", icon: "trophy", category: "challenge", criteria: '{"type":"challenges_completed","count":1}', rarity: "common" },
    { name: "Challenge Veteran", description: "Complete 6 monthly challenges", icon: "medal", category: "challenge", criteria: '{"type":"challenges_completed","count":6}', rarity: "uncommon" },
    { name: "Challenge Legend", description: "Complete 12 monthly challenges", icon: "crown", category: "challenge", criteria: '{"type":"challenges_completed","count":12}', rarity: "epic" },
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
  // Resources
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
    const existing = await prisma.resource.findFirst({ where: { url: resource.url } });
    if (!existing) await prisma.resource.create({ data: resource });
  }
  console.log(`  Seeded ${resources.length} resources`);

  // ==========================================
  // Demo Users
  // ==========================================
  const demoPassword = await bcrypt.hash("demo1234", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: demoPassword,
      displayName: "EcoWarrior",
      bio: "Passionate about reducing my environmental footprint, one small step at a time.",
      isPublic: true,
      totalPoints: 1250,
      streakDays: 45,
      lastActiveAt: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "sarah@example.com" },
    update: {},
    create: {
      email: "sarah@example.com",
      name: "Sarah Green",
      password: demoPassword,
      displayName: "GreenSarah",
      bio: "Cyclist and zero-waste advocate.",
      isPublic: true,
      totalPoints: 2100,
      streakDays: 72,
      lastActiveAt: daysAgo(1),
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "james@example.com" },
    update: {},
    create: {
      email: "james@example.com",
      name: "James Rivers",
      password: demoPassword,
      displayName: "EcoJames",
      bio: "Started my eco journey this year. Learning every day!",
      isPublic: true,
      totalPoints: 680,
      streakDays: 12,
      lastActiveAt: daysAgo(2),
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: "priya@example.com" },
    update: {},
    create: {
      email: "priya@example.com",
      name: "Priya Patel",
      password: demoPassword,
      displayName: "PriyaEco",
      bio: "Vegan, train commuter, and secondhand shopper.",
      isPublic: true,
      totalPoints: 1580,
      streakDays: 33,
      lastActiveAt: daysAgo(1),
    },
  });

  console.log("  Seeded 4 demo users");

  // Create credential accounts for each user (required by PrismaAdapter)
  for (const user of [demoUser, user2, user3, user4]) {
    await prisma.account.upsert({
      where: { provider_providerAccountId: { provider: "credentials", providerAccountId: user.id } },
      update: {},
      create: {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user.id,
      },
    });
  }
  console.log("  Seeded credential accounts for demo users");

  // ==========================================
  // Activities for Demo User
  // ==========================================
  // Skip deleteMany on fresh DB (HTTP adapter doesn't support transactions)

  const activities: Array<{
    userId: string;
    category: string;
    type: string;
    value: number;
    unit: string;
    date: Date;
    note?: string;
    transportMode?: string;
    distanceKm?: number;
    co2Saved?: number;
  }> = [];

  // Water activities (15)
  const waterTypes = ["reusable_bottle", "shorter_shower", "full_load_washing", "tap_off_brushing", "rain_barrel"];
  for (let i = 0; i < 15; i++) {
    activities.push({
      userId: demoUser.id,
      category: "WATER",
      type: waterTypes[i % waterTypes.length],
      value: 5 + Math.floor(Math.random() * 75),
      unit: "litres",
      date: daysAgo(Math.floor(Math.random() * 55)),
      note: i % 3 === 0 ? "Feeling good about this!" : undefined,
    });
  }

  // Carbon activities (10)
  const carbonTypes = ["energy_saving", "diet_change", "local_produce", "air_dry_clothes", "reduced_heating"];
  for (let i = 0; i < 10; i++) {
    activities.push({
      userId: demoUser.id,
      category: "CARBON",
      type: carbonTypes[i % carbonTypes.length],
      value: Math.round((0.5 + Math.random() * 4.5) * 100) / 100,
      unit: "kg_co2",
      date: daysAgo(Math.floor(Math.random() * 55)),
    });
  }

  // Plastic activities (12)
  const plasticTypes = ["reusable_bag", "reusable_bottle", "refused_straw", "refused_packaging", "bulk_buy"];
  for (let i = 0; i < 12; i++) {
    activities.push({
      userId: demoUser.id,
      category: "PLASTIC",
      type: plasticTypes[i % plasticTypes.length],
      value: 1 + Math.floor(Math.random() * 7),
      unit: "items",
      date: daysAgo(Math.floor(Math.random() * 55)),
    });
  }

  // Recycling activities (8)
  const recyclingTypes = ["paper", "glass", "metal", "plastic_recycling", "electronics"];
  for (let i = 0; i < 8; i++) {
    activities.push({
      userId: demoUser.id,
      category: "RECYCLING",
      type: recyclingTypes[i % recyclingTypes.length],
      value: 2 + Math.floor(Math.random() * 13),
      unit: "kg",
      date: daysAgo(Math.floor(Math.random() * 55)),
    });
  }

  // Transport activities (15)
  const transportEntries = [
    { mode: "cycling", dist: 5, type: "commute" },
    { mode: "cycling", dist: 8, type: "commute" },
    { mode: "cycling", dist: 12, type: "leisure" },
    { mode: "walking", dist: 3, type: "errand" },
    { mode: "walking", dist: 2, type: "commute" },
    { mode: "walking", dist: 4, type: "leisure" },
    { mode: "train", dist: 25, type: "commute" },
    { mode: "train", dist: 40, type: "leisure" },
    { mode: "bus", dist: 10, type: "errand" },
    { mode: "bus", dist: 15, type: "commute" },
    { mode: "ev", dist: 30, type: "errand" },
    { mode: "ev", dist: 45, type: "leisure" },
    { mode: "e_scooter", dist: 6, type: "commute" },
    { mode: "cycling", dist: 15, type: "leisure" },
    { mode: "train", dist: 60, type: "leisure" },
  ];

  const co2PerKmMap: Record<string, number> = {};
  for (const m of transportModes) co2PerKmMap[m.slug] = m.co2PerKm;
  const baselineCO2 = 0.170;

  for (const { mode, dist, type } of transportEntries) {
    const co2Saved = Math.max(0, (baselineCO2 - (co2PerKmMap[mode] ?? 0)) * dist);
    activities.push({
      userId: demoUser.id,
      category: "TRANSPORT",
      type,
      value: dist,
      unit: "km",
      date: daysAgo(Math.floor(Math.random() * 55)),
      transportMode: mode,
      distanceKm: dist,
      co2Saved: Math.round(co2Saved * 1000) / 1000,
    });
  }

  // Fashion activities (5)
  const fashionTypes = ["secondhand_purchase", "clothing_swap", "repair", "upcycle"];
  for (let i = 0; i < 5; i++) {
    activities.push({
      userId: demoUser.id,
      category: "FASHION",
      type: fashionTypes[i % fashionTypes.length],
      value: 1 + Math.floor(Math.random() * 3),
      unit: "items",
      date: daysAgo(Math.floor(Math.random() * 55)),
    });
  }

  // Activities for other users
  for (const u of [user2, user3, user4]) {
    // Skip deleteMany on fresh DB
    const cats = ["WATER", "CARBON", "PLASTIC", "TRANSPORT", "RECYCLING", "FASHION"];
    const units = ["litres", "kg_co2", "items", "km", "kg", "items"];
    for (let i = 0; i < 8; i++) {
      activities.push({
        userId: u.id,
        category: cats[i % 6],
        type: "other",
        value: 5 + Math.floor(Math.random() * 30),
        unit: units[i % 6],
        date: daysAgo(Math.floor(Math.random() * 30)),
      });
    }
  }

  // Ensure current-week data for the weekly trend chart
  for (let dayOffset = 0; dayOffset < 6; dayOffset++) {
    activities.push({
      userId: demoUser.id,
      category: "WATER",
      type: "reusable_bottle",
      value: 20 + Math.floor(Math.random() * 40),
      unit: "litres",
      date: daysAgo(dayOffset),
    });
    activities.push({
      userId: demoUser.id,
      category: "CARBON",
      type: "diet_change",
      value: Math.round((1 + Math.random() * 3) * 100) / 100,
      unit: "kg_co2",
      date: daysAgo(dayOffset),
    });
    activities.push({
      userId: demoUser.id,
      category: "PLASTIC",
      type: "reusable_bag",
      value: 2 + Math.floor(Math.random() * 5),
      unit: "items",
      date: daysAgo(dayOffset),
    });
  }

  // Create activities individually (HTTP adapter doesn't support createMany transactions)
  for (const activity of activities) {
    await prisma.activity.create({ data: activity });
  }
  console.log(`  Seeded ${activities.length} activities`);

  // ==========================================
  // Challenges
  // ==========================================
  // Skip deleteMany on fresh DB

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        title: "Car-Free Commute Week",
        description: "Use alternatives to driving for 5 work days this month. Walk, cycle, or take public transport!",
        category: "TRANSPORT",
        targetValue: 5,
        startDate: monthStart,
        endDate: monthEnd,
        isActive: true,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Plastic-Free March",
        description: "Avoid 100 single-use plastic items this month. Every bag, bottle, and straw counts!",
        category: "PLASTIC",
        targetValue: 100,
        startDate: monthStart,
        endDate: monthEnd,
        isActive: true,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Water Saver Sprint",
        description: "Save 500 litres of water in a month through mindful daily habits.",
        category: "WATER",
        targetValue: 500,
        startDate: lastMonthStart,
        endDate: lastMonthEnd,
        isActive: false,
      },
    }),
    prisma.challenge.create({
      data: {
        title: "Zero Waste April",
        description: "Recycle 50 kg of materials next month. Sort, separate, and recycle!",
        category: "RECYCLING",
        targetValue: 50,
        startDate: nextMonthStart,
        endDate: nextMonthEnd,
        isActive: false,
      },
    }),
  ]);

  // Participants
  await prisma.challengeParticipant.create({ data: { userId: demoUser.id, challengeId: challenges[0].id, progress: 3 } });
  await prisma.challengeParticipant.create({ data: { userId: demoUser.id, challengeId: challenges[1].id, progress: 42 } });
  await prisma.challengeParticipant.create({ data: { userId: user2.id, challengeId: challenges[0].id, progress: 4 } });
  await prisma.challengeParticipant.create({ data: { userId: user3.id, challengeId: challenges[1].id, progress: 25 } });
  await prisma.challengeParticipant.create({ data: { userId: user4.id, challengeId: challenges[0].id, progress: 5 } });
  await prisma.challengeParticipant.create({ data: { userId: user4.id, challengeId: challenges[1].id, progress: 68 } });

  console.log("  Seeded 4 challenges with participants");

  // ==========================================
  // Award badges
  // ==========================================
  // Skip deleteMany on fresh DB

  const badgeNames = ["First Step", "Week Warrior", "Water Watcher", "Pedal Power", "Plastic Reducer", "Challenger"];
  for (let i = 0; i < badgeNames.length; i++) {
    const badge = await prisma.badge.findUnique({ where: { name: badgeNames[i] } });
    if (badge) {
      await prisma.userBadge.create({
        data: { userId: demoUser.id, badgeId: badge.id, earnedAt: daysAgo(i * 7 + 2) },
      });
    }
  }

  const firstStepBadge = await prisma.badge.findUnique({ where: { name: "First Step" } });
  if (firstStepBadge) {
    for (const u of [user2, user3, user4]) {
      await prisma.userBadge.create({ data: { userId: u.id, badgeId: firstStepBadge.id } });
    }
  }

  const monthMasterBadge = await prisma.badge.findUnique({ where: { name: "Month Master" } });
  if (monthMasterBadge) {
    await prisma.userBadge.create({ data: { userId: user2.id, badgeId: monthMasterBadge.id } });
  }

  console.log("  Seeded badges for demo users");

  // ==========================================
  // Point Transactions
  // ==========================================
  // Skip deleteMany on fresh DB

  const pointReasons = [
    "Logged water activity", "Logged carbon activity", "Logged plastic activity",
    "Logged transport activity", "Logged recycling activity", "Daily streak bonus",
    "Joined challenge", "Weekly streak bonus", "Logged fashion activity",
  ];

  for (let i = 0; i < 25; i++) {
    await prisma.pointTransaction.create({
      data: {
        userId: demoUser.id,
        points: [10, 10, 10, 15, 10, 25, 20, 50, 10][i % 9],
        reason: pointReasons[i % pointReasons.length],
        createdAt: daysAgo(Math.floor(Math.random() * 45)),
      },
    });
  }
  console.log("  Seeded 25 point transactions");

  // ==========================================
  // Forum Threads & Replies
  // ==========================================
  // Skip deleteMany on fresh DB

  const thread1 = await prisma.thread.create({
    data: {
      userId: demoUser.id,
      title: "Best reusable water bottles?",
      content: "I'm looking for a good insulated water bottle that keeps drinks cold for hours. Any recommendations? I've been going through so many plastic bottles at work and want to make the switch.",
      category: "tips",
    },
  });

  const thread2 = await prisma.thread.create({
    data: {
      userId: user2.id,
      title: "Just hit a 60-day streak!",
      content: "Can't believe I've been logging every day for 60 days. It started as a small challenge but now it's become a habit. The dashboard stats are really motivating!",
      category: "wins",
    },
  });

  const thread3 = await prisma.thread.create({
    data: {
      userId: user4.id,
      title: "How do you handle food packaging?",
      content: "I'm trying to reduce plastic but almost everything at the supermarket comes wrapped in plastic. Has anyone found good strategies for reducing packaging waste when grocery shopping?",
      category: "questions",
    },
  });

  const thread4 = await prisma.thread.create({
    data: {
      userId: user3.id,
      title: "Car-Free Commute Challenge - Let's go!",
      content: "Who's joining the Car-Free Commute Challenge this month? I've switched to cycling to work and it's only 20 minutes longer than driving. Plus I feel way more energised when I arrive!",
      category: "challenges",
      isPinned: true,
    },
  });

  const reply1 = await prisma.reply.create({
    data: { threadId: thread1.id, userId: user2.id, content: "I love my Chilly's bottle! Keeps water ice cold for 24 hours. A bit pricey but totally worth it \u2014 I've had mine for 2 years now." },
  });

  const reply2 = await prisma.reply.create({
    data: { threadId: thread1.id, userId: user4.id, content: "Klean Kanteen is also brilliant. I got the 32oz one and it's perfect for the office. They also do a lifetime warranty." },
  });

  await prisma.reply.create({
    data: { threadId: thread2.id, userId: demoUser.id, content: "That's amazing, well done! I'm on 45 days myself. The streak badge is a great motivator." },
  });

  await prisma.reply.create({
    data: { threadId: thread2.id, userId: user3.id, content: "Congratulations! I find the weekly trend chart really helps me stay on track too." },
  });

  const reply5 = await prisma.reply.create({
    data: { threadId: thread3.id, userId: user2.id, content: "Try your local farmers market! Most things come unwrapped or in paper bags. Also, lots of supermarkets now have refill stations for pasta, rice, and cereals." },
  });

  await prisma.reply.create({
    data: { threadId: thread3.id, userId: demoUser.id, content: "I bring my own containers to the deli counter and they're always happy to use them. Also, buying loose fruit and veg instead of pre-packed makes a huge difference." },
  });

  await prisma.reply.create({
    data: { threadId: thread4.id, userId: demoUser.id, content: "I'm in! Cycling to work 3 days so far this week. The weather has been kind!" },
  });

  await prisma.reply.create({
    data: { threadId: thread4.id, userId: user2.id, content: "Just joined! Taking the train on rainy days and cycling the rest. Already on 4 car-free days!" },
  });

  await prisma.reaction.create({ data: { replyId: reply1.id, userId: demoUser.id, type: "helpful" } });
  await prisma.reaction.create({ data: { replyId: reply1.id, userId: user3.id, type: "cheer" } });
  await prisma.reaction.create({ data: { replyId: reply2.id, userId: demoUser.id, type: "helpful" } });
  await prisma.reaction.create({ data: { replyId: reply5.id, userId: user4.id, type: "helpful" } });
  await prisma.reaction.create({ data: { replyId: reply5.id, userId: demoUser.id, type: "inspiring" } });

  console.log("  Seeded 4 threads, 8 replies, 5 reactions");

  console.log("\nSeeding complete!");
  console.log("\n  Demo login: demo@example.com / demo1234");
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
