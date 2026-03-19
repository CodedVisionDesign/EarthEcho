"use client";

import { DashboardDemo } from "./DashboardDemo";
import { FadeIn } from "@/components/ui/FadeIn";

export function DashboardPreviewSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <span className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-slate">
            <span className="h-px w-8 bg-charcoal/30" />
            Live preview
          </span>
          <FadeIn variant="fade-up" duration={0.6}>
            <h2 className="text-4xl font-bold tracking-tight text-charcoal lg:text-6xl">
              See it in action.
              <br />
              <span className="text-slate">Try the interactive demo.</span>
            </h2>
          </FadeIn>
        </div>

        {/* Dashboard Demo */}
        <FadeIn variant="slide-up-fade" delay={0.15} duration={0.8}>
          <DashboardDemo />
        </FadeIn>
      </div>
    </section>
  );
}
