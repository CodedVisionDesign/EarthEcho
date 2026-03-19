"use client";

import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faSeedling,
  faDroplet,
  faTree,
  faUsers,
  faGlobe,
  faHouse,
  faRecycle,
  faArrowRight,
  faSun,
} from "@/lib/fontawesome";
import { Navigation } from "@/components/landing/Navigation";
import { FooterSection } from "@/components/landing/FooterSection";
import { Button } from "@/components/ui/Button";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/ui/FadeIn";

const InteractiveGlobe = dynamic(
  () => import("@/components/landing/InteractiveGlobe").then((mod) => mod.InteractiveGlobe),
  { ssr: false, loading: () => <div className="h-[400px] rounded-2xl border border-forest/10 bg-white animate-pulse" /> }
);

const values = [
  {
    icon: faSeedling,
    title: "Plant-Forward Living",
    description:
      "We believe what we eat shapes the planet. Sal follows a fully vegan lifestyle, and together we champion plant-based choices as one of the most impactful ways to reduce your footprint.",
  },
  {
    icon: faDroplet,
    title: "Water Conservation",
    description:
      "From rainwater harvesting to shorter showers, we practise and promote water-saving habits every single day. Every drop counts, and small changes add up to enormous impact.",
  },
  {
    icon: faTree,
    title: "Community & Volunteering",
    description:
      "Whether it's watering community gardens, planting trees, or spreading awareness at local events, we show up. Charity work and volunteering are at the heart of who we are.",
  },
  {
    icon: faHouse,
    title: "Homesteading",
    description:
      "We practise what we preach. Our homestead includes a thriving wormery for composting, home-grown food, and a commitment to living as self-sufficiently and sustainably as possible.",
  },
  {
    icon: faRecycle,
    title: "Waste Reduction",
    description:
      "From our wormery turning food scraps into rich compost to choosing package-free products, we're dedicated to keeping waste out of landfill and resources in circulation.",
  },
  {
    icon: faGlobe,
    title: "Spreading Awareness",
    description:
      "We believe knowledge is the first step to change. Through Earth Echo and our community work, we aim to inspire others to make more conscious, eco-friendly decisions every day.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-off-white">
      <Navigation variant="light" />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200/60 bg-gradient-to-b from-white to-emerald-50/30 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-forest/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-leaf/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <FadeIn variant="slide-up-big" cinematic>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/8">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="h-7 w-7 text-forest"
                  aria-hidden
                />
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                Our Story
              </p>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-charcoal md:text-5xl lg:text-6xl">
                Meet the People Behind{" "}
                <span className="text-forest">Earth Echo</span>
              </h1>
              <p className="text-lg leading-relaxed text-slate md:text-xl">
                We&apos;re Neil and Sal, husband and wife, eco-enthusiasts,
                and the founders of Earth Echo. What started as a shared passion
                for the planet grew into a mission to help everyone track and
                reduce their environmental impact.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Neil */}
            <FadeIn variant="slide-left" cinematic>
              <div className="relative">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 border border-forest/20">
                    <FontAwesomeIcon icon={faTree} className="h-6 w-6 text-forest" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal">Neil</h2>
                    <p className="text-sm font-medium text-forest">Co-Founder</p>
                  </div>
                </div>
                <div className="space-y-4 text-slate leading-relaxed">
                  <p>
                    Neil has always believed that small, consistent actions can
                    create massive change. A hands-on homesteader and dedicated
                    volunteer, he spends his weekends watering community gardens,
                    maintaining their wormery, and finding new ways to conserve
                    water and energy at home.
                  </p>
                  <p>
                    His vision for Earth Echo was simple: give people a clear,
                    honest picture of their environmental impact and the tools to
                    improve it. No guilt trips, no greenwashing, just
                    actionable data and genuine encouragement.
                  </p>
                  <p>
                    When he&apos;s not building Earth Echo, you&apos;ll find him tending to
                    the homestead, volunteering with local conservation groups, or
                    researching the latest water-saving techniques.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Homesteading", "Water Conservation", "Volunteering", "Wormery Enthusiast"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-forest/20 bg-forest/5 px-3 py-1 text-xs font-medium text-forest"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Sal */}
            <FadeIn variant="slide-right" cinematic>
              <div className="relative">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf/10 border border-leaf/20">
                    <FontAwesomeIcon icon={faLeaf} className="h-6 w-6 text-leaf" aria-hidden />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal">Sal</h2>
                    <p className="text-sm font-medium text-leaf">Co-Founder</p>
                  </div>
                </div>
                <div className="space-y-4 text-slate leading-relaxed">
                  <p>
                    Sal is a passionate vegan and the heart behind Earth Echo&apos;s
                    community-driven approach. She believes that living kindly,
                    towards animals, people, and the planet, isn&apos;t
                    a sacrifice but a joyful way of life that anyone can embrace.
                  </p>
                  <p>
                    Her dedication to charity work and environmental awareness
                    runs deep. From organising local plant-watering sessions to
                    advocating for sustainable living at community events, Sal
                    leads by example and inspires others to follow.
                  </p>
                  <p>
                    She brings warmth and accessibility to Earth Echo, ensuring the
                    platform feels welcoming to everyone, whether you&apos;re
                    just starting your eco journey or you&apos;ve been living green
                    for years.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Vegan Lifestyle", "Charity Work", "Community Building", "Plant-Based Cooking"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-leaf/20 bg-leaf/5 px-3 py-1 text-xs font-medium text-leaf"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Quote / Mission Banner */}
      <section className="border-y border-gray-200/60 bg-charcoal py-20 lg:py-28">
        <FadeIn variant="scale" cinematic>
          <div className="mx-auto max-w-4xl px-6 text-center">
            <FontAwesomeIcon
              icon={faSun}
              className="mb-6 h-8 w-8 text-sunshine"
              aria-hidden
            />
            <blockquote className="mb-8 text-2xl font-bold leading-relaxed text-white md:text-3xl lg:text-4xl">
              &ldquo;We didn&apos;t start Earth Echo to lecture anyone. We started
              it because we saw how much better life gets when you live in
              harmony with the world around you, and we wanted to make
              that easier for everyone.&rdquo;
            </blockquote>
            <p className="text-sm font-medium text-white/50">
              Neil &amp; Sal, Founders of Earth Echo
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Interactive Globe Section */}
      <section className="py-20 lg:py-28 border-b border-gray-200/60">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <FadeIn variant="slide-left" cinematic>
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                  One Planet, One Mission
                </p>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
                  Our Reach is Global, Our Impact Starts Local
                </h2>
                <p className="mb-6 text-lg leading-relaxed text-slate">
                  Every action you log on Earth Echo contributes to a bigger picture.
                  From conserving water at home to choosing plant-based meals,
                  the small changes we all make ripple outward across the globe.
                </p>
                <p className="text-slate leading-relaxed">
                  Drag and spin the globe to explore our world. Click &quot;Unroll Globe&quot;
                  to see it transform into a flat map and back again. This is the
                  planet we&apos;re working to protect, together.
                </p>
              </div>
            </FadeIn>
            <FadeIn variant="slide-right" cinematic delay={0.15}>
              <InteractiveGlobe />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <FadeIn variant="fade-up">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                What We Stand For
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-charcoal md:text-4xl">
                Our Values in Action
              </h2>
              <p className="text-lg text-slate">
                These aren&apos;t just words on a page. They&apos;re how we
                live every single day. Earth Echo is built on the same principles
                that guide our life together.
              </p>
            </div>
          </FadeIn>

          <StaggerGroup
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            stagger={0.08}
            itemVariant="zoom-in"
          >
            {values.map((value) => (
              <StaggerItem key={value.title} variant="zoom-in">
                <div className="group h-full rounded-2xl border border-gray-200/60 bg-white p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-forest/20">
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-forest/8 transition-colors group-hover:bg-forest/12">
                    <FontAwesomeIcon
                      icon={value.icon}
                      className="h-5 w-5 text-forest"
                      aria-hidden
                    />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-charcoal">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate">
                    {value.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-b from-off-white to-emerald-50/40 py-20 lg:py-28">
        <FadeIn variant="fade-up" cinematic>
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-charcoal">
              Join Us on This Journey
            </h2>
            <p className="mb-8 text-slate">
              Earth Echo is free, always will be, and built with love. Start
              tracking your impact today and become part of a community that
              cares.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                rightIcon={faArrowRight}
                href="/register"
              >
                Get Started Free
              </Button>
              <Button variant="secondary" size="lg" href="/">
                Back to Home
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
