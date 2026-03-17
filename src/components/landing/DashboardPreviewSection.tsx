"use client";

import { useEffect, useRef, useState } from "react";
import { DashboardDemo } from "./DashboardDemo";

export function DashboardPreviewSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-slate mb-6">
            <span className="w-8 h-px bg-charcoal/30" />
            Live preview
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-bold tracking-tight text-charcoal transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            See it in action.
            <br />
            <span className="text-slate">Try the interactive demo.</span>
          </h2>
        </div>

        {/* Dashboard Demo */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <DashboardDemo />
        </div>
      </div>
    </section>
  );
}
