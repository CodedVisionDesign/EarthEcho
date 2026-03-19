"use client";

import { useEffect, useState, useRef } from "react";

function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div
      ref={ref}
      className="text-5xl lg:text-7xl font-bold tracking-tight text-charcoal"
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

const metrics = [
  {
    value: 240,
    suffix: "L",
    prefix: "",
    label: "That's 3 bathtubs of water saved",
    sublabel: "Water impact this month",
  },
  {
    value: 17,
    suffix: "kg",
    prefix: "",
    label: "Equal to 5 car commutes avoided",
    sublabel: "Carbon reduced this month",
  },
  {
    value: 150,
    suffix: "",
    prefix: "",
    label: "One full wheelie bin of plastic avoided",
    sublabel: "Plastic items saved",
  },
  {
    value: 60,
    suffix: "kg",
    prefix: "",
    label: "That's 1 whole tree saved",
    sublabel: "Recycling impact",
  },
];

export function MetricsSection() {
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
    <section
      id="impact"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-y border-charcoal/10 bg-off-white"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-slate mb-6">
              <span className="w-8 h-px bg-charcoal/30" />
              Real impact
            </span>
            <h2
              className={`text-4xl lg:text-6xl font-bold tracking-tight text-charcoal transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Numbers that
              <br />
              make sense.
            </h2>
          </div>
          <p className="text-lg text-slate max-w-md leading-relaxed">
            We don&apos;t just show litres and kilograms. We show you what
            your impact really means - in terms you can picture.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-charcoal/10">
          {metrics.map((metric, index) => (
            <div
              key={metric.sublabel}
              className={`bg-off-white p-8 lg:p-12 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <AnimatedCounter
                end={metric.value}
                suffix={metric.suffix}
                prefix={metric.prefix}
              />
              <div className="mt-3 text-lg font-medium text-forest">
                {metric.label}
              </div>
              <div className="mt-1 text-sm text-slate">{metric.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
