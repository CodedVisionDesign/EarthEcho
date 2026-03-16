"use client";

import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";

const MOBILE_BREAKPOINT = 768;

interface MagicCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** RGB string e.g. "45, 106, 79" — defaults to forest green */
  glowColor?: string;
  enableTilt?: boolean;
  enableRipple?: boolean;
  enableBorderGlow?: boolean;
  spotlightRadius?: number;
}

export function MagicCard({
  children,
  className = "",
  style,
  glowColor = "45, 106, 79",
  enableTilt = true,
  enableRipple = true,
  enableBorderGlow = true,
  spotlightRadius = 250,
}: MagicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // --- Border glow: track mouse position via CSS custom properties ---
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el || isMobile) return;

      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      el.style.setProperty("--glow-x", `${x}%`);
      el.style.setProperty("--glow-y", `${y}%`);
      el.style.setProperty("--glow-intensity", "1");
      el.style.setProperty("--glow-radius", `${spotlightRadius}px`);

      if (enableTilt) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -6;
        const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 6;

        gsap.to(el, {
          rotateX,
          rotateY,
          duration: 0.15,
          ease: "power2.out",
          transformPerspective: 800,
        });
      }
    },
    [isMobile, enableTilt, spotlightRadius],
  );

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el || isMobile) return;

    el.style.setProperty("--glow-intensity", "0");

    if (enableTilt) {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isMobile, enableTilt]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el || !enableRipple || isMobile) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDist = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDist * 2}px;
        height: ${maxDist * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, rgba(${glowColor}, 0.15) 30%, transparent 70%);
        left: ${x - maxDist}px;
        top: ${y - maxDist}px;
        pointer-events: none;
        z-index: 10;
      `;

      el.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    },
    [glowColor, enableRipple, isMobile],
  );

  const cssVars = {
    "--glow-x": "50%",
    "--glow-y": "50%",
    "--glow-intensity": "0",
    "--glow-radius": `${spotlightRadius}px`,
    "--glow-color": glowColor,
  } as CSSProperties;

  return (
    <div
      ref={cardRef}
      className={`magic-card ${enableBorderGlow ? "magic-card--glow" : ""} ${className}`}
      style={{ ...cssVars, ...style, position: "relative", overflow: "hidden" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
