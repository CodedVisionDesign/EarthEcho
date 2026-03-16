import Link from "next/link";

const FEATURES = [
  {
    icon: "\u{1F4CA}",
    title: "Visual Dashboard",
    description:
      'See your impact in ways that make sense — "3 bathtubs of water saved" not "240 litres".',
  },
  {
    icon: "\u{1F697}",
    title: "Transport Tracker",
    description:
      "Compare cycling vs driving vs bus. Track EV savings, flight offsets, and active transport health benefits.",
  },
  {
    icon: "\u{1F3C6}",
    title: "Gamification",
    description:
      "Earn badges, climb leaderboards, and complete monthly challenges. Make saving the planet fun.",
  },
  {
    icon: "\u{1F91D}",
    title: "Community Forum",
    description:
      "Share tips, celebrate wins, and cheer each other on. You're not doing this alone.",
  },
  {
    icon: "\u{267B}\u{FE0F}",
    title: "Track Everything",
    description:
      "Water, carbon, plastic, recycling, transport, and fashion. One place for your full environmental picture.",
  },
  {
    icon: "\u{1F517}",
    title: "Useful Resources",
    description:
      "Curated links to organisations like Energy Saving Trust, Sustrans, Waterwise, and more.",
  },
];

const IMPACT_STATS = [
  { value: "6", label: "Categories Tracked", sub: "Water, Carbon, Plastic, Recycling, Transport, Fashion" },
  { value: "12", label: "Transport Modes", sub: "From walking to long-haul flights" },
  { value: "24", label: "Badges to Earn", sub: "From First Step to Flight-Free Year" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{"\u{1F331}"}</span>
            <span className="text-xl font-bold text-forest">
              CarbonFootprint
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate hover:text-charcoal"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest-dark"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-forest-dark via-forest to-ocean py-24 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Track Your Impact.
            <br />
            <span className="text-sunshine">Change Your World.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
            The one-stop shop for understanding and reducing your environmental
            footprint. See your impact in human-readable terms, earn badges,
            join challenges, and be part of a community making a real
            difference.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-sunshine px-8 py-3 text-lg font-semibold text-charcoal transition-colors hover:bg-sunshine-light"
            >
              Start Tracking Free
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-white/30 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="border-b border-gray-200 bg-white py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          {IMPACT_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-forest">{stat.value}</div>
              <div className="mt-1 text-sm font-semibold text-charcoal">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-slate">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-charcoal">
            Everything You Need in One Place
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-slate">
            Other tools track one thing. We bring it all together — and make it
            actually understandable.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-charcoal">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Human Readable Metrics Example */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-3xl font-bold text-charcoal">
            Numbers That Actually Make Sense
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-slate">
            We don't just show litres and kilograms. We show you what your
            impact really means.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                boring: "240 litres",
                human: "3 bathtubs",
                label: "Water Saved",
                color: "bg-blue-50 text-blue-700",
              },
              {
                boring: "17 kg CO2",
                human: "5 car commutes",
                label: "Carbon Reduced",
                color: "bg-green-50 text-green-700",
              },
              {
                boring: "150 items",
                human: "1 wheelie bin",
                label: "Plastic Avoided",
                color: "bg-amber-50 text-amber-700",
              },
              {
                boring: "60 kg recycled",
                human: "1 tree saved",
                label: "Recycling Impact",
                color: "bg-emerald-50 text-emerald-700",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="mb-1 text-xs font-medium text-slate">
                  Instead of saying
                </div>
                <div className="mb-3 text-lg text-slate line-through">
                  {metric.boring}
                </div>
                <div className="mb-1 text-xs font-medium text-slate">
                  We show
                </div>
                <div
                  className={`mb-3 inline-block rounded-full px-4 py-1 text-lg font-bold ${metric.color}`}
                >
                  {metric.human}
                </div>
                <div className="text-sm font-medium text-charcoal">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-forest to-ocean py-20 text-white">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Make a Difference?
          </h2>
          <p className="mb-8 text-white/80">
            Join for free. Track your impact. Earn badges. Be part of a
            community that cares.
          </p>
          <Link
            href="/register"
            className="rounded-lg bg-sunshine px-8 py-3 text-lg font-semibold text-charcoal transition-colors hover:bg-sunshine-light"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate">
          <p>
            {"\u{1F331}"} CarbonFootprint &mdash; Helping individuals track and reduce
            their environmental impact.
          </p>
        </div>
      </footer>
    </div>
  );
}
