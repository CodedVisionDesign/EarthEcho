"use client";

import { useState, useTransition, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSeedling,
  faDroplet,
  faEarthAmericas,
  faBagShopping,
  faRecycle,
  faCar,
  faShirt,
  faArrowRight,
  faUser,
  faTrophy,
  faSpinner,
  faCircleCheck,
  faRocket,
} from "@/lib/fontawesome";
import { completeOnboarding } from "@/lib/actions";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface OnboardingModalProps {
  userName: string;
}

const INTEREST_OPTIONS: { key: string; label: string; icon: IconDefinition; color: string; emoji: string }[] = [
  { key: "WATER", label: "Water", icon: faDroplet, color: "border-ocean/30 bg-ocean/5 text-ocean hover:border-ocean/60 hover:bg-ocean/10", emoji: "💧" },
  { key: "CARBON", label: "Carbon", icon: faEarthAmericas, color: "border-forest/30 bg-forest/5 text-forest hover:border-forest/60 hover:bg-forest/10", emoji: "🌍" },
  { key: "PLASTIC", label: "Plastic", icon: faBagShopping, color: "border-sunshine/30 bg-sunshine/5 text-amber-600 hover:border-sunshine/60 hover:bg-sunshine/10", emoji: "🛍️" },
  { key: "RECYCLING", label: "Recycling", icon: faRecycle, color: "border-leaf/30 bg-leaf/5 text-leaf hover:border-leaf/60 hover:bg-leaf/10", emoji: "♻️" },
  { key: "TRANSPORT", label: "Transport", icon: faCar, color: "border-ocean/30 bg-ocean/5 text-ocean hover:border-ocean/60 hover:bg-ocean/10", emoji: "🚗" },
  { key: "FASHION", label: "Fashion", icon: faShirt, color: "border-forest/30 bg-forest/5 text-forest hover:border-forest/60 hover:bg-forest/10", emoji: "👗" },
];

const TOTAL_STEPS = 4;

export function OnboardingModal({ userName }: OnboardingModalProps) {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [completed, setCompleted] = useState(false);

  const toggleInterest = useCallback((key: string) => {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  function handleNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleComplete() {
    startTransition(async () => {
      try {
        await completeOnboarding({
          displayName: displayName || undefined,
          bio: bio || undefined,
          interests,
        });
        setCompleted(true);
        // Use hard navigation to guarantee fresh server data.
        // router.refresh() can stall if the revalidation cache hasn't propagated.
        setTimeout(() => {
          window.location.replace("/dashboard");
        }, 2000);
      } catch {
        // Force reload even on error to clear the modal
        window.location.replace("/dashboard");
      }
    });
  }

  function handleSkip() {
    startTransition(async () => {
      try {
        await completeOnboarding({});
      } catch {
        // Continue to reload even on error
      }
      window.location.replace("/dashboard");
    });
  }

  // Completion celebration screen
  if (completed) {
    return (
      <div data-onboarding-modal className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md animate-scale-in rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-forest to-ocean">
            <FontAwesomeIcon icon={faCircleCheck} className="h-10 w-10 text-white" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-charcoal">You&apos;re All Set!</h2>
          <p className="mb-3 text-sm text-slate">You&apos;ve earned <strong className="text-forest">50 points</strong> for completing your onboarding.</p>
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-2 text-sm font-semibold text-forest">
            <FontAwesomeIcon icon={faTrophy} className="h-4 w-4" />
            +50 Points Earned!
          </div>
          <p className="text-xs text-slate">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-onboarding-modal className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg animate-slide-up sm:animate-scale-in rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[85vh]">
        {/* Progress bar */}
        <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate">
            <span>Step {step + 1} of {TOTAL_STEPS}</span>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isPending}
              className="text-slate/60 hover:text-slate transition-colors"
            >
              Skip
            </button>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-gradient-to-r from-forest to-ocean" : "bg-gray-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {step === 0 && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-forest/10 to-ocean/10">
                <FontAwesomeIcon icon={faSeedling} className="h-9 w-9 text-forest" />
              </div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-charcoal">
                Welcome, {userName}!
              </h2>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate">
                EarthEcho helps you track and reduce your environmental impact across
                water, carbon, plastic, recycling, transport, and fashion.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { icon: "📊", text: "Track your daily eco-actions" },
                  { icon: "🏆", text: "Earn badges and climb the leaderboard" },
                  { icon: "💬", text: "Connect with a community of eco-warriors" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-left">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm text-charcoal">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="mb-5 text-center">
                <h2 className="mb-1 text-xl font-bold text-charcoal">What matters to you?</h2>
                <p className="text-sm text-slate">Choose the areas you care about most. You can track all of them anytime.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {INTEREST_OPTIONS.map((opt) => {
                  const isSelected = interests.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => toggleInterest(opt.key)}
                      className={`group relative flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-5 transition-all duration-200 ${
                        isSelected
                          ? "border-forest bg-forest/5 shadow-sm ring-1 ring-forest/20"
                          : opt.color
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute right-2 top-2">
                          <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4 text-forest" />
                        </div>
                      )}
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className={`text-sm font-medium ${isSelected ? "text-forest" : ""}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ocean/10">
                  <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-ocean" />
                </div>
                <h2 className="mb-1 text-xl font-bold text-charcoal">Personalise your profile</h2>
                <p className="text-sm text-slate">This is how others see you on the leaderboard and forum.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="ob-displayName" className="mb-1 block text-sm font-medium text-charcoal">
                    Display Name
                  </label>
                  <input
                    id="ob-displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. EcoWarrior"
                    maxLength={30}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder:text-slate/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                </div>
                <div>
                  <label htmlFor="ob-bio" className="mb-1 block text-sm font-medium text-charcoal">
                    Short Bio <span className="text-slate/50">(optional)</span>
                  </label>
                  <textarea
                    id="ob-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community a bit about your eco journey..."
                    rows={3}
                    maxLength={160}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder:text-slate/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  />
                  <p className="mt-1 text-right text-[11px] text-slate/50">{bio.length}/160</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-forest/10 to-ocean/10">
                <FontAwesomeIcon icon={faRocket} className="h-9 w-9 text-forest" />
              </div>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-charcoal">
                Ready to make an impact?
              </h2>
              <p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-slate">
                You&apos;ll earn <strong className="text-forest">50 bonus points</strong> just for completing this setup. Here&apos;s what to do next:
              </p>
              <div className="space-y-3 text-left">
                {[
                  { icon: "📝", text: "Log your first eco-action", sub: "Water, carbon, transport — anything counts!" },
                  { icon: "🏅", text: "Join a monthly challenge", sub: "Compete with the community for extra points" },
                  { icon: "💬", text: "Say hello in the forum", sub: "Introduce yourself and get tips from others" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span className="mt-0.5 text-lg">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-charcoal">{item.text}</p>
                      <p className="text-xs text-slate">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div
          className="shrink-0 border-t border-gray-100 px-6 py-4 sm:px-8 sm:py-5"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 1rem))" }}
        >
          <div className="flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate transition-colors hover:bg-gray-100"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest to-forest/90 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
              >
                Continue
                <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest to-ocean px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60"
              >
                {isPending ? (
                  <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5" spin />
                ) : (
                  <FontAwesomeIcon icon={faRocket} className="h-3.5 w-3.5" />
                )}
                Let&apos;s Go!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
