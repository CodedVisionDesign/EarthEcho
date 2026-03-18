export interface TourStep {
  id: string;
  /** data-tour-step attribute value to find the target element */
  target: string;
  title: string;
  description: string;
  /** Where to place the tooltip relative to the target */
  placement: "top" | "bottom" | "left" | "right";
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "sidebar-nav",
    target: "sidebar-nav",
    title: "Navigation",
    description:
      "Use the sidebar to move between sections. Track your water, carbon, plastic, recycling, transport, and fashion impact.",
    placement: "right",
  },
  {
    id: "quick-actions",
    target: "quick-actions",
    title: "Quick Actions",
    description:
      "Tap these buttons to quickly log an eco-action. Each entry earns you points!",
    placement: "bottom",
  },
  {
    id: "impact-cards",
    target: "impact-cards",
    title: "Your Impact",
    description:
      "These cards show your total environmental impact across all categories. Watch them grow as you log more actions.",
    placement: "top",
  },
  {
    id: "challenges-link",
    target: "challenges-link",
    title: "Challenges",
    description:
      "Join monthly challenges to compete with the community and earn bonus points.",
    placement: "right",
  },
  {
    id: "leaderboard-link",
    target: "leaderboard-link",
    title: "Leaderboard",
    description:
      "See how you rank against other eco-warriors. Log actions and complete challenges to climb higher!",
    placement: "right",
  },
  {
    id: "profile-link",
    target: "profile-link",
    title: "Your Profile",
    description:
      "View your profile, update your settings, and see all your earned badges.",
    placement: "top",
  },
];

export const TOUR_POINTS = 25;
