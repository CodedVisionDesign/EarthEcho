"use client";

import { useState } from "react";
import Image from "next/image";

type LogoSize = "xs" | "sm" | "md" | "lg";

const SIZES: Record<LogoSize, { icon: number; text: string; gap: string }> = {
  xs: { icon: 34, text: "text-[13px]", gap: "gap-2" },
  sm: { icon: 40, text: "text-base", gap: "gap-2.5" },
  md: { icon: 44, text: "text-[17px]", gap: "gap-2.5" },
  lg: { icon: 56, text: "text-xl", gap: "gap-3" },
};

interface LogoProps {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
  textClassName = "",
}: LogoProps) {
  const [clicked, setClicked] = useState(false);
  const s = SIZES[size];

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <span
      className={`inline-flex items-center ${s.gap} ${className}`}
      onClick={handleClick}
    >
      <span
        className={`
          relative inline-flex items-center justify-center shrink-0
          transition-transform duration-300 ease-out
          hover:scale-110 hover:rotate-[8deg]
          ${clicked ? "animate-logo-click" : ""}
        `}
        style={{ width: s.icon, height: s.icon }}
      >
        <Image
          src="/assets/ee-logo.webp?v=4"
          alt="EarthEcho logo"
          width={s.icon}
          height={s.icon}
          className="object-contain drop-shadow-[0_2px_4px_rgba(45,106,79,0.25)]"
          priority
        />
      </span>

      {showText && (
        <span
          className={`font-bold tracking-tight ${s.text} ${textClassName}`}
        >
          EarthEcho
        </span>
      )}
    </span>
  );
}
