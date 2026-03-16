"use client";

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
  if (!content) return <>{children}</>;

  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-lg bg-charcoal px-3 py-1.5 text-xs text-white shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 ${positionClasses[position]}`}
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
