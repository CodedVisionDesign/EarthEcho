# CarbonFootprint - Design Document

## Vision

A visually engaging, gamified platform that makes environmental impact tracking **fun, understandable, and actionable** for everyone — not just eco-enthusiasts.

---

## Core Design Principles

1. **Human First**: Numbers mean nothing without context. Always show relatable comparisons.
2. **Progressive Engagement**: Easy to start (log one thing), rewarding to continue (streaks, badges).
3. **Community Driven**: Environmental action is more sustainable when shared.
4. **Actionable**: Every metric links to advice on how to improve.

---

## Page-by-Page Design

### 1. Landing Page (`/`)
- Hero section: "Track Your Impact. Change Your World."
- Quick stats: community-wide impact (e.g., "Together we've saved 50 swimming pools of water")
- CTA: Sign up / Login
- Feature highlights: Dashboard, Forum, Challenges
- Testimonials section

### 2. Dashboard (`/dashboard`)
**The heart of the app.** A single-page overview of the user's environmental impact.

**Layout**: Grid of cards, each representing a category:

```
┌─────────────────────────────────────────────────┐
│  Welcome back, [Name]!         🔥 12-day streak │
│  Your impact this month:                        │
├────────────────┬────────────────┬───────────────┤
│  💧 Water      │  🌍 Carbon     │  ♻️ Recycling  │
│  Saved 3       │  Reduced by    │  Recycled     │
│  bathtubs      │  2 car trips   │  enough to    │
│  this week     │  worth         │  save 1 tree  │
│  [Chart ↗]     │  [Chart ↗]     │  [Chart ↗]    │
├────────────────┼────────────────┼───────────────┤
│  🛍️ Plastic    │  👗 Fashion     │  🏆 Challenge │
│  Avoided 40    │  3 Vinted      │  "Walk Week"  │
│  shopping bags │  purchases =   │  Day 4 of 7   │
│  this month    │  15kg CO2      │  [Progress ▓▓░]│
│                │  avoided       │               │
├────────────────┴────────────────┴───────────────┤
│  📊 Overall Impact Trend (Line Chart)           │
│  [============================]                 │
│  Shows monthly progress across all categories   │
├─────────────────────────────────────────────────┤
│  🏅 Recent Badges    │  📢 Community Highlights  │
│  [Water Saver III]   │  "Sarah completed the     │
│  [Streak Master]     │   Plastic-Free challenge!" │
└─────────────────────────────────────────────────┘
```

**Key Features**:
- Animated counters on page load
- Colour-coded progress (green = good, amber = average, red = needs work)
- Click any card to drill into detailed tracking
- Time period toggle: Week / Month / Year / All Time

### 3. Tracking Pages (`/track/*`)
Individual pages for each category with:
- **Quick Log Form**: "How many plastic bags did you avoid today?" with +/- buttons
- **History Table**: Past entries with edit/delete
- **Category Chart**: Trend over time (line/bar chart)
- **Tips Section**: "Did you know? Using a reusable water bottle saves X bottles per year"
- **Human-readable impact**: Running total in relatable terms

### 4. Forum (`/forum`)
- Thread list with categories: Tips, Challenges, Wins, Questions
- Thread view with replies
- Upvote/downvote system
- User badges displayed next to names
- "Cheer" reaction (like but eco-themed)
- Pinned threads for monthly challenges

### 5. Challenges (`/challenges`)
- Active challenge with description and progress
- Community progress bar ("Together we're 65% there!")
- Past challenges with completion status
- Upcoming challenges preview
- Challenge-specific leaderboard

### 6. Leaderboard (`/leaderboard`)
- Top users by total points
- Filter by: This Week / This Month / All Time
- Category-specific leaderboards (Water Champion, Recycling Star, etc.)
- User's own ranking highlighted
- Anonymous mode option (show rank without name)

### 7. Badges (`/badges`)
- Grid of all available badges
- Earned badges highlighted with date earned
- Locked badges show requirements
- Progress toward next badge
- Rarity indicator (how many users have each badge)

### 8. Resources (`/resources`)
- Categorised list of useful websites and organisations
- Categories: Energy, Water, Recycling, Transport, Shopping, Food Waste
- Each resource: Name, description, link, category tag
- Admin-curated (not user-submitted)
- Search and filter functionality

### 9. Profile (`/profile`)
- User info (name, avatar, email)
- Account settings
- Privacy controls
- Impact summary (total lifetime stats)
- Badge showcase (pick 3 featured badges)
- Public profile toggle

---

## Colour Palette

| Use | Colour | Hex |
|-----|--------|-----|
| Primary | Forest Green | `#2D6A4F` |
| Secondary | Ocean Blue | `#1B4965` |
| Accent | Sunshine Yellow | `#FFB703` |
| Success | Leaf Green | `#52B788` |
| Warning | Amber | `#FB8500` |
| Danger | Coral Red | `#E63946` |
| Background | Off White | `#F8F9FA` |
| Card Background | White | `#FFFFFF` |
| Text Primary | Dark Charcoal | `#212529` |
| Text Secondary | Slate Grey | `#6C757D` |

---

## Typography

- **Headings**: Inter (clean, modern, excellent readability)
- **Body**: Inter
- **Numbers/Stats**: Tabular numbers for dashboard alignment
- **Metric Comparisons**: Slightly larger weight, primary colour

---

## Responsive Design

- **Desktop**: Full dashboard grid (3 columns)
- **Tablet**: 2-column grid
- **Mobile**: Single column, swipeable cards
- **Navigation**: Sidebar on desktop, bottom nav on mobile

---

## Database Schema Overview

### Core Tables
- `User` — accounts, profiles, settings
- `Account` — OAuth provider links (Auth.js)
- `Session` — user sessions (Auth.js)
- `Activity` — individual tracking entries (water, plastic, etc.)
- `Category` — activity categories with conversion factors

### Gamification Tables
- `Badge` — badge definitions (name, description, criteria)
- `UserBadge` — earned badges per user
- `Challenge` — monthly challenge definitions
- `ChallengeParticipant` — user challenge progress
- `Points` — point transaction log

### Forum Tables
- `Thread` — forum threads
- `Reply` — thread replies
- `Reaction` — upvotes/cheers

### Support Tables
- `Resource` — signposted websites
- `MetricConversion` — human-readable conversion factors

---

## MVP Scope (Phase 1)

**In Scope**:
- User registration (email + Google OAuth)
- Dashboard with 3 categories (Water, Plastic, Carbon)
- Basic tracking (log daily activities)
- Human-readable metric conversions
- Basic profile page
- Resources page (static links)

**Phase 2** (post-MVP):
- Facebook OAuth
- Forum
- Badges and points
- Leaderboard
- Monthly challenges
- Recycling and Fashion tracking

**Phase 3**:
- Email reports
- Social sharing
- Household mode
- PWA
