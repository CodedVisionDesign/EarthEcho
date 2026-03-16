import type { ActivityCategory } from "@/generated/prisma";

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
