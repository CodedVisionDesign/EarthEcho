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
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
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
    boring: "17 kg CO₂",
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

export default function Home() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest to-ocean py-28">
        {/* Animated gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 animate-gradient-shift opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(255,193,7,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(64,145,108,0.4) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <h1 className="animate-fade-in mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
            Track Your Impact.
            <br />
            <span className="bg-gradient-to-r from-sunshine to-amber-300 bg-clip-text text-transparent">
              Change Your World.
            </span>
          </h1>
          <p className="animate-fade-in mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/75 [animation-delay:150ms]">
            The one-stop shop for understanding and reducing your environmental
            footprint. See your impact in human-readable terms, earn badges,
            join challenges, and be part of a community making a real
            difference.
          </p>
          <div className="animate-fade-in flex flex-col items-center justify-center gap-4 [animation-delay:300ms] sm:flex-row">
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
              href="#features"
              className="border border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="border-b border-gray-200/60 bg-white py-14">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 px-6 md:grid-cols-3">
          {IMPACT_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
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
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
            Everything You Need in One Place
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-slate">
            Other tools track one thing. We bring it all together and make it
            actually understandable.
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} variant="interactive" className="p-6 text-center">
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
            ))}
          </div>
        </div>
      </section>

      {/* Human Readable Metrics */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
            Numbers That Actually Make Sense
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-slate">
            We don&apos;t just show litres and kilograms. We show you what your
            impact really means.
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((metric) => (
              <Card key={metric.label} variant="default" className="p-6 text-center">
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-forest via-forest-dark to-ocean py-24 text-white">
        <div
          className="pointer-events-none absolute inset-0 animate-gradient-shift opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(255,193,7,0.4) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 bg-white py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 text-sm text-slate">
          <FontAwesomeIcon
            icon={faSeedling}
            className="h-3.5 w-3.5 text-forest"
            aria-hidden
          />
          <p>
            CarbonFootprint. Helping individuals track and reduce their
            environmental impact.
          </p>
        </div>
      </footer>
    </div>
  );
}
