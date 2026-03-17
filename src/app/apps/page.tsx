import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faLeaf,
} from "@/lib/fontawesome";
import { faApple, faGooglePlay } from "@/lib/fontawesome";
import { Navigation } from "@/components/landing/Navigation";
import { Logo } from "@/components/ui/Logo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";

interface EcoApp {
  name: string;
  tagline: string;
  description: string;
  iconUrl: string;
  category: string;
  categoryLabel: string;
  categoryColor: string;
  categoryTextColor: string;
  platforms: ("ios" | "android" | "web")[];
  websiteUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  features: string[];
  rating?: number;
}

const ECO_APPS: EcoApp[] = [
  {
    name: "Giki Zero",
    tagline: "Know your footprint",
    description:
      "Calculate your carbon footprint and get a personalised action plan. Track progress across food, travel, home, and shopping.",
    iconUrl: "https://www.google.com/s2/favicons?domain=giki.earth&sz=128",
    category: "carbon",
    categoryLabel: "Carbon",
    categoryColor: "bg-emerald-50",
    categoryTextColor: "text-emerald-700",
    platforms: ["ios", "android", "web"],
    websiteUrl: "https://zero.giki.earth",
    appStoreUrl: "https://apps.apple.com/gb/app/giki-zero/id1489664516",
    playStoreUrl: "https://play.google.com/store/apps/details?id=earth.giki.zero",
    features: ["Carbon calculator", "Personalised tips", "Progress tracking"],
    rating: 4.5,
  },
  {
    name: "Olio",
    tagline: "Share, don't waste",
    description:
      "Share surplus food with neighbours instead of throwing it away. Connects communities to reduce food waste locally.",
    iconUrl: "https://www.google.com/s2/favicons?domain=olioapp.com&sz=128",
    category: "food_waste",
    categoryLabel: "Food Waste",
    categoryColor: "bg-lime-50",
    categoryTextColor: "text-lime-700",
    platforms: ["ios", "android"],
    websiteUrl: "https://olioapp.com",
    appStoreUrl: "https://apps.apple.com/gb/app/olio/id1008237086",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.olioex.android",
    features: ["Food sharing", "Local community", "Zero waste"],
    rating: 4.7,
  },
  {
    name: "Too Good To Go",
    tagline: "Rescue delicious food",
    description:
      "Rescue unsold food from restaurants and shops at a third of the price. Fight food waste while saving money.",
    iconUrl:
      "https://www.google.com/s2/favicons?domain=toogoodtogo.com&sz=128",
    category: "food_waste",
    categoryLabel: "Food Waste",
    categoryColor: "bg-lime-50",
    categoryTextColor: "text-lime-700",
    platforms: ["ios", "android"],
    websiteUrl: "https://www.toogoodtogo.com",
    appStoreUrl: "https://apps.apple.com/gb/app/too-good-to-go-end-food-waste/id1060683933",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.app.tgtg",
    features: ["Surprise bags", "Discounted meals", "Waste reduction"],
    rating: 4.8,
  },
  {
    name: "Ecosia",
    tagline: "Search & plant trees",
    description:
      "A search engine that plants trees with its ad revenue. Every ~45 searches plants a tree. Simple swap, real impact.",
    iconUrl: "https://www.google.com/s2/favicons?domain=ecosia.org&sz=128",
    category: "carbon",
    categoryLabel: "Carbon",
    categoryColor: "bg-emerald-50",
    categoryTextColor: "text-emerald-700",
    platforms: ["ios", "android", "web"],
    websiteUrl: "https://www.ecosia.org",
    appStoreUrl: "https://apps.apple.com/gb/app/ecosia/id670881887",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.ecosia.android",
    features: ["Plants trees", "Privacy focused", "Browser extension"],
    rating: 4.6,
  },
  {
    name: "Refill",
    tagline: "Find free water",
    description:
      "Find free water refill stations near you. Reduce plastic bottle waste by refilling your reusable bottle on the go.",
    iconUrl: "https://www.google.com/s2/favicons?domain=refill.org.uk&sz=128",
    category: "water",
    categoryLabel: "Water",
    categoryColor: "bg-sky-50",
    categoryTextColor: "text-sky-700",
    platforms: ["ios", "android"],
    websiteUrl: "https://www.refill.org.uk",
    appStoreUrl: "https://apps.apple.com/gb/app/refill/id1237723389",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.refill.refill",
    features: ["Refill station map", "Plastic reduction", "UK-wide"],
    rating: 4.3,
  },
  {
    name: "Citymapper",
    tagline: "Greener commutes",
    description:
      "Plan journeys by public transport, cycling, and walking. Compare CO\u2082 emissions for different route options.",
    iconUrl: "https://www.google.com/s2/favicons?domain=citymapper.com&sz=128",
    category: "transport",
    categoryLabel: "Transport",
    categoryColor: "bg-blue-50",
    categoryTextColor: "text-blue-700",
    platforms: ["ios", "android", "web"],
    websiteUrl: "https://citymapper.com",
    appStoreUrl: "https://apps.apple.com/gb/app/citymapper-all-your-transport/id469463298",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.citymapper.app.release",
    features: ["Route planning", "CO\u2082 comparison", "Multi-modal"],
    rating: 4.7,
  },
  {
    name: "Vinted",
    tagline: "Secondhand fashion",
    description:
      "Buy and sell secondhand clothes. Give fashion a second life and keep textiles out of landfill.",
    iconUrl: "https://www.google.com/s2/favicons?domain=vinted.co.uk&sz=128",
    category: "shopping",
    categoryLabel: "Shopping",
    categoryColor: "bg-amber-50",
    categoryTextColor: "text-amber-700",
    platforms: ["ios", "android", "web"],
    websiteUrl: "https://www.vinted.co.uk",
    appStoreUrl: "https://apps.apple.com/gb/app/vinted-sell-buy-second-hand/id632064380",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.vinted",
    features: ["Secondhand fashion", "No seller fees", "Circular economy"],
    rating: 4.5,
  },
  {
    name: "Bulb Energy Monitor",
    tagline: "Track home energy",
    description:
      "Track your home energy usage in real time. Identify waste, set budgets, and reduce your bills and carbon footprint.",
    iconUrl: "https://www.google.com/s2/favicons?domain=bulb.co.uk&sz=128",
    category: "energy",
    categoryLabel: "Energy",
    categoryColor: "bg-orange-50",
    categoryTextColor: "text-orange-700",
    platforms: ["ios", "android"],
    websiteUrl: "https://bulb.co.uk",
    appStoreUrl: "https://apps.apple.com/gb/app/bulb-account/id1257928592",
    playStoreUrl: "https://play.google.com/store/apps/details?id=uk.co.bulb",
    features: ["Real-time usage", "Bill tracking", "Energy saving tips"],
    rating: 4.1,
  },
  {
    name: "JouleBug",
    tagline: "Gamified green living",
    description:
      "Turn sustainability into a social game. Earn points for eco-friendly actions and compete with friends.",
    iconUrl: "https://www.google.com/s2/favicons?domain=joulebug.com&sz=128",
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    categoryColor: "bg-violet-50",
    categoryTextColor: "text-violet-700",
    platforms: ["ios", "android"],
    websiteUrl: "https://joulebug.com",
    appStoreUrl: "https://apps.apple.com/us/app/joulebug/id391199498",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.cleanbit.joulebug",
    features: ["Gamified habits", "Social challenges", "Impact tracking"],
    rating: 4.4,
  },
  {
    name: "iRecycle",
    tagline: "Recycle anything",
    description:
      "Find recycling centres near you for any material. Covers electronics, batteries, textiles, and household waste.",
    iconUrl:
      "https://www.google.com/s2/favicons?domain=recyclenow.com&sz=128",
    category: "recycling",
    categoryLabel: "Recycling",
    categoryColor: "bg-teal-50",
    categoryTextColor: "text-teal-700",
    platforms: ["ios", "android", "web"],
    websiteUrl: "https://www.recyclenow.com",
    appStoreUrl: "https://apps.apple.com/us/app/irecycle/id327071498",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.earth911",
    features: ["Recycling locator", "Material guides", "Council lookup"],
    rating: 4.2,
  },
  {
    name: "ShareMyToolbox",
    tagline: "Borrow, don't buy",
    description:
      "Borrow tools and equipment from your community instead of buying new. Reduce consumption and save money.",
    iconUrl:
      "https://www.google.com/s2/favicons?domain=sharemytoolbox.com&sz=128",
    category: "shopping",
    categoryLabel: "Shopping",
    categoryColor: "bg-amber-50",
    categoryTextColor: "text-amber-700",
    platforms: ["web"],
    websiteUrl: "https://www.sharemytoolbox.com",
    features: ["Tool sharing", "Community lending", "Reduce buying"],
    rating: 4.0,
  },
  {
    name: "Zap-Map",
    tagline: "Find EV chargers",
    description:
      "Find EV charging points across the UK. Filter by connector type, speed, and network. Essential for EV drivers.",
    iconUrl: "https://www.google.com/s2/favicons?domain=zap-map.com&sz=128",
    category: "transport",
    categoryLabel: "Transport",
    categoryColor: "bg-blue-50",
    categoryTextColor: "text-blue-700",
    platforms: ["ios", "android", "web"],
    websiteUrl: "https://www.zap-map.com",
    appStoreUrl: "https://apps.apple.com/gb/app/zap-map-ev-charging-points/id592674782",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.zapmap",
    features: ["Charging map", "Route planner", "Real-time availability"],
    rating: 4.6,
  },
  {
    name: "Vegan Outfitters",
    tagline: "Ethical vegan fashion",
    description:
      "Shop 100% vegan clothing, shoes, and accessories. Cruelty-free fashion that looks good and does good for animals and the planet.",
    iconUrl: "/assets/vegan-outfitters.png",
    category: "shopping",
    categoryLabel: "Shopping",
    categoryColor: "bg-amber-50",
    categoryTextColor: "text-amber-700",
    platforms: ["web"],
    websiteUrl: "https://vo.clothing",
    features: ["Vegan fashion", "Cruelty-free", "Ethical brands"],
    rating: 4.5,
  },
  {
    name: "Vegan Runners",
    tagline: "Run fuelled by plants",
    description:
      "A UK-wide running club for vegans. Join events, find local groups, and connect with plant-powered athletes across the country.",
    iconUrl: "/assets/vegan-runners.png",
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    categoryColor: "bg-violet-50",
    categoryTextColor: "text-violet-700",
    platforms: ["web"],
    websiteUrl: "https://www.veganrunners.org.uk",
    features: ["Running club", "Vegan community", "UK events"],
    rating: 4.3,
  },
];

const CATEGORIES = [
  { key: "all", label: "All Apps" },
  { key: "carbon", label: "Carbon" },
  { key: "food_waste", label: "Food Waste" },
  { key: "transport", label: "Transport" },
  { key: "water", label: "Water" },
  { key: "energy", label: "Energy" },
  { key: "shopping", label: "Shopping" },
  { key: "recycling", label: "Recycling" },
  { key: "lifestyle", label: "Lifestyle" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-3 w-3 ${
            star <= Math.floor(rating)
              ? "text-amber-400"
              : star - 0.5 <= rating
                ? "text-amber-300"
                : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-[11px] font-medium text-slate">{rating}</span>
    </div>
  );
}

function PlatformBadges({ app }: { app: EcoApp }) {
  const badgeBase =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors";
  const linkBadge = `${badgeBase} bg-gray-100 text-slate hover:bg-forest/10 hover:text-forest`;
  const plainBadge = `${badgeBase} bg-gray-100 text-slate`;

  return (
    <div className="flex items-center gap-1.5">
      {app.platforms.includes("ios") &&
        (app.appStoreUrl ? (
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBadge}
          >
            <FontAwesomeIcon
              icon={faApple}
              className="h-3 w-3"
              aria-hidden
            />
            iOS
          </a>
        ) : (
          <span className={plainBadge}>
            <FontAwesomeIcon
              icon={faApple}
              className="h-3 w-3"
              aria-hidden
            />
            iOS
          </span>
        ))}
      {app.platforms.includes("android") &&
        (app.playStoreUrl ? (
          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBadge}
          >
            <FontAwesomeIcon
              icon={faGooglePlay}
              className="h-3 w-3"
              aria-hidden
            />
            Android
          </a>
        ) : (
          <span className={plainBadge}>
            <FontAwesomeIcon
              icon={faGooglePlay}
              className="h-3 w-3"
              aria-hidden
            />
            Android
          </span>
        ))}
      {app.platforms.includes("web") &&
        (app.websiteUrl ? (
          <a
            href={app.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBadge}
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="h-2.5 w-2.5"
              aria-hidden
            />
            Web
          </a>
        ) : (
          <span className={plainBadge}>Web</span>
        ))}
    </div>
  );
}

function AppCard({ app }: { app: EcoApp }) {
  const primaryUrl = app.websiteUrl || app.appStoreUrl || app.playStoreUrl;

  return (
    <div className="group block h-full">
      <Card
        variant="interactive"
        className="flex h-full flex-col justify-between p-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
      >
        {/* Header with icon */}
        <div className="p-5 pb-0">
          <div className="mb-4 flex items-start gap-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <Image
                src={app.iconUrl}
                alt={`${app.name} icon`}
                width={56}
                height={56}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {primaryUrl ? (
                  <a
                    href={primaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-base font-semibold text-charcoal transition-colors hover:text-forest"
                  >
                    {app.name}
                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      className="ml-1.5 inline h-3 w-3 text-slate/40 transition-colors hover:text-forest"
                      aria-hidden
                    />
                  </a>
                ) : (
                  <h3 className="truncate text-base font-semibold text-charcoal">
                    {app.name}
                  </h3>
                )}
              </div>
              <p className="text-xs font-medium text-slate">{app.tagline}</p>
              {app.rating && <StarRating rating={app.rating} />}
            </div>
          </div>

          <p className="mb-3 text-[13px] leading-relaxed text-slate">
            {app.description}
          </p>

          {/* Features */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {app.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-slate"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
          <PlatformBadges app={app} />
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${app.categoryColor} ${app.categoryTextColor}`}
          >
            {app.categoryLabel}
          </span>
        </div>
      </Card>
    </div>
  );
}

export default function EcoAppsPage() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navigation variant="light" />

      {/* Hero Header */}
      <section className="border-b border-gray-200/60 bg-gradient-to-b from-white to-emerald-50/30 pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn variant="slide-up-big" cinematic>
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/8">
                <FontAwesomeIcon
                  icon={faLeaf}
                  className="h-7 w-7 text-forest"
                  aria-hidden
                />
              </div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-charcoal md:text-5xl">
                Eco App Directory
              </h1>
              <p className="text-lg text-slate">
                A curated collection of apps and tools to help you live more
                sustainably. All free or freemium, all genuinely useful.
              </p>
            </div>
          </FadeIn>

          {/* Category filters */}
          <FadeIn variant="fade-up" delay={0.2}>
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <span
                  key={cat.key}
                  className={`cursor-default rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    cat.key === "all"
                      ? "border-forest bg-forest text-white"
                      : "border-gray-200 bg-white text-slate hover:border-forest/30 hover:text-forest"
                  }`}
                >
                  {cat.label}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-gray-200/60 bg-white py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-8 px-6 text-center md:gap-16">
          <div>
            <p className="text-2xl font-bold text-forest">{ECO_APPS.length}</p>
            <p className="text-xs font-medium text-slate">Curated Apps</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <p className="text-2xl font-bold text-forest">
              {new Set(ECO_APPS.map((a) => a.category)).size}
            </p>
            <p className="text-xs font-medium text-slate">Categories</p>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <p className="text-2xl font-bold text-forest">100%</p>
            <p className="text-xs font-medium text-slate">Free to Use</p>
          </div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <StaggerGroup
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            stagger={0.06}
            itemVariant="zoom-in"
          >
            {ECO_APPS.map((app) => (
              <StaggerItem key={app.name} variant="zoom-in">
                <AppCard app={app} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200/60 bg-gradient-to-b from-white to-emerald-50/40 py-20">
        <FadeIn variant="fade-up" cinematic>
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-charcoal">
              Track Your Impact Alongside These Tools
            </h2>
            <p className="mb-8 text-slate">
              Use these apps in your daily life, then log your progress on Earth
              Echo to see your full environmental picture.
            </p>
            <Button
              variant="primary"
              size="lg"
              rightIcon={faArrowRight}
              href="/register"
            >
              Start Tracking Free
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 bg-charcoal py-8 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <Logo size="sm" textClassName="text-white" />
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Earth Echo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
