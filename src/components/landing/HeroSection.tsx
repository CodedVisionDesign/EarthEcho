"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { faArrowRight } from "@/lib/fontawesome";
import { AnimatedGlobe } from "./AnimatedGlobe";

const words = ["track", "reduce", "change", "inspire"];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero_bg.jpg"
          alt="Pristine forest canopy with a turquoise river"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Animated globe background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px] opacity-80 z-[2]">
        <AnimatedGlobe />
      </div>

      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 z-[1]">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-white/30"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-white/30"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40 pointer-events-none">
        {/* Eyebrow */}
        <div
          className={`mb-8 transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-white/60">
            <span className="w-8 h-px bg-white/40" />
            The platform for conscious living
          </span>
        </div>

        {/* Main headline */}
        <div className="mb-12">
          <h1
            className={`text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.95] tracking-tight text-white transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block">The platform</span>
            <span className="block">
              to{" "}
              <span className="relative inline-block">
                <span key={wordIndex} className="inline-flex">
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="inline-block animate-char-in text-sunshine"
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-sunshine/20" />
              </span>
            </span>
          </h1>
        </div>

        {/* Description and CTAs */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
          <p
            className={`text-xl lg:text-2xl text-white/60 leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Your one-stop shop for understanding and reducing your
            environmental footprint. See your impact in terms that actually
            make sense.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              variant="sunshine"
              size="lg"
              rightIcon={faArrowRight}
              href="/register"
              className="rounded-full h-14 px-8 text-base pointer-events-auto"
            >
              Start tracking free
            </Button>
            <Button
              variant="ghost"
              size="lg"
              href="#how-it-works"
              className="rounded-full h-14 px-8 text-base border border-white/20 text-white hover:bg-white/10 hover:text-white pointer-events-auto"
            >
              See how it works
            </Button>
          </div>
        </div>
      </div>

      {/* Stats marquee */}
      <div
        className={`absolute bottom-16 left-0 right-0 transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-16 marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16">
              {[
                { value: "6", label: "categories tracked", detail: "WATER · CARBON · PLASTIC" },
                { value: "24", label: "badges to earn", detail: "GAMIFICATION" },
                { value: "12", label: "transport modes", detail: "WALK TO FLIGHT" },
                { value: "100%", label: "free forever", detail: "NO CREDIT CARD" },
              ].map((stat) => (
                <div
                  key={`${stat.detail}-${i}`}
                  className="flex items-baseline gap-4"
                >
                  <span className="text-4xl lg:text-5xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-sm text-white/50">
                    {stat.label}
                    <span className="block font-mono text-xs mt-1 text-white/30">
                      {stat.detail}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
