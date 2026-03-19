# Earth Echo — Full Documentation

> Track and reduce your environmental impact with human-readable metrics, gamification, and community support.

## Overview

Earth Echo is an environmental impact tracking platform that helps individuals understand and reduce their carbon footprint. The app transforms complex environmental data into human-readable metrics (e.g., "equivalent to 3 car journeys" rather than "4.2kg CO2e") and uses gamification to motivate sustained behaviour change.

## Target Audience

- Environmentally conscious individuals looking to quantify and reduce their impact
- Students and educators studying sustainability
- Organisations running internal green challenges
- Anyone curious about their environmental footprint

## Tracking Categories

### 1. Carbon Emissions
Track activities that produce CO2 emissions: energy usage, heating, cooking, and general household activities. View equivalences in relatable terms.

### 2. Water Usage
Log daily water consumption from showers, baths, washing, cooking, and garden use. Compare against UK/global averages.

### 3. Plastic Consumption
Record single-use plastic items used daily. Track reduction over time with alternatives suggestions.

### 4. Recycling
Log recycling activities by material type (paper, glass, metal, plastic, electronics). Earn bonus points for proper sorting.

### 5. Transport
Track commutes and journeys by mode (car, bus, train, bicycle, walking, flight). Calculate emissions savings from greener choices.

### 6. Sustainable Shopping
Log ethical fashion and sustainable product purchases. Track fast-fashion avoidance and support for eco-brands.

## Gamification System

### Points
Every logged activity earns points weighted by environmental impact. Bonus multipliers for streaks and challenge participation.

### Badges
Achievement badges awarded for milestones:
- First Log, 7-Day Streak, 30-Day Streak
- Zero Waste Day, Carbon Neutral Week
- Community Contributor, Challenge Champion
- Category-specific mastery badges

### Streaks
Consecutive daily logging builds streaks. Longer streaks earn multiplied points and exclusive badges.

### Challenges
Time-limited community challenges with specific goals (e.g., "Plastic-Free July", "Cycle to Work Week"). Participants compete on leaderboards.

### Leaderboard
Global rankings filtered by time period (weekly, monthly, all-time). Rankings based on points, badge count, or streak length.

## Community Features

### Forum
Discussion threads organised by topic. Users can create threads, reply, and support each other's sustainability journeys.

### Guides
Expert-written sustainability guides covering practical tips for reducing environmental impact across all tracking categories.

### Eco App Directory
Curated collection of third-party apps and tools that complement the Earth Echo experience (recycling locators, carbon calculators, ethical shopping guides).

## Privacy & Data

- GDPR-compliant data handling
- Minimal data collection (email, name, activity logs)
- No third-party advertising or tracking (Google Analytics with explicit consent only)
- Data deletion available on request
- All authentication data encrypted (bcrypt for passwords, JWT sessions)
- WebAuthn/passkey support for passwordless authentication

## API & Integration

Earth Echo uses server-side rendering and server actions. There is no public REST API at this time. Authentication is handled via Auth.js v5 supporting:
- Google OAuth
- Facebook OAuth
- Email/password with bcrypt
- WebAuthn/passkeys (FIDO2)

## Native Apps

Available as a Progressive Web App (PWA) installable from the browser, and as a native Android app via Capacitor. iOS app is planned.

- Android: Capacitor 8 wrapper loading the hosted web app
- Push notifications via Firebase Cloud Messaging (Android) and Web Push (browser)
- Offline fallback page for connectivity issues

## Contact & Support

- **Website**: https://earthecho.co.uk
- **Email**: contact@earthecho.co.uk
- **Privacy Policy**: https://earthecho.co.uk/privacy
- **Terms of Service**: https://earthecho.co.uk/terms
- **Data Deletion**: https://earthecho.co.uk/data-deletion
