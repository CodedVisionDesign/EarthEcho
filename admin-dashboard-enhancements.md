# Admin Dashboard & Bottom Nav Enhancements

## Goal
Fix bottom nav bar appearing mid-page on main app, make admin stat widgets clickable, and add bottom nav to admin layout.

## Root Cause Analysis

### Bottom nav floating mid-page (main app)
The `FadeIn` component uses Framer Motion which applies CSS `transform` during animations. Per CSS spec, **any ancestor with `transform` creates a new containing block for `fixed` elements**, breaking viewport-relative positioning. The BottomTabBar's `fixed bottom-0` ends up relative to the nearest transformed ancestor instead of the viewport.

**Fix:** Convert the bottom nav from `fixed` positioning to a **flexbox app shell** layout. Make the parent `h-dvh` with a vertical flex column so `<main>` scrolls internally and the nav sits naturally at the bottom — no `fixed` needed on mobile.

### Admin dashboard widgets not clickable
Stat widgets are plain `<Card>` divs with no links or click handlers.

### Admin has no bottom nav
Admin layout (`src/app/admin/layout.tsx`) doesn't render `<BottomTabBar>` at all.

## Tasks

- [x] **Task 1:** Fix main layout app shell — `src/app/(main)/layout.tsx`
  - Wrap `<main>` + `<BottomTabBar>` in a vertical flex column
  - Use `h-dvh` on outermost container to constrain to viewport
  - Remove `fixed` from BottomTabBar on mobile; use flex-shrink-0 instead
  - Keep `pb-20` → reduce to small padding since nav is in flow now
  - Verify: Bottom nav stays at viewport bottom, content scrolls behind it

- [x] **Task 2:** Make admin stat widgets clickable — `src/app/admin/page.tsx`
  - Wrap each `<Card>` in `<Link>` to relevant admin sub-page
  - Total Users / Active (7d) / Banned Users → `/admin/users`
  - Activities Logged → `/admin/audit`
  - Forum Threads / Forum Replies → `/forum`
  - Active Challenges / Pending Reviews → `/admin/challenges`
  - Add hover/tap visual feedback (cursor-pointer, hover:shadow)
  - Verify: Each card navigates correctly on tap

- [x] **Task 3:** Add `<BottomTabBar>` to admin layout — `src/app/admin/layout.tsx`
  - Import and render BottomTabBar
  - Add bottom padding for mobile content clearance
  - Verify: Bottom nav visible on mobile admin pages

## Done When
- [ ] Bottom nav stays pinned at screen bottom on the main app (no mid-page floating)
- [ ] All admin stat cards are clickable and route correctly
- [ ] Bottom nav appears on admin pages on mobile
