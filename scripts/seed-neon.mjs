import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

async function query(text) {
  try {
    return await sql.query(text);
  } catch (e) {
    console.error(`  FAILED: ${text.slice(0, 80)}...`);
    console.error(`  Error: ${e.message}`);
    throw e;
  }
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

function esc(s) {
  if (s === null || s === undefined) return "NULL";
  return `'${String(s).replace(/'/g, "''")}'`;
}

function cuid() {
  // Simple cuid-like ID generator
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `cl${ts}${rand}`;
}

async function main() {
  console.log("Seeding Neon database via HTTP API...\n");

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

  for (const m of transportModes) {
    await query(`INSERT INTO transport_modes (id, slug, name, "co2PerKm", icon, category, "isZeroEmission", "createdAt")
      VALUES (${esc(cuid())}, ${esc(m.slug)}, ${esc(m.name)}, ${m.co2PerKm}, ${esc(m.icon)}, ${esc(m.category)}, ${m.isZeroEmission}, NOW())
      ON CONFLICT (slug) DO UPDATE SET name = ${esc(m.name)}, "co2PerKm" = ${m.co2PerKm}`);
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
    { name: "Helpful Hand", description: "Get 10 helpful reactions on your replies", icon: "heart-handshake", category: "community", criteria: '{"type":"reactions_received","reaction":"helpful","count":10}', rarity: "uncommon" },
    { name: "Community Star", description: "Make 50 forum posts or replies", icon: "star", category: "community", criteria: '{"type":"posts_count","count":50}', rarity: "rare" },
  ];

  for (const b of badges) {
    await query(`INSERT INTO badges (id, name, description, icon, category, criteria, rarity, "createdAt")
      VALUES (${esc(cuid())}, ${esc(b.name)}, ${esc(b.description)}, ${esc(b.icon)}, ${esc(b.category)}, ${esc(b.criteria)}, ${esc(b.rarity)}, NOW())
      ON CONFLICT (name) DO UPDATE SET description = ${esc(b.description)}`);
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

  for (const r of resources) {
    await query(`INSERT INTO resources (id, name, description, url, category, "isActive", "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(r.name)}, ${esc(r.description)}, ${esc(r.url)}, ${esc(r.category)}, true, NOW(), NOW())`);
  }
  console.log(`  Seeded ${resources.length} resources`);

  // ==========================================
  // Demo Users
  // ==========================================
  const demoPassword = await bcrypt.hash("demo1234", 12);

  const users = [
    { id: cuid(), email: "demo@example.com", name: "Demo User", displayName: "EcoWarrior", bio: "Passionate about reducing my environmental footprint, one small step at a time.", totalPoints: 1250, streakDays: 45, lastActiveAt: new Date().toISOString() },
    { id: cuid(), email: "sarah@example.com", name: "Sarah Green", displayName: "GreenSarah", bio: "Cyclist and zero-waste advocate.", totalPoints: 2100, streakDays: 72, lastActiveAt: daysAgo(1) },
    { id: cuid(), email: "james@example.com", name: "James Rivers", displayName: "EcoJames", bio: "Started my eco journey this year. Learning every day!", totalPoints: 680, streakDays: 12, lastActiveAt: daysAgo(2) },
    { id: cuid(), email: "priya@example.com", name: "Priya Patel", displayName: "PriyaEco", bio: "Vegan, train commuter, and secondhand shopper.", totalPoints: 1580, streakDays: 33, lastActiveAt: daysAgo(1) },
  ];

  for (const u of users) {
    await query(`INSERT INTO users (id, email, name, password, "displayName", bio, "isPublic", "totalPoints", "streakDays", "lastActiveAt", "createdAt", "updatedAt")
      VALUES (${esc(u.id)}, ${esc(u.email)}, ${esc(u.name)}, ${esc(demoPassword)}, ${esc(u.displayName)}, ${esc(u.bio)}, true, ${u.totalPoints}, ${u.streakDays}, ${esc(u.lastActiveAt)}, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING`);
  }
  console.log("  Seeded 4 demo users");

  // Credential accounts
  for (const u of users) {
    await query(`INSERT INTO accounts (id, "userId", type, provider, "providerAccountId", "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(u.id)}, 'credentials', 'credentials', ${esc(u.id)}, NOW(), NOW())
      ON CONFLICT (provider, "providerAccountId") DO NOTHING`);
  }
  console.log("  Seeded credential accounts");

  const demoUser = users[0];
  const user2 = users[1];
  const user3 = users[2];
  const user4 = users[3];

  // ==========================================
  // Activities
  // ==========================================
  const co2PerKmMap = {};
  for (const m of transportModes) co2PerKmMap[m.slug] = m.co2PerKm;
  const baselineCO2 = 0.170;

  let actCount = 0;

  // Water activities (15)
  const waterTypes = ["reusable_bottle", "shorter_shower", "full_load_washing", "tap_off_brushing", "rain_barrel"];
  for (let i = 0; i < 15; i++) {
    const note = i % 3 === 0 ? "Feeling good about this!" : null;
    await query(`INSERT INTO activities (id, "userId", category, type, value, unit, note, date, "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, 'WATER', ${esc(waterTypes[i % 5])}, ${5 + Math.floor(Math.random() * 75)}, 'litres', ${esc(note)}, ${esc(daysAgo(Math.floor(Math.random() * 55)))}, NOW(), NOW())`);
    actCount++;
  }

  // Carbon activities (10)
  const carbonTypes = ["energy_saving", "diet_change", "local_produce", "air_dry_clothes", "reduced_heating"];
  for (let i = 0; i < 10; i++) {
    await query(`INSERT INTO activities (id, "userId", category, type, value, unit, date, "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, 'CARBON', ${esc(carbonTypes[i % 5])}, ${Math.round((0.5 + Math.random() * 4.5) * 100) / 100}, 'kg_co2', ${esc(daysAgo(Math.floor(Math.random() * 55)))}, NOW(), NOW())`);
    actCount++;
  }

  // Plastic activities (12)
  const plasticTypes = ["reusable_bag", "reusable_bottle", "refused_straw", "refused_packaging", "bulk_buy"];
  for (let i = 0; i < 12; i++) {
    await query(`INSERT INTO activities (id, "userId", category, type, value, unit, date, "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, 'PLASTIC', ${esc(plasticTypes[i % 5])}, ${1 + Math.floor(Math.random() * 7)}, 'items', ${esc(daysAgo(Math.floor(Math.random() * 55)))}, NOW(), NOW())`);
    actCount++;
  }

  // Recycling activities (8)
  const recyclingTypes = ["paper", "glass", "metal", "plastic_recycling", "electronics"];
  for (let i = 0; i < 8; i++) {
    await query(`INSERT INTO activities (id, "userId", category, type, value, unit, date, "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, 'RECYCLING', ${esc(recyclingTypes[i % 5])}, ${2 + Math.floor(Math.random() * 13)}, 'kg', ${esc(daysAgo(Math.floor(Math.random() * 55)))}, NOW(), NOW())`);
    actCount++;
  }

  // Transport activities (15)
  const transportEntries = [
    { mode: "cycling", dist: 5, type: "commute" }, { mode: "cycling", dist: 8, type: "commute" },
    { mode: "cycling", dist: 12, type: "leisure" }, { mode: "walking", dist: 3, type: "errand" },
    { mode: "walking", dist: 2, type: "commute" }, { mode: "walking", dist: 4, type: "leisure" },
    { mode: "train", dist: 25, type: "commute" }, { mode: "train", dist: 40, type: "leisure" },
    { mode: "bus", dist: 10, type: "errand" }, { mode: "bus", dist: 15, type: "commute" },
    { mode: "ev", dist: 30, type: "errand" }, { mode: "ev", dist: 45, type: "leisure" },
    { mode: "e_scooter", dist: 6, type: "commute" }, { mode: "cycling", dist: 15, type: "leisure" },
    { mode: "train", dist: 60, type: "leisure" },
  ];
  for (const { mode, dist, type } of transportEntries) {
    const co2Saved = Math.max(0, (baselineCO2 - (co2PerKmMap[mode] ?? 0)) * dist);
    await query(`INSERT INTO activities (id, "userId", category, type, value, unit, date, "transportMode", "distanceKm", "co2Saved", "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, 'TRANSPORT', ${esc(type)}, ${dist}, 'km', ${esc(daysAgo(Math.floor(Math.random() * 55)))}, ${esc(mode)}, ${dist}, ${Math.round(co2Saved * 1000) / 1000}, NOW(), NOW())`);
    actCount++;
  }

  // Fashion activities (5)
  const fashionTypes = ["secondhand_purchase", "clothing_swap", "repair", "upcycle"];
  for (let i = 0; i < 5; i++) {
    await query(`INSERT INTO activities (id, "userId", category, type, value, unit, date, "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, 'FASHION', ${esc(fashionTypes[i % 4])}, ${1 + Math.floor(Math.random() * 3)}, 'items', ${esc(daysAgo(Math.floor(Math.random() * 55)))}, NOW(), NOW())`);
    actCount++;
  }

  // Other users activities
  const cats = ["WATER", "CARBON", "PLASTIC", "TRANSPORT", "RECYCLING", "FASHION"];
  const units = ["litres", "kg_co2", "items", "km", "kg", "items"];
  for (const u of [user2, user3, user4]) {
    for (let i = 0; i < 8; i++) {
      await query(`INSERT INTO activities (id, "userId", category, type, value, unit, date, "createdAt", "updatedAt")
        VALUES (${esc(cuid())}, ${esc(u.id)}, ${esc(cats[i % 6])}, 'other', ${5 + Math.floor(Math.random() * 30)}, ${esc(units[i % 6])}, ${esc(daysAgo(Math.floor(Math.random() * 30)))}, NOW(), NOW())`);
      actCount++;
    }
  }

  // Weekly trend data
  for (let dayOffset = 0; dayOffset < 6; dayOffset++) {
    await query(`INSERT INTO activities (id, "userId", category, type, value, unit, date, "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, 'WATER', 'reusable_bottle', ${20 + Math.floor(Math.random() * 40)}, 'litres', ${esc(daysAgo(dayOffset))}, NOW(), NOW())`);
    await query(`INSERT INTO activities (id, "userId", category, type, value, unit, date, "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, 'CARBON', 'diet_change', ${Math.round((1 + Math.random() * 3) * 100) / 100}, 'kg_co2', ${esc(daysAgo(dayOffset))}, NOW(), NOW())`);
    await query(`INSERT INTO activities (id, "userId", category, type, value, unit, date, "createdAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, 'PLASTIC', 'reusable_bag', ${2 + Math.floor(Math.random() * 5)}, 'items', ${esc(daysAgo(dayOffset))}, NOW(), NOW())`);
    actCount += 3;
  }
  console.log(`  Seeded ${actCount} activities`);

  // ==========================================
  // Challenges
  // ==========================================
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
  const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

  const challengeIds = [cuid(), cuid(), cuid(), cuid()];
  const challengeData = [
    { id: challengeIds[0], title: "Car-Free Commute Week", description: "Use alternatives to driving for 5 work days this month.", category: "TRANSPORT", targetValue: 5, startDate: monthStart, endDate: monthEnd, isActive: true },
    { id: challengeIds[1], title: "Plastic-Free March", description: "Avoid 100 single-use plastic items this month.", category: "PLASTIC", targetValue: 100, startDate: monthStart, endDate: monthEnd, isActive: true },
    { id: challengeIds[2], title: "Water Saver Sprint", description: "Save 500 litres of water in a month.", category: "WATER", targetValue: 500, startDate: lastMonthStart, endDate: lastMonthEnd, isActive: false },
    { id: challengeIds[3], title: "Zero Waste April", description: "Recycle 50 kg of materials next month.", category: "RECYCLING", targetValue: 50, startDate: nextMonthStart, endDate: nextMonthEnd, isActive: false },
  ];

  for (const c of challengeData) {
    await query(`INSERT INTO challenges (id, title, description, category, "targetValue", "startDate", "endDate", "isActive", "createdAt")
      VALUES (${esc(c.id)}, ${esc(c.title)}, ${esc(c.description)}, ${esc(c.category)}, ${c.targetValue}, ${esc(c.startDate)}, ${esc(c.endDate)}, ${c.isActive}, NOW())`);
  }

  // Participants
  const participants = [
    { userId: demoUser.id, challengeId: challengeIds[0], progress: 3 },
    { userId: demoUser.id, challengeId: challengeIds[1], progress: 42 },
    { userId: user2.id, challengeId: challengeIds[0], progress: 4 },
    { userId: user3.id, challengeId: challengeIds[1], progress: 25 },
    { userId: user4.id, challengeId: challengeIds[0], progress: 5 },
    { userId: user4.id, challengeId: challengeIds[1], progress: 68 },
  ];
  for (const p of participants) {
    await query(`INSERT INTO challenge_participants (id, "userId", "challengeId", progress, "joinedAt", "updatedAt")
      VALUES (${esc(cuid())}, ${esc(p.userId)}, ${esc(p.challengeId)}, ${p.progress}, NOW(), NOW())`);
  }
  console.log("  Seeded 4 challenges with 6 participants");

  // ==========================================
  // Badges for users
  // ==========================================
  const badgeNames = ["First Step", "Week Warrior", "Water Watcher", "Pedal Power", "Plastic Reducer", "Challenger"];
  for (let i = 0; i < badgeNames.length; i++) {
    const res = await query(`SELECT id FROM badges WHERE name = ${esc(badgeNames[i])}`);
    if (res.length > 0) {
      await query(`INSERT INTO user_badges (id, "userId", "badgeId", "earnedAt")
        VALUES (${esc(cuid())}, ${esc(demoUser.id)}, ${esc(res[0].id)}, ${esc(daysAgo(i * 7 + 2))})`);
    }
  }

  // First Step for all other users
  const fsRes = await query(`SELECT id FROM badges WHERE name = 'First Step'`);
  if (fsRes.length > 0) {
    for (const u of [user2, user3, user4]) {
      await query(`INSERT INTO user_badges (id, "userId", "badgeId", "earnedAt")
        VALUES (${esc(cuid())}, ${esc(u.id)}, ${esc(fsRes[0].id)}, NOW())
        ON CONFLICT ("userId", "badgeId") DO NOTHING`);
    }
  }

  // Month Master for Sarah
  const mmRes = await query(`SELECT id FROM badges WHERE name = 'Month Master'`);
  if (mmRes.length > 0) {
    await query(`INSERT INTO user_badges (id, "userId", "badgeId", "earnedAt")
      VALUES (${esc(cuid())}, ${esc(user2.id)}, ${esc(mmRes[0].id)}, NOW())`);
  }
  console.log("  Seeded badges for demo users");

  // ==========================================
  // Point Transactions
  // ==========================================
  const pointReasons = [
    "Logged water activity", "Logged carbon activity", "Logged plastic activity",
    "Logged transport activity", "Logged recycling activity", "Daily streak bonus",
    "Joined challenge", "Weekly streak bonus", "Logged fashion activity",
  ];
  const pointValues = [10, 10, 10, 15, 10, 25, 20, 50, 10];

  for (let i = 0; i < 25; i++) {
    await query(`INSERT INTO point_transactions (id, "userId", points, reason, "createdAt")
      VALUES (${esc(cuid())}, ${esc(demoUser.id)}, ${pointValues[i % 9]}, ${esc(pointReasons[i % 9])}, ${esc(daysAgo(Math.floor(Math.random() * 45)))})`);
  }
  console.log("  Seeded 25 point transactions");

  // ==========================================
  // Forum
  // ==========================================
  const threadIds = [cuid(), cuid(), cuid(), cuid()];
  await query(`INSERT INTO threads (id, "userId", title, content, category, "isPinned", "createdAt", "updatedAt")
    VALUES (${esc(threadIds[0])}, ${esc(demoUser.id)}, 'Best reusable water bottles?', ${esc("I'm looking for a good insulated water bottle that keeps drinks cold for hours. Any recommendations?")}, 'tips', false, NOW(), NOW())`);
  await query(`INSERT INTO threads (id, "userId", title, content, category, "isPinned", "createdAt", "updatedAt")
    VALUES (${esc(threadIds[1])}, ${esc(user2.id)}, 'Just hit a 60-day streak!', ${esc("Can't believe I've been logging every day for 60 days. The dashboard stats are really motivating!")}, 'wins', false, NOW(), NOW())`);
  await query(`INSERT INTO threads (id, "userId", title, content, category, "isPinned", "createdAt", "updatedAt")
    VALUES (${esc(threadIds[2])}, ${esc(user4.id)}, 'How do you handle food packaging?', ${esc("I'm trying to reduce plastic but almost everything comes wrapped. Any strategies?")}, 'questions', false, NOW(), NOW())`);
  await query(`INSERT INTO threads (id, "userId", title, content, category, "isPinned", "createdAt", "updatedAt")
    VALUES (${esc(threadIds[3])}, ${esc(user3.id)}, ${esc("Car-Free Commute Challenge - Let's go!")}, ${esc("Who's joining? I switched to cycling and it's only 20 minutes longer than driving!")}, 'challenges', true, NOW(), NOW())`);

  const replyIds = [cuid(), cuid(), cuid(), cuid(), cuid(), cuid(), cuid(), cuid()];
  await query(`INSERT INTO replies (id, "threadId", "userId", content, "createdAt", "updatedAt")
    VALUES (${esc(replyIds[0])}, ${esc(threadIds[0])}, ${esc(user2.id)}, ${esc("I love my Chilly's bottle! Keeps water ice cold for 24 hours.")}, NOW(), NOW())`);
  await query(`INSERT INTO replies (id, "threadId", "userId", content, "createdAt", "updatedAt")
    VALUES (${esc(replyIds[1])}, ${esc(threadIds[0])}, ${esc(user4.id)}, ${esc("Klean Kanteen is also brilliant. They do a lifetime warranty.")}, NOW(), NOW())`);
  await query(`INSERT INTO replies (id, "threadId", "userId", content, "createdAt", "updatedAt")
    VALUES (${esc(replyIds[2])}, ${esc(threadIds[1])}, ${esc(demoUser.id)}, ${esc("That's amazing! I'm on 45 days myself. The streak badge is a great motivator.")}, NOW(), NOW())`);
  await query(`INSERT INTO replies (id, "threadId", "userId", content, "createdAt", "updatedAt")
    VALUES (${esc(replyIds[3])}, ${esc(threadIds[1])}, ${esc(user3.id)}, ${esc("Congratulations! The weekly trend chart helps me stay on track too.")}, NOW(), NOW())`);
  await query(`INSERT INTO replies (id, "threadId", "userId", content, "createdAt", "updatedAt")
    VALUES (${esc(replyIds[4])}, ${esc(threadIds[2])}, ${esc(user2.id)}, ${esc("Try your local farmers market! Also supermarkets now have refill stations.")}, NOW(), NOW())`);
  await query(`INSERT INTO replies (id, "threadId", "userId", content, "createdAt", "updatedAt")
    VALUES (${esc(replyIds[5])}, ${esc(threadIds[2])}, ${esc(demoUser.id)}, ${esc("I bring my own containers to the deli counter. Buying loose fruit and veg helps too.")}, NOW(), NOW())`);
  await query(`INSERT INTO replies (id, "threadId", "userId", content, "createdAt", "updatedAt")
    VALUES (${esc(replyIds[6])}, ${esc(threadIds[3])}, ${esc(demoUser.id)}, ${esc("I'm in! Cycling to work 3 days so far this week.")}, NOW(), NOW())`);
  await query(`INSERT INTO replies (id, "threadId", "userId", content, "createdAt", "updatedAt")
    VALUES (${esc(replyIds[7])}, ${esc(threadIds[3])}, ${esc(user2.id)}, ${esc("Just joined! Taking the train on rainy days and cycling the rest.")}, NOW(), NOW())`);

  // Reactions
  await query(`INSERT INTO reactions (id, "replyId", "userId", type, "createdAt") VALUES (${esc(cuid())}, ${esc(replyIds[0])}, ${esc(demoUser.id)}, 'helpful', NOW())`);
  await query(`INSERT INTO reactions (id, "replyId", "userId", type, "createdAt") VALUES (${esc(cuid())}, ${esc(replyIds[0])}, ${esc(user3.id)}, 'cheer', NOW())`);
  await query(`INSERT INTO reactions (id, "replyId", "userId", type, "createdAt") VALUES (${esc(cuid())}, ${esc(replyIds[1])}, ${esc(demoUser.id)}, 'helpful', NOW())`);
  await query(`INSERT INTO reactions (id, "replyId", "userId", type, "createdAt") VALUES (${esc(cuid())}, ${esc(replyIds[4])}, ${esc(user4.id)}, 'helpful', NOW())`);
  await query(`INSERT INTO reactions (id, "replyId", "userId", type, "createdAt") VALUES (${esc(cuid())}, ${esc(replyIds[4])}, ${esc(demoUser.id)}, 'inspiring', NOW())`);

  console.log("  Seeded 4 threads, 8 replies, 5 reactions");

  console.log("\nSeeding complete!");
  console.log("\n  Demo login: demo@example.com / demo1234");
  console.log("  All accounts: demo1234");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
