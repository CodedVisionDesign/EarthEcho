"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faRocket, faPaperPlane } from "@/lib/fontawesome";
import { createChallenge, updateChallenge, quickCreateChallenge } from "@/lib/challenge-actions";
import { CATEGORIES, type ActivityCategory } from "@/lib/categories";

const CATEGORY_LIST = Object.values(CATEGORIES);

interface ChallengeFormProps {
  mode: "create" | "edit";
  challengeId?: string;
  isSuperAdmin?: boolean;
  initialData?: {
    title: string;
    description: string;
    category: string;
    targetValue: number;
    startDate: string;
    endDate: string;
  };
}

export function ChallengeForm({ mode, challengeId, isSuperAdmin, initialData }: ChallengeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "WATER");
  const [targetValue, setTargetValue] = useState(initialData?.targetValue ?? 0);
  const [startDate, setStartDate] = useState(initialData?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialData?.endDate ?? "");

  const selectedCat = CATEGORIES[category as ActivityCategory];

  function handleSubmit(action: "draft" | "quick") {
    setError("");
    startTransition(async () => {
      try {
        const input = {
          title: title.trim(),
          description: description.trim(),
          category,
          targetValue,
          startDate,
          endDate,
        };

        if (mode === "edit" && challengeId) {
          await updateChallenge(challengeId, input);
          router.push(`/admin/challenges/${challengeId}`);
        } else if (action === "quick" && isSuperAdmin) {
          const result = await quickCreateChallenge(input);
          router.push(`/admin/challenges/${result.challengeId}`);
        } else {
          const result = await createChallenge(input);
          router.push(`/admin/challenges/${result.challengeId}`);
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Plastic-Free March"
          maxLength={100}
          className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
        <p className="mt-1 text-xs text-slate/60">{title.length}/100 characters</p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what participants need to do and why it matters..."
          maxLength={2000}
          rows={4}
          className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
        <p className="mt-1 text-xs text-slate/60">{description.length}/2000 characters</p>
      </div>

      {/* Category + Target */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          >
            {CATEGORY_LIST.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">
            Target Value ({selectedCat?.unitLabel ?? "units"})
          </label>
          <input
            type="number"
            value={targetValue || ""}
            onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
            placeholder="e.g. 100"
            min={0}
            step="any"
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
        <button
          type="button"
          onClick={() => handleSubmit("draft")}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-50"
        >
          {isPending ? (
            <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} className="h-3.5 w-3.5" />
          )}
          {mode === "edit" ? "Save Changes" : "Save as Draft"}
        </button>

        {mode === "create" && isSuperAdmin && (
          <button
            type="button"
            onClick={() => handleSubmit("quick")}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-forest bg-forest/5 px-5 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-forest/10 disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faRocket} className="h-3.5 w-3.5" />
            Quick Create (Skip Review)
          </button>
        )}

        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-slate transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
