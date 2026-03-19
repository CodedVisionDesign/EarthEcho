"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { faArrowRight } from "@/lib/fontawesome";
import { Logo } from "@/components/ui/Logo";
import Image from "next/image";

export function CtaSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden bg-off-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div
          className={`relative border-2 border-forest/20 overflow-hidden rounded-2xl transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/hero_bg.webp"
              alt=""
              fill
              className="object-cover opacity-10"
              aria-hidden="true"
            />
          </div>

          {/* Spotlight effect */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none z-[1] transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(45,106,79,0.2), transparent 40%)`,
            }}
          />

          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              {/* Left content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <Logo size="lg" showText={false} />
                </div>

                <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-charcoal mb-8 leading-[0.95]">
                  Ready to make
                  <br />
                  a difference?
                </h2>

                <p className="text-xl text-slate mb-12 leading-relaxed max-w-xl">
                  Join for free. Track your impact. Earn badges. Be part of a
                  community that actually cares about the planet.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={faArrowRight}
                    href="/register"
                    className="rounded-full h-14 px-8 text-base"
                  >
                    Create your free account
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    href="#features"
                    className="rounded-full h-14 px-8 text-base"
                  >
                    Learn more
                  </Button>
                </div>

                <p className="text-sm text-slate mt-8 font-mono">
                  Free forever · No credit card required
                </p>
              </div>

              {/* Right visual */}
              <div className="hidden lg:flex items-center justify-center w-[300px] h-[300px]">
                <svg viewBox="0 0 200 200" className="w-full h-full text-forest">
                  {/* Animated eco circles */}
                  <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1">
                    <animate attributeName="r" values="70;85;70" dur="4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15">
                    <animate attributeName="r" values="55;65;55" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2">
                    <animate attributeName="r" values="38;45;38" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Center leaf */}
                  <path
                    d="M 100 75 Q 120 85 110 105 Q 105 115 100 120 Q 95 115 90 105 Q 80 85 100 75 Z"
                    fill="currentColor"
                    opacity="0.3"
                  >
                    <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
                  </path>
                  {/* Stem */}
                  <line x1="100" y1="120" x2="100" y2="140" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  {/* Pulse rings */}
                  <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
                    <animate attributeName="r" values="20;90" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0">
                    <animate attributeName="r" values="20;90" dur="3s" begin="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0" dur="3s" begin="1.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-forest/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-forest/10" />
        </div>
      </div>
    </section>
  );
}
