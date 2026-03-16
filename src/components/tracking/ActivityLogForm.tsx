"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCircleExclamation } from "@/lib/fontawesome";
import { logActivity } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import type { ActivityCategory } from "@/lib/categories";

interface ActivityLogFormProps {
  category: ActivityCategory;
  activityTypes: Array<{ value: string; label: string }>;
  unit: string;
  unitLabel: string;
  transportModes?: Array<{ slug: string; name: string; co2PerKm: number }>;
}

interface FormState {
  error?: string;
  success?: boolean;
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
  return { success: true };
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

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
      formRef.current?.reset();
      router.refresh();
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
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
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-16 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate">
            {unitLabel}
          </span>
        </div>
      </div>

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
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
            >
              <option value="">Select mode...</option>
              {transportModes.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
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
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-12 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate">
                km
              </span>
            </div>
          </div>
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

      {/* Success message */}
      {showSuccess && (
        <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          Activity logged successfully!
        </div>
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
  );
}
