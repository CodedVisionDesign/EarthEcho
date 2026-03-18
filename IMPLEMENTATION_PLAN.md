# Earth Echo — Implementation Plan

**Date:** 2026-03-18
**Status:** Phases 1-3 COMPLETE — Phase 4 (Capacitor) ready for implementation
**Scope:** Bottom tab bar, icon cleanup, favicon generation, Capacitor integration

---

## Table of Contents

1. [Phase 1: Icon Cleanup & Favicon Generation](#phase-1-icon-cleanup--favicon-generation)
2. [Phase 2: Bottom Tab Bar (Mobile App-Like Navigation)](#phase-2-bottom-tab-bar)
3. [Phase 3: Icon Size Standardisation](#phase-3-icon-size-standardisation)
4. [Phase 4: Capacitor Integration (Single Codebase)](#phase-4-capacitor-integration)
5. [Risk Register](#risk-register)
6. [File Change Map](#file-change-map)

---

## Phase 1: Icon Cleanup & Favicon Generation

### 1a. Remove Lucide React (5 minutes)

**Finding:** `lucide-react` is in `package.json` but **zero imports exist** in `src/`. It was added but never used.

**Action:**
```bash
npm uninstall lucide-react
```

**Files changed:** `package.json`, `package-lock.json` only.
**Risk:** None. Zero files import it.

---

### 1b. Generate App Icons from Logo (30 minutes)

**Source file:** `public/assets/logo.webp` (also `logo.png` at 499KB)

**Problem:** `manifest.json`, `layout.tsx`, and `sw.js` all reference `/icon.png` and `/apple-icon.png` but these files don't exist. The current `src/app/icon.png` and `src/app/apple-icon.png` are Next.js auto-generated placeholders (if they exist at all).

**Action:** Generate from `public/assets/logo.png` (the PNG variant, since it's lossless):

| File | Size | Purpose | Location |
|------|------|---------|----------|
| `favicon.ico` | 32×32 | Browser tab favicon | `src/app/favicon.ico` |
| `icon.png` | 512×512 | PWA icon, manifest, push notifications | `public/icon.png` |
| `apple-icon.png` | 180×180 | iOS home screen | `public/apple-icon.png` |
| `icon-192.png` | 192×192 | Android PWA install | `public/icon-192.png` |
| `icon-384.png` | 384×384 | Android splash | `public/icon-384.png` |
| `icon-maskable.png` | 512×512 | Android adaptive icon (with safe zone padding) | `public/icon-maskable.png` |

**Maskable icon note:** The maskable variant needs 20% padding (safe zone) around the logo so it isn't cropped on different Android device shapes. The current manifest declares `"purpose": "any maskable"` on a single icon — best practice is to separate `any` and `maskable` into different entries.

**Updated manifest.json:**
```json
{
  "name": "Earth Echo",
  "short_name": "EarthEcho",
  "description": "Track and reduce your environmental impact",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#F8F9FA",
  "theme_color": "#2D6A4F",
  "orientation": "portrait-primary",
  "categories": ["lifestyle", "education", "utilities"],
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icon.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" },
    { "src": "/apple-icon.png", "sizes": "180x180", "type": "image/png" }
  ],
  "shortcuts": [
    {
      "name": "Log Activity",
      "url": "/track/carbon",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    },
    {
      "name": "Dashboard",
      "url": "/dashboard",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    },
    {
      "name": "Challenges",
      "url": "/challenges",
      "icons": [{ "src": "/icon-192.png", "sizes": "192x192" }]
    }
  ]
}
```

**Tool recommendation:** Use `sharp` (already available in Node.js) or an online tool like realfavicongenerator.net to generate all sizes from `logo.png`.

**Files changed:** `public/manifest.json`, add 5 new PNG files to `public/`.
**Risk:** None. Additive changes only.

---

## Phase 2: Bottom Tab Bar

### Design

Replace mobile hamburger sidebar with a fixed bottom tab bar on screens < 768px (`md` breakpoint).

```
┌─────────────────────────────────────┐
│                                     │
│         Page Content                │
│                                     │
│                                     │
├─────┬──────┬───────┬──────┬────────┤
│ 🏠  │  📊  │  🌍   │  🏅  │  ≡    │
│Home │Track │Social │Badges│ More   │
└─────┴──────┴───────┴──────┴────────┘
```

**Tab definitions:**

| Tab | Icon (FA7) | Label | Route | Active when |
|-----|-----------|-------|-------|-------------|
| Home | `faHouse` | Home | `/dashboard` | `/dashboard` |
| Track | `faChartLine` | Track | Last-used category or `/track/carbon` | `/track/*` |
| Social | `faGlobe` | Social | `/challenges` | `/challenges`, `/leaderboard`, `/forum` |
| Badges | `faMedal` | Badges | `/badges` | `/badges` |
| More | `faBars` | More | Opens bottom sheet | Profile, Guides, Resources, Settings |

### Architecture Decisions

1. **New component:** `src/components/layout/BottomTabBar.tsx`
   - Client component (needs `usePathname()`)
   - Fixed to bottom: `fixed bottom-0 left-0 right-0 z-50`
   - Height: 56px (iOS safe area: + `pb-[env(safe-area-inset-bottom)]`)
   - Glass morphism matching sidebar style
   - Only visible on `< md` viewports: `md:hidden`

2. **"More" tab:** Opens a bottom sheet (not a full sidebar) with:
   - Profile link
   - Guides link
   - Resources link
   - Notification preferences
   - Sign out
   - App version

3. **Sidebar changes:**
   - Desktop sidebar: **unchanged** (`hidden md:flex`)
   - Mobile hamburger button: **removed** (replaced by bottom tab bar)
   - Mobile sidebar overlay: **removed**
   - NotificationBell moves into the page header on mobile (not the tab bar)

4. **Main layout padding:**
   - Add `pb-16 md:pb-0` to main content area to prevent content hiding behind tab bar

### Files to Change

| File | Change |
|------|--------|
| `src/components/layout/BottomTabBar.tsx` | **NEW** — Bottom tab bar component |
| `src/components/layout/BottomSheet.tsx` | **NEW** — "More" menu bottom sheet |
| `src/components/layout/Sidebar.tsx` | Remove mobile hamburger + overlay code. Keep desktop sidebar. |
| `src/app/(main)/layout.tsx` | Add `<BottomTabBar />` + bottom padding |
| `src/app/globals.css` | Add safe-area-inset utilities if needed |

### Design Specs

```
Tab Bar:
- Background: rgba(255, 255, 255, 0.85) + backdrop-blur(20px) (matches sidebar glass)
- Border-top: 1px solid rgba(0, 0, 0, 0.08)
- Height: 56px + safe-area-inset-bottom
- Icon size: 20px (h-5 w-5)
- Label size: 10px (text-[10px])
- Active state: text-forest, icon filled
- Inactive state: text-slate
- Tap target: full tab width × 56px (well above 44pt minimum)
- Transition: color 200ms ease

Bottom Sheet ("More"):
- Slides up from bottom with backdrop overlay
- Rounded top corners (rounded-t-2xl)
- Drag handle at top (w-10 h-1 bg-gray-300 rounded-full)
- Menu items: 48px height each, icon + label
- Close on backdrop tap or swipe down
```

---

## Phase 3: Icon Size Standardisation

### Current Icon Size Audit

| Context | Current | Standard |
|---------|---------|----------|
| Button leftIcon/rightIcon | h-3.5 w-3.5 (14px) | `icon-sm` = 16px |
| Sidebar nav icons | h-4 w-4 (16px) | `icon-md` = 20px (better touch) |
| Category card icons | h-4.5 w-4.5 (18px) | `icon-md` = 20px |
| Notification bell | h-4 w-4 (16px) | `icon-md` = 20px |
| Badge icons | h-3.5 w-3.5 (14px) | `icon-sm` = 16px |
| Bottom tab bar icons | N/A (new) | `icon-md` = 20px |

### Proposed Icon Scale (Design Tokens)

Add to `globals.css` or as Tailwind config:

```
icon-xs:  12px (h-3 w-3)    — inline tags, small badges
icon-sm:  16px (h-4 w-4)    — buttons, form hints, compact UI
icon-md:  20px (h-5 w-5)    — navigation, cards, tab bar
icon-lg:  24px (h-6 w-6)    — headers, empty states
icon-xl:  32px (h-8 w-8)    — feature highlights, onboarding
```

### Files to Change

Update the `Icon.tsx` component size map, then update all callsites. Estimated ~30 files with icon size references.

---

## Phase 4: Capacitor Integration

### Strategy: Remote URL Wrapper

Capacitor points to `https://earthecho.co.uk`. The web app stays exactly as-is. No `output: 'export'`. No architectural changes.

```
┌─────────────────────────────────────────────────┐
│                  Single Codebase                │
│                                                 │
│  src/app/           (Next.js App Router)        │
│  src/components/    (React components)          │
│  src/lib/           (Server actions, Prisma)    │
│  prisma/            (Database schema)           │
│  public/            (Static assets)             │
│                                                 │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │  Web Deploy  │  │  Capacitor (new)         │ │
│  │              │  │                          │ │
│  │  VPS/Server  │  │  ios/     (Xcode proj)   │ │
│  │  npm run     │  │  android/ (Android proj) │ │
│  │  build+start │  │  capacitor.config.ts     │ │
│  │              │  │                          │ │
│  │  Serves to:  │  │  WebView loads:          │ │
│  │  browsers    │  │  earthecho.co.uk         │ │
│  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### What Changes vs What Doesn't

| Aspect | Changes? | Details |
|--------|----------|---------|
| Next.js code | **NO** | Zero changes to any page, component, or server action |
| API routes | **NO** | Still served from VPS |
| NextAuth | **NO** | Still server-side (but see OAuth caveat below) |
| Prisma/Database | **NO** | Still connects to MySQL from server |
| CSS/Tailwind | **NO** | Identical rendering in WebView |
| Service worker | **NO** | Still serves web users (may not work in native WebView) |
| Web Push | **NO** for web | Web users keep Web Push as-is |
| Deployment (VPS) | **NO** | Same GitHub Actions pipeline |
| `package.json` | **YES** | Add `@capacitor/core`, `@capacitor/cli`, plugins |
| Root directory | **YES** | Add `capacitor.config.ts`, `ios/`, `android/` |
| `.gitignore` | **YES** | Add `ios/`, `android/` (or keep them, your preference) |
| Push notifications | **YES** (native only) | Add `@capacitor/push-notifications` for APNs/FCM |
| OAuth flow | **MAYBE** | Google may block WebView — need `@capacitor/browser` |

### Step-by-Step Setup

**Step 1: Install Capacitor** (does not affect web build)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Earth Echo" "uk.co.earthecho.app" --web-dir out
```

**Step 2: Create `capacitor.config.ts`**
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uk.co.earthecho.app',
  appName: 'Earth Echo',
  webDir: 'out',
  server: {
    url: 'https://earthecho.co.uk',
    cleartext: false,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
```

**Step 3: Add native platforms**
```bash
npx cap add ios      # generates ios/ directory
npx cap add android  # generates android/ directory
```

**Step 4: Platform-specific setup**

_Android:_
- Open `android/` in Android Studio
- Configure signing key for Play Store
- Set minimum SDK version (API 24+ recommended)
- Add FCM configuration for push notifications

_iOS:_
- Open `ios/App/App.xcworkspace` in Xcode
- Set Bundle Identifier: `uk.co.earthecho.app`
- Configure Apple Developer signing
- Add Push Notification capability
- Add APNs certificate

**Step 5: Add native plugins** (only what's needed to avoid "thin wrapper" rejection)

```bash
npm install @capacitor/push-notifications  # Native push (APNs/FCM)
npm install @capacitor/browser             # In-app browser for OAuth
npm install @capacitor/haptics             # Haptic feedback on actions
npm install @capacitor/status-bar          # Control status bar appearance
npm install @capacitor/splash-screen       # Native splash screen
npm install @capacitor/cookies             # Fix iOS cookie persistence
```

**Step 6: Add platform detection utility**

Create `src/lib/platform.ts`:
```typescript
import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();
export const isIOS = () => Capacitor.getPlatform() === 'ios';
export const isAndroid = () => Capacitor.getPlatform() === 'android';
export const isWeb = () => Capacitor.getPlatform() === 'web';
```

**Step 7: Dual push notification support**

In notification code, detect platform:
- Web → existing Web Push API (unchanged)
- Native → `@capacitor/push-notifications` (FCM/APNs)

The server needs to support sending to both:
- Web Push subscriptions (existing `PushSubscription` table)
- Native device tokens (new field or new table: `NativeDeviceToken`)

**Step 8: Handle Google OAuth in WebView**

Google blocks OAuth in WebViews. Solution: detect native platform and open system browser:
```typescript
// In login flow, before OAuth redirect:
if (isNative()) {
  // Open system browser instead of in-app WebView
  await Browser.open({ url: authUrl });
} else {
  // Normal web redirect
  window.location.href = authUrl;
}
```

Configure deep link to bring user back:
- Android: Intent filter for `earthecho://auth/callback`
- iOS: Universal link for `https://earthecho.co.uk/api/auth/callback/*`

### Cost & Timeline

| Item | Cost | Time |
|------|------|------|
| Capacitor setup + config | $0 | 2 hours |
| Native push (FCM + APNs) | $0 | 4-6 hours |
| OAuth WebView workaround | $0 | 3-4 hours |
| iOS cookie fix | $0 | 1-2 hours |
| Android build + testing | $0 | 2-3 hours |
| iOS build + testing | $0 | 2-3 hours |
| Google Play Store submission | $25 (one-time) | 2 hours |
| Apple App Store submission | $99/year | 3-4 hours |
| **Total** | **$124 first year** | **~20-25 hours** |

### App Store Rejection Mitigation

To avoid "thin wrapper" rejection (especially Apple):

1. **Native push notifications** — APNs integration (not just web push)
2. **Haptic feedback** — on button taps, badge earned, challenge complete
3. **Splash screen** — native iOS/Android splash, not a web loading state
4. **Status bar control** — match theme colour, light/dark based on route
5. **Biometric login** (future) — Face ID / fingerprint via `@capacitor/biometrics`

Apple's specific concern is apps that are "simply a web page bundled as an app." The native plugins above demonstrate genuine native integration.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Apple rejects "thin wrapper" | Medium | High | Add 3+ native plugins, demonstrate native UX |
| Google blocks OAuth in WebView | High | High | Use `@capacitor/browser` for auth flow |
| iOS cookie persistence issues | Medium | Medium | Use `@capacitor/cookies` plugin |
| Web Push fails in native WebView | High | Low | Already planned: use native push for Capacitor |
| Service worker conflicts in WebView | Medium | Low | Service worker primarily used for web; native container handles caching |
| Bottom tab bar conflicts with Capacitor safe areas | Low | Medium | Use `env(safe-area-inset-bottom)` padding |
| Two push systems increase server complexity | Medium | Medium | Abstract behind `sendNotification()` that routes to correct channel |

---

## File Change Map

### New Files

| File | Phase | Purpose |
|------|-------|---------|
| `src/components/layout/BottomTabBar.tsx` | 2 | Mobile bottom navigation |
| `src/components/layout/BottomSheet.tsx` | 2 | "More" menu for bottom tab |
| `capacitor.config.ts` | 4 | Capacitor configuration |
| `src/lib/platform.ts` | 4 | Platform detection utility |
| `public/icon-192.png` | 1 | PWA icon 192px |
| `public/icon-384.png` | 1 | PWA icon 384px |
| `public/icon-maskable.png` | 1 | Android adaptive icon |
| `public/icon.png` | 1 | PWA icon 512px (from logo) |
| `public/apple-icon.png` | 1 | iOS home screen icon |
| `src/app/favicon.ico` | 1 | Browser tab favicon |
| `ios/` | 4 | iOS native project (generated) |
| `android/` | 4 | Android native project (generated) |

### Modified Files

| File | Phase | Change |
|------|-------|--------|
| `package.json` | 1, 4 | Remove lucide-react, add Capacitor deps |
| `public/manifest.json` | 1 | Add icon sizes, shortcuts, split maskable |
| `src/components/layout/Sidebar.tsx` | 2 | Remove mobile hamburger/overlay code |
| `src/app/(main)/layout.tsx` | 2 | Add BottomTabBar, bottom padding |
| `src/components/ui/Icon.tsx` | 3 | Update size scale definitions |
| `src/lib/notifications.ts` | 4 | Add native push detection/routing |
| `src/lib/notification-actions.ts` | 4 | Support native device tokens |
| `src/app/globals.css` | 2 | Safe area inset utilities |
| `.gitignore` | 4 | Add ios/, android/ patterns |
| `prisma/schema.prisma` | 4 | Add NativeDeviceToken model (optional) |
| ~30 component files | 3 | Standardise icon sizes |

### Untouched (Explicitly)

| File/Area | Why |
|-----------|-----|
| All server actions | Capacitor uses remote URL — server code untouched |
| All API routes | Still served from VPS |
| NextAuth configuration | Unchanged (OAuth workaround is client-side only) |
| Database queries | Prisma runs on server as before |
| All tracking pages | No changes needed |
| Admin panel | No changes needed |
| Deployment pipeline | `.github/workflows/deploy.yml` stays the same |

---

## Decision Points for You

Before implementation, confirm:

1. **Bottom tab bar tabs** — Are you happy with Home / Track / Social / Badges / More? Or different grouping?
2. **Capacitor timing** — Do phases 1-3 first (web improvements), then phase 4 (Capacitor)? Or all together?
3. **App Store accounts** — Do you already have an Apple Developer account ($99/yr) and Google Play account ($25)?
4. **App ID** — Is `uk.co.earthecho.app` the correct bundle identifier?
5. **FCM/APNs** — Do you have a Firebase project for FCM? An Apple Developer push certificate?
6. **Icon generation** — Shall I generate the icons programmatically from `logo.png` using sharp, or do you want to design them manually?
