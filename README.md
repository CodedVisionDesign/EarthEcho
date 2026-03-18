# EarthEcho 🌍

> **Track and reduce your environmental impact with human-readable metrics, gamification, and community support**

A comprehensive web application designed for individuals to log, track, and reduce their carbon footprint across multiple environmental categories. Built as a university study project with production-grade features including real-time analytics, community engagement, and admin management tools.

**Live Demo:** https://earthecho.co.uk

---

## ✨ Key Features

### 📊 Activity Tracking
- **6 Environmental Categories:** Carbon, Water, Plastic, Recycling, Transport, Fashion
- **Human-Readable Metrics:** Convert abstract numbers into relatable comparisons (e.g., "equivalent to 3 showers worth of water")
- **Quick Logging:** One-click logging for common activities
- **Detailed Analytics:** Charts, trends, and personal impact summaries

### 🎮 Gamification
- **Points System:** Earn points based on activity impact and frequency
- **Streak Tracking:** Maintain consecutive days of logged activities
- **Badges & Achievements:** Unlock badges for milestones and consistency
- **Leaderboard:** Compete with community members (optional public profiles)
- **Challenges:** Join time-limited environmental challenges

### 👥 Community Features
- **Forum:** Discuss tips, challenges, and environmental topics
- **User Profiles:** Share progress and inspire others
- **Guides & Resources:** Curated educational content on sustainability
- **Notification System:** Real-time updates on replies, badges, and reactions

### 🔐 Authentication & Security
- **Multi-Provider Auth:** Email/Password, Google OAuth, GitHub OAuth
- **Session Management:** Secure NextAuth.js integration
- **Role-Based Access Control:** User, Admin, Super Admin, and Developer roles
- **Ban Management:** Account suspension system for policy violations
- **Password Security:** Bcrypt hashing, reset tokens, 1-hour expiry

### 🛠️ Admin Features
- **User Management:** Search, filter, sort, and manage users
- **Role Elevation:** Promote users to admin roles
- **Ban System:** Suspend accounts with reason tracking
- **Email Management:** Preview and manage notification templates
- **Forum Moderation:** Moderate threads and replies
- **Audit Logs:** Track administrative actions
- **Email Invitations:** Invite new admins with temporary credentials

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org/) - React framework with server/client components
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- [Three.js](https://threejs.org/) - 3D graphics for interactive elements
- [Globe.gl](https://github.com/vasturiano/globe.gl) - 3D globe visualization
- [Recharts](https://recharts.org/) - Data visualization charts
- [FontAwesome 7](https://fontawesome.com/) - Icon library

**Backend:**
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - RESTful API
- [NextAuth.js 5](https://authjs.dev/) - Authentication
- [Prisma ORM](https://www.prisma.io/) - Database management
- [MySQL](https://www.mysql.com/) - Primary database
- [Nodemailer](https://nodemailer.com/) - Email service
- [Zod](https://zod.dev/) - Schema validation

**DevOps:**
- [GitHub Actions](https://github.com/features/actions) - CI/CD pipeline
- [Vercel/VPS](https://vercel.com/) - Deployment & hosting
- [SSH Deployment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) - Automated VPS updates

### Directory Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages (login, register, password reset)
│   ├── (main)/              # Protected application pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── track/           # Activity tracking (carbon, water, plastic, etc.)
│   │   ├── leaderboard/     # Competitive rankings
│   │   ├── badges/          # Achievement display
│   │   ├── challenges/      # Time-limited challenges
│   │   ├── forum/           # Community discussions
│   │   ├── guides/          # Educational content
│   │   ├── profile/         # User profile management
│   │   └── resources/       # External resources
│   └── admin/               # Admin-only pages
│       ├── users/           # User management
│       ├── emails/          # Email template previews
│       ├── forum/           # Forum moderation
│       └── audit/           # Audit logs
├── components/              # Reusable React components
│   ├── ui/                  # Core UI components
│   ├── auth/                # Authentication components
│   ├── tracking/            # Tracking interface components
│   ├── admin/               # Admin panel components
│   ├── profile/             # Profile management components
│   └── landing/             # Public landing page
├── lib/                     # Utility functions & business logic
│   ├── auth.ts              # NextAuth configuration
│   ├── db.ts                # Prisma client
│   ├── actions.ts           # Server actions (mutations)
│   ├── queries.ts           # Database queries
│   ├── email.ts             # Email templates
│   ├── admin.ts             # Admin authorization
│   ├── admin-actions.ts     # Admin operations
│   ├── metrics/             # Metric calculations & conversions
│   └── categories.ts        # Activity category definitions
└── public/                  # Static assets
    └── assets/              # Images, logos, favicons

prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Database seeding

.github/
└── workflows/
    └── deploy.yml           # CI/CD deployment pipeline
```

---

## 📊 Database Schema

### Core Models

**User** - Account and profile information
- Authentication: email, password hash, sessions
- Profile: displayName, bio, customImage
- Gamification: totalPoints, streakDays, badges
- Admin: role, banned status, ban reason
- Relations: activities, badges, forum posts, challenges

**Activity** - Logged environmental actions
- Categories: WATER, CARBON, PLASTIC, RECYCLING, TRANSPORT, FASHION
- Tracking: value, unit, date, notes
- Points: automatically calculated based on impact
- Relations: user, category, point transactions

**Badge** & **UserBadge** - Achievement system
- Badge templates with criteria and descriptions
- User progress tracked through UserBadge junction table

**Challenge** - Time-limited environmental competitions
- Duration, objectives, participant tracking
- Points multiplier for challenge activities
- Leaderboard ranking

**Thread** & **Reply** - Forum discussions
- Hierarchical conversation structure
- Reactions and engagement tracking
- Moderation flags

**Notification** - Event-driven notifications
- Types: reply, reaction, badge earned, challenge progress
- Read/unread status
- Push subscription support

**AuditLog** - Admin action tracking
- Action type, affected user/resource
- Timestamp and admin identifier
- Change details (JSON)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MySQL 8.0+ database
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/CodedVisionDesign/EarthEcho.git
cd EarthEcho
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/earthecho"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Email Service
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Initialize the database**
```bash
npm run db:migrate
npm run db:seed  # Optional: populate sample data
```

5. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:3002` in your browser.

---

## 🔄 Deployment

### GitHub Actions CI/CD

The project uses GitHub Actions to automatically deploy to the VPS when code is pushed to `main` or `v1` branches.

**Deployment Flow:**
```
Push to main/v1
    ↓
GitHub Action triggered
    ↓
Run tests & build
    ↓
SSH into VPS
    ↓
Git pull & npm install
    ↓
Prisma generate & build
    ↓
Restart service
```

### Manual VPS Deployment

```bash
cd /var/www/earthecho
git fetch origin
git checkout main  # or v1
git pull origin main
npm install
npx prisma generate
npm run build
sudo systemctl restart earthecho
```

### Environment-Based Branching
- **`main`** - Production branch (auto-deploys to https://earthecho.co.uk)
- **`v1`** - Staging/testing branch (auto-deploys for testing)
- **Feature branches** - Create from `main`, merge via PR

---

## 📈 Tracking Metrics

### Activity Categories

| Category | Unit | Example Activities |
|----------|------|-------------------|
| **Carbon** | kg CO₂ | Public transit, renewable energy, sustainable shopping |
| **Water** | Litres | Shorter showers, reusable bottles, full wash loads |
| **Plastic** | Items | Plastic-free purchases, reusable containers |
| **Recycling** | kg | Paper, plastic, metal, glass recycling |
| **Transport** | km | Walking, cycling, electric vehicles |
| **Fashion** | Items | Secondhand clothes, clothes swaps, repairs |

### Points System

- Minimum 5 points per activity (encourages any logging)
- Variable points based on impact (10 pts/kg CO₂, 1 pt/10L water, etc.)
- 100 bonus points for challenge completion
- Streak bonuses for consecutive daily logging

### Leaderboard Ranking

Users ranked by:
1. **All Time** - Total points accumulated
2. **Monthly** - Points earned in current month
3. **Weekly** - Points earned in current week

---

## 🔐 Security Features

### Authentication
- **NextAuth.js 5** - Industry-standard auth library
- **CSRF Protection** - Built-in token validation
- **Session Management** - Secure cookies, configurable TTL
- **OAuth Integration** - Google & GitHub with verified state handling
- **Password Hashing** - Bcrypt with salt rounds

### Authorization
- **Role-Based Access Control (RBAC)**
  - `user` - Regular user, can log activities
  - `admin` - Can manage content and moderate
  - `superadmin` - Full system access
  - `developer` - Backend/system-level access (same as superadmin)
- **Protected Routes** - Server-side auth checks on sensitive pages
- **API Route Protection** - Middleware verification on endpoints

### Data Protection
- **Input Validation** - Zod schemas on all inputs
- **SQL Injection Prevention** - Prisma parameterized queries
- **XSS Prevention** - React's built-in HTML escaping
- **Rate Limiting** - Implemented on email endpoints
- **HTTPS Only** - Production deployment on HTTPS

### Account Safety
- **Ban System** - Suspend policy violators with reason logging
- **Banned User Signup Prevention** - Clear messaging during registration attempt
- **Password Reset Security** - 1-hour expiring tokens, OWASP compliant
- **Session Invalidation** - Immediate logout on ban

---

## 📧 Email System

### Email Templates
- Welcome email for new users
- Password reset with security warnings
- Admin invitations with temporary credentials
- Account suspension notifications
- Notification emails (forum replies, badges, reactions)

### Configuration
- SMTP support (Gmail, custom SMTP servers)
- Reply-to: `contact@earthecho.co.uk`
- HTML templates with responsive design
- Logo: `logo.webp` (high contrast, professional styling)
- Branded footer with website links

### Email Preview
Admins can preview all email templates at `/admin/emails` before they're sent.

---

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Forest green (#2D6A4F), ocean blue, sunshine yellow, coral
- **Typography**: Inter/system fonts, responsive sizing
- **Components**: Reusable, accessible UI components
- **Animations**: Smooth transitions with Framer Motion & GSAP
- **3D Graphics**: Three.js particle effects, interactive globe

### Accessibility
- WCAG 2.1 AA compliance target
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast mode ready

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints: sm, md, lg, xl, 2xl
- Adaptive layouts for all screen sizes
- Touch-friendly interface

---

## 🧪 Testing & Quality

### Code Quality
- ESLint configuration for code standards
- TypeScript strict mode for type safety
- Prisma schema validation
- Input validation with Zod schemas

### Database
```bash
# Run migrations
npm run db:migrate

# Reset database (dev only)
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

---

## 📝 Git Workflow

### Branch Strategy
- **`main`** - Production (protected, auto-deploys)
- **`v1`** - Testing/staging (auto-deploys for QA)
- **`feat/***`** - Feature branches (create from main)
- **`fix/***`** - Bug fix branches (create from main)

### Commit Convention
- Clear, descriptive commit messages
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code restructuring
- `test:` - Test changes
- `chore:` - Dependency updates

### Pull Request Process
1. Create feature branch from `main`
2. Make changes and commit
3. Push to origin
4. Create pull request with description
5. Await review and approval
6. Merge with squash option
7. Delete branch after merge

---

## 🐛 Common Tasks

### Add a New Activity Type

1. Update `src/lib/categories.ts`:
```typescript
{
  value: "new_activity",
  label: "New Activity Label",
  defaultValue: 10,
  hint: "Helpful hint text",
  quickLog: true,
  quickLogEmoji: "📱"
}
```

2. The activity will automatically appear in the tracking interface

### Create a New Badge

1. Add to database:
```bash
npm run db:studio
# Navigate to Badge model and add new record
```

2. Create unlock logic in `src/lib/badges.ts`

### Update Email Template

1. Edit `src/lib/email.ts`
2. Preview at `/admin/emails`
3. Commit and deploy

### Grant Admin Access

1. Go to `/admin/users`
2. Find the user
3. Click "Promote to Admin"
4. User receives email with temporary credentials

---

## 📚 Documentation

### Code Documentation
- JSDoc comments on utility functions
- Type annotations throughout codebase
- Component prop documentation

### API Documentation
- RESTful endpoints in `/src/app/api`
- NextAuth configuration in `src/lib/auth.ts`
- Database schema in `prisma/schema.prisma`

---

## 🤝 Contributing

This is a university study project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of a university study program.

---

## 👥 Team & Credits

**Developed by:** CodedVisionDesign
**Project Type:** University Study Project
**Version:** 0.1.0

---

## 📞 Support

- **Email:** contact@earthecho.co.uk
- **Issues:** GitHub Issues on the repository
- **Website:** https://earthecho.co.uk

---

## 🌱 Environmental Impact

EarthEcho's mission is to make environmental impact tracking accessible and engaging. Every feature is designed to inspire users to log activities, learn about sustainability, and connect with a supportive community committed to protecting our planet.

**Together, we track. Together, we reduce. Together, we make a difference.** 🌍
