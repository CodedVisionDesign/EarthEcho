# Demo User Credentials

All demo accounts use the same password for convenience during development.

| User | Email | Password | Display Name | Points | Role |
|------|-------|----------|-------------|--------|------|
| Demo User | demo@example.com | demo1234 | EcoWarrior | 1,250 | Primary test account |
| Sarah Green | sarah@example.com | demo1234 | GreenSarah | 2,100 | Top leaderboard user |
| James Rivers | james@example.com | demo1234 | EcoJames | 680 | New user / low activity |
| Priya Patel | priya@example.com | demo1234 | PriyaEco | 1,580 | Mid-range user |

## Quick Start

1. Run `npm run db:reset` to reset and seed the database
2. Start the dev server: `npm run dev`
3. Navigate to http://localhost:3002/login
4. Log in with any account above

## What's Seeded

- **80+ activities** across all 6 categories (water, carbon, plastic, recycling, transport, fashion)
- **4 challenges** (2 active, 1 ended, 1 upcoming)
- **6 badges** earned by demo user, others distributed across users
- **4 forum threads** with 8 replies and 5 reactions
- **25 point transactions** for demo user
- **12 resources** (real UK environmental websites)
- **12 transport modes** with CO2 emission factors
- **24 badges** with criteria definitions
