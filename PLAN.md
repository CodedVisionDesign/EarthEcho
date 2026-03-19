# Plan: Email Verification + Age-Gated Forum Access

## Current State Summary

**DOB usage today:**
- Required at registration, validated >= 13 years (COPPA)
- GDPR data minimisation: only stored in DB if user is under 18; set to `null` for adults
- No age-based restrictions on forum posting — anyone authenticated and unbanned can post/reply
- DOB is **not available** for adults (nulled out), only for minors

**Email verification today:**
- `emailVerified DateTime?` field exists on User model but is **never set or checked**
- OAuth users (Google/Facebook) have verified emails inherently, but `emailVerified` is not populated
- Credential users never go through email verification
- No email verification requirement for any action

**Email infrastructure:**
- Nodemailer with SMTP already configured (`src/lib/email.ts`)
- Branded email templates with `emailWrapper()` and `buttonHtml()` helpers
- `VerificationToken` model already exists in Prisma schema (NextAuth standard)

---

## Feature 1: Email Verification

### 1A. Database Changes

**No new Prisma model needed** — use the existing `emailVerified DateTime?` field on User and `VerificationToken` model.

For OAuth users (Google/Facebook): auto-set `emailVerified = new Date()` on first sign-in since these providers verify email ownership.

### 1B. Server Actions (src/lib/actions.ts)

1. **`sendVerificationEmail(userId)`** — generates a cryptographically random token (32 bytes, hex), stores it in `VerificationToken` with 24h expiry, sends branded email with verify link (`/verify-email?token=...`)
2. **`verifyEmail(token)`** — validates token exists and not expired, sets `user.emailVerified = new Date()`, deletes the token
3. **`resendVerificationEmail()`** — rate-limited (1 per 60s), deletes any old tokens for the user, calls `sendVerificationEmail`

### 1C. Email Template (src/lib/email.ts)

New function `sendEmailVerification(name, email, verifyUrl)` — branded template matching existing style, with "Verify Your Email" button and 24h expiry notice.

### 1D. Verification Page

New page: `src/app/(auth)/verify-email/page.tsx`
- Reads `?token=` from URL
- Calls `verifyEmail(token)` server action
- Shows success/error/expired state with redirect to profile or login

### 1E. Profile Page — Email Verification Status Card

New component: `EmailVerificationCard` on the profile page (placed above "Edit Profile" card in right column)
- **If verified**: Shows green checkmark with "Email verified" and verified date
- **If unverified**: Shows warning with "Email not verified" and a "Send Verification Email" button
- Button calls `resendVerificationEmail()`, shows loading state and success/error feedback
- Cooldown indicator (60s between resends)

### 1F. Auth Callbacks — Auto-verify OAuth Users

In `auth.ts` signIn callback, when linking an OAuth account (Google/Facebook) to an existing user OR creating a new OAuth user:
- Set `emailVerified = new Date()` if not already set

### 1G. Registration Flow

After `registerUser()` creates the user, automatically call `sendVerificationEmail()` (best-effort, non-blocking) so credential users receive a verification email immediately.

### 1H. Session — Expose emailVerified

In `auth.ts` JWT callback, fetch `emailVerified` from DB and add to token. In session callback, expose it on `session.user.emailVerified` (boolean) so client components can check it.

---

## Feature 2: Age-Gated Forum Access (Configurable Minimum Age)

### 2A. Database — AppSetting for Configurable Age

Use the existing `AppSetting` key-value model to store:
- Key: `forum_min_age`, Value: `"16"` (default)

New server helper: `getForumMinAge()` — reads from AppSetting, falls back to 16.

### 2B. How DOB/Age is Determined

**Problem**: Adults (18+) have `dateOfBirth = null` due to GDPR data minimisation, so we cannot check their exact age.

**Solution**:
- If `dateOfBirth` is `null` → user is 18+ (adults) → always passes the forum age gate
- If `dateOfBirth` is set → user is under 18 → calculate age from DOB and compare against `forum_min_age`
- This works because DOB is only stored for under-18s

### 2C. Server-Side Enforcement (src/lib/actions.ts)

Add age check to `createThread()` and `createReply()` after the ban check:

```
const user = await db.user.findUnique({ where: { id: session.user.id }, select: { dateOfBirth: true } });
const minAge = await getForumMinAge();
if (user?.dateOfBirth) {
  const age = calculateAge(user.dateOfBirth);
  if (age < minAge) return { error: `You must be at least ${minAge} years old to post on the forum.` };
}
```

Also add the same check to `editThread()` and `editReply()`.

### 2D. Forum UI — Gating Messages

In `CreateThreadForm` and `ReplyForm`: if the server returns the age-gated error, display it clearly.

On the forum page itself: if the user's age (from session or a server check) is below the minimum, show an info banner: "You must be at least {minAge} to post. You can still browse the forum."

### 2E. Email Verification Required for Forum

Add email verification check to `createThread()` and `createReply()`:

```
const user = await db.user.findUnique({ where: { id: session.user.id }, select: { emailVerified: true, dateOfBirth: true } });
if (!user?.emailVerified) return { error: "Please verify your email before posting. Check your profile to resend the verification email." };
```

### 2F. Admin Panel — Configurable Age Limit

In the existing admin settings area, add a setting for "Minimum forum posting age" with a number input (min 13, max 18). This updates the `forum_min_age` AppSetting.

If no admin settings page exists yet for app settings, add a simple card in the admin panel to manage this.

---

## Feature 3: Quick Fix Already Done

- Removed "Only stored if you are under 18 (GDPR data minimisation)." text from ProfileEditForm — now just says "Used for age verification."

---

## Implementation Order

1. **Prisma**: No schema migration needed (emailVerified + VerificationToken + AppSetting already exist). Seed `forum_min_age = "16"` in AppSetting.
2. **Email verification server actions** + email template
3. **Verify email page** (`/verify-email?token=...`)
4. **Auth callback updates** (auto-verify OAuth, expose emailVerified in session)
5. **Registration flow** (auto-send verification email)
6. **EmailVerificationCard** on profile page
7. **Forum age + email gates** in createThread/createReply server actions
8. **Forum UI** (info banners for unverified/underage users)
9. **Admin setting** for forum_min_age
10. **Commit & push**

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/lib/email.ts` | Add `sendEmailVerification()` |
| `src/lib/actions.ts` | Add `sendVerificationEmail()`, `verifyEmail()`, `resendVerificationEmail()`, age/email gates on forum actions |
| `src/lib/auth.ts` | Auto-verify OAuth users, expose `emailVerified` in session |
| `src/app/(auth)/verify-email/page.tsx` | **New** — email verification landing page |
| `src/components/profile/EmailVerificationCard.tsx` | **New** — verification status + resend button |
| `src/app/(main)/profile/page.tsx` | Add EmailVerificationCard |
| `src/components/forum/CreateThreadForm.tsx` | Handle email/age gate errors |
| `src/components/forum/ReplyForm.tsx` | Handle email/age gate errors |
| `src/app/(main)/forum/page.tsx` | Add forum access banner for unverified/underage |
| `src/lib/queries.ts` | Add `getForumMinAge()` helper |
| Admin settings page | Add forum_min_age config |
