"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const positionClasses = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowClasses = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-charcoal border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-charcoal border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-charcoal border-y-transparent border-r-transparent",
  right: "right-full top-1/2 -translate-y-1/2 border-r-charcoal border-y-transparent border-l-transparent",
};

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!content) return <>{children}</>;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 max-w-64 rounded-lg bg-charcoal px-3 py-1.5 text-xs text-white shadow-lg transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        } ${positionClasses[position]}`}
      >
        {content}
        <span
          className={`absolute h-0 w-0 border-4 ${arrowClasses[position]}`}
          aria-hidden
        />
      </span>
    </span>
  );
}
