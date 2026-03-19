"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    number: "01",
    title: "Visual Dashboard",
    description:
      "See your impact in ways that make sense. '3 bathtubs of water saved' not '240 litres'. Track water, carbon, plastic, recycling, transport, and fashion in one place.",
    visual: "dashboard",
  },
  {
    number: "02",
    title: "Transport Tracker",
    description:
      "Compare cycling vs driving vs bus with real CO₂ data. Track EV savings, flight offsets, and active transport health benefits across 12 different modes.",
    visual: "transport",
  },
  {
    number: "03",
    title: "Gamification & Badges",
    description:
      "Earn 24 unique badges, climb leaderboards, and complete monthly challenges. Make saving the planet genuinely addictive.",
    visual: "badges",
  },
  {
    number: "04",
    title: "Community Forum",
    description:
      "Share tips, celebrate wins, and cheer each other on. You're not doing this alone - join a community making real changes.",
    visual: "community",
  },
];

function DashboardVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Chart frame */}
      <rect x="25" y="20" width="150" height="120" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* Bars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={40 + i * 26} y={100} width="16" height="0" rx="2" fill="currentColor" opacity="0.6">
          <animate attributeName="height" values={`0;${30 + i * 12};${30 + i * 12}`} dur="1.5s" begin={`${i * 0.15}s`} fill="freeze" />
          <animate attributeName="y" values={`100;${70 - i * 12};${70 - i * 12}`} dur="1.5s" begin={`${i * 0.15}s`} fill="freeze" />
        </rect>
      ))}
      {/* Trend line */}
      <path d="M 40 90 Q 75 60 100 70 T 160 35" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="200" strokeDashoffset="200" opacity="0.8">
        <animate attributeName="stroke-dashoffset" values="200;0" dur="2s" begin="0.5s" fill="freeze" />
      </path>
      {/* Pulse dot */}
      <circle cx="160" cy="35" r="4" fill="currentColor">
        <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" begin="2.5s" />
        <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" begin="2.5s" />
      </circle>
    </svg>
  );
}

function TransportVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Road */}
      <line x1="30" y1="120" x2="170" y2="120" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <line x1="30" y1="120" x2="170" y2="120" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" opacity="0.4" />
      {/* Bike */}
      <circle cx="60" cy="105" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="105" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 60 105 L 80 85 L 100 105 M 80 85 L 80 75 M 75 75 L 85 75" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* CO2 cloud fading */}
      <circle cx="140" cy="60" r="15" fill="currentColor" opacity="0.1">
        <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
        <animate attributeName="r" values="15;20;15" dur="3s" repeatCount="indefinite" />
      </circle>
      <text x="140" y="63" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.4">CO₂</text>
      {/* Arrow showing reduction */}
      <path d="M 140 45 L 140 30" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" markerEnd="url(#arrowDown)" />
      <text x="140" y="25" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" opacity="0.5">-85%</text>
    </svg>
  );
}

function BadgesVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Trophy */}
      <path d="M 85 50 L 85 30 Q 85 15 100 15 Q 115 15 115 30 L 115 50" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="80" y="50" width="40" height="8" rx="2" fill="currentColor" opacity="0.3" />
      <rect x="90" y="58" width="20" height="15" rx="1" fill="currentColor" opacity="0.2" />
      {/* Handles */}
      <path d="M 85 35 Q 70 35 70 45 Q 70 50 85 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 115 35 Q 130 35 130 45 Q 130 50 115 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Star inside */}
      <polygon points="100,22 103,30 111,30 105,35 107,43 100,39 93,43 95,35 89,30 97,30" fill="currentColor" opacity="0.6">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </polygon>
      {/* Sparkles */}
      {[
        { cx: 65, cy: 25 },
        { cx: 135, cy: 20 },
        { cx: 50, cy: 55 },
        { cx: 150, cy: 50 },
      ].map((pos, i) => (
        <circle key={i} cx={pos.cx} cy={pos.cy} r="2" fill="currentColor" opacity="0">
          <animate attributeName="opacity" values="0;0.8;0" dur="1.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="1;3;1" dur="1.5s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Badge count */}
      <text x="100" y="100" textAnchor="middle" fontSize="28" fontFamily="monospace" fill="currentColor" opacity="0.15">24</text>
      <text x="100" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.3">badges</text>
    </svg>
  );
}

function CommunityVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Central person */}
      <circle cx="100" cy="55" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 80 85 Q 80 70 100 70 Q 120 70 120 85" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Surrounding people */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = ((i * 72) - 90) * (Math.PI / 180);
        const cx = 100 + Math.cos(angle) * 50;
        const cy = 70 + Math.sin(angle) * 40;
        return (
          <g key={i}>
            <line x1={100} y1={65} x2={cx} y2={cy} stroke="currentColor" strokeWidth="1" opacity="0.15">
              <animate attributeName="opacity" values="0.15;0.4;0.15" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </line>
            <circle cx={cx} cy={cy} r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      {/* Chat bubbles */}
      <rect x="130" y="35" width="30" height="15" rx="4" fill="currentColor" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="40" y="90" width="25" height="12" rx="4" fill="currentColor" opacity="0.1">
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" begin="1s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function AnimatedVisual({ type }: { type: string }) {
  switch (type) {
    case "dashboard": return <DashboardVisual />;
    case "transport": return <TransportVisual />;
    case "badges": return <BadgesVisual />;
    case "community": return <CommunityVisual />;
    default: return <DashboardVisual />;
  }
}

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-20 border-b border-charcoal/10">
        {/* Number */}
        <div className="shrink-0">
          <span className="font-mono text-sm text-slate">{feature.number}</span>
        </div>

        {/* Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl lg:text-4xl font-bold text-charcoal mb-4 group-hover:translate-x-2 transition-transform duration-500">
              {feature.title}
            </h3>
            <p className="text-lg text-slate leading-relaxed">
              {feature.description}
            </p>
          </div>

          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-48 h-40 text-forest">
              <AnimatedVisual type={feature.visual} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative py-24 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-slate mb-6">
            <span className="w-8 h-px bg-charcoal/30" />
            Capabilities
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-bold tracking-tight text-charcoal transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Everything you need.
            <br />
            <span className="text-slate">Nothing you don&apos;t.</span>
          </h2>
        </div>

        {/* Features List */}
        <div>
          {features.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
