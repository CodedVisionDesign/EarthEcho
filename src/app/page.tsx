import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faChartLine,
  faCar,
  faTrophy,
  faComments,
  faRecycle,
  faLink,
  faBath,
  faTrashCan,
  faTree,
  faArrowRight,
  faRocket,
  faDroplet,
  faEarthAmericas,
  faUserPlus,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";
import Image from "next/image";
import { DashboardDemo } from "@/components/landing/DashboardDemo";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const FEATURES: {
  icon: IconDefinition;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    icon: faChartLine,
    title: "Visual Dashboard",
    description:
      'See your impact in ways that make sense. "3 bathtubs of water saved" not "240 litres".',
    color: "bg-ocean/10 text-ocean",
  },
  {
    icon: faCar,
    title: "Transport Tracker",
    description:
      "Compare cycling vs driving vs bus. Track EV savings, flight offsets, and active transport health benefits.",
    color: "bg-forest/10 text-forest",
  },
  {
    icon: faTrophy,
    title: "Gamification",
    description:
      "Earn badges, climb leaderboards, and complete monthly challenges. Make saving the planet fun.",
    color: "bg-sunshine/20 text-amber-700",
  },
  {
    icon: faComments,
    title: "Community Forum",
    description:
      "Share tips, celebrate wins, and cheer each other on. You're not doing this alone.",
    color: "bg-coral/10 text-coral",
  },
  {
    icon: faRecycle,
    title: "Track Everything",
    description:
      "Water, carbon, plastic, recycling, transport, and fashion. One place for your full environmental picture.",
    color: "bg-leaf/10 text-leaf",
  },
  {
    icon: faLink,
    title: "Useful Resources",
    description:
      "Curated links to organisations like Energy Saving Trust, Sustrans, Waterwise, and more.",
    color: "bg-purple-100 text-purple-700",
  },
];

const IMPACT_STATS: {
  value: number;
  label: string;
  sub: string;
  icon: IconDefinition;
}[] = [
  {
    value: 6,
    label: "Categories Tracked",
    sub: "Water, Carbon, Plastic, Recycling, Transport, Fashion",
    icon: faEarthAmericas,
  },
  {
    value: 12,
    label: "Transport Modes",
    sub: "From walking to long-haul flights",
    icon: faCar,
  },
  {
    value: 24,
    label: "Badges to Earn",
    sub: "From First Step to Flight-Free Year",
    icon: faTrophy,
  },
];

const METRICS = [
  {
    boring: "240 litres",
    human: "3 bathtubs",
    label: "Water Saved",
    icon: faBath,
    bg: "bg-ocean/8",
    accent: "bg-ocean/15 text-ocean",
    iconColor: "text-ocean",
  },
  {
    boring: "17 kg CO\u2082",
    human: "5 car commutes",
    label: "Carbon Reduced",
    icon: faCar,
    bg: "bg-forest/8",
    accent: "bg-forest/15 text-forest",
    iconColor: "text-forest",
  },
  {
    boring: "150 items",
    human: "1 wheelie bin",
    label: "Plastic Avoided",
    icon: faTrashCan,
    bg: "bg-sunshine/15",
    accent: "bg-sunshine/20 text-amber-700",
    iconColor: "text-amber-600",
  },
  {
    boring: "60 kg recycled",
    human: "1 tree saved",
    label: "Recycling Impact",
    icon: faTree,
    bg: "bg-leaf/8",
    accent: "bg-leaf/15 text-leaf",
    iconColor: "text-leaf",
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    icon: faUserPlus,
    title: "Create Your Account",
    description:
      "Sign up in seconds with email or Google. No credit card, no catches.",
    color: "bg-ocean/10 text-ocean",
    ring: "ring-ocean/20",
  },
  {
    step: 2,
    icon: faChartLine,
    title: "Log Your Impact",
    description:
      "Track water, carbon, plastic, transport, and more. We translate it into terms you actually understand.",
    color: "bg-forest/10 text-forest",
    ring: "ring-forest/20",
  },
  {
    step: 3,
    icon: faTrophy,
    title: "Earn & Compete",
    description:
      "Unlock badges, climb the leaderboard, and join monthly challenges with the community.",
    color: "bg-sunshine/20 text-amber-700",
    ring: "ring-sunshine/20",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I had no idea how much water I was wasting until I saw it measured in bathtubs. Completely changed my habits.",
    name: "Alex M.",
    role: "Teacher, Manchester",
    avatar: "A",
    color: "bg-ocean text-white",
  },
  {
    quote:
      "The transport tracker finally made me switch to cycling for short trips. The badge system is weirdly addictive.",
    name: "Priya K.",
    role: "Software Engineer, London",
    avatar: "P",
    color: "bg-forest text-white",
  },
  {
    quote:
      "My kids love checking the leaderboard. It turned sustainability into a family competition and we're all better for it.",
    name: "James T.",
    role: "Parent of 3, Bristol",
    avatar: "J",
    color: "bg-coral text-white",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest">
                <FontAwesomeIcon
                  icon={faSeedling}
                  className="h-4 w-4 text-white"
                  aria-hidden
                />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-charcoal">
                CarbonFootprint
              </span>
            </div>
            {/* Nav links - desktop */}
            <div className="hidden items-center gap-1 md:flex">
              <a
                href="#features"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate transition-colors hover:bg-gray-100 hover:text-charcoal"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate transition-colors hover:bg-gray-100 hover:text-charcoal"
              >
                How It Works
              </a>
              <a
                href="/apps"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate transition-colors hover:bg-gray-100 hover:text-charcoal"
              >
                Eco Apps
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" href="/login">
              Log in
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={faArrowRight}
              href="/register"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[calc(100dvh-3.5rem)] items-center justify-center overflow-hidden px-6 py-16 sm:py-20 md:py-24 lg:py-28">
        {/* Hero Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero_nature.jpg"
            alt="Pristine forest canopy with a turquoise river"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
          <h1 className="animate-fade-in mb-4 text-3xl font-bold leading-[1.1] tracking-tight text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Track Your Impact.
            <br />
            <span className="bg-gradient-to-r from-sunshine to-amber-300 bg-clip-text text-transparent">
              Change Your World.
            </span>
          </h1>
          <p className="animate-fade-in mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white/75 [animation-delay:150ms] sm:mb-10 sm:text-lg">
            The one-stop shop for understanding and reducing your environmental
            footprint. See your impact in human-readable terms, earn badges,
            join challenges, and be part of a community making a real
            difference.
          </p>
          <div className="animate-fade-in flex flex-col items-center justify-center gap-3 [animation-delay:300ms] sm:flex-row sm:gap-4">
            <Button
              variant="sunshine"
              size="lg"
              rightIcon={faRocket}
              href="/register"
            >
              Start Tracking Free
            </Button>
            <Button
              variant="ghost"
              size="lg"
              href="#how-it-works"
              className="border border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="border-b border-gray-200/60 bg-white py-14">
        <StaggerGroup className="mx-auto grid max-w-4xl grid-cols-1 gap-10 px-6 md:grid-cols-3" stagger={0.12} itemVariant="scale">
          {IMPACT_STATS.map((stat) => (
            <StaggerItem key={stat.label} variant="scale" className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-forest/8">
                <FontAwesomeIcon
                  icon={stat.icon}
                  className="h-5 w-5 text-forest"
                  aria-hidden
                />
              </div>
              <AnimatedCounter
                value={stat.value}
                duration={1200}
                className="text-4xl font-bold text-charcoal"
              />
              <div className="mt-1.5 text-sm font-semibold text-charcoal">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-slate">{stat.sub}</div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/moss_texture.jpg"
            alt=""
            fill
            className="object-cover opacity-[0.07]"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <FadeIn variant="slide-up-big" cinematic>
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              Get Started in 3 Simple Steps
            </h2>
            <p className="mx-auto mb-16 max-w-xl text-center text-slate">
              From sign-up to saving the planet in under a minute.
            </p>
          </FadeIn>
          <StaggerGroup className="grid grid-cols-1 gap-8 md:grid-cols-3" stagger={0.15} itemVariant="flip-up">
            {HOW_IT_WORKS.map((item) => (
              <StaggerItem key={item.step} variant="flip-up" className="relative text-center">
                {/* Connector line between steps (hidden on mobile, hidden on last) */}
                {item.step < 3 && (
                  <div className="absolute top-10 left-[calc(50%+40px)] hidden h-0.5 w-[calc(100%-80px)] bg-gradient-to-r from-forest/20 to-forest/5 md:block" />
                )}
                <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color} ring-4 ${item.ring}`}
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="h-6 w-6"
                      aria-hidden
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-bold text-white shadow-md">
                    {item.step}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-charcoal">
                  {item.title}
                </h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
          <FadeIn variant="fade-up" delay={0.4}>
            <div className="mt-14 text-center">
              <Button
                variant="primary"
                size="lg"
                rightIcon={faArrowRight}
                href="/register"
              >
                Get Started Now
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn variant="slide-up-big" cinematic>
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              Everything You Need in One Place
            </h2>
            <p className="mx-auto mb-14 max-w-xl text-center text-slate">
              Other tools track one thing. We bring it all together and make it
              actually understandable.
            </p>
          </FadeIn>
          <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08} itemVariant="zoom-in">
            {FEATURES.map((feature) => (
              <StaggerItem key={feature.title} variant="zoom-in">
              <Card variant="interactive" magic className="p-6 text-center">
                <div
                  className={`mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <FontAwesomeIcon
                    icon={feature.icon}
                    className="h-4.5 w-4.5"
                    aria-hidden
                  />
                </div>
                <h3 className="mb-2 text-[15px] font-semibold text-charcoal">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate">
                  {feature.description}
                </p>
              </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Section Divider - Eco Lifestyle Image */}
      <section className="relative h-48 overflow-hidden md:h-64">
        <Image
          src="/assets/transport_eco.jpg"
          alt="Sustainable transport and eco-friendly lifestyle"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/80 to-ocean/80" />
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <FadeIn variant="blur-in" cinematic duration={1}>
            <p className="max-w-2xl text-center text-xl font-semibold text-white md:text-2xl">
              &ldquo;We don&apos;t inherit the earth from our ancestors, we borrow
              it from our children.&rdquo;
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Human Readable Metrics */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn variant="slide-up-big" cinematic>
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              Numbers That Actually Make Sense
            </h2>
            <p className="mx-auto mb-14 max-w-xl text-center text-slate">
              We don&apos;t just show litres and kilograms. We show you what your
              impact really means.
            </p>
          </FadeIn>
          <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.1} itemVariant="flip-up">
            {METRICS.map((metric) => (
              <StaggerItem key={metric.label} variant="flip-up">
              <Card variant="default" magic className="p-6 text-center">
                <div
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${metric.bg}`}
                >
                  <FontAwesomeIcon
                    icon={metric.icon}
                    className={`h-5 w-5 ${metric.iconColor}`}
                    aria-hidden
                  />
                </div>
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate/60">
                  Instead of
                </div>
                <div className="mb-3 text-lg text-slate/50 line-through">
                  {metric.boring}
                </div>
                <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate/60">
                  We show
                </div>
                <div
                  className={`mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-bold ${metric.accent}`}
                >
                  {metric.human}
                </div>
                <div className="text-sm font-medium text-charcoal">
                  {metric.label}
                </div>
              </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="bg-gradient-to-b from-off-white to-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn variant="slide-up-big" cinematic>
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              See Your Dashboard in Action
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-slate">
              A clean, intuitive dashboard that makes tracking your environmental
              impact feel effortless.
            </p>
          </FadeIn>
          <FadeIn variant="zoom-in" cinematic duration={0.8}>
            <div className="mx-auto max-w-5xl xl:max-w-6xl">
              <DashboardDemo />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/lab_glass.jpg"
            alt=""
            fill
            className="object-cover opacity-[0.05]"
            aria-hidden="true"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <FadeIn variant="slide-up-big" cinematic>
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
              What Our Community Says
            </h2>
            <p className="mx-auto mb-14 max-w-xl text-center text-slate">
              Real people making real changes. Here&apos;s what they think.
            </p>
          </FadeIn>
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3" stagger={0.12} itemVariant="slide-left">
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.name} variant="slide-left">
              <Card variant="default" className="p-6">
                {/* Quote mark */}
                <div className="mb-4 text-4xl leading-none text-forest/20">
                  &ldquo;
                </div>
                <p className="-mt-4 mb-6 text-sm leading-relaxed text-charcoal/80">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${t.color}`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-charcoal">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate">{t.role}</div>
                  </div>
                </div>
              </Card>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero_bg.jpg"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest-dark/90 to-ocean/90" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] animate-gradient-shift opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(255,193,7,0.4) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <FadeIn variant="zoom-in" cinematic duration={0.9} className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <FontAwesomeIcon
              icon={faSeedling}
              className="h-6 w-6 text-sunshine"
              aria-hidden
            />
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Make a Difference?
          </h2>
          <p className="mb-8 text-white/70">
            Join for free. Track your impact. Earn badges. Be part of a
            community that cares.
          </p>
          <Button
            variant="sunshine"
            size="lg"
            rightIcon={faArrowRight}
            href="/register"
          >
            Create Your Free Account
          </Button>
          <p className="mt-5 text-xs text-white/40">
            Free forever. No credit card required.
          </p>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest">
                  <FontAwesomeIcon
                    icon={faSeedling}
                    className="h-4 w-4 text-white"
                    aria-hidden
                  />
                </div>
                <span className="text-[15px] font-bold">CarbonFootprint</span>
              </div>
              <p className="text-sm leading-relaxed text-white/50">
                Helping individuals track and reduce their environmental impact,
                one habit at a time.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                Explore
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#features" className="text-sm text-white/60 transition-colors hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm text-white/60 transition-colors hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="/apps" className="text-sm text-white/60 transition-colors hover:text-white">
                    Recommended Apps
                  </a>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                Product
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="/login" className="text-sm text-white/60 transition-colors hover:text-white">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-sm text-white/60 transition-colors hover:text-white">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-sm text-white/60 transition-colors hover:text-white">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="/login" className="text-sm text-white/60 transition-colors hover:text-white">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
                Legal
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-white/60 transition-colors hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} CarbonFootprint. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              Made with care for the planet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
