// Activity categories (SQLite doesn't support enums, so we define them here)
export const ACTIVITY_CATEGORIES = [
  "WATER",
  "CARBON",
  "PLASTIC",
  "RECYCLING",
  "TRANSPORT",
  "FASHION",
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export interface HumanMetric {
  value: string;
  comparison: string;
  icon: string;
}

export interface DashboardCategory {
  category: ActivityCategory;
  label: string;
  description: string;
  color: string;
  totalValue: number;
  humanMetric: HumanMetric;
  trend: number; // percentage change vs previous period
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  image: string | null;
  totalPoints: number;
  badges: number;
}

export interface ChallengeProgress {
  challengeId: string;
  title: string;
  description: string;
  category: ActivityCategory;
  communityProgress: number; // percentage
  userProgress: number; // percentage
  daysRemaining: number;
  participantCount: number;
}

export interface TransportJourney {
  mode: string;
  distanceKm: number;
  co2Kg: number;
  co2SavedKg: number;
  date: Date;
}

export interface JourneyComparison {
  mode: string;
  modeName: string;
  co2Kg: number;
  savingsVsCar: number;
  icon: string;
}
