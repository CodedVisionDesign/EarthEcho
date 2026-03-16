import { ImpactSummaryCard } from "@/components/charts/ImpactSummaryCard";
import { WeeklyTrendChart } from "@/components/charts/WeeklyTrendChart";
import { TransportComparisonChart } from "@/components/charts/TransportComparisonChart";

// Demo data — will be replaced with real DB queries
const IMPACT_CARDS = [
  {
    icon: "\u{1F4A7}",
    label: "Water Saved",
    humanValue: "3 bathtubs",
    comparison: "That's about 240 litres this week",
    color: "text-ocean",
    trend: 12,
  },
  {
    icon: "\u{1F30D}",
    label: "Carbon Reduced",
    humanValue: "5 car commutes",
    comparison: "17.5 kg CO2 avoided this week",
    color: "text-forest",
    trend: 8,
  },
  {
    icon: "\u{1F6CD}\u{FE0F}",
    label: "Plastic Avoided",
    humanValue: "1 bin bag",
    comparison: "37 single-use items kept out of landfill",
    color: "text-amber",
    trend: -3,
  },
  {
    icon: "\u{267B}\u{FE0F}",
    label: "Recycling Impact",
    humanValue: "0.5 trees saved",
    comparison: "30 kg of materials recycled",
    color: "text-leaf",
    trend: 15,
  },
  {
    icon: "\u{1F697}",
    label: "Transport Savings",
    humanValue: "12 car-free km",
    comparison: "By cycling and walking instead of driving",
    color: "text-ocean-light",
    trend: 22,
  },
  {
    icon: "\u{1F457}",
    label: "Fashion Impact",
    humanValue: "3 secondhand items",
    comparison: "24 kg CO2 avoided vs buying new",
    color: "text-forest-light",
    trend: 0,
  },
];

const RECENT_BADGES = [
  { name: "Week Warrior", icon: "\u{1F525}", earnedAgo: "2 days ago" },
  { name: "Water Watcher", icon: "\u{1F4A7}", earnedAgo: "5 days ago" },
  { name: "Pedal Power", icon: "\u{1F6B2}", earnedAgo: "1 week ago" },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">
            Welcome back! {"\u{1F44B}"}
          </h1>
          <p className="mt-1 text-sm text-slate">
            Here&apos;s your environmental impact this week
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2">
          <span>{"\u{1F525}"}</span>
          <span className="text-sm font-semibold text-amber-700">
            12-day streak
          </span>
        </div>
      </div>

      {/* Impact Cards Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {IMPACT_CARDS.map((card) => (
          <ImpactSummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WeeklyTrendChart />
        <TransportComparisonChart />
      </div>

      {/* Bottom Row: Badges + Active Challenge */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Badges */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-charcoal">
            Recent Badges
          </h3>
          <div className="space-y-3">
            {RECENT_BADGES.map((badge) => (
              <div
                key={badge.name}
                className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="text-sm font-medium text-charcoal">
                    {badge.name}
                  </div>
                  <div className="text-xs text-slate">
                    Earned {badge.earnedAgo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Challenge */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-charcoal">
            Active Challenge
          </h3>
          <div className="rounded-lg bg-gradient-to-r from-forest to-ocean p-5 text-white">
            <div className="mb-2 text-xs font-medium text-white/70">
              March 2026
            </div>
            <div className="mb-1 text-lg font-bold">
              {"\u{1F6B6}"} Car-Free Commute Week
            </div>
            <div className="mb-4 text-sm text-white/80">
              Use alternatives to driving for 5 work days
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="mb-1 flex justify-between text-xs">
                <span>Your progress</span>
                <span>3 / 5 days</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-sunshine"
                  style={{ width: "60%" }}
                />
              </div>
            </div>

            {/* Community Progress */}
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span>Community</span>
                <span>234 participants</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-leaf"
                  style={{ width: "45%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
