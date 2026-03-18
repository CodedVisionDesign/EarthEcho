"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { TOUR_STEPS, type TourStep } from "./tourSteps";

interface TourContextValue {
  /** Whether the tour is currently running */
  isActive: boolean;
  /** Current step index */
  currentStep: number;
  /** The current step definition */
  step: TourStep | null;
  /** Total number of steps */
  totalSteps: number;
  /** Start the tour */
  start: () => void;
  /** Move to next step */
  next: () => void;
  /** Move to previous step */
  prev: () => void;
  /** Skip / close the tour without completing */
  skip: () => void;
  /** Finish the tour (last step done) */
  finish: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within TourProvider");
  return ctx;
}

interface TourProviderProps {
  children: ReactNode;
  onComplete: () => Promise<void>;
}

export function TourProvider({ children, onComplete }: TourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const start = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const next = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= TOUR_STEPS.length - 1) return prev;
      return prev + 1;
    });
  }, []);

  const prev = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const skip = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const finish = useCallback(async () => {
    setIsActive(false);
    setCurrentStep(0);
    await onComplete();
  }, [onComplete]);

  const step = isActive ? (TOUR_STEPS[currentStep] ?? null) : null;

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        step,
        totalSteps: TOUR_STEPS.length,
        start,
        next,
        prev,
        skip,
        finish,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}
