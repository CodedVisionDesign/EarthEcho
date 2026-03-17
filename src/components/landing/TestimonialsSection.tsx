"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    quote:
      "I had no idea how much water I was wasting until I saw it measured in bathtubs. Completely changed my habits.",
    author: "Alex M.",
    role: "Teacher",
    location: "Manchester",
    metric: "3 bathtubs saved monthly",
  },
  {
    quote:
      "The transport tracker finally made me switch to cycling for short trips. The badge system is weirdly addictive.",
    author: "Priya K.",
    role: "Software Engineer",
    location: "London",
    metric: "85% fewer car trips",
  },
  {
    quote:
      "My kids love checking the leaderboard. It turned sustainability into a family competition and we're all better for it.",
    author: "James T.",
    role: "Parent of 3",
    location: "Bristol",
    metric: "Family of 5 engaged",
  },
  {
    quote:
      "Finally an app that doesn't just guilt-trip you. The community challenges actually make it fun to reduce your footprint.",
    author: "Sophie L.",
    role: "Student",
    location: "Edinburgh",
    metric: "12 challenges completed",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const active = testimonials[activeIndex];

  return (
    <section id="community" className="relative py-32 lg:py-40 border-t border-charcoal/10 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-xs tracking-widest text-slate uppercase">
            What people say
          </span>
          <div className="flex-1 h-px bg-charcoal/10" />
          <span className="font-mono text-xs text-slate">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(testimonials.length).padStart(2, "0")}
          </span>
        </div>

        {/* Main Quote */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8">
            <blockquote
              className={`transition-all duration-300 ${
                isAnimating
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-charcoal">
                &ldquo;{active.quote}&rdquo;
              </p>
            </blockquote>

            {/* Author */}
            <div
              className={`mt-12 flex items-center gap-6 transition-all duration-300 delay-100 ${
                isAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center">
                <span className="text-xl font-bold text-forest">
                  {active.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold text-charcoal">
                  {active.author}
                </p>
                <p className="text-slate">
                  {active.role}, {active.location}
                </p>
              </div>
            </div>
          </div>

          {/* Metric Highlight */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div
              className={`p-8 border border-charcoal/10 transition-all duration-300 ${
                isAnimating
                  ? "opacity-0 scale-95"
                  : "opacity-100 scale-100"
              }`}
            >
              <span className="font-mono text-xs tracking-widest text-slate uppercase block mb-4">
                Key Result
              </span>
              <p className="text-2xl md:text-3xl font-bold text-forest">
                {active.metric}
              </p>
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAnimating(true);
                    setTimeout(() => {
                      setActiveIndex(idx);
                      setIsAnimating(false);
                    }, 300);
                  }}
                  className={`h-2 transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-8 bg-forest"
                      : "w-2 bg-charcoal/20 hover:bg-charcoal/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trusted by marquee */}
        <div className="mt-24 pt-12 border-t border-charcoal/10">
          <p className="font-mono text-xs tracking-widest text-slate uppercase mb-8 text-center">
            Trusted by eco-conscious individuals everywhere
          </p>
        </div>
      </div>

      {/* Full-width marquee */}
      <div className="w-full overflow-hidden">
        <div className="flex gap-16 items-center marquee">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex gap-16 items-center shrink-0">
              {[
                "Energy Saving Trust",
                "Sustrans",
                "Waterwise",
                "Cycling UK",
                "WRAP",
                "Hubbub",
                "Keep Britain Tidy",
                "Friends of the Earth",
              ].map((org) => (
                <span
                  key={`${setIdx}-${org}`}
                  className="text-xl md:text-2xl font-bold text-charcoal/15 whitespace-nowrap hover:text-charcoal/40 transition-colors duration-300"
                >
                  {org}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
