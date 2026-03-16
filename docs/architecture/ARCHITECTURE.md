# CarbonFootprint - Architecture Document

## Project Overview

CarbonFootprint is a multi-page application (MPA) that serves as a one-stop shop for individuals to understand, track, and reduce their environmental impact. It combines carbon footprint tracking, water usage, plastic consumption, recycling habits, and sustainable shopping (charity shops, Vinted, etc.) into a single platform with a visually engaging dashboard.

**What makes this different**: Human-readable metrics ("1 swimming pool" not "100L"), gamification, and a supportive community forum.

---

## Project Classification

| Dimension | Classification | Rationale |
|-----------|---------------|-----------|
| Scale | MVP → SaaS (1K-10K users initially) | Start small, grow organically |
| Team | Solo/Small | Single developer, possible contributors later |
| Timeline | Medium (months) | MVP first, iterate |
| Architecture | Modular Monolith | Single Next.js app, clean module boundaries |
| Patterns | Selective | Only add complexity when proven necessary |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| UI Library | React | 19.x |
| Language | TypeScript | 5.x |
| Database | PostgreSQL | 16.x |
| ORM | Prisma | 6.x |
| Auth | NextAuth.js (Auth.js v5) | 5.x |
| Charts | Recharts | 2.x |
| Styling | Tailwind CSS + shadcn/ui | 4.x / latest |
| Caching | Redis | 7.x |
| Hosting | Hostinger VPS | Ubuntu + PM2/Docker |

---

## Architecture Decision Records

### ADR-001: Next.js 15 App Router (Modular Monolith)

**Context**: Need a full-stack framework that supports server-rendered MPA pages, API routes, and can run on a VPS.

**Decision**: Next.js 15 with App Router and React 19 Server Components.

**Rationale**:
1. Server Components reduce client JS bundle — faster dashboards
2. App Router supports layouts, loading states, and streaming natively
3. API routes eliminate need for separate backend
4. Single deployment unit — simple VPS hosting with PM2

**Trade-offs Accepted**:
- Tied to Vercel's framework decisions (mitigated: can self-host)
- Server Components have a learning curve
- Less flexibility than separate API + SPA (acceptable for our scale)

**Revisit When**: Need mobile app (would need separate API), or scale >100K users.

---

### ADR-002: PostgreSQL over MongoDB

**Context**: Need to store user profiles, activity logs, forum posts, gamification data with relationships.

**Decision**: PostgreSQL with Prisma ORM.

**Rationale**:
1. Relational data model fits perfectly — users have activities, badges, forum posts
2. PostgreSQL excels at aggregations needed for dashboard analytics
3. Prisma provides type-safe queries with TypeScript
4. ACID compliance for leaderboard calculations and badge awards

**Trade-offs Accepted**:
- Schema migrations needed for changes (mitigated: Prisma handles this well)
- Less flexible for unstructured data (acceptable: our data is well-structured)

---

### ADR-003: Auth.js v5 (NextAuth) for Authentication

**Context**: Need email/password, Google OAuth, and Facebook OAuth login.

**Decision**: Auth.js v5 with Prisma adapter.

**Rationale**:
1. Built-in providers for Google and Facebook
2. Credentials provider for email/password
3. Prisma adapter stores sessions in PostgreSQL
4. Handles CSRF, JWT/session tokens, and security best practices

**Trade-offs Accepted**:
- Credentials provider requires manual password hashing (bcrypt)
- Less control than building auth from scratch (acceptable: security > control)

---

### ADR-004: Recharts for Dashboard Visualizations

**Context**: Need interactive, responsive charts that display human-readable environmental metrics.

**Decision**: Recharts with custom tooltip/label components.

**Rationale**:
1. React-native — works seamlessly with React 19
2. Declarative API matches our component-driven approach
3. Customizable tooltips for human-readable metric conversion
4. Good performance with moderate data volumes
5. Active community and maintenance

**Alternatives Considered**:
- Chart.js: More performant but less React-idiomatic
- D3.js: Too low-level for our needs
- ApexCharts: Heavier bundle, less React integration

---

### ADR-005: Redis for Caching

**Context**: Leaderboards, dashboard aggregations, and session data need fast access.

**Decision**: Redis for caching leaderboards, computed metrics, and rate limiting.

**Rationale**:
1. Sorted sets are perfect for leaderboards
2. Cache dashboard aggregations (recompute hourly, not per request)
3. Rate limiting for API/forum to prevent abuse
4. Session storage option for Auth.js

**Trade-offs Accepted**:
- Additional infrastructure on VPS (mitigated: Redis is lightweight)
- Data loss on restart for cache (acceptable: cache is rebuilt from PostgreSQL)

---

## Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js 15 App                    │
├──────────────┬──────────────┬───────────────────────┤
│   Pages/     │   API        │   Server              │
│   Layouts    │   Routes     │   Actions             │
│   (RSC)      │   (/api/*)   │   (mutations)         │
├──────────────┴──────────────┴───────────────────────┤
│                  Service Layer                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ Activity │ │ Metrics  │ │ Forum    │ │ Gamify │ │
│  │ Service  │ │ Service  │ │ Service  │ │Service │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
├─────────────────────────────────────────────────────┤
│                  Data Layer                          │
│  ┌──────────────────┐    ┌─────────────────────┐    │
│  │  Prisma ORM      │    │  Redis Cache         │    │
│  │  (PostgreSQL)     │    │  (Leaderboards,     │    │
│  │                   │    │   Metrics Cache)     │    │
│  └──────────────────┘    └─────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (login, register)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (main)/                   # Authenticated layout group
│   │   ├── dashboard/page.tsx    # Main dashboard
│   │   ├── track/                # Activity tracking pages
│   │   │   ├── water/page.tsx
│   │   │   ├── plastic/page.tsx
│   │   │   ├── recycling/page.tsx
│   │   │   ├── transport/page.tsx
│   │   │   └── shopping/page.tsx
│   │   ├── forum/                # Community forum
│   │   │   ├── page.tsx          # Forum home
│   │   │   └── [threadId]/page.tsx
│   │   ├── challenges/page.tsx   # Monthly challenges
│   │   ├── leaderboard/page.tsx  # Leaderboard
│   │   ├── badges/page.tsx       # Badge collection
│   │   ├── resources/page.tsx    # Signposted websites
│   │   ├── profile/page.tsx      # User profile
│   │   └── layout.tsx            # Main layout with sidebar
│   ├── api/                      # API routes
│   │   └── auth/[...nextauth]/route.ts
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page (public)
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── charts/                   # Dashboard chart components
│   │   ├── WaterUsageChart.tsx
│   │   ├── CarbonChart.tsx
│   │   ├── PlasticChart.tsx
│   │   └── ImpactSummary.tsx
│   ├── dashboard/                # Dashboard-specific components
│   ├── forum/                    # Forum components
│   └── gamification/             # Badges, leaderboard components
├── lib/
│   ├── auth.ts                   # Auth.js configuration
│   ├── db.ts                     # Prisma client singleton
│   ├── redis.ts                  # Redis client
│   ├── metrics/                  # Human-readable metric conversions
│   │   ├── water.ts              # L → bathtubs, swimming pools
│   │   ├── carbon.ts             # kg CO2 → car journeys, flights
│   │   ├── plastic.ts            # items → bags, bottles
│   │   └── converters.ts         # Shared conversion utilities
│   └── validators/               # Zod schemas for form validation
├── services/
│   ├── activity.service.ts       # Log & query activities
│   ├── metrics.service.ts        # Calculate & cache dashboard metrics
│   ├── forum.service.ts          # Forum CRUD
│   ├── gamification.service.ts   # Badges, points, challenges
│   └── leaderboard.service.ts    # Leaderboard calculations
├── types/
│   └── index.ts                  # Shared TypeScript types
└── prisma/
    ├── schema.prisma             # Database schema
    └── seed.ts                   # Seed data (badges, challenges)
```

---

## Human-Readable Metrics System

This is a core differentiator. All metrics stored in base units, converted for display:

| Category | Base Unit | Human-Readable Examples |
|----------|-----------|------------------------|
| Water | Litres (L) | "1 bathtub" (80L), "half a swimming pool" (25,000L) |
| Carbon | kg CO2e | "3 car journeys to work" (per 10kg), "1 return flight to Paris" (per 500kg) |
| Plastic | Items | "50 shopping bags avoided", "enough bottles to fill 2 recycling bins" |
| Recycling | kg | "saved 3 trees" (per 60kg paper), "powered your home for 2 days" (energy saved) |
| Clothing | Items | "avoided 25kg CO2 by buying secondhand" (per fast-fashion equivalent) |

**Implementation**: Converter functions in `lib/metrics/` that take raw values and return `{ value: string, icon: string, comparison: string }`.

---

## Authentication Flow

```
User → Login Page → Choose Method:
  ├── Email/Password → Credentials Provider → bcrypt verify → Session
  ├── Google → Google OAuth Provider → Callback → Session
  └── Facebook → Facebook OAuth Provider → Callback → Session
                                                        ↓
                                              Prisma Adapter → PostgreSQL
                                              (User, Account, Session tables)
```

---

## Gamification System

### Points System
| Action | Points |
|--------|--------|
| Log daily activity | 10 |
| Complete weekly streak (7 days) | 50 |
| Complete a monthly challenge | 100 |
| Forum post | 5 |
| Forum reply | 3 |
| Help another user (upvoted reply) | 10 |

### Badge Categories
- **Starter**: First log, first forum post, complete profile
- **Streaks**: 7-day, 30-day, 90-day logging streaks
- **Impact**: Save 1000L water, avoid 100 plastic items, recycle 50kg
- **Community**: 10 forum posts, 50 helpful replies, mentor badge
- **Challenge**: Complete 1, 3, 6, 12 monthly challenges

### Monthly Challenges
- Rotating themed challenges (e.g., "Plastic-Free March", "Walk to Work Week")
- Community-wide progress bar
- Top participants highlighted on leaderboard

---

## Deployment Architecture (Hostinger VPS)

```
Hostinger VPS (Ubuntu 22.04)
├── Nginx (reverse proxy, SSL termination)
│   └── Let's Encrypt (free HTTPS)
├── Node.js 20 LTS
│   └── PM2 (process manager)
│       └── Next.js App (port 3000)
├── PostgreSQL 16
│   └── CarbonFootprint database
├── Redis 7
│   └── Cache + Leaderboards
└── Cron Jobs
    ├── Daily: Recalculate leaderboards
    ├── Weekly: Generate streak badges
    └── Monthly: Reset challenges, send reports
```

---

## Security Considerations

1. **Auth**: bcrypt for passwords, CSRF protection via Auth.js, HTTP-only cookies
2. **Input Validation**: Zod schemas on all form inputs (client + server)
3. **SQL Injection**: Prisma parameterized queries (protected by default)
4. **XSS**: React escapes by default, CSP headers via Next.js
5. **Rate Limiting**: Redis-based rate limiting on auth and API endpoints
6. **HTTPS**: Enforced via Nginx + Let's Encrypt

---

## Performance Strategy

1. **Server Components**: Dashboard pages render on server, minimal client JS
2. **Redis Caching**: Leaderboards, aggregated metrics cached (TTL: 1 hour)
3. **Prisma Query Optimization**: Select only needed fields, pagination
4. **Image Optimization**: Next.js Image component for badges/assets
5. **Streaming**: React Suspense boundaries for dashboard loading states

---

## Future Considerations (Not in MVP)

- Mobile app (React Native, sharing API routes)
- Email reports (weekly/monthly impact summaries)
- Household mode (family tracking)
- Local council recycling data integration
- Carbon offset partner integrations
- Social media sharing (impact cards)
- PWA support for mobile-like experience
