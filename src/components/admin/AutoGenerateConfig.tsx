"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faToggleOn,
  faToggleOff,
  faSpinner,
  faChevronDown,
  faChevronUp,
  faCircleCheck,
} from "@/lib/fontawesome";
import { toggleAutoGenerate, updateTemplate } from "@/lib/auto-challenge-actions";
import { CATEGORIES, type ActivityCategory } from "@/lib/categories";

interface Template {
  id: string;
  category: string;
  titlePattern: string;
  description: string;
  targetValue: number;
  isEnabled: boolean;
}

interface AutoGenerateConfigProps {
  globalEnabled: boolean;
  templates: Template[];
}

export function AutoGenerateConfig({ globalEnabled, templates }: AutoGenerateConfigProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(globalEnabled);
  const [error, setError] = useState("");

  function handleToggle() {
    const newVal = !enabled;
    setEnabled(newVal);
    setError("");
    startTransition(async () => {
      try {
        await toggleAutoGenerate(newVal);
        router.refresh();
      } catch (e) {
        setEnabled(!newVal);
        setError(e instanceof Error ? e.message : "Toggle failed");
      }
    });
  }

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white">
      {/* Collapsible header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={enabled ? faToggleOn : faToggleOff}
            className={`h-5 w-5 ${enabled ? "text-forest" : "text-gray-300"}`}
          />
          <div>
            <p className="text-sm font-semibold text-charcoal">Auto-Generation</p>
            <p className="text-xs text-slate">
              {enabled ? "Enabled — challenges auto-created monthly as Pending Review" : "Disabled — challenges created manually only"}
            </p>
          </div>
        </div>
        <FontAwesomeIcon
          icon={expanded ? faChevronUp : faChevronDown}
          className="h-3.5 w-3.5 text-slate/50"
        />
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Global toggle */}
          <div className="mb-5 flex items-center gap-3">
            <button
              onClick={handleToggle}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {isPending ? (
                <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FontAwesomeIcon
                  icon={enabled ? faToggleOn : faToggleOff}
                  className={`h-4 w-4 ${enabled ? "text-forest" : "text-gray-400"}`}
                />
              )}
              {enabled ? "Disable Auto-Generation" : "Enable Auto-Generation"}
            </button>
          </div>

          {/* Template cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [titlePattern, setTitlePattern] = useState(template.titlePattern);
  const [description, setDescription] = useState(template.description);
  const [targetValue, setTargetValue] = useState(template.targetValue);
  const [isEnabled, setIsEnabled] = useState(template.isEnabled);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const cat = CATEGORIES[template.category as ActivityCategory];

  const hasChanges =
    titlePattern !== template.titlePattern ||
    description !== template.description ||
    targetValue !== template.targetValue ||
    isEnabled !== template.isEnabled;

  function handleSave() {
    setError("");
    setSaved(false);
    startTransition(async () => {
      try {
        await updateTemplate(template.category, {
          titlePattern: titlePattern.trim(),
          description: description.trim(),
          targetValue,
          isEnabled,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      }
    });
  }

  return (
    <div className={`rounded-lg border p-3 transition-colors ${isEnabled ? "border-forest/30 bg-forest/5" : "border-gray-200 bg-gray-50"}`}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal">
          {cat?.icon} {cat?.label ?? template.category}
        </span>
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className="text-xs"
        >
          <FontAwesomeIcon
            icon={isEnabled ? faToggleOn : faToggleOff}
            className={`h-4 w-4 ${isEnabled ? "text-forest" : "text-gray-300"}`}
          />
        </button>
      </div>

      {error && (
        <p className="mb-2 text-xs text-red-500">{error}</p>
      )}

      {/* Title pattern */}
      <input
        type="text"
        value={titlePattern}
        onChange={(e) => setTitlePattern(e.target.value)}
        placeholder="Title pattern (use {month})"
        className="mb-2 w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs text-charcoal placeholder:text-slate/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        placeholder="Description (use {month}, {target})"
        className="mb-2 w-full resize-none rounded-md border border-gray-200 px-2 py-1.5 text-xs text-charcoal placeholder:text-slate/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
      />

      {/* Target + Save */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={targetValue || ""}
          onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
          min={0}
          step="any"
          className="w-20 rounded-md border border-gray-200 px-2 py-1.5 text-xs text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
        <span className="text-xs text-slate">{cat?.unitLabel?.toLowerCase() ?? "units"}</span>

        <button
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          className="ml-auto inline-flex items-center gap-1 rounded-md bg-forest px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-40"
        >
          {isPending ? (
            <FontAwesomeIcon icon={faSpinner} className="h-3 w-3 animate-spin" />
          ) : saved ? (
            <FontAwesomeIcon icon={faCircleCheck} className="h-3 w-3" />
          ) : null}
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
