# Admin Panel V2 Enhancement

## Goal

Build an admin-specific bottom nav, enhance dashboard with community impact stats, create Resources CRUD, and migrate Guides to database with full CRUD. All for superadmin/developer roles.

## Current State

- **Analytics page already exists** at `/admin/analytics` with date filtering (day/week/month/year/custom), category breakdown, charts, top contributors. Just needs a link from the admin bottom nav.
- **Resources** are in the database (`Resource` model) but have NO admin management page.
- **Guides** are hardcoded TypeScript files — need database migration for CRUD.
- **Admin bottom nav** currently reuses the main app `BottomTabBar` — needs admin-specific tabs.

## Tasks

- [x] **Task 1: Admin-specific bottom nav bar** — Create `AdminBottomTabBar.tsx`
  - Tabs: Dashboard (`/admin`), Analytics (`/admin/analytics`), Content (`/admin/resources` or `/admin/guides`), Users (`/admin/users`), More (opens sheet with: Forum, Challenges, Badges, Emails, Audit, Back to App)
  - Replace `BottomTabBar` in `src/app/admin/layout.tsx` with new component
  - Verify: Admin pages show admin-specific bottom tabs on mobile

- [x] **Task 2: Community impact summary on admin dashboard** — `src/app/admin/page.tsx`
  - Add "Community Impact" section below stat cards
  - Query total values per category across ALL users (water litres, carbon kg, plastic items, recycling kg, transport km, fashion items)
  - Display as cards with human-readable conversions (e.g., "12,450 litres = 83 bathtubs of water saved")
  - Add mini bar chart showing category breakdown
  - Verify: Dashboard shows real aggregate data with conversions

- [x] **Task 3: Resources admin CRUD page** — `src/app/admin/resources/page.tsx`
  - List all resources with name, URL, category, isActive toggle
  - Add/Edit form (name, description, url, category dropdown, isActive)
  - Delete with confirmation
  - Server actions in `src/lib/resource-actions.ts`: `createResource`, `updateResource`, `deleteResource`, `toggleResourceActive`
  - Audit log entries for all operations
  - Verify: Can create, edit, toggle, and delete resources from admin

- [x] **Task 4: Guide Prisma model + migration** — `prisma/schema.prisma`
  - Add `Guide` model: id, slug, title, subtitle, icon, category, categoryLabel, readTimeMinutes, introduction, sections (JSON), quickTips (JSON), sources (JSON), lastUpdated, isPublished, createdAt, updatedAt
  - Run `npx prisma db push` (used db push due to remote DB shadow database permissions)
  - Create seed script to migrate 5 existing hardcoded guides into DB
  - Update `/guides` and `/guides/[slug]` pages to read from DB instead of TS files
  - Verify: Existing guides render identically from database

- [x] **Task 5: Guides admin CRUD page** — `src/app/admin/guides/page.tsx`
  - List all guides with title, category, published status, last updated
  - Create/Edit form with: title, subtitle, slug, category, introduction, sections editor (add/remove/reorder), quick tips, sources, publish toggle
  - Sections editor: each section has heading + paragraphs (rich text or markdown)
  - Server actions: `createGuide`, `updateGuide`, `deleteGuide`, `toggleGuidePublished`
  - Preview button to see guide before publishing
  - Verify: Can create a new guide from admin and see it on the public `/guides` page

- [ ] **Task 6: Verification** — Test all flows end-to-end on mobile
  - Admin bottom nav navigates correctly on all pages
  - Dashboard impact stats show real data
  - Resources CRUD works (create, edit, toggle active, delete)
  - Guides CRUD works (create, edit, publish/unpublish, delete)
  - Role gates: only superadmin/developer can access Guides and Resources admin
  - Audit logs capture all admin actions

## Suggested Improvements

- **Guide version history**: Store previous versions so edits can be rolled back
- **Resource import**: Bulk import resources from CSV
- **Impact milestones**: Auto-notify admins when community hits impact milestones (e.g., "10,000 litres saved!")
- **Guide analytics**: Track which guides are most read, time spent, comment engagement
- **Content scheduling**: Allow guides to be scheduled for future publish dates

## Done When

- [ ] Admin bottom nav is admin-specific with relevant tabs
- [ ] Dashboard shows community-wide impact stats with unit conversions
- [ ] Resources have full CRUD from admin panel
- [ ] Guides are database-driven with full CRUD from admin panel
- [ ] All operations are audit-logged and role-gated
