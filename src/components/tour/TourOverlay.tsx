"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTour } from "./TourProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faXmark, faCircleCheck } from "@/lib/fontawesome";

const PADDING = 8;
const ARROW_SIZE = 8;

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getTooltipPosition(
  targetRect: Rect,
  placement: "top" | "bottom" | "left" | "right",
  tooltipWidth: number,
  tooltipHeight: number,
) {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const cx = targetRect.left + scrollX + targetRect.width / 2;
  const cy = targetRect.top + scrollY + targetRect.height / 2;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "bottom":
      top = targetRect.top + scrollY + targetRect.height + PADDING + ARROW_SIZE;
      left = cx - tooltipWidth / 2;
      break;
    case "top":
      top = targetRect.top + scrollY - tooltipHeight - PADDING - ARROW_SIZE;
      left = cx - tooltipWidth / 2;
      break;
    case "right":
      top = cy - tooltipHeight / 2;
      left = targetRect.left + scrollX + targetRect.width + PADDING + ARROW_SIZE;
      break;
    case "left":
      top = cy - tooltipHeight / 2;
      left = targetRect.left + scrollX - tooltipWidth - PADDING - ARROW_SIZE;
      break;
  }

  // Clamp to viewport
  const vw = window.innerWidth;
  const vh = window.innerHeight + scrollY;
  left = Math.max(12, Math.min(left, vw - tooltipWidth - 12));
  top = Math.max(scrollY + 12, Math.min(top, vh - tooltipHeight - 12));

  return { top, left };
}

export function TourOverlay() {
  const { isActive, step, currentStep, totalSteps, next, prev, skip, finish } =
    useTour();
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 320, height: 200 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const measureTarget = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(`[data-tour-step="${step.target}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      // Scroll into view if needed
      const buffer = 100;
      if (
        rect.top < buffer ||
        rect.bottom > window.innerHeight - buffer
      ) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Re-measure after scroll
        setTimeout(() => {
          const r2 = el.getBoundingClientRect();
          setTargetRect({
            top: r2.top,
            left: r2.left,
            width: r2.width,
            height: r2.height,
          });
        }, 400);
      }
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!isActive || !step) return;
    measureTarget();
    const handle = () => measureTarget();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [isActive, step, measureTarget]);

  // Measure tooltip
  useEffect(() => {
    if (tooltipRef.current) {
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      setTooltipSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [currentStep, isActive]);

  if (!mounted || !isActive || !step || !targetRect) return null;

  const isLast = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

  // Spotlight rect with padding
  const spotX = targetRect.left - PADDING;
  const spotY = targetRect.top - PADDING;
  const spotW = targetRect.width + PADDING * 2;
  const spotH = targetRect.height + PADDING * 2;
  const spotR = 12;

  const tooltipPos = getTooltipPosition(
    targetRect,
    step.placement,
    tooltipSize.width,
    tooltipSize.height,
  );

  const overlay = (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="tour-overlay"
          className="fixed inset-0 z-[110]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* SVG mask with spotlight cutout */}
          <svg
            className="absolute inset-0 h-full w-full"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <mask id="tour-spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={spotX}
                  y={spotY}
                  width={spotW}
                  height={spotH}
                  rx={spotR}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.55)"
              mask="url(#tour-spotlight-mask)"
              style={{ pointerEvents: "auto" }}
              onClick={skip}
            />
          </svg>

          {/* Spotlight highlight ring */}
          <motion.div
            className="absolute rounded-xl border-2 border-forest/60 shadow-[0_0_0_4px_rgba(45,106,79,0.15)]"
            style={{
              top: spotY,
              left: spotX,
              width: spotW,
              height: spotH,
              pointerEvents: "none",
            }}
            layoutId="tour-spotlight"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Tooltip */}
          <motion.div
            ref={tooltipRef}
            className="absolute z-[111] w-full max-w-xs sm:max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              pointerEvents: "auto",
            }}
            key={step.id}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Step counter */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate">
                {currentStep + 1} of {totalSteps}
              </span>
              <button
                type="button"
                onClick={skip}
                className="flex h-6 w-6 items-center justify-center rounded-full text-slate/60 transition-colors hover:bg-gray-100 hover:text-charcoal"
                aria-label="Close tour"
              >
                <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
              </button>
            </div>

            {/* Progress dots */}
            <div className="mb-3 flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= currentStep
                      ? "bg-gradient-to-r from-forest to-ocean"
                      : "bg-gray-100"
                  }`}
                />
              ))}
            </div>

            <h3 className="mb-1 text-base font-bold text-charcoal">
              {step.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-slate">
              {step.description}
            </p>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-2">
              {!isFirst ? (
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate transition-colors hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={skip}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate/60 transition-colors hover:bg-gray-100 hover:text-slate"
                >
                  Skip tour
                </button>
              )}

              {isLast ? (
                <button
                  type="button"
                  onClick={finish}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest to-ocean px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                >
                  <FontAwesomeIcon icon={faCircleCheck} className="h-3.5 w-3.5" />
                  Finish Tour
                </button>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest to-forest/90 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                >
                  Next
                  <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(overlay, document.body);
}
