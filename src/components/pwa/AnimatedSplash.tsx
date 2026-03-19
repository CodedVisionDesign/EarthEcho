"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface AnimatedSplashProps {
  onComplete?: () => void;
  minDuration?: number;
}

/**
 * Premium animated splash screen for Capacitor / PWA.
 *
 * Dark cinematic background with:
 *   - Animated aurora mesh gradient (3 moving blobs)
 *   - Floating eco-themed SVG icons (leaf, water, recycle, wind, etc.)
 *   - Logo reveal with glow ring + luminous bloom
 *   - Brand text with staggered fade-in
 *   - Smooth fade-out transition
 *
 * All pure CSS/SVG — no extra dependencies, GPU-accelerated.
 */
export function AnimatedSplash({ onComplete, minDuration = 3200 }: AnimatedSplashProps) {
  const [phase, setPhase] = useState<"playing" | "fading" | "done">("playing");

  const hideSplash = useCallback(async () => {
    try {
      const { SplashScreen } = await import("@capacitor/splash-screen");
      await SplashScreen.hide();
    } catch {
      // Not running in Capacitor
    }
  }, []);

  useEffect(() => {
    hideSplash();
    const fadeTimer = setTimeout(() => setPhase("fading"), minDuration);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, minDuration + 700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [minDuration, onComplete, hideSplash]);

  if (phase === "done") return null;

  // Eco-themed floating icons — leaf, water drop, recycle, wind, seedling, bicycle, sun, globe
  const ecoIcons = [
    // Leaf
    (s: number) => <path d={`M${s/2} ${s*0.15} C${s*0.2} ${s*0.4}, ${s*0.1} ${s*0.7}, ${s*0.5} ${s*0.9} C${s*0.9} ${s*0.7}, ${s*0.8} ${s*0.4}, ${s/2} ${s*0.15}Z M${s*0.5} ${s*0.9} L${s*0.5} ${s*0.3}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round"/>,
    // Water drop
    (s: number) => <path d={`M${s/2} ${s*0.12} C${s*0.3} ${s*0.45}, ${s*0.2} ${s*0.65}, ${s*0.5} ${s*0.88} C${s*0.8} ${s*0.65}, ${s*0.7} ${s*0.45}, ${s/2} ${s*0.12}Z`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round"/>,
    // Recycle arrows (simplified)
    (s: number) => <><path d={`M${s*0.5} ${s*0.18} L${s*0.7} ${s*0.48} L${s*0.55} ${s*0.48}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round" strokeLinejoin="round"/><path d={`M${s*0.7} ${s*0.48} L${s*0.5} ${s*0.82} L${s*0.35} ${s*0.65}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round" strokeLinejoin="round"/><path d={`M${s*0.5} ${s*0.82} L${s*0.3} ${s*0.48} L${s*0.45} ${s*0.48}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round" strokeLinejoin="round"/></>,
    // Wind/breeze lines
    (s: number) => <><path d={`M${s*0.15} ${s*0.35} Q${s*0.5} ${s*0.2}, ${s*0.7} ${s*0.35} Q${s*0.85} ${s*0.42}, ${s*0.75} ${s*0.28}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round"/><path d={`M${s*0.1} ${s*0.55} Q${s*0.4} ${s*0.45}, ${s*0.6} ${s*0.55}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round"/><path d={`M${s*0.2} ${s*0.72} Q${s*0.55} ${s*0.62}, ${s*0.8} ${s*0.72} Q${s*0.9} ${s*0.78}, ${s*0.82} ${s*0.65}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round"/></>,
    // Seedling
    (s: number) => <><path d={`M${s*0.5} ${s*0.88} L${s*0.5} ${s*0.45}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round"/><path d={`M${s*0.5} ${s*0.55} C${s*0.3} ${s*0.55}, ${s*0.25} ${s*0.3}, ${s*0.35} ${s*0.2}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round"/><path d={`M${s*0.5} ${s*0.45} C${s*0.7} ${s*0.45}, ${s*0.75} ${s*0.25}, ${s*0.65} ${s*0.15}`} fill="none" stroke="currentColor" strokeWidth={s*0.06} strokeLinecap="round"/></>,
    // Sun
    (s: number) => <><circle cx={s/2} cy={s/2} r={s*0.18} fill="none" stroke="currentColor" strokeWidth={s*0.06}/>{[0,45,90,135,180,225,270,315].map((a,j)=>{const rad=a*Math.PI/180;const x1=s/2+Math.cos(rad)*s*0.28;const y1=s/2+Math.sin(rad)*s*0.28;const x2=s/2+Math.cos(rad)*s*0.38;const y2=s/2+Math.sin(rad)*s*0.38;return <line key={j} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={s*0.05} strokeLinecap="round"/>})}</>,
    // Globe/Earth outline
    (s: number) => <><circle cx={s/2} cy={s/2} r={s*0.35} fill="none" stroke="currentColor" strokeWidth={s*0.06}/><ellipse cx={s/2} cy={s/2} rx={s*0.15} ry={s*0.35} fill="none" stroke="currentColor" strokeWidth={s*0.04}/><path d={`M${s*0.15} ${s*0.5} L${s*0.85} ${s*0.5}`} fill="none" stroke="currentColor" strokeWidth={s*0.04}/></>,
    // CO2 cloud with down arrow
    (s: number) => <><path d={`M${s*0.25} ${s*0.55} Q${s*0.15} ${s*0.55}, ${s*0.15} ${s*0.42} Q${s*0.15} ${s*0.28}, ${s*0.3} ${s*0.28} Q${s*0.35} ${s*0.18}, ${s*0.5} ${s*0.18} Q${s*0.65} ${s*0.18}, ${s*0.7} ${s*0.28} Q${s*0.85} ${s*0.28}, ${s*0.85} ${s*0.42} Q${s*0.85} ${s*0.55}, ${s*0.75} ${s*0.55}Z`} fill="none" stroke="currentColor" strokeWidth={s*0.05} strokeLinecap="round"/><path d={`M${s*0.5} ${s*0.55} L${s*0.5} ${s*0.82} M${s*0.38} ${s*0.72} L${s*0.5} ${s*0.84} L${s*0.62} ${s*0.72}`} fill="none" stroke="currentColor" strokeWidth={s*0.05} strokeLinecap="round" strokeLinejoin="round"/></>,
  ];

  // 14 floating eco icons scattered across the screen
  const floatingIcons = Array.from({ length: 14 }, (_, i) => ({
    x: ((i * 41 + 17) % 85) + 5,
    y: ((i * 59 + 11) % 80) + 8,
    size: 22 + (i % 3) * 6,
    iconIdx: i % ecoIcons.length,
    delay: (i * 0.25).toFixed(2),
    dur: (5 + (i % 4)).toFixed(1),
    rotation: (i * 27) % 360,
  }));

  return (
    <div
      className={`ee-splash fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#0a1a12]" />

      {/* Aurora mesh gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ee-blob ee-blob-1" />
        <div className="ee-blob ee-blob-2" />
        <div className="ee-blob ee-blob-3" />
      </div>

      {/* Subtle noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      {/* Floating eco icons */}
      <div className="absolute inset-0">
        {floatingIcons.map((icon, i) => (
          <svg
            key={i}
            className="ee-eco-icon absolute"
            width={icon.size}
            height={icon.size}
            viewBox={`0 0 ${icon.size} ${icon.size}`}
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              color: "rgba(116,198,157,0.18)",
              animationDelay: `${icon.delay}s`,
              animationDuration: `${icon.dur}s`,
              transform: `rotate(${icon.rotation}deg)`,
            }}
          >
            {ecoIcons[icon.iconIdx](icon.size)}
          </svg>
        ))}
      </div>

      {/* Radial light behind logo */}
      <div className="ee-glow absolute z-[1]" />

      {/* Logo + ring */}
      <div className="relative z-10 flex items-center justify-center" style={{ width: 220, height: 220 }}>
        {/* Outer glow ring */}
        <svg width="220" height="220" viewBox="0 0 220 220" className="ee-ring absolute inset-0">
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#52b788" />
              <stop offset="50%" stopColor="#2D6A4F" />
              <stop offset="100%" stopColor="#74c69d" />
            </linearGradient>
          </defs>
          <circle
            cx="110"
            cy="110"
            r="100"
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth="1.5"
            className="ee-ring-circle"
          />
          {/* Second thinner ring */}
          <circle
            cx="110"
            cy="110"
            r="105"
            fill="none"
            stroke="#52b788"
            strokeWidth="0.5"
            opacity="0.3"
            className="ee-ring-circle-outer"
          />
        </svg>

        {/* Logo */}
        <div className="ee-logo relative z-10 drop-shadow-[0_0_12px_rgba(82,183,136,0.2)]">
          <Image
            src="/assets/ee-logo.webp"
            alt="EarthEcho"
            width={140}
            height={140}
            className="object-contain brightness-110"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Brand text */}
      <h1 className="ee-brand relative z-10 mt-6 text-[26px] font-bold tracking-wide text-white">
        Earth<span className="text-[#74c69d]">Echo</span>
      </h1>

      {/* Tagline */}
      <p className="ee-tagline relative z-10 mt-2 text-[13px] font-medium uppercase tracking-[0.25em] text-white/40">
        Track Your Impact
      </p>

      <style>{`
        /* ===== Aurora blobs ===== */
        .ee-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          will-change: transform;
        }
        .ee-blob-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(45,106,79,0.5) 0%, transparent 70%);
          top: -10%; left: -10%;
          animation: ee-float-1 6s ease-in-out infinite alternate;
        }
        .ee-blob-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(82,183,136,0.35) 0%, transparent 70%);
          bottom: -5%; right: -15%;
          animation: ee-float-2 7s ease-in-out infinite alternate;
        }
        .ee-blob-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(116,198,157,0.2) 0%, transparent 70%);
          top: 40%; left: 50%;
          transform: translate(-50%, -50%);
          animation: ee-float-3 5s ease-in-out infinite alternate;
        }
        @keyframes ee-float-1 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes ee-float-2 {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(-50px, -30px) scale(1.1); }
        }
        @keyframes ee-float-3 {
          from { transform: translate(-50%, -50%) scale(1); }
          to   { transform: translate(-40%, -60%) scale(1.2); }
        }

        /* ===== Floating eco icons ===== */
        .ee-eco-icon {
          opacity: 0;
          animation: ee-icon-drift 6s ease-in-out infinite alternate;
          will-change: transform, opacity;
        }
        @keyframes ee-icon-drift {
          0%   { opacity: 0; transform: translateY(0) scale(0.85); }
          20%  { opacity: 1; }
          50%  { opacity: 0.8; transform: translateY(-8px) scale(1); }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-16px) scale(0.9); }
        }

        /* ===== Radial glow behind logo ===== */
        .ee-glow {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 60%);
          border-radius: 50%;
          opacity: 0;
          animation: ee-glow-in 1s ease-out 0.3s forwards;
        }
        @keyframes ee-glow-in {
          to { opacity: 1; }
        }

        /* ===== Logo reveal ===== */
        .ee-logo {
          opacity: 0;
          transform: scale(0.7);
          animation: ee-logo-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s forwards;
        }
        @keyframes ee-logo-in {
          to { opacity: 1; transform: scale(1); }
        }

        /* ===== Ring draw ===== */
        .ee-ring {
          opacity: 0;
          animation: ee-fade 0.5s ease-out 0.8s forwards;
        }
        .ee-ring-circle {
          stroke-dasharray: 628.3;
          stroke-dashoffset: 628.3;
          transform-origin: center;
          animation:
            ee-ring-draw 1.2s ease-out 0.8s forwards,
            ee-ring-spin 8s linear 0.8s infinite;
        }
        .ee-ring-circle-outer {
          stroke-dasharray: 659.7;
          stroke-dashoffset: 659.7;
          transform-origin: center;
          animation:
            ee-ring-outer-draw 1.4s ease-out 1.0s forwards,
            ee-ring-spin-reverse 12s linear 1.0s infinite;
        }
        @keyframes ee-fade {
          to { opacity: 1; }
        }
        @keyframes ee-ring-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes ee-ring-outer-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes ee-ring-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ee-ring-spin-reverse {
          to { transform: rotate(-360deg); }
        }

        /* ===== Text reveals ===== */
        .ee-brand {
          opacity: 0;
          transform: translateY(14px);
          animation: ee-text-up 0.6s ease-out 1.4s forwards;
        }
        .ee-tagline {
          opacity: 0;
          transform: translateY(10px);
          animation: ee-text-up 0.5s ease-out 1.7s forwards;
        }
        @keyframes ee-text-up {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
