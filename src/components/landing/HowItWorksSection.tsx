"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faChartLine, faTrophy } from "@/lib/fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const steps = [
  {
    number: "I",
    icon: faUserPlus,
    title: "Create your account",
    description:
      "Sign up in seconds with email or Google. No credit card, no catches — just a free account to start your journey.",
    detail: "Average signup time: 12 seconds",
  },
  {
    number: "II",
    icon: faChartLine,
    title: "Log your impact",
    description:
      "Track water, carbon, plastic, transport, recycling, and fashion. We translate everything into terms you actually understand.",
    detail: "6 categories · 12 transport modes",
  },
  {
    number: "III",
    icon: faTrophy,
    title: "Earn & compete",
    description:
      "Unlock badges, climb the leaderboard, and join monthly challenges with the community. Make saving the planet fun.",
    detail: "24 badges · Monthly challenges",
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-charcoal text-white overflow-hidden"
    >
      {/* Diagonal lines pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            white 40px,
            white 41px
          )`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-white/50 mb-6">
            <span className="w-8 h-px bg-white/30" />
            Process
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-bold tracking-tight transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Three steps.
            <br />
            <span className="text-white/50">Infinite impact.</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Steps */}
          <div className="space-y-0">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full text-left py-8 border-b border-white/10 transition-all duration-500 group ${
                  activeStep === index
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70"
                }`}
              >
                <div className="flex items-start gap-6">
                  <span className="font-bold text-3xl text-white/30">
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FontAwesomeIcon
                        icon={step.icon}
                        className="h-5 w-5 text-sunshine"
                        aria-hidden
                      />
                      <h3 className="text-2xl lg:text-3xl font-bold group-hover:translate-x-2 transition-transform duration-300">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-white/60 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Progress indicator */}
                    {activeStep === index && (
                      <div className="mt-4 h-px bg-white/20 overflow-hidden">
                        <div
                          className="h-full bg-sunshine"
                          style={{
                            animation: "progress 5s linear forwards",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Visual display */}
          <div className="lg:sticky lg:top-32 self-start">
            <div className="border border-white/10 overflow-hidden">
              {/* Window header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-coral/60" />
                  <div className="w-3 h-3 rounded-full bg-sunshine/60" />
                  <div className="w-3 h-3 rounded-full bg-leaf/60" />
                </div>
                <span className="text-xs font-mono text-white/40">
                  earthecho.app
                </span>
              </div>

              {/* Step content */}
              <div className="p-8 min-h-[280px] flex flex-col justify-center">
                <div
                  key={activeStep}
                  className="step-content-reveal"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/20">
                      <FontAwesomeIcon
                        icon={steps[activeStep].icon}
                        className="h-5 w-5 text-sunshine"
                        aria-hidden
                      />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">
                        Step {activeStep + 1}
                      </div>
                      <div className="text-sm text-white/50">
                        {steps[activeStep].title}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/60 leading-relaxed mb-6">
                    {steps[activeStep].description}
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2">
                    <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
                    <span className="text-xs font-mono text-white/50">
                      {steps[activeStep].detail}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="px-6 py-4 border-t border-white/10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
                <span className="text-xs font-mono text-white/40">
                  Ready to start
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .step-content-reveal {
          animation: stepReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes stepReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
