"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Logo } from "@/components/ui/Logo";
import {
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
  faPlus,
  faArrowTrendUp,
  faArrowTrendDown,
  faCircleCheck,
  faChartLine,
  faBullseye,
  faTrophy,
  faMedal,
  faFire,
  faSeedling,
  faCircleUser,
} from "@/lib/fontawesome";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/* ── Types ──────────────────────────────────────────────── */

type DemoPage = "dashboard" | "challenges" | "leaderboard" | "badges";

interface MetricCard {
  icon: IconDefinition;
  label: string;
  humanValue: string;
  comparison: string;
  iconBg: string;
  iconColor: string;
  accentBorder: string;
  trend: number;
  category: string;
  numericValue: number;
}

interface DemoNavItem {
  page: DemoPage;
  label: string;
  icon: IconDefinition;
  section: string;
}

interface DemoState {
  activePage: DemoPage;
  metrics: MetricCard[];
  weeklyData: typeof INITIAL_WEEKLY;
  loggedCount: number;
  lastAction: string | null;
  challengeProgress: Record<string, number>;
  leaderboardPoints: number;
}

/* ── Nav items ──────────────────────────────────────────── */

const DEMO_NAV: DemoNavItem[] = [
  { page: "dashboard", label: "Dashboard", icon: faChartLine, section: "Overview" },
  { page: "challenges", label: "Challenges", icon: faBullseye, section: "Community" },
  { page: "leaderboard", label: "Leaderboard", icon: faTrophy, section: "Community" },
  { page: "badges", label: "Badges", icon: faMedal, section: "Community" },
];

/* ── Human-readable value formatter ─────────────────────── */

function formatMetric(category: string, value: number): { humanValue: string; comparison: string } {
  switch (category) {
    case "water":
      return {
        humanValue: `${value.toFixed(1)} bathtubs`,
        comparison: `That's about ${value.toFixed(1)} bathtubs of water`,
      };
    case "carbon":
      return {
        humanValue: `${value.toFixed(1)} tree-years`,
        comparison: `Would take ${value.toFixed(1)} trees a whole year to absorb`,
      };
    case "plastic":
      return {
        humanValue: `${Math.round(value)} bin bags`,
        comparison: `You've avoided filling ${Math.round(value)} bin bags with plastic`,
      };
    case "recycling":
      return {
        humanValue: `${Math.round(value)} days of energy`,
        comparison: `Enough saved energy to power a home for ${Math.round(value)} days`,
      };
    case "transport":
      return {
        humanValue: `${Math.round(value)} road trips worth`,
        comparison: `You've saved the emissions of ${Math.round(value)} long car journeys`,
      };
    case "fashion":
      return {
        humanValue: `${Math.round(value)} secondhand items`,
        comparison: `${Math.round(value)} items given a second life instead of fast fashion`,
      };
    default:
      return { humanValue: `${value}`, comparison: "" };
  }
}

/* ── Mock data ──────────────────────────────────────────── */

const INITIAL_METRICS: MetricCard[] = [
  {
    icon: faDroplet, label: "Water Saved", ...formatMetric("water", 9.6),
    iconBg: "bg-ocean/10", iconColor: "text-ocean", accentBorder: "bg-ocean",
    trend: 15, category: "water", numericValue: 9.6,
  },
  {
    icon: faEarthAmericas, label: "Carbon Reduced", ...formatMetric("carbon", 2.1),
    iconBg: "bg-forest/10", iconColor: "text-forest", accentBorder: "bg-forest",
    trend: -17, category: "carbon", numericValue: 2.1,
  },
  {
    icon: faBagShopping, label: "Plastic Avoided", ...formatMetric("plastic", 2),
    iconBg: "bg-sunshine/15", iconColor: "text-amber-600", accentBorder: "bg-sunshine",
    trend: 0, category: "plastic", numericValue: 2,
  },
  {
    icon: faRecycle, label: "Recycling Impact", ...formatMetric("recycling", 12),
    iconBg: "bg-leaf/10", iconColor: "text-leaf", accentBorder: "bg-leaf",
    trend: 8, category: "recycling", numericValue: 12,
  },
  {
    icon: faCar, label: "Transport Savings", ...formatMetric("transport", 5),
    iconBg: "bg-ocean/10", iconColor: "text-ocean", accentBorder: "bg-ocean",
    trend: 22, category: "transport", numericValue: 5,
  },
  {
    icon: faShirt, label: "Fashion Impact", ...formatMetric("fashion", 8),
    iconBg: "bg-purple-100", iconColor: "text-purple-700", accentBorder: "bg-purple-500",
    trend: 5, category: "fashion", numericValue: 8,
  },
];

const INITIAL_WEEKLY = [
  { day: "Mon", water: 30, carbon: 2, plastic: 5 },
  { day: "Tue", water: 45, carbon: 3.5, plastic: 8 },
  { day: "Wed", water: 20, carbon: 1.5, plastic: 3 },
  { day: "Thu", water: 55, carbon: 4, plastic: 10 },
  { day: "Fri", water: 35, carbon: 2.5, plastic: 6 },
  { day: "Sat", water: 60, carbon: 5, plastic: 12 },
  { day: "Sun", water: 40, carbon: 3, plastic: 7 },
];

const TRANSPORT_DATA = [
  { mode: "Walk", co2: 0, color: "#52B788" },
  { mode: "Cycle", co2: 0, color: "#52B788" },
  { mode: "E-Scoot", co2: 0.05, color: "#74C69D" },
  { mode: "Train", co2: 0.35, color: "#40916C" },
  { mode: "Bus", co2: 0.89, color: "#2D6A4F" },
  { mode: "EV", co2: 0.5, color: "#1B4965" },
  { mode: "Hybrid", co2: 1.05, color: "#FFB703" },
  { mode: "Diesel", co2: 1.55, color: "#FB8500" },
  { mode: "Petrol", co2: 1.7, color: "#E63946" },
  { mode: "Flight", co2: 2.55, color: "#C1121F" },
];

const LOG_ACTIONS = [
  { label: "Log Water", icon: faDroplet, color: "bg-ocean/10 text-ocean hover:bg-ocean/20", category: "water" },
  { label: "Log Carbon", icon: faEarthAmericas, color: "bg-forest/10 text-forest hover:bg-forest/20", category: "carbon" },
  { label: "Log Transport", icon: faCar, color: "bg-ocean/10 text-ocean hover:bg-ocean/20", category: "transport" },
  { label: "Log Recycling", icon: faRecycle, color: "bg-leaf/10 text-leaf hover:bg-leaf/20", category: "recycling" },
] as const;

const MOCK_CHALLENGES = [
  {
    title: "Plastic-Free Week", description: "Avoid single-use plastics for 7 days straight",
    category: "plastic", icon: faBagShopping, iconBg: "bg-sunshine/15", iconColor: "text-amber-600",
    participants: 234, startDate: "Mar 10", endDate: "Mar 16", target: 7, baseProgress: 4, joined: true,
  },
  {
    title: "Cycle to Work", description: "Replace car commutes with cycling for 5 days",
    category: "transport", icon: faCar, iconBg: "bg-ocean/10", iconColor: "text-ocean",
    participants: 189, startDate: "Mar 12", endDate: "Mar 19", target: 5, baseProgress: 2, joined: true,
  },
  {
    title: "Water Warrior", description: "Save 500L of water through shorter showers",
    category: "water", icon: faDroplet, iconBg: "bg-ocean/10", iconColor: "text-ocean",
    participants: 312, startDate: "Mar 1", endDate: "Mar 31", target: 500, baseProgress: 280, joined: true,
  },
  {
    title: "Zero Waste Kitchen", description: "Compost all food waste and recycle packaging",
    category: "recycling", icon: faRecycle, iconBg: "bg-leaf/10", iconColor: "text-leaf",
    participants: 156, startDate: "Mar 15", endDate: "Mar 22", target: 10, baseProgress: 0, joined: false,
  },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: "EcoWarrior42", points: 12450, streak: 45, badges: 18 },
  { rank: 2, name: "GreenQueen", points: 11280, streak: 32, badges: 16 },
  { rank: 3, name: "PlanetSaver", points: 10100, streak: 28, badges: 15 },
  { rank: 4, name: "Demo User", points: 8750, streak: 12, badges: 9, isYou: true },
  { rank: 5, name: "RecycleKing", points: 7900, streak: 19, badges: 11 },
  { rank: 6, name: "CarbonCutter", points: 7200, streak: 14, badges: 10 },
  { rank: 7, name: "WaterWise", points: 6800, streak: 8, badges: 8 },
  { rank: 8, name: "EcoNinja", points: 5950, streak: 22, badges: 7 },
];

const MOCK_BADGES = [
  { name: "First Step", description: "Log your first activity", icon: faSeedling, rarity: "Common" as const, earned: true, earnedDate: "2 Mar 2026", category: "Getting Started" },
  { name: "Week Warrior", description: "Log every day for a week", icon: faFire, rarity: "Uncommon" as const, earned: true, earnedDate: "9 Mar 2026", category: "Getting Started" },
  { name: "Water Saver", description: "Save 100L of water", icon: faDroplet, rarity: "Common" as const, earned: true, earnedDate: "5 Mar 2026", category: "Impact Milestones" },
  { name: "Carbon Cutter", description: "Reduce 50kg of CO₂", icon: faEarthAmericas, rarity: "Uncommon" as const, earned: true, earnedDate: "11 Mar 2026", category: "Impact Milestones" },
  { name: "Plastic Free", description: "Avoid 500 plastic items", icon: faBagShopping, rarity: "Rare" as const, earned: false, progress: 62, category: "Impact Milestones" },
  { name: "Cycle Champion", description: "Cycle 100km instead of driving", icon: faCar, rarity: "Rare" as const, earned: false, progress: 45, category: "Transport Champions" },
  { name: "Month Streak", description: "30-day logging streak", icon: faFire, rarity: "Epic" as const, earned: false, progress: 40, category: "Streak Achievements" },
  { name: "Challenge Master", description: "Complete 10 challenges", icon: faBullseye, rarity: "Legendary" as const, earned: false, progress: 20, category: "Challenge Awards" },
];

const RARITY_COLORS: Record<string, string> = {
  Common: "bg-gray-100 text-gray-600",
  Uncommon: "bg-green-100 text-green-700",
  Rare: "bg-blue-100 text-blue-700",
  Epic: "bg-purple-100 text-purple-700",
  Legendary: "bg-amber-100 text-amber-700",
};

/* ── Phone clock (live UK London time) ─────────────────── */

function PhoneClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span className="text-[8px] font-semibold text-charcoal">{time ?? "9:41"}</span>;
}

/* ── Main component ─────────────────────────────────────── */

export function DashboardDemo() {
  const [activePage, setActivePage] = useState<DemoPage>("dashboard");
  const [phonePage, setPhonePage] = useState<DemoPage>("dashboard");
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [weeklyData, setWeeklyData] = useState(INITIAL_WEEKLY);
  const [loggedCount, setLoggedCount] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [challengeProgress, setChallengeProgress] = useState<Record<string, number>>({});
  const [leaderboardPoints, setLeaderboardPoints] = useState(8750);
  const [urlPath, setUrlPath] = useState("earthecho.app/dashboard");

  const navigateTo = useCallback((page: DemoPage) => {
    setActivePage(page);
    setUrlPath(`earthecho.app/${page}`);
    browserAutoRef.current = false; // pause browser auto-cycle on manual interaction
  }, []);

  const phoneNavigateTo = useCallback((page: DemoPage) => {
    setPhonePage(page);
    phoneAutoRef.current = false; // pause phone auto-cycle on manual interaction
  }, []);

  // Auto-cycle: phone rotates pages every 5s, browser every 7s
  const PAGES: DemoPage[] = ["dashboard", "challenges", "leaderboard", "badges"];
  const phoneAutoRef = useRef(true);
  const browserAutoRef = useRef(true);

  useEffect(() => {
    const id = setInterval(() => {
      if (!phoneAutoRef.current) return;
      setPhonePage((prev) => PAGES[(PAGES.indexOf(prev) + 1) % PAGES.length]);
    }, 5000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const id = setInterval(() => {
      if (!browserAutoRef.current) return;
      setActivePage((prev) => {
        const next = PAGES[(PAGES.indexOf(prev) + 1) % PAGES.length];
        setUrlPath(`earthecho.app/${next}`);
        return next;
      });
    }, 7000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLog = useCallback((category: string, label: string) => {
    setLoggedCount((c) => c + 1);
    setLastAction(label);

    // Update metric values + regenerate human-readable text
    setMetrics((prev) =>
      prev.map((m) => {
        if (m.category === category) {
          const inc = category === "water" ? 0.4 : category === "carbon" ? 0.1 : category === "recycling" ? 0.5 : 1;
          const newVal = +(m.numericValue + inc).toFixed(1);
          const { humanValue, comparison } = formatMetric(category, newVal);
          return { ...m, trend: Math.min(Math.abs(m.trend) + 3, 99), numericValue: newVal, humanValue, comparison };
        }
        return m;
      })
    );

    // Bump today's chart data
    setWeeklyData((prev) =>
      prev.map((d, i) =>
        i === prev.length - 1
          ? {
              ...d,
              water: d.water + (category === "water" ? 8 : 0),
              carbon: d.carbon + (category === "carbon" ? 1 : category === "transport" ? 0.5 : 0),
              plastic: d.plastic + (category === "recycling" ? 3 : 0),
            }
          : d
      )
    );

    setChallengeProgress((prev) => ({ ...prev, [category]: (prev[category] || 0) + 1 }));
    setLeaderboardPoints((p) => p + 25);
    setTimeout(() => setLastAction(null), 2000);
  }, []);

  const sections = DEMO_NAV.reduce<Record<string, DemoNavItem[]>>((acc, item) => {
    (acc[item.section] ??= []).push(item);
    return acc;
  }, {});

  const sharedState: DemoState = { activePage, metrics, weeklyData, loggedCount, lastAction, challengeProgress, leaderboardPoints };

  return (
    <div className="flex items-end justify-center gap-6 lg:gap-8">
      {/* ── Browser window ─────────────────────────────────── */}
      <div className="min-w-0 flex-1">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
        {/* Chrome bar */}
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-amber-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
          <div className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-xs text-slate">
            {urlPath}
          </div>
        </div>

        <div className="flex min-h-[520px] md:min-h-[560px]">
          {/* Sidebar */}
          <div className="hidden w-44 shrink-0 border-r border-gray-200/80 bg-white md:flex md:flex-col">
            <div className="border-b border-gray-200/80 px-4 py-3">
              <Logo size="xs" textClassName="text-charcoal" />
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3">
              {Object.entries(sections).map(([section, items]) => (
                <div key={section} className="mb-3">
                  <h3 className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-wider text-slate/50">{section}</h3>
                  <ul className="space-y-0.5">
                    {items.map((item) => {
                      const active = activePage === item.page;
                      return (
                        <li key={item.page}>
                          <button type="button" onClick={() => navigateTo(item.page)}
                            className={`relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium transition-all duration-200 ${active ? "bg-forest/10 text-forest" : "text-slate hover:bg-gray-100 hover:text-charcoal"}`}>
                            {active && (
                              <motion.span
                                layoutId="sidebar-indicator"
                                className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-forest"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              />
                            )}
                            <FontAwesomeIcon icon={item.icon} className={`h-3 w-3 shrink-0 ${active ? "text-forest" : "text-slate/60"}`} aria-hidden />
                            {item.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <div className="mb-3">
                <h3 className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-wider text-slate/50">Track</h3>
                <ul className="space-y-0.5">
                  {[{ icon: faDroplet, label: "Water" }, { icon: faEarthAmericas, label: "Carbon" }, { icon: faCar, label: "Transport" }].map((item) => (
                    <li key={item.label}>
                      <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium text-slate/30">
                        <FontAwesomeIcon icon={item.icon} className="h-3 w-3 shrink-0" aria-hidden />
                        {item.label}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
            <div className="border-t border-gray-200/80 p-2">
              <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <FontAwesomeIcon icon={faCircleUser} className="h-5 w-5 text-slate/40" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-medium text-charcoal">Demo User</div>
                  <div className="text-[9px] text-slate/60">Try the demo!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile tabs (browser window on small screens) */}
          <div className="flex w-full flex-col md:hidden">
            <div className="flex border-b border-gray-200 bg-white">
              {DEMO_NAV.map((item) => (
                <button key={item.page} type="button" onClick={() => navigateTo(item.page)}
                  className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[9px] font-medium transition-colors ${activePage === item.page ? "border-b-2 border-forest text-forest" : "text-slate/60"}`}>
                  <FontAwesomeIcon icon={item.icon} className="h-3 w-3" aria-hidden />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden">
              {PAGES.map((p) => (
                <div key={p} className="absolute inset-0 overflow-y-auto transition-opacity duration-300 ease-in-out" style={{ maxHeight: "520px", opacity: activePage === p ? 1 : 0, pointerEvents: activePage === p ? "auto" : "none" }}>
                  <PageContent page={p} state={sharedState} onLog={handleLog} compact={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop content */}
          <div className="relative hidden flex-1 overflow-hidden md:block">
            {PAGES.map((p) => (
              <div key={p} className="absolute inset-0 overflow-y-auto transition-opacity duration-300 ease-in-out" style={{ maxHeight: "560px", opacity: activePage === p ? 1 : 0, pointerEvents: activePage === p ? "auto" : "none" }}>
                <PageContent page={p} state={sharedState} onLog={handleLog} compact={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* ── iPhone mockup ──────────────────────────────────── */}
      <div className="hidden w-[220px] shrink-0 xl:block">
        <div className="relative mx-auto w-[220px] animate-gentle-float rounded-[2.5rem] border-[6px] border-gray-800 bg-gray-800 shadow-2xl">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2 z-30 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-black" />

          {/* Screen */}
          <div className="relative overflow-hidden rounded-[2rem] bg-white">
            {/* Status bar */}
            <div className="flex items-center justify-between bg-white px-5 pb-1 pt-8">
              <PhoneClock />
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-3 rounded-sm bg-charcoal/60" />
                <div className="h-1.5 w-1.5 rounded-full bg-charcoal/60" />
                <div className="h-2 w-4 rounded-sm border border-charcoal/60">
                  <div className="h-full w-3/4 rounded-sm bg-forest" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative h-[420px] overflow-hidden">
              {PAGES.map((p) => (
                <div key={p} className="absolute inset-0 h-[420px] overflow-y-auto transition-opacity duration-300 ease-in-out" style={{ opacity: phonePage === p ? 1 : 0, pointerEvents: phonePage === p ? "auto" : "none" }}>
                  <PageContent page={p} state={sharedState} onLog={handleLog} compact />
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              <div className="flex">
                {DEMO_NAV.map((item) => (
                  <button key={item.page} type="button" onClick={() => phoneNavigateTo(item.page)}
                    className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[7px] font-medium transition-colors ${phonePage === item.page ? "text-forest" : "text-slate/40"}`}>
                    <FontAwesomeIcon icon={item.icon} className="h-2.5 w-2.5" aria-hidden />
                    {item.label}
                    {phonePage === item.page && (
                      <motion.span
                        layoutId="phone-tab-indicator"
                        className="absolute -bottom-px left-1/4 right-1/4 h-[2px] rounded-full bg-forest"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="mx-auto mb-1 h-1 w-24 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page router ─────────────────────────────────────────── */

interface PageContentProps {
  page: DemoPage;
  state: DemoState;
  onLog: (category: string, label: string) => void;
  compact: boolean;
}

function PageContent({ page, state, onLog, compact }: PageContentProps) {
  switch (page) {
    case "dashboard": return <DashboardPage state={state} onLog={onLog} compact={compact} />;
    case "challenges": return <ChallengesPage state={state} onLog={onLog} compact={compact} />;
    case "leaderboard": return <LeaderboardPage state={state} compact={compact} />;
    case "badges": return <BadgesPage compact={compact} />;
  }
}

/* ── Dashboard page ──────────────────────────────────────── */

function DashboardPage({ state, onLog, compact }: { state: DemoState; onLog: (c: string, l: string) => void; compact: boolean }) {
  const { metrics, weeklyData, loggedCount, lastAction } = state;

  return (
    <div className={`relative bg-off-white ${compact ? "p-2" : "p-3 md:p-5"}`}>
      <Toast lastAction={lastAction} loggedCount={loggedCount} compact={compact} />

      {/* Quick actions */}
      <div className={`mb-2 flex flex-wrap ${compact ? "gap-1" : "gap-1.5"}`}>
        {LOG_ACTIONS.map((action) => (
          <motion.button key={action.category} type="button" onClick={() => onLog(action.category, action.label)}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={`inline-flex items-center gap-0.5 rounded-md font-medium transition-colors duration-200 ${action.color} ${compact ? "px-1.5 py-0.5 text-[7px]" : "gap-1 rounded-lg px-2.5 py-1 text-[10px]"}`}>
            <FontAwesomeIcon icon={action.icon} className={compact ? "h-2 w-2" : "h-2.5 w-2.5"} />
            <FontAwesomeIcon icon={faPlus} className={compact ? "h-1 w-1" : "h-1.5 w-1.5"} />
            {compact ? action.label.replace("Log ", "") : action.label}
          </motion.button>
        ))}
        {!compact && <span className="self-center text-[9px] text-slate/50 italic">Try clicking these!</span>}
      </div>

      {/* Metrics */}
      <div className={`mb-2 grid gap-1.5 ${compact ? "grid-cols-2" : "grid-cols-2 gap-2 lg:grid-cols-3"}`}>
        {(compact ? metrics.slice(0, 4) : metrics).map((m) => (
          <DemoMetricCard key={m.label} {...m} compact={compact} />
        ))}
      </div>

      {/* Desktop charts */}
      {!compact && (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <ChartCard title="This Week's Impact" subtitle="Your daily savings across categories">
            <div>
              <ResponsiveContainer width="100%" height={144}>
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#6C757D" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#6C757D" }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "10px" }} />
                  <Area type="monotone" dataKey="water" name="Water (L)" stroke="#1B4965" fill="#1B4965" fillOpacity={0.1} strokeWidth={2} animationDuration={400} />
                  <Area type="monotone" dataKey="carbon" name="Carbon (kg)" stroke="#2D6A4F" fill="#2D6A4F" fillOpacity={0.1} strokeWidth={2} animationDuration={400} />
                  <Area type="monotone" dataKey="plastic" name="Plastic (items)" stroke="#FFB703" fill="#FFB703" fillOpacity={0.1} strokeWidth={2} animationDuration={400} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
          <ChartCard title="Transport CO2 Comparison" subtitle="kg CO2 per 10km journey">
            <div>
              <ResponsiveContainer width="100%" height={144}>
                <BarChart data={TRANSPORT_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: "#6C757D" }} axisLine={false} tickLine={false} unit=" kg" />
                  <YAxis type="category" dataKey="mode" tick={{ fontSize: 9, fill: "#6C757D" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "10px" }} formatter={(value) => [`${value} kg CO2`, "Emissions"]} />
                  <Bar dataKey="co2" radius={[0, 4, 4, 0]} barSize={12}>
                    {TRANSPORT_DATA.map((entry) => (<Cell key={entry.mode} fill={entry.color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      )}

      {/* Phone chart */}
      {compact && (
        <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
          <h3 className="mb-1 text-[8px] font-semibold text-charcoal">Weekly Impact</h3>
          <div>
            <ResponsiveContainer width="100%" height={96}>
              <AreaChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 7, fill: "#6C757D" }} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="water" stroke="#1B4965" fill="#1B4965" fillOpacity={0.1} strokeWidth={1.5} animationDuration={400} />
                <Area type="monotone" dataKey="carbon" stroke="#2D6A4F" fill="#2D6A4F" fillOpacity={0.1} strokeWidth={1.5} animationDuration={400} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Challenges page ─────────────────────────────────────── */

function ChallengesPage({ state, onLog, compact }: { state: DemoState; onLog: (c: string, l: string) => void; compact: boolean }) {
  const { challengeProgress, loggedCount, lastAction } = state;

  return (
    <div className={`relative bg-off-white ${compact ? "p-2" : "p-3 md:p-5"}`}>
      <Toast lastAction={lastAction} loggedCount={loggedCount} compact={compact} />

      <div className={`flex items-center gap-1.5 ${compact ? "mb-1.5" : "mb-3"}`}>
        <div className={`flex items-center justify-center rounded-lg bg-forest/10 ${compact ? "h-5 w-5" : "h-7 w-7"}`}>
          <FontAwesomeIcon icon={faBullseye} className={`text-forest ${compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`} aria-hidden />
        </div>
        <div>
          <h2 className={`font-bold text-charcoal ${compact ? "text-[10px]" : "text-sm"}`}>Active Challenges</h2>
          {!compact && <p className="text-[9px] text-slate">Join challenges and log activities to progress</p>}
        </div>
      </div>

      <div className={`grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-1 gap-2.5 lg:grid-cols-2"}`}>
        {(compact ? MOCK_CHALLENGES.slice(0, 2) : MOCK_CHALLENGES).map((ch) => {
          const extra = challengeProgress[ch.category] || 0;
          const curr = ch.baseProgress + extra;
          const pct = Math.min(100, Math.round((curr / ch.target) * 100));
          const done = pct >= 100;

          return (
            <Card key={ch.title} variant="interactive" className={`relative overflow-hidden ${compact ? "p-2" : "p-3"}`}>
              <div className="mb-1.5 flex items-start justify-between gap-1">
                <div className="flex items-center gap-1.5">
                  <div className={`flex items-center justify-center rounded-lg ${ch.iconBg} ${compact ? "h-5 w-5" : "h-7 w-7"}`}>
                    <FontAwesomeIcon icon={ch.icon} className={`${ch.iconColor} ${compact ? "h-2 w-2" : "h-3 w-3"}`} aria-hidden />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-charcoal ${compact ? "text-[8px]" : "text-[11px]"}`}>{ch.title}</h3>
                    {!compact && <p className="text-[9px] text-slate">{ch.description}</p>}
                  </div>
                </div>
                {!compact && <Badge variant="neutral" size="sm"><span className="text-[8px]">{ch.participants} joined</span></Badge>}
              </div>

              <div className={`mb-1 flex items-center justify-between ${compact ? "text-[7px]" : "text-[9px]"}`}>
                <span className="text-slate">{ch.startDate} – {ch.endDate}</span>
                {done ? <span className="font-medium text-forest">Complete!</span> : <span className="font-medium text-charcoal">{curr} / {ch.target}</span>}
              </div>
              <ProgressBar value={pct} color={done ? "forest" : "ocean"} size="sm" />

              {ch.joined && !done && (
                <motion.button type="button" onClick={() => onLog(ch.category, ch.title)}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`mt-1.5 inline-flex items-center gap-0.5 rounded-md bg-forest/10 font-medium text-forest transition-colors hover:bg-forest/20 ${compact ? "px-1.5 py-0.5 text-[7px]" : "gap-1 px-2 py-1 text-[9px]"}`}>
                  <FontAwesomeIcon icon={faPlus} className={compact ? "h-1.5 w-1.5" : "h-2 w-2"} />
                  Log progress
                </motion.button>
              )}
              {!ch.joined && (
                <motion.button type="button" onClick={() => onLog(ch.category, ch.title)}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={`mt-1.5 inline-flex items-center rounded-md bg-forest font-medium text-white transition-colors hover:bg-forest-dark ${compact ? "px-1.5 py-0.5 text-[7px]" : "gap-1 px-2.5 py-1 text-[9px]"}`}>
                  Join Challenge
                </motion.button>
              )}
              {done && (
                <div className={`mt-1.5 flex items-center gap-1 font-medium text-forest ${compact ? "text-[7px]" : "text-[9px]"}`}>
                  <FontAwesomeIcon icon={faCircleCheck} className={compact ? "h-2 w-2" : "h-3 w-3"} />
                  Complete! +50 pts
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ── Leaderboard page ────────────────────────────────────── */

function LeaderboardPage({ state, compact }: { state: DemoState; compact: boolean }) {
  const [period, setPeriod] = useState<"all" | "month" | "week">("all");

  const board = MOCK_LEADERBOARD
    .map((e) => (e.isYou ? { ...e, points: state.leaderboardPoints } : e))
    .sort((a, b) => b.points - a.points)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const rows = compact ? board.slice(0, 5) : board;

  return (
    <div className={`bg-off-white ${compact ? "p-2" : "p-3 md:p-5"}`}>
      <div className={`flex items-center justify-between ${compact ? "mb-1.5" : "mb-3"}`}>
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center justify-center rounded-lg bg-sunshine/15 ${compact ? "h-5 w-5" : "h-7 w-7"}`}>
            <FontAwesomeIcon icon={faTrophy} className={`text-amber-600 ${compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`} aria-hidden />
          </div>
          <h2 className={`font-bold text-charcoal ${compact ? "text-[10px]" : "text-sm"}`}>Leaderboard</h2>
        </div>
        {!compact && (
          <div className="flex gap-1">
            {(["all", "month", "week"] as const).map((p) => (
              <button key={p} type="button" onClick={() => setPeriod(p)}
                className={`rounded-md px-2 py-1 text-[9px] font-medium transition-colors ${period === p ? "bg-forest text-white" : "bg-gray-100 text-slate hover:bg-gray-200"}`}>
                {p === "all" ? "All Time" : p === "month" ? "Month" : "Week"}
              </button>
            ))}
          </div>
        )}
      </div>

      <Card variant="default" className="overflow-hidden p-0">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className={`font-semibold uppercase tracking-wider text-slate/60 ${compact ? "px-2 py-1 text-[7px]" : "px-3 py-2 text-[9px]"}`}>#</th>
              <th className={`font-semibold uppercase tracking-wider text-slate/60 ${compact ? "px-2 py-1 text-[7px]" : "px-3 py-2 text-[9px]"}`}>Member</th>
              <th className={`text-right font-semibold uppercase tracking-wider text-slate/60 ${compact ? "px-2 py-1 text-[7px]" : "px-3 py-2 text-[9px]"}`}>Points</th>
              {!compact && (
                <>
                  <th className="hidden px-3 py-2 text-right text-[9px] font-semibold uppercase tracking-wider text-slate/60 sm:table-cell">Streak</th>
                  <th className="hidden px-3 py-2 text-right text-[9px] font-semibold uppercase tracking-wider text-slate/60 sm:table-cell">Badges</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.name}
                className={`border-b border-gray-50 transition-colors ${e.isYou ? "bg-forest/5" : "hover:bg-gray-50"}`}>
                <td className={`font-bold text-charcoal ${compact ? "px-2 py-1 text-[8px]" : "px-3 py-2 text-[11px]"}`}>
                  {e.rank <= 3 ? (
                    <span className={e.rank === 1 ? "text-amber-500" : e.rank === 2 ? "text-gray-400" : "text-amber-700"}>
                      <FontAwesomeIcon icon={faTrophy} className={compact ? "h-2 w-2" : "h-3 w-3"} />
                    </span>
                  ) : e.rank}
                </td>
                <td className={compact ? "px-2 py-1" : "px-3 py-2"}>
                  <div className="flex items-center gap-1">
                    <span className={`font-medium text-charcoal ${compact ? "text-[8px]" : "text-[11px]"}`}>
                      {compact && e.name.length > 10 ? e.name.slice(0, 10) + "…" : e.name}
                    </span>
                    {e.isYou && <Badge variant="success" size="sm"><span className={compact ? "text-[6px]" : "text-[8px]"}>You</span></Badge>}
                  </div>
                </td>
                <td className={`text-right font-semibold text-charcoal ${compact ? "px-2 py-1 text-[8px]" : "px-3 py-2 text-[11px]"}`}>
                  {e.points.toLocaleString()}
                </td>
                {!compact && (
                  <>
                    <td className="hidden px-3 py-2 text-right sm:table-cell">
                      {e.streak > 0 && <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600"><FontAwesomeIcon icon={faFire} className="h-2.5 w-2.5" />{e.streak}d</span>}
                    </td>
                    <td className="hidden px-3 py-2 text-right sm:table-cell">
                      <Badge variant="neutral" size="sm"><span className="text-[8px]">{e.badges}</span></Badge>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className={`mt-1.5 text-center italic text-slate/50 ${compact ? "text-[7px]" : "mt-2 text-[9px]"}`}>
        Log activities to earn points and climb the ranks!
      </p>
    </div>
  );
}

/* ── Badges page ─────────────────────────────────────────── */

function BadgesPage({ compact }: { compact: boolean }) {
  const earned = MOCK_BADGES.filter((b) => b.earned).length;
  const display = compact ? MOCK_BADGES.slice(0, 4) : MOCK_BADGES;
  const cats = [...new Set(display.map((b) => b.category))];

  return (
    <div className={`bg-off-white ${compact ? "p-2" : "p-3 md:p-5"}`}>
      <div className={`flex items-center justify-between ${compact ? "mb-1.5" : "mb-3"}`}>
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center justify-center rounded-lg bg-purple-100 ${compact ? "h-5 w-5" : "h-7 w-7"}`}>
            <FontAwesomeIcon icon={faMedal} className={`text-purple-700 ${compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`} aria-hidden />
          </div>
          <h2 className={`font-bold text-charcoal ${compact ? "text-[10px]" : "text-sm"}`}>Your Badges</h2>
        </div>
        <Badge variant="success" size="sm">
          <span className={compact ? "text-[7px]" : "text-[9px]"}>{earned} / {MOCK_BADGES.length}</span>
        </Badge>
      </div>

      {cats.map((cat) => (
        <div key={cat} className={compact ? "mb-2" : "mb-3"}>
          <h3 className={`mb-1 font-semibold uppercase tracking-wider text-slate/60 ${compact ? "text-[7px]" : "text-[10px] mb-1.5"}`}>{cat}</h3>
          <div className={`grid gap-1.5 ${compact ? "grid-cols-1" : "grid-cols-1 gap-2 lg:grid-cols-2"}`}>
            {display.filter((b) => b.category === cat).map((badge) => (
              <Card key={badge.name} variant="default" className={`${compact ? "p-1.5" : "p-2.5"} ${!badge.earned ? "opacity-70" : ""}`}>
                <div className={`flex items-start ${compact ? "gap-1.5" : "gap-2.5"}`}>
                  <div className={`flex shrink-0 items-center justify-center rounded-lg ${badge.earned ? "bg-forest/10" : "bg-gray-100"} ${compact ? "h-6 w-6" : "h-8 w-8"}`}>
                    <FontAwesomeIcon icon={badge.icon} className={`${badge.earned ? "text-forest" : "text-gray-400"} ${compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className={`font-semibold text-charcoal ${compact ? "text-[8px]" : "text-[11px]"}`}>{badge.name}</span>
                      <span className={`rounded-full px-1 py-0.5 font-medium ${RARITY_COLORS[badge.rarity]} ${compact ? "text-[6px]" : "text-[8px] px-1.5"}`}>{badge.rarity}</span>
                    </div>
                    <p className={`text-slate ${compact ? "text-[7px]" : "text-[9px]"}`}>{badge.description}</p>
                    {badge.earned && badge.earnedDate && (
                      <p className={`text-forest ${compact ? "mt-0.5 text-[6px]" : "mt-0.5 text-[8px]"}`}>Earned {badge.earnedDate}</p>
                    )}
                    {!badge.earned && badge.progress !== undefined && (
                      <div className="mt-1"><ProgressBar value={badge.progress} color="ocean" size="sm" showLabel /></div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Shared UI ────────────────────────────────────────────── */

function Toast({ lastAction, loggedCount, compact }: { lastAction: string | null; loggedCount: number; compact: boolean }) {
  return (
    <AnimatePresence>
      {lastAction && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: -12, x: "-50%", scale: 0.95 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className={`absolute left-1/2 top-1 z-20 rounded-lg border border-green-200 bg-green-50 shadow-md ${compact ? "px-2 py-1" : "px-3 py-1.5"}`}
        >
          <div className={`flex items-center gap-1 font-medium text-green-700 ${compact ? "text-[7px]" : "gap-1.5 text-[10px]"}`}>
            <FontAwesomeIcon icon={faCircleCheck} className={compact ? "h-2 w-2" : "h-3 w-3"} />
            {lastAction} saved! ({loggedCount})
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <h3 className="mb-0.5 text-xs font-semibold text-charcoal">{title}</h3>
      <p className="mb-2 text-[9px] text-slate">{subtitle}</p>
      {children}
    </div>
  );
}

function DemoMetricCard({ icon, label, humanValue, comparison, iconBg, iconColor, accentBorder, trend, compact }: MetricCard & { compact: boolean }) {
  return (
    <Card variant="interactive" className={`relative overflow-hidden ${compact ? "p-1.5" : "p-2.5 md:p-3"}`}>
      <div className={`absolute inset-y-0 left-0 ${compact ? "w-[2px]" : "w-[3px]"} ${accentBorder}`} />

      {!compact && trend !== 0 && (
        <div className="absolute right-1.5 top-1.5">
          <Badge variant={trend > 0 ? "success" : "danger"} size="sm">
            <FontAwesomeIcon icon={trend > 0 ? faArrowTrendUp : faArrowTrendDown} className="h-2 w-2" aria-hidden />
            {trend > 0 ? "+" : ""}{trend}%
          </Badge>
        </div>
      )}
      {!compact && trend === 0 && (
        <div className="absolute right-1.5 top-1.5">
          <Badge variant="neutral" size="sm">No change</Badge>
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <div className={`flex items-center justify-center rounded-lg ${iconBg} ${compact ? "mb-1 h-5 w-5" : "mb-1.5 h-7 w-7"}`}>
          <FontAwesomeIcon icon={icon} className={`${iconColor} ${compact ? "h-2 w-2" : "h-3 w-3"}`} aria-hidden />
        </div>
        <div className={`font-medium uppercase tracking-wider text-slate/60 ${compact ? "text-[6px]" : "mb-0.5 text-[8px]"}`}>{label}</div>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={humanValue}
            initial={{ scale: 1.08, color: "#2D6A4F" }}
            animate={{ scale: 1, color: "#212529" }}
            transition={{ duration: 0.4 }}
            className={`font-bold ${compact ? "text-[8px]" : "mb-0.5 text-xs md:text-sm"}`}
          >
            {humanValue}
          </motion.div>
        </AnimatePresence>
        {!compact && <div className="text-[9px] leading-tight text-slate">{comparison}</div>}
      </div>
    </Card>
  );
}
