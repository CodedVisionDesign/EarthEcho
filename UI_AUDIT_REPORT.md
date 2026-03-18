# Earth Echo — Comprehensive UI/UX Audit & App Readiness Report

**Date:** 2026-03-18
**Scope:** Mobile UX, alignment, centering, iconography, onboarding, gamification, notifications, social features, app store readiness
**Approach:** Research & planning only — no code changes

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Mobile UI/UX Issues](#2-mobile-uiux-issues)
3. [Alignment & Centering Audit](#3-alignment--centering-audit)
4. [Iconography Audit](#4-iconography-audit)
5. [Onboarding Flow Analysis](#5-onboarding-flow-analysis)
6. [Tracking Areas Analysis](#6-tracking-areas-analysis)
7. [Notification System Analysis](#7-notification-system-analysis)
8. [Gamification Analysis](#8-gamification-analysis)
9. [Social Features Analysis](#9-social-features-analysis)
10. [App Store Readiness](#10-app-store-readiness)
11. [Best Practice Recommendations](#11-best-practice-recommendations)
12. [Prioritised Action Plan](#12-prioritised-action-plan)

---

## 1. Executive Summary

**Earth Echo** is a Next.js 16 + React 19 + Tailwind CSS 4 environmental impact tracker with gamification, community features, and PWA capabilities. The project is architecturally mature (166 TSX files, 40+ routes, 80+ components) with strong foundations in colour theming, animation, and server-side rendering.

### Key Findings

| Area | Score | Verdict |
|------|-------|---------|
| Mobile responsiveness | 6/10 | Functional but not native-feeling |
| Alignment & centering | 7/10 | Mostly consistent, a few outliers |
| Iconography consistency | 6/10 | Dual library issue (FA7 + Lucide), sizing inconsistencies |
| Onboarding flow | 7/10 | Good structure, missing key engagement hooks |
| Gamification | 8/10 | Comprehensive — points, badges, streaks, challenges, leaderboard |
| Notifications | 7/10 | Multi-channel (in-app, push, email) but triggers limited |
| Social features | 6/10 | Forum exists but no sharing, friends, or teams |
| App store readiness | 3/10 | PWA partial, no native bridge, missing assets |

### Critical Gaps
1. **No bottom tab navigation** — sidebar pattern is web-native, not app-native
2. **No offline support** — service worker has no fetch handler
3. **Dual icon libraries** — FontAwesome 7 AND Lucide React cause visual inconsistency
4. **No gesture support** — no swipe-back, pull-to-refresh, or haptics
5. **Missing icon assets** — manifest references files that don't exist
6. **No social sharing** — no share-to-social or share-to-app functionality

---

## 2. Mobile UI/UX Issues

### 2.1 Navigation Pattern

**Current:** Hamburger menu (top-left) + sidebar overlay on mobile
**Problem:** Sidebar navigation is a desktop pattern. Mobile apps universally use bottom tab bars (iOS HIG, Material Design 3).

**DESIGN.md spec says:** "Navigation: Sidebar on desktop, bottom nav on mobile"
**Reality:** Bottom nav was never implemented.

**Recommendation:**
```
Bottom Tab Bar (5 tabs max):
┌──────┬──────┬──────┬──────┬──────┐
│ Home │ Track│Commu-│Badge │ More │
│  🏠  │  📊  │nity 🌍│  🏅  │  ≡   │
└──────┴──────┴──────┴──────┴──────┘
```

- "Home" → Dashboard
- "Track" → Category picker or last-used category
- "Community" → Challenges + Forum + Leaderboard
- "Badges" → Badge collection
- "More" → Profile, Guides, Resources, Settings

### 2.2 Touch Targets

**Current:** Minimum 40×40px (`h-10 w-10`) for icon buttons
**Standard:** Apple HIG requires 44×44pt minimum; Material Design requires 48×48dp

**Issues found:**
- Badge component `sm` size: `px-2 py-0.5 text-[10px]` — too small for touch
- Forum reaction buttons may be below 44pt
- Sidebar nav items: `px-3 py-2` — vertical hit area ~32px, needs `py-3` minimum

### 2.3 Safe Area Handling

**Current:** `viewportFit: "cover"` is set, which is correct.
**Missing:**
- No `env(safe-area-inset-top)` padding on fixed headers
- No `env(safe-area-inset-bottom)` on bottom-positioned elements
- iPhone notch/Dynamic Island could overlap the hamburger menu
- Home indicator bar on iPhone could overlap bottom content

### 2.4 Spacing & Content Width

**Current:** Content fills full width on mobile (`grid-cols-1`)
**Issues:**
- No max-width constraint on tablets — content stretches on iPad
- Impact cards at full width on mobile lack breathing room (need `mx-4` or `px-4`)
- Forum thread cards may have cramped text at 320px viewport

### 2.5 Scroll & Gesture Behaviour

**Missing entirely:**
- Pull-to-refresh on dashboard and activity lists
- Swipe-to-delete on activity history items
- Swipe-back navigation between routes
- Momentum scrolling indicators
- Skeleton loading states (some pages jump when data loads)

### 2.6 Typography on Mobile

**Current:** Responsive text sizes (`text-xl sm:text-2xl`)
**Issues:**
- Body text at `text-sm` (14px) — acceptable but `text-base` (16px) is iOS default and prevents zoom on inputs
- Input font size below 16px causes iOS Safari to auto-zoom on focus
- Section headers at `text-[11px] uppercase tracking-wider` may be hard to read on small screens

---

## 3. Alignment & Centering Audit

### 3.1 Consistent Patterns (Good)

- Buttons: `inline-flex items-center justify-center` ✅
- Icon containers: `flex h-10 w-10 items-center justify-center rounded-xl` ✅
- Card headers: `flex items-center gap-3` ✅
- Page headers: Consistent `text-2xl font-bold` ✅

### 3.2 Inconsistencies Found

| Location | Issue | Fix |
|----------|-------|-----|
| **Sidebar** | Inline styles for glass effect mixed with Tailwind classes | Extract to Tailwind custom utility |
| **MagicCard** | Hardcoded `768px` breakpoint instead of Tailwind `md:` | Use Tailwind breakpoint |
| **Impact cards** | Icon container sizes vary: `h-10 w-10` vs `h-4.5 w-4.5` | Standardise to design token |
| **Notification panel** | Mobile uses `inset-x-3`, desktop uses fixed width `w-[28rem]` | Use consistent responsive pattern |
| **Dashboard greeting** | Streak badge vertically misaligned with name on some viewports | Wrap in `items-center` flex container |
| **Leaderboard table** | Column headers not aligned with cell content on narrow viewports | Add `text-left` and consistent padding |

### 3.3 Spacing Scale Inconsistencies

The project uses Tailwind's spacing scale but with some custom half-steps:
- `gap-1.5`, `gap-2.5`, `mb-1.5`, `py-2.5` — these are fine (Tailwind 4 supports them)
- `text-[11px]`, `text-[10px]` — arbitrary values should be design tokens
- Padding on cards: mix of `p-5`, `p-6`, `p-8` — should standardise to 2-3 card padding variants

---

## 4. Iconography Audit

### 4.1 Current State: Dual Icon Library Problem

**Library 1:** FontAwesome 7.2.0 (95+ icons registered in `fontawesome.ts`)
- Packages: `@fortawesome/fontawesome-svg-core`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/free-regular-svg-icons`, `@fortawesome/free-brands-svg-icons`
- Usage: Via `<FontAwesomeIcon>` component and custom `<Icon>` wrapper

**Library 2:** Lucide React 0.577.0
- Usage: Imported directly in some components

**Problem:** Two icon libraries means:
- Inconsistent visual weight (FA7 icons are bolder than Lucide)
- Different stroke widths and corner radii
- Larger bundle size (shipping two icon sets)
- Maintenance burden (two APIs to learn)

### 4.2 Icon Sizing Inconsistencies

| Context | Current Size | Recommended |
|---------|-------------|-------------|
| Button icons | `h-3.5 w-3.5` | `h-4 w-4` (16px) |
| Nav sidebar icons | `h-4 w-4` | `h-5 w-5` (20px) for touch |
| Category icons in cards | `h-4.5 w-4.5` | `h-5 w-5` (20px) |
| Notification bell | `h-4 w-4` | `h-5 w-5` (20px) for touch |
| Badge icons | `h-3.5 w-3.5` | `h-4 w-4` (16px) |
| User avatar area | `h-6 w-6` | Correct |
| Error/success input icons | `h-4 w-4` | Correct |

### 4.3 Recommendations

1. **Pick one icon library.** FontAwesome 7 is already deeply integrated (95+ icons) — commit to it fully and remove Lucide React.
2. **Create an icon size scale:**
   - `icon-xs`: 12px (badges, inline tags)
   - `icon-sm`: 16px (buttons, form hints)
   - `icon-md`: 20px (navigation, cards)
   - `icon-lg`: 24px (empty states, headers)
   - `icon-xl`: 32px (feature highlights)
3. **Standardise icon containers:** Always use a fixed-size flex container with centered icon inside.
4. **Audit emoji vs icon usage:** Onboarding uses emojis (💧🌍♻️) while the rest of the app uses FA icons. Pick one approach per context.

### 4.4 Missing Icons

- No custom app icon set (the manifest references `/icon.png` and `/apple-icon.png` but these are Next.js auto-generated, not custom designed)
- No favicon variants (16×16, 32×32, 192×192, 512×512)
- No maskable icon variant for Android adaptive icons

---

## 5. Onboarding Flow Analysis

### 5.1 Current Flow

```
Landing Page → Register → Login → OnboardingModal (4 steps) → Dashboard → Tour
```

**Step 1: Welcome** — Introduces app with feature bullets
**Step 2: Interests** — Pick 1+ categories (Water 💧, Carbon 🌍, Plastic 🛍️, Recycling ♻️, Transport 🚗, Fashion 👗)
**Step 3: Profile** — Display name + optional bio
**Step 4: Next Steps** — Encouragement to log, join challenges, post
**Reward:** 50 bonus points + celebration screen

### 5.2 Strengths
- Progressive disclosure (4 manageable steps)
- Interest selection personalises experience
- Points reward for completion incentivises finishing
- Skip option respects user agency
- Tour system follows up with contextual UI guidance

### 5.3 Issues & Best Practice Gaps

| Issue | Impact | Best Practice |
|-------|--------|---------------|
| **No value proposition shown before registration** | Users register without understanding the benefit | Show a demo dashboard or "see your impact" preview before sign-up |
| **Interests collected but not used** | Categories selected in onboarding don't filter the dashboard or suggest content | Personalise dashboard to show selected categories first; hide unselected ones |
| **No first-action prompt** | After onboarding, user lands on empty dashboard | Immediately prompt to log one activity (the "aha moment") |
| **Tour auto-starts** | Unsolicited tours are dismissed by 80%+ of users | Offer tour as an option, or trigger contextually on first visit to each page |
| **No progress indicator in modal** | Users don't know how many steps remain | Add step dots or "Step 2 of 4" indicator |
| **No email verification** | Account created without confirming email | Add email verification before onboarding (or mark as unverified) |
| **Onboarding reopens on refresh** | Until completed, the modal blocks dashboard access on every page load | Track last-seen step and resume from there; don't restart |

### 5.4 Recommended Onboarding Redesign

```
1. Landing page with interactive demo (try logging one activity)
2. Register (email + OAuth)
3. Email verification (optional, can defer)
4. Welcome screen with 3-step setup:
   a. Pick your top 3 interests → personalises dashboard
   b. Set a weekly goal (e.g., "Log 3 activities this week")
   c. Profile photo + name (optional, can skip)
5. Immediately guide to log FIRST ACTIVITY (the aha moment)
6. Show celebration + impact in human terms
7. Contextual tooltips on first visit to each section (not a full tour)
```

---

## 6. Tracking Areas Analysis

### 6.1 Current Categories

| Category | Unit | Activity Types | Quick-Log | Impact Preview |
|----------|------|----------------|-----------|----------------|
| **Water** | Litres | Reusable bottle, shorter shower, full load wash, rain barrel, tap off brushing | ✅ | "Equivalent to X showers saved" |
| **Carbon** | kg CO₂ | Energy saving, plant-based meal, local produce, air dry clothes, reduced heating | ✅ | "Like planting X trees" |
| **Plastic** | Items | Reusable bag, bottle, refused straws, refused packaging, bulk buy | ✅ | Item count |
| **Recycling** | kg | Paper, plastic, glass, metal, electronics, textiles | ✅ | Weight-based |
| **Transport** | km | Commute, errand, leisure + mode selection with CO₂ calculator | ✅ | CO₂ saved vs car baseline |
| **Fashion** | Items | Secondhand, swap, repair, upcycle | ✅ | Item count |

### 6.2 Strengths
- **Quick-log buttons** reduce friction significantly
- **Live impact preview** shows real-time calculations as user types
- **Human-readable comparisons** make numbers meaningful ("3 bathtubs of water")
- **Transport CO₂ calculator** is genuinely useful and differentiating
- **Backdate capability** lets users log forgotten activities

### 6.3 Gaps vs Best Practice

| Gap | Impact | Recommendation |
|-----|--------|----------------|
| **No daily/weekly goals** | Users have no target to aim for | Add personalised daily targets based on past behaviour |
| **No reminders to log** | Users forget without prompts | Push notification at user's preferred logging time |
| **No photo evidence** | Recycling/fashion could benefit from photos | Optional photo attachment for accountability |
| **No barcode scanning** | Product-level tracking not possible | Future: scan products to auto-categorise |
| **No location-based suggestions** | No contextual prompts | Future: "You're near a recycling centre — log a visit?" |
| **No aggregation dashboard** | Each category is siloed | Show cross-category "eco score" on dashboard |
| **No comparison to averages** | Users can't gauge if they're doing well | "You saved 30% more water than the average user this week" |
| **DESIGN.md spec missing:** | Time period toggle (Week/Month/Year/All Time) on dashboard | Implement as planned |
| **DESIGN.md spec missing:** | Colour-coded progress (green/amber/red) | Implement traffic-light system for goals |
| **DESIGN.md spec missing:** | Tips section on tracking pages | Add contextual eco-tips below forms |

---

## 7. Notification System Analysis

### 7.1 Current Triggers

| Trigger | Channel | Status |
|---------|---------|--------|
| Forum reply to your thread | In-app, email, push | ✅ Implemented |
| Reply to thread you've commented on | In-app, email, push | ✅ Implemented |
| Reaction on your reply | In-app, email, push | ✅ Implemented |
| Badge earned | In-app, email, push | ✅ Implemented |
| Challenge notifications | In-app | ✅ Implemented |
| System messages | In-app | ✅ Implemented |

### 7.2 Missing Notification Triggers (Best Practice)

| Trigger | Priority | Rationale |
|---------|----------|-----------|
| **Daily logging reminder** | HIGH | "Don't break your 5-day streak! Log today's impact" |
| **Weekly summary** | HIGH | "This week you saved X litres of water and Y kg CO₂" |
| **Goal completion** | HIGH | "You hit your weekly target! 🎉" |
| **Streak milestone** | MEDIUM | "Amazing! 30-day streak — you're in the top 5%" |
| **Challenge starting soon** | MEDIUM | "New challenge starts tomorrow: Plastic-Free Week" |
| **Challenge ending soon** | MEDIUM | "2 days left in Walk to Work Week — you're 80% there!" |
| **Leaderboard position change** | MEDIUM | "You moved up to #12 on the leaderboard!" |
| **Inactivity re-engagement** | MEDIUM | "We miss you! Your last log was 7 days ago" |
| **Friend activity** | LOW | "Sarah just completed the Recycling Champion challenge!" |
| **New guide published** | LOW | "New guide: How to Start Composting at Home" |

### 7.3 Push Notification Issues

- **PushOptIn cooldown:** 14-day cooldown after dismissal is too aggressive — users may change their mind sooner
- **No notification scheduling:** All notifications are immediate; no "best time to send" logic
- **No notification grouping:** Multiple forum replies create separate notifications instead of grouped
- **Service worker push handler:** Functional but basic — no action buttons for quick responses

### 7.4 Permission Flow Best Practice

```
Current:  Page load → PushOptIn banner → Accept/Dismiss
Better:   First badge earned → Contextual prompt → "Get notified when you earn badges?"
```

Contextual permission requests convert 3× better than generic banners.

---

## 8. Gamification Analysis

### 8.1 Current System

**Points:**
```
Carbon:    10 pts/kg CO₂
Fashion:    5 pts/item
Plastic:    3 pts/item
Recycling:  2 pts/kg
Transport:  1 pt/km
Water:      1 pt/10L
Minimum:    5 pts per activity
Challenge:  100 pts bonus
Onboarding: 50 pts
Tour:       25 pts
```

**Badges:** 19+ badges with 13 criteria types, 5 rarity levels (Common → Legendary)
**Streaks:** Consecutive daily logging, resets on miss
**Challenges:** Admin-created, time-limited, target-based
**Leaderboard:** All Time / This Month / This Week rankings

### 8.2 Strengths
- **Comprehensive badge criteria** (13 types including car-free streaks, transport modes, community participation)
- **Rarity system** adds aspiration (Epic and Legendary badges feel special)
- **Progress bars** on unearned badges show how close users are
- **Contextual nudges** at 75%+ completion ("Almost there!")
- **Points audit trail** via PointTransaction table

### 8.3 Gaps & Best Practice Recommendations

| Gap | Best Practice | Priority |
|-----|--------------|----------|
| **No levels/ranks** | Users should have a level (1-50) based on total points — "Eco Novice → Eco Champion → Eco Legend" | HIGH |
| **No daily quests** | "Today's mission: Log one water-saving activity" — refreshes daily, small point bonus | HIGH |
| **No milestone celebrations** | When user hits 100 activities, 1000 points, etc. — show full-screen celebration | MEDIUM |
| **Streaks are punitive** | Missing one day resets to 0 — use "streak freeze" (1 free miss per week) | MEDIUM |
| **No seasonal events** | Earth Day (April 22), World Water Day (March 22), etc. — themed challenges + limited badges | MEDIUM |
| **No difficulty tiers** | All challenges have flat targets — add Easy/Medium/Hard with different rewards | MEDIUM |
| **Points not spendable** | Points are display-only — consider letting users "spend" points (customise profile, unlock themes) | LOW |
| **No team challenges** | All challenges are individual — add team-based goals (household, workplace) | LOW |
| **No badge showcase** | DESIGN.md specifies "pick 3 featured badges" on profile — not implemented | LOW |

### 8.4 Gamification Loop Assessment

```
Current loop:
Log Activity → Earn Points → See Leaderboard → Want More Points → Log More

Missing loops:
1. Daily Quest → Complete → Reward → New Quest (daily habit formation)
2. Badge Progress → Almost There → Extra Effort → Earn Badge → Share (achievement pursuit)
3. Challenge Join → Daily Progress → Team Encouragement → Complete → Celebrate (social accountability)
4. Streak → Risk of Breaking → Log to Maintain → Milestone Reward (loss aversion)
```

---

## 9. Social Features Analysis

### 9.1 Current Social Features

| Feature | Status | Depth |
|---------|--------|-------|
| Forum (threads + replies) | ✅ | Full CRUD, categories, search, sort, pagination |
| Reactions (👏💡⭐) | ✅ | Three types, toggle, count display |
| Leaderboard | ✅ | Three time periods, top 50, medals for top 3 |
| Challenges (community) | ✅ | Join, track progress, completion |
| User profiles (public) | ✅ | Basic — name, bio, badges, stats |

### 9.2 Missing Social Features (Best Practice)

| Feature | Priority | Rationale |
|---------|----------|-----------|
| **Share to social media** | HIGH | "I saved 50kg of CO₂ this month with @EarthEcho" — viral growth |
| **Invite friends** | HIGH | Referral system with bonus points for both users |
| **Activity feed** | HIGH | See what friends/community members are doing (opt-in) |
| **Friend/follow system** | MEDIUM | Connect with friends, see their stats |
| **Team/household mode** | MEDIUM | Family or workplace groups tracking together (in DESIGN.md Phase 3) |
| **Direct messaging** | LOW | Private messaging between users |
| **Social login sharing** | LOW | "Share my weekly summary to Instagram Stories" |
| **Comparisons** | MEDIUM | "You vs. friend" side-by-side impact comparison |
| **Community milestones** | MEDIUM | "Together, Earth Echo users have saved 1 million litres of water!" |
| **Share badge earned** | HIGH | Share card image when badge unlocked — "I just earned Eco Champion on Earth Echo!" |

### 9.3 Forum Enhancement Opportunities

| Enhancement | Priority |
|-------------|----------|
| User reputation/level shown next to posts | MEDIUM |
| "Best answer" marking for Question threads | MEDIUM |
| Rich text editor (markdown or WYSIWYG) | LOW |
| Image attachments in posts | MEDIUM |
| @mentions with notifications | MEDIUM |
| Trending topics | LOW |

---

## 10. App Store Readiness

### 10.1 Current State: PWA Assessment

| Criteria | Status | Notes |
|----------|--------|-------|
| HTTPS | ✅ | Production at earthecho.co.uk |
| Manifest | ⚠️ | Exists but missing icon files, shortcuts, screenshots |
| Service worker | ⚠️ | Push notifications work but NO offline support |
| Responsive design | ✅ | Tailwind responsive, works on mobile |
| Installable | ⚠️ | Missing icon assets prevent proper install prompt |
| Offline capable | ❌ | No fetch handler, no cached resources |
| Lighthouse PWA score | ~55-65% | Estimated; would fail on offline criteria |

### 10.2 Path to App Store: Options Ranked

#### Option A: PWA Enhancement (Recommended First Step)
**Effort:** 1-2 weeks
**Cost:** $0

| Task | Hours |
|------|-------|
| Generate full icon set (6 sizes) | 2 |
| Implement service worker caching (app shell + stale-while-revalidate) | 6 |
| Create offline fallback page | 2 |
| Add manifest shortcuts and screenshots | 2 |
| Add meta tags (OG, Twitter, description) | 1 |
| Test with Lighthouse and fix failures | 3 |
| **Total** | **~16 hours** |

#### Option B: TWA for Google Play Store
**Effort:** 1 day (after Option A)
**Cost:** $25 one-time Play Store fee

1. Create `/.well-known/assetlinks.json` for digital asset links
2. Generate signing key
3. Use Bubblewrap CLI: `npx @bubblewrap/cli init --manifest=https://earthecho.co.uk/manifest.json`
4. Build signed APK
5. Submit to Google Play

**Prerequisite:** Option A must be complete (Google requires passing PWA criteria)

#### Option C: Capacitor for iOS App Store + Play Store
**Effort:** 2-3 weeks
**Cost:** $99/year Apple Developer + $25 Google Play

| Task | Hours |
|------|-------|
| Install and configure Capacitor | 4 |
| Set up Xcode project for iOS | 4 |
| Set up Android Studio project | 2 |
| Configure native plugins (push notifications, camera, share) | 8 |
| Handle deep linking and universal links | 4 |
| Build and test on devices | 8 |
| Prepare app store listings (screenshots, descriptions, privacy policy) | 6 |
| Submit for review | 2 |
| **Total** | **~38 hours** |

**Capacitor benefits:**
- Native push notifications (not web push)
- Native share sheet integration
- Camera access for photo evidence
- Haptic feedback
- App store discovery and ratings
- Automatic updates via web (code changes don't need app store review)

#### Option D: React Native / Flutter Rewrite
**Effort:** 2-3 months
**Cost:** High
**Recommendation:** ❌ Not recommended — the current codebase is too large to justify a rewrite

### 10.3 What Must Change for Any App Store Path

| Change | Reason |
|--------|--------|
| Bottom tab navigation | App store reviewers and users expect native navigation patterns |
| Splash screen | Required for iOS App Store |
| App icons (all sizes) | Required for both stores |
| Privacy policy URL | Required for both stores |
| Data deletion mechanism | Required for both stores (already have `/data-deletion` route ✅) |
| Age rating | Required for both stores |
| Offline graceful degradation | Expected for quality apps |
| Loading states | No blank screens — always show skeleton/spinner |

---

## 11. Best Practice Recommendations

### 11.1 Mobile UX (Priority: HIGH)

1. **Implement bottom tab bar** for mobile viewports (< 768px)
2. **Increase touch targets** to 44pt minimum (iOS HIG)
3. **Add safe area insets** for notch/Dynamic Island/home indicator
4. **Set input font-size to 16px** to prevent iOS auto-zoom
5. **Add pull-to-refresh** on dashboard and activity lists
6. **Add skeleton loading states** on all data-dependent pages
7. **Implement swipe gestures** for activity deletion and navigation

### 11.2 Alignment & Consistency (Priority: MEDIUM)

1. **Standardise card padding** to 2 variants: `p-5` (compact) and `p-6` (spacious)
2. **Remove hardcoded 768px** in MagicCard — use Tailwind `md:` breakpoint
3. **Extract inline styles** from Sidebar glass effect into Tailwind utility
4. **Create design tokens** for arbitrary text sizes (`text-[11px]` → `text-2xs`)
5. **Standardise impact card icon containers** to consistent `h-10 w-10`

### 11.3 Iconography (Priority: HIGH)

1. **Remove Lucide React** — consolidate on FontAwesome 7 (already 95+ icons registered)
2. **Define icon size scale** with design tokens (xs/sm/md/lg/xl)
3. **Generate proper app icons** — 6 PNG sizes from a master SVG
4. **Decide emoji vs icon policy** — use emojis in user-facing content (onboarding, celebrations), FA icons in UI chrome

### 11.4 Onboarding (Priority: HIGH)

1. **Add progress indicator** (step dots) to onboarding modal
2. **Use selected interests** to personalise dashboard layout
3. **Guide to first activity immediately** after onboarding
4. **Replace auto-tour** with contextual tooltips on first visit per section
5. **Don't restart onboarding on refresh** — resume from last step

### 11.5 Notifications (Priority: MEDIUM)

1. **Add daily logging reminder** — most impactful engagement trigger
2. **Add weekly summary** email/push with stats
3. **Request push permission contextually** (after first badge, not on page load)
4. **Group notifications** (3 forum replies → "3 new replies on your thread")
5. **Add notification scheduling** — send at user's preferred time

### 11.6 Gamification (Priority: MEDIUM)

1. **Add user levels** (1-50) based on total points
2. **Add daily quests** — one small, achievable mission per day
3. **Implement streak freezes** — 1 free miss per week to reduce frustration
4. **Add milestone celebrations** — full-screen confetti at key milestones
5. **Implement badge showcase** — "Pick 3 featured badges" as per DESIGN.md

### 11.7 Social (Priority: MEDIUM)

1. **Add share buttons** — generate shareable cards for badges and weekly summaries
2. **Add invite/referral system** — bonus points for inviter and invitee
3. **Add community activity feed** — opt-in, shows recent community actions
4. **Add community milestones** — "Together we've saved 1M litres of water"

---

## 12. Prioritised Action Plan

### Phase 1: Mobile Foundation (1-2 weeks)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 1 | Implement bottom tab bar for mobile | Critical | 8 hrs |
| 2 | Consolidate to single icon library (remove Lucide) | High | 4 hrs |
| 3 | Standardise icon sizes with design tokens | High | 3 hrs |
| 4 | Fix touch targets (44pt minimum) | High | 2 hrs |
| 5 | Add safe area insets (notch, home indicator) | High | 2 hrs |
| 6 | Fix input font-size for iOS (16px minimum) | Medium | 1 hr |
| 7 | Generate proper app icon set (6 sizes) | High | 2 hrs |

### Phase 2: Engagement & Polish (2-3 weeks)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 8 | Add progress dots to onboarding modal | Medium | 1 hr |
| 9 | Personalise dashboard based on interests selected | High | 6 hrs |
| 10 | Guide to first activity post-onboarding | High | 4 hrs |
| 11 | Add daily logging reminders (push + in-app) | High | 6 hrs |
| 12 | Add weekly summary notifications | Medium | 4 hrs |
| 13 | Add user levels (Eco Novice → Legend) | Medium | 6 hrs |
| 14 | Add daily quests system | Medium | 8 hrs |
| 15 | Implement streak freeze | Medium | 3 hrs |
| 16 | Contextual push permission requests | Medium | 3 hrs |

### Phase 3: Social & Sharing (2-3 weeks)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 17 | Share badge/achievement cards (generate images) | High | 8 hrs |
| 18 | Invite/referral system with bonus points | High | 8 hrs |
| 19 | Community activity feed | Medium | 6 hrs |
| 20 | Community milestone celebrations | Medium | 4 hrs |
| 21 | Notification grouping | Medium | 4 hrs |
| 22 | Comparison feature ("You vs. average") | Medium | 6 hrs |

### Phase 4: App Store (1-2 weeks)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 23 | Implement service worker offline caching | High | 6 hrs |
| 24 | Create offline fallback page | Medium | 2 hrs |
| 25 | Add manifest shortcuts and screenshots | Medium | 2 hrs |
| 26 | Add OG/Twitter meta tags | Low | 1 hr |
| 27 | Lighthouse audit and fix to 90+ PWA score | High | 4 hrs |
| 28 | TWA build for Google Play Store | High | 4 hrs |
| 29 | Capacitor setup for iOS App Store | High | 16 hrs |
| 30 | App store listing preparation | Medium | 6 hrs |

### Phase 5: Advanced (Ongoing)

| # | Task | Impact | Effort |
|---|------|--------|--------|
| 31 | Pull-to-refresh on data pages | Medium | 4 hrs |
| 32 | Skeleton loading states | Medium | 6 hrs |
| 33 | Swipe gestures (delete, navigate) | Low | 6 hrs |
| 34 | Haptic feedback via Capacitor | Low | 2 hrs |
| 35 | Seasonal events and limited badges | Medium | 8 hrs |
| 36 | Team/household mode | Medium | 16 hrs |
| 37 | Dark mode toggle (not just OS preference) | Low | 8 hrs |
| 38 | Category-specific leaderboards | Low | 4 hrs |

---

## Appendix A: DESIGN.md Compliance Check

| DESIGN.md Specification | Implemented? | Notes |
|------------------------|-------------|-------|
| Dashboard grid with human-readable comparisons | ✅ Partial | Impact cards exist but missing time period toggle |
| Animated counters on page load | ✅ | AnimatedCounter component exists |
| Colour-coded progress (green/amber/red) | ❌ | Not implemented |
| Time period toggle (Week/Month/Year/All Time) | ❌ | Not on dashboard (only on leaderboard) |
| Click card to drill into tracking | ✅ | Quick-action buttons link to tracking pages |
| Quick Log Form with +/- buttons | ⚠️ Partial | Quick-log exists but uses pre-set buttons, not +/- |
| Tips section on tracking pages | ❌ | Not implemented |
| Forum upvote/downvote | ⚠️ Changed | Uses reactions (👏💡⭐) instead of up/down votes |
| Challenge community progress bar | ❌ | Individual progress only |
| Category-specific leaderboards | ❌ | Overall points only |
| Badge showcase on profile (pick 3) | ❌ | Shows recent 3 but not user-selected |
| Bottom nav on mobile | ❌ | Uses hamburger + sidebar instead |
| Tablet 2-column grid | ⚠️ | Uses `sm:grid-cols-2` but not optimised for tablet |
| Swipeable cards on mobile | ❌ | Not implemented |

## Appendix B: Files Referenced

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Theme tokens, animations, glass utilities |
| `src/components/ui/Button.tsx` | Button variants and sizes |
| `src/components/ui/Card.tsx` | Card variants |
| `src/components/ui/Icon.tsx` | Icon wrapper with size scale |
| `src/components/ui/Input.tsx` | Form input with icons |
| `src/components/ui/Badge.tsx` | Status badge component |
| `src/components/ui/ProgressBar.tsx` | Progress indicator |
| `src/components/layout/Sidebar.tsx` | Main navigation |
| `src/components/onboarding/OnboardingModal.tsx` | Onboarding flow |
| `src/components/tour/tourSteps.ts` | Tour configuration |
| `src/components/notifications/NotificationBell.tsx` | Notification UI |
| `src/components/notifications/NotificationPreferences.tsx` | Notification settings |
| `src/components/pwa/PushOptIn.tsx` | Push permission |
| `src/components/pwa/ServiceWorkerRegistrar.tsx` | SW registration |
| `src/lib/fontawesome.ts` | Icon registry (95+ icons) |
| `src/lib/categories.ts` | Category definitions |
| `src/lib/notifications.ts` | Notification engine |
| `src/lib/notification-actions.ts` | Notification CRUD |
| `src/lib/badge-actions.ts` | Badge criteria & award logic |
| `src/lib/challenge-actions.ts` | Challenge workflow |
| `public/manifest.json` | PWA manifest |
| `public/sw.js` | Service worker |
| `prisma/schema.prisma` | Database schema |
| `docs/DESIGN.md` | Original design specification |
