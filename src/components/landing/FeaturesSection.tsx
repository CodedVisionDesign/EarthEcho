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
  const barHeights = [30, 45, 35, 55, 48];
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      <rect x="25" y="20" width="150" height="120" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* Animated bars that continuously pulse between two heights */}
      {barHeights.map((h, i) => {
        const h2 = h + 15 - i * 3;
        return (
          <rect key={i} x={40 + i * 26} width="16" rx="2" fill="currentColor" opacity="0.6">
            <animate attributeName="height" values={`0;${h};${h2};${h};${h2};${h}`} dur="4s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`130;${130 - h};${130 - h2};${130 - h};${130 - h2};${130 - h}`} dur="4s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
          </rect>
        );
      })}
      {/* Trend line that continuously draws and redraws */}
      <path d="M 40 95 Q 70 60 100 70 T 155 35" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="160" opacity="0.8">
        <animate attributeName="stroke-dashoffset" values="160;0;0;160" dur="4s" repeatCount="indefinite" />
      </path>
      {/* Pulse dot at end of trend */}
      <circle cx="155" cy="35" r="0" fill="currentColor">
        <animate attributeName="r" values="0;5;4;5;4;0" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0.6;1;0.6;0" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Rising counter */}
      <text x="155" y="28" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" opacity="0">
        +12%
        <animate attributeName="opacity" values="0;0;0.7;0.7;0" dur="4s" repeatCount="indefinite" />
        <animate attributeName="y" values="35;35;26;26;20" dur="4s" repeatCount="indefinite" />
      </text>
    </svg>
  );
}

function TransportVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Scrolling road surface */}
      <line x1="10" y1="125" x2="190" y2="125" stroke="currentColor" strokeWidth="2" opacity="0.15" />
      {/* Moving dashes — simulates forward motion */}
      <line x1="10" y1="125" x2="190" y2="125" stroke="currentColor" strokeWidth="2" strokeDasharray="10 8" opacity="0.35">
        <animate attributeName="stroke-dashoffset" values="0;-36" dur="0.6s" repeatCount="indefinite" />
      </line>

      {/* Scrolling background scenery — trees */}
      {[0, 1, 2].map((i) => (
        <g key={`tree-${i}`} opacity="0.12">
          <line x1="0" y1="90" x2="0" y2="118" stroke="currentColor" strokeWidth="2">
            <animate attributeName="x1" values={`${200 + i * 80};${-20 + i * 0}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="x2" values={`${200 + i * 80};${-20 + i * 0}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </line>
          <polygon points="0,90 -8,110 8,110" fill="currentColor">
            <animate attributeName="points" values={`${200 + i * 80},90 ${192 + i * 80},110 ${208 + i * 80},110;${-20},90 ${-28},110 ${-12},110`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </polygon>
        </g>
      ))}

      {/* Bike body — stationary in frame, world moves around it */}
      <g>
        {/* Rider body bob */}
        <g>
          <animateTransform attributeName="transform" type="translate" values="0,0;0,-1.5;0,0;0,-1.5;0,0" dur="0.5s" repeatCount="indefinite" />
          {/* Frame */}
          <path d="M 65 108 L 82 88 L 102 108 M 82 88 L 82 78" fill="none" stroke="currentColor" strokeWidth="2" />
          {/* Handlebars */}
          <path d="M 76 78 L 88 78" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Seat */}
          <path d="M 62 88 L 70 88" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Rider head */}
          <circle cx="82" cy="70" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </g>

        {/* Back wheel — spinning */}
        <circle cx="65" cy="112" r="13" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 65 112;360 65 112" dur="0.6s" repeatCount="indefinite" />
          <line x1="65" y1="100" x2="65" y2="124" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="53" y1="112" x2="77" y2="112" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="56" y1="103" x2="74" y2="121" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1="74" y1="103" x2="56" y2="121" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </g>

        {/* Front wheel — spinning */}
        <circle cx="102" cy="112" r="13" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 102 112;360 102 112" dur="0.6s" repeatCount="indefinite" />
          <line x1="102" y1="100" x2="102" y2="124" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="90" y1="112" x2="114" y2="112" stroke="currentColor" strokeWidth="1" opacity="0.4" />
          <line x1="93" y1="103" x2="111" y2="121" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <line x1="111" y1="103" x2="93" y2="121" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        </g>
      </g>

      {/* CO₂ cloud shrinking */}
      <circle cx="155" cy="55" r="16" fill="currentColor" opacity="0.08">
        <animate attributeName="r" values="16;10;16" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;0.03;0.1" dur="3s" repeatCount="indefinite" />
      </circle>
      <text x="155" y="52" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="currentColor" opacity="0.3">CO₂</text>
      {/* Animated percentage */}
      <text x="155" y="70" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor" opacity="0.5">
        -85%
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
      </text>

      {/* Speed lines behind bike */}
      {[0, 1, 2].map((i) => (
        <line key={`speed-${i}`} y1={100 + i * 8} y2={100 + i * 8} stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0">
          <animate attributeName="x1" values="50;20" dur="0.8s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
          <animate attributeName="x2" values="45;30" dur="0.8s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.3;0" dur="0.8s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
        </line>
      ))}
    </svg>
  );
}

function BadgesVisual() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Trophy — bouncing */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="2s" repeatCount="indefinite" />
        {/* Trophy body */}
        <path d="M 85 50 L 85 30 Q 85 15 100 15 Q 115 15 115 30 L 115 50" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="80" y="50" width="40" height="8" rx="2" fill="currentColor" opacity="0.3" />
        <rect x="90" y="58" width="20" height="15" rx="1" fill="currentColor" opacity="0.2" />
        {/* Handles */}
        <path d="M 85 35 Q 70 35 70 45 Q 70 50 85 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 115 35 Q 130 35 130 45 Q 130 50 115 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Star inside — pulsing glow */}
        <polygon points="100,22 103,30 111,30 105,35 107,43 100,39 93,43 95,35 89,30 97,30" fill="currentColor" opacity="0.6">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="1.5s" repeatCount="indefinite" additive="sum" />
        </polygon>
      </g>

      {/* Orbiting sparkle ring */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={`orbit-${i}`} r="2.5" fill="currentColor" opacity="0">
          <animate attributeName="cx" values={`${100 + Math.cos((i * 60 * Math.PI) / 180) * 45};${100 + Math.cos(((i * 60 + 360) * Math.PI) / 180) * 45}`} dur="4s" repeatCount="indefinite" />
          <animate attributeName="cy" values={`${40 + Math.sin((i * 60 * Math.PI) / 180) * 30};${40 + Math.sin(((i * 60 + 360) * Math.PI) / 180) * 30}`} dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0.3;0.7;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;3;1.5" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Confetti bursts — small shapes shooting upward */}
      {[
        { x: 70, delay: 0 },
        { x: 85, delay: 0.6 },
        { x: 115, delay: 1.2 },
        { x: 130, delay: 1.8 },
        { x: 100, delay: 2.4 },
      ].map((c, i) => (
        <g key={`confetti-${i}`}>
          <rect x={c.x} y="50" width="3" height="3" rx="0.5" fill="currentColor" opacity="0">
            <animate attributeName="y" values="50;10;-10" dur="1.8s" begin={`${c.delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.6;0" dur="1.8s" begin={`${c.delay}s`} repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" values="0;180;360" dur="1.8s" begin={`${c.delay}s`} repeatCount="indefinite" />
          </rect>
          <circle cx={c.x + 8} cy="55" r="1.5" fill="currentColor" opacity="0">
            <animate attributeName="cy" values="55;20;0" dur="2s" begin={`${c.delay + 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.5;0" dur="2s" begin={`${c.delay + 0.2}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Badge count — counting up effect */}
      <text x="100" y="100" textAnchor="middle" fontSize="28" fontFamily="monospace" fill="currentColor" opacity="0.15">
        24
        <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
      </text>
      <text x="100" y="115" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.3">badges earned</text>

      {/* Rising +1 badges */}
      <text x="140" y="90" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" opacity="0">
        +1
        <animate attributeName="y" values="90;70;55" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.6;0" dur="2.5s" repeatCount="indefinite" />
      </text>
      <text x="60" y="85" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="currentColor" opacity="0">
        +1
        <animate attributeName="y" values="85;65;50" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0.6;0" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
      </text>
    </svg>
  );
}

function CommunityVisual() {
  const people = [0, 1, 2, 3, 4].map((i) => {
    const angle = ((i * 72) - 90) * (Math.PI / 180);
    return { cx: 100 + Math.cos(angle) * 50, cy: 70 + Math.sin(angle) * 40, angle };
  });

  return (
    <svg viewBox="0 0 200 160" className="w-full h-full">
      {/* Ripple rings expanding from center */}
      {[0, 1, 2].map((i) => (
        <circle key={`ripple-${i}`} cx="100" cy="65" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
          <animate attributeName="r" values="10;60" dur="3s" begin={`${i * 1}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0" dur="3s" begin={`${i * 1}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Connection lines with traveling pulse dots */}
      {people.map((p, i) => (
        <g key={`conn-${i}`}>
          <line x1={100} y1={65} x2={p.cx} y2={p.cy} stroke="currentColor" strokeWidth="1" opacity="0.12">
            <animate attributeName="opacity" values="0.08;0.3;0.08" dur="2s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </line>
          {/* Pulse dot traveling along the line */}
          <circle r="2" fill="currentColor" opacity="0">
            <animate attributeName="cx" values={`100;${p.cx}`} dur="1.5s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`65;${p.cy}`} dur="1.5s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;0.7;0" dur="1.5s" begin={`${i * 0.6}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Central person — gentle bounce */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-2;0,0" dur="3s" repeatCount="indefinite" />
        <circle cx="100" cy="55" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M 80 85 Q 80 70 100 70 Q 120 70 120 85" fill="none" stroke="currentColor" strokeWidth="2" />
      </g>

      {/* Surrounding people — bouncing in sequence */}
      {people.map((p, i) => (
        <g key={`person-${i}`}>
          <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          {/* Head */}
          <circle cx={p.cx} cy={p.cy - 4} r="5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
          {/* Body hint */}
          <path d={`M ${p.cx - 6} ${p.cy + 8} Q ${p.cx - 6} ${p.cy + 2} ${p.cx} ${p.cy + 2} Q ${p.cx + 6} ${p.cy + 2} ${p.cx + 6} ${p.cy + 8}`} fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        </g>
      ))}

      {/* Chat bubbles popping in and out */}
      {[
        { x: 135, y: 28, w: 28, h: 14, text: "Nice!", delay: 0 },
        { x: 38, y: 88, w: 22, h: 12, text: "🌱", delay: 1.5 },
        { x: 125, y: 95, w: 26, h: 12, text: "Great!", delay: 3 },
        { x: 50, y: 30, w: 24, h: 12, text: "👏", delay: 4.5 },
      ].map((b, i) => (
        <g key={`bubble-${i}`} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" dur="6s" begin={`${b.delay}s`} repeatCount="indefinite" />
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill="currentColor" opacity="0.12">
            <animate attributeName="opacity" values="0.08;0.2;0.08" dur="2s" repeatCount="indefinite" />
          </rect>
          <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} textAnchor="middle" fontSize="6" fontFamily="monospace" fill="currentColor" opacity="0.5">{b.text}</text>
          {/* Bubble tail */}
          <polygon points={`${b.x + 6},${b.y + b.h} ${b.x + 3},${b.y + b.h + 4} ${b.x + 10},${b.y + b.h}`} fill="currentColor" opacity="0.1" />
        </g>
      ))}

      {/* Active users counter */}
      <text x="100" y="145" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="currentColor" opacity="0.3">
        5 online
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
      </text>
      {/* Online indicator dot */}
      <circle cx="73" cy="142" r="2" fill="currentColor" opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.5s" repeatCount="indefinite" />
      </circle>
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
