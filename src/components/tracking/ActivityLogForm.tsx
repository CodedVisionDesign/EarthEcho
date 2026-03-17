"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCircleExclamation, faBolt, faAward } from "@/lib/fontawesome";
import { logActivity } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ActivityCategory, ActivityTypeConfig } from "@/lib/categories";
import { toHumanReadable, type MetricCategory } from "@/lib/metrics/converters";
import { calculateCO2Saved, transportToHuman } from "@/lib/metrics/transport";

interface ActivityLogFormProps {
  category: ActivityCategory;
  activityTypes: ActivityTypeConfig[];
  unit: string;
  unitLabel: string;
  transportModes?: Array<{ slug: string; name: string; co2PerKm: number }>;
}

interface FormState {
  error?: string;
  success?: boolean;
  newBadge?: { name: string; icon: string };
}

async function submitAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = await logActivity({
    category: formData.get("category") as string,
    type: formData.get("type") as string,
    value: Number(formData.get("value")),
    unit: formData.get("unit") as string,
    note: (formData.get("note") as string) || undefined,
    date: (formData.get("date") as string) || undefined,
    transportMode: (formData.get("transportMode") as string) || undefined,
    distanceKm: formData.get("distanceKm")
      ? Number(formData.get("distanceKm"))
      : undefined,
  });

  if (result.error) return { error: result.error };
  return {
    success: true,
    newBadge: result.newBadge ?? undefined,
  };
}

export function ActivityLogForm({
  category,
  activityTypes,
  unit,
  unitLabel,
  transportModes,
}: ActivityLogFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(submitAction, {});
  const [showSuccess, setShowSuccess] = useState(false);

  // Controlled state for smart presets & live preview
  const [selectedType, setSelectedType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedTransportMode, setSelectedTransportMode] = useState("");
  const [distanceValue, setDistanceValue] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const currentTypeConfig = activityTypes.find((t) => t.value === selectedType);
  const quickLogTypes = activityTypes.filter((t) => t.quickLog);

  // Compute live preview
  const numericValue = parseFloat(inputValue);
  const numericDistance = parseFloat(distanceValue);

  let preview: { value: string; comparison: string; tooltip?: string } | null = null;
  if (category === "TRANSPORT") {
    if (selectedTransportMode && !isNaN(numericDistance) && numericDistance > 0) {
      const co2Saved = calculateCO2Saved(selectedTransportMode, numericDistance);
      if (co2Saved > 0) {
        preview = transportToHuman(co2Saved);
      }
    }
  } else if (!isNaN(numericValue) && numericValue > 0) {
    preview = toHumanReadable(category as MetricCategory, numericValue);
  }

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      setSelectedType("");
      setInputValue("");
      setSelectedTransportMode("");
      setDistanceValue("");
      formRef.current?.reset();
      router.refresh();
      const timer = setTimeout(() => setShowSuccess(false), state.newBadge ? 5000 : 3000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  function handleTypeChange(value: string) {
    setSelectedType(value);
    const config = activityTypes.find((t) => t.value === value);
    if (config) {
      setInputValue(String(config.defaultValue));
      if (category === "TRANSPORT") {
        setDistanceValue(String(config.defaultValue));
      }
    } else {
      setInputValue("");
    }
  }

  function handleQuickLog(typeConfig: ActivityTypeConfig) {
    setSelectedType(typeConfig.value);
    setInputValue(String(typeConfig.defaultValue));
    // Submit after React flushes the controlled state
    requestAnimationFrame(() => {
      formRef.current?.requestSubmit();
    });
  }

  return (
    <Card variant="default" className="p-5">
      <h3 className="mb-1 text-[15px] font-semibold text-charcoal">
        Log Activity
      </h3>
      <p className="mb-4 text-xs text-slate">
        Record your environmental contribution
      </p>

      {/* Quick-Log Buttons */}
      {quickLogTypes.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-1.5">
            <FontAwesomeIcon
              icon={faBolt}
              className="h-3 w-3 text-amber-500"
              aria-hidden
            />
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate/60">
              Quick Log
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickLogTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handleQuickLog(t)}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-medium text-charcoal shadow-sm transition-all hover:-translate-y-px hover:border-forest/30 hover:shadow-md active:translate-y-0 disabled:opacity-50"
              >
                <span>{t.quickLogEmoji}</span>
                <span>{t.label}</span>
                <span className="text-slate/60">
                  ({t.defaultValue} {unitLabel.toLowerCase()})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="unit" value={unit} />

        {/* Activity Type */}
        <div>
          <label
            htmlFor="type"
            className="mb-1 block text-sm font-medium text-charcoal"
          >
            Activity Type
          </label>
          <select
            id="type"
            name="type"
            required
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          >
            <option value="">Select activity...</option>
            {activityTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Value */}
        {category !== "TRANSPORT" && (
          <div>
            <label
              htmlFor="value"
              className="mb-1 block text-sm font-medium text-charcoal"
            >
              Value
            </label>
            <div className="relative">
              <input
                id="value"
                name="value"
                type="number"
                min={0}
                step="any"
                required
                placeholder="0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-16 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate">
                {unitLabel}
              </span>
            </div>

            {/* Hint or Live Preview */}
            {preview ? (
              <div className="mt-2 flex items-start gap-2 rounded-lg bg-forest/5 px-3 py-2">
                <span className="mt-0.5 text-sm">{preview.value.includes("pool") ? "\u{1F3CA}" : preview.value.includes("bathtub") ? "\u{1F6C1}" : preview.value.includes("shower") ? "\u{1F6BF}" : preview.value.includes("tree") ? "\u{1F333}" : preview.value.includes("car") ? "\u{1F697}" : preview.value.includes("flight") ? "\u{2708}\u{FE0F}" : preview.value.includes("bin") ? "\u{1F5D1}\u{FE0F}" : "\u{2728}"}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-forest">
                    {preview.comparison}
                  </p>
                  {preview.tooltip && (
                    <p className="mt-0.5 text-[11px] text-forest/60">
                      {preview.tooltip}
                    </p>
                  )}
                </div>
              </div>
            ) : currentTypeConfig ? (
              <p className="mt-1.5 text-xs italic text-slate">
                Tip: {currentTypeConfig.hint}
              </p>
            ) : null}
          </div>
        )}

        {/* Transport-specific fields */}
        {category === "TRANSPORT" && transportModes && (
          <>
            <div>
              <label
                htmlFor="transportMode"
                className="mb-1 block text-sm font-medium text-charcoal"
              >
                Transport Mode
              </label>
              <select
                id="transportMode"
                name="transportMode"
                required
                value={selectedTransportMode}
                onChange={(e) => setSelectedTransportMode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              >
                <option value="">Select mode...</option>
                {transportModes.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name} ({m.co2PerKm === 0 ? "zero emission" : `${m.co2PerKm} kg/km`})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="distanceKm"
                className="mb-1 block text-sm font-medium text-charcoal"
              >
                Distance
              </label>
              <div className="relative">
                <input
                  id="distanceKm"
                  name="distanceKm"
                  type="number"
                  min={0}
                  step="any"
                  required
                  placeholder="0"
                  value={distanceValue}
                  onChange={(e) => setDistanceValue(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-12 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate">
                  km
                </span>
              </div>

              {/* Transport hint or preview */}
              {preview ? (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-forest/5 px-3 py-2">
                  <span className="mt-0.5 text-sm">{preview.value.includes("road trip") ? "\u{1F5FA}\u{FE0F}" : preview.value.includes("commute") ? "\u{1F697}" : "\u{1F33F}"}</span>
                  <p className="text-sm font-medium text-forest">
                    {preview.comparison}
                  </p>
                </div>
              ) : currentTypeConfig ? (
                <p className="mt-1.5 text-xs italic text-slate">
                  Tip: {currentTypeConfig.hint}
                </p>
              ) : null}
            </div>

            {/* Hidden value field for transport (uses distance as the activity value) */}
            <input type="hidden" name="value" value={distanceValue || "0"} />
          </>
        )}

        {/* Note */}
        <div>
          <label
            htmlFor="note"
            className="mb-1 block text-sm font-medium text-charcoal"
          >
            Note{" "}
            <span className="font-normal text-slate">(optional)</span>
          </label>
          <input
            id="note"
            name="note"
            type="text"
            placeholder="Add a note..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="mb-1 block text-sm font-medium text-charcoal"
          >
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={today}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </div>

        {/* Error message */}
        {state.error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="h-3.5 w-3.5"
              aria-hidden
            />
            {state.error}
          </div>
        )}

        {/* Success message / Badge celebration */}
        {showSuccess && (
          state.newBadge ? (
            <div className="rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-sunshine/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sunshine/20">
                  <FontAwesomeIcon icon={faAward} className="h-5 w-5 text-amber-600" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">
                    Badge Earned!
                  </p>
                  <p className="text-xs text-amber-700">
                    You unlocked <span className="font-semibold">{state.newBadge.name}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              Activity logged successfully!
            </div>
          )
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          leftIcon={faPlus}
          loading={isPending}
          className="w-full"
        >
          Log Activity
        </Button>
      </form>
    </Card>
  );
}
