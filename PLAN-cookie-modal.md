# Cookie Modal Behaviour Plan

## Current State

The `CookieConsent.tsx` component already exists with solid foundations:
- Stores choice in `localStorage` key `ee_cookie_consent` ("accepted" | "rejected")
- Conditionally loads Google Analytics only on "Accept all"
- Skips display entirely in Capacitor native apps (`window.Capacitor` check)
- 800ms delay before showing to avoid page-load flash
- Full-screen backdrop modal at z-[9999]

---

## Platform Decision Matrix

| Platform | Show Cookie Modal? | Why |
|---|---|---|
| **Web (browser)** | YES | Required by GDPR/ePrivacy/PECR. The site uses Google Analytics cookies. |
| **PWA (installed to home screen)** | YES | A PWA is still a website running in a browser engine. Cookie law applies identically. `window.Capacitor` is `undefined` here, so the modal already shows correctly. |
| **Android (Capacitor native)** | NO | Native apps are governed by the app store privacy policy & in-app disclosure, not cookie banners. The current `window.Capacitor` check already handles this. |
| **iOS (Capacitor native)** | NO | Same as Android. Apple's App Tracking Transparency (ATT) framework replaces cookie consent for native apps. The current check handles this. |

### Best Practice Rationale

**Why NO for native apps:**
1. **Legal:** GDPR cookie consent applies to "terminal equipment" accessed via HTTP (i.e., browsers). Native apps use different consent mechanisms (app store listings, in-app privacy prompts, Apple ATT).
2. **UX:** Native app users have already accepted privacy terms during install. A web-style cookie banner feels foreign and breaks the native experience.
3. **Technical:** Capacitor native apps load the hosted web app inside a WebView. Google Analytics in a WebView should be replaced with Firebase Analytics (native SDK), which uses its own consent flow.

**Why YES for PWA:**
1. A PWA installed to the home screen is still a website — it runs in the browser engine with full cookie/JS capabilities.
2. All cookie regulations (GDPR, PECR, CCPA) apply equally to PWAs.
3. There is no "install consent" equivalent for PWAs like there is for app stores.

---

## Persistence Behaviour

### Current: `localStorage` — Good enough for now, but has caveats

| Aspect | Current Behaviour | Best Practice |
|---|---|---|
| **Remembers choice?** | YES — reads `localStorage` on mount, skips modal if value exists | Correct |
| **Shows every launch?** | NO — only shows once until storage is cleared | Correct |
| **Survives browser restart?** | YES — `localStorage` persists | Correct |
| **Survives "Clear browsing data"?** | NO — `localStorage` is wiped | Acceptable (re-consent is fine) |
| **Survives incognito/private?** | NO — ephemeral storage | Acceptable (must re-consent each session) |
| **Cross-device sync?** | NO | Not needed — consent is per-device per regulations |

### Recommended Enhancement: Dual storage (localStorage + server-side)

For logged-in users, persist the consent choice server-side (in the User model or a dedicated `consent` table) as a **secondary record**. This provides:
1. **Audit trail** — GDPR requires you to prove consent was given, with a timestamp
2. **Re-hydration** — If a logged-in user clears their browser, their choice can be restored from the server on next auth session
3. **Compliance reporting** — Ability to answer "how many users consented?"

**localStorage remains the primary check** (fast, no network round-trip). Server-side is a fallback and audit mechanism.

### Suggested Schema Addition

```
model CookieConsent {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  analytics Boolean  @default(false)   // true = accepted analytics
  givenAt   DateTime @default(now())   // when consent was given
  updatedAt DateTime @updatedAt        // last change
  ipAddress String?                    // optional, for audit
  userAgent String?                    // optional, for audit
}
```

---

## Recommended Behaviour Flow

```
App Launch
    │
    ├─ Native (Capacitor)?
    │   └─ SKIP cookie modal entirely
    │      └─ Use Firebase Analytics with native consent (ATT on iOS)
    │
    └─ Web / PWA?
        │
        ├─ localStorage has "ee_cookie_consent"?
        │   ├─ "accepted" → Load GA silently, no modal
        │   └─ "rejected" → No GA, no modal
        │
        └─ No stored value?
            │
            ├─ User is logged in?
            │   └─ Check server for saved consent
            │       ├─ Found → Apply it, write to localStorage, no modal
            │       └─ Not found → Show modal
            │
            └─ User is not logged in?
                └─ Show modal (after 800ms delay)
```

---

## Additional Best Practice Recommendations

### 1. Consent Expiry
- **GDPR guidance:** Re-ask consent every **12 months**
- Store a timestamp alongside the consent value: `ee_cookie_consent_ts`
- On app load, if consent is older than 12 months, treat as "pending" and re-show the modal

### 2. Ability to Change Choice
- Add a "Cookie Preferences" link in the app footer/settings page
- Clicking it re-opens the consent modal so users can switch from "Accept all" ↔ "Essential only"
- This is a GDPR requirement — withdrawal of consent must be as easy as giving it

### 3. Pre-consent Blocking
- **Current behaviour is correct:** GA script is only injected after "Accept all"
- Ensure no other third-party scripts (fonts from Google, embedded maps, social widgets) set cookies before consent
- Audit any `<Script>` tags in `layout.tsx` or `_app.tsx`

### 4. Native App Analytics (Future)
- Replace GA with **Firebase Analytics** for Capacitor builds
- Firebase handles consent natively:
  - iOS: Integrates with App Tracking Transparency (ATT prompt)
  - Android: Google Play data safety section covers it
- This keeps native apps compliant without a web-style cookie banner

### 5. Modal UX Polish
- Current 800ms delay is good — prevents flash
- Consider not showing the modal on legal pages (`/privacy`, `/cookies`, `/terms`) since users are already reading the policy
- Ensure the modal is **not dismissible** by clicking outside or pressing Escape (current implementation is correct — no backdrop dismiss)

---

## Summary of What Needs Changing

| Item | Priority | Effort |
|---|---|---|
| Current web/PWA modal behaviour | No change needed | - |
| Current native app skip | No change needed | - |
| Add consent expiry (12 months) | Medium | Small |
| Add "Change preferences" in settings/footer | High (GDPR requirement) | Small |
| Server-side consent audit trail | Medium | Medium |
| Re-hydrate consent for logged-in users | Low | Small |
| Firebase Analytics for native apps | Low (future) | Medium |
| Audit third-party scripts for pre-consent leaks | High | Small |

---

*This plan follows ICO (UK), CNIL (EU), and GDPR best practice guidelines.*
*No code changes were made — this is a planning document only.*
