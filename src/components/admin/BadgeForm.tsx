"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faPaperPlane,
  faMedal,
  faDroplet,
  faFire,
  faBicycle,
  faLeaf,
  faTrophy,
  faBolt,
  faPersonWalking,
  faUsers,
  faEarthAmericas,
  faCar,
  faUser,
  faTrain,
} from "@/lib/fontawesome";
import { createBadge, updateBadge } from "@/lib/badge-actions";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

const ICON_OPTIONS: { value: string; icon: IconDefinition; label: string }[] = [
  { value: "footprints", icon: faPersonWalking, label: "Footprints" },
  { value: "flame", icon: faFire, label: "Flame" },
  { value: "droplet", icon: faDroplet, label: "Droplet" },
  { value: "droplets", icon: faDroplet, label: "Droplets" },
  { value: "bike", icon: faBicycle, label: "Bike" },
  { value: "leaf", icon: faLeaf, label: "Leaf" },
  { value: "trophy", icon: faTrophy, label: "Trophy" },
  { value: "medal", icon: faMedal, label: "Medal" },
  { value: "crown", icon: faTrophy, label: "Crown" },
  { value: "zap", icon: faBolt, label: "Zap" },
  { value: "shield", icon: faLeaf, label: "Shield" },
  { value: "waves", icon: faDroplet, label: "Waves" },
  { value: "user-check", icon: faUser, label: "User" },
  { value: "message-circle", icon: faUsers, label: "Messages" },
  { value: "heart-handshake", icon: faUsers, label: "Handshake" },
  { value: "star", icon: faTrophy, label: "Star" },
  { value: "globe", icon: faEarthAmericas, label: "Globe" },
  { value: "train", icon: faTrain, label: "Train" },
  { value: "car-off", icon: faCar, label: "Car-Off" },
];

const CATEGORY_OPTIONS = [
  { value: "starter", label: "Getting Started" },
  { value: "streak", label: "Streak" },
  { value: "impact", label: "Impact" },
  { value: "transport", label: "Transport" },
  { value: "challenge", label: "Challenge" },
  { value: "community", label: "Community" },
];

const RARITY_OPTIONS = [
  { value: "common", label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
];

const CRITERIA_TYPES = [
  { value: "first_activity", label: "First Activity" },
  { value: "profile_complete", label: "Profile Complete" },
  { value: "first_post", label: "First Post" },
  { value: "streak", label: "Streak (days)" },
  { value: "total", label: "Category Total" },
  { value: "transport_distance", label: "Transport Distance" },
  { value: "transport_count", label: "Transport Count" },
  { value: "challenges_completed", label: "Challenges Completed" },
  { value: "reactions_received", label: "Reactions Received" },
  { value: "posts_count", label: "Posts Count" },
  { value: "car_free_streak", label: "Car-Free Streak" },
  { value: "flight_free_streak", label: "Flight-Free Streak" },
];

const ACTIVITY_CATEGORIES = ["WATER", "CARBON", "PLASTIC", "RECYCLING", "TRANSPORT", "FASHION"];
const TRANSPORT_MODES = ["cycling", "walking", "ev", "train", "bus", "e_scooter"];
const REACTION_TYPES = ["cheer", "helpful", "inspiring"];

interface BadgeFormProps {
  mode: "create" | "edit";
  badgeId?: string;
  initialData?: {
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: string;
    criteria: string;
  };
}

export function BadgeForm({ mode, badgeId, initialData }: BadgeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? "medal");
  const [category, setCategory] = useState(initialData?.category ?? "starter");
  const [rarity, setRarity] = useState(initialData?.rarity ?? "common");

  // Parse initial criteria
  const parsedInitial = (() => {
    try {
      return initialData?.criteria ? JSON.parse(initialData.criteria) : {};
    } catch {
      return {};
    }
  })();

  const [criteriaType, setCriteriaType] = useState(parsedInitial.type ?? "first_activity");
  const [criteriaDays, setCriteriaDays] = useState(parsedInitial.days ?? 7);
  const [criteriaCategory, setCriteriaCategory] = useState(parsedInitial.category ?? "WATER");
  const [criteriaValue, setCriteriaValue] = useState(parsedInitial.value ?? parsedInitial.km ?? parsedInitial.count ?? 100);
  const [criteriaMode, setCriteriaMode] = useState(parsedInitial.mode ?? "cycling");
  const [criteriaReaction, setCriteriaReaction] = useState(parsedInitial.reaction ?? "helpful");

  function buildCriteriaJSON(): string {
    switch (criteriaType) {
      case "first_activity":
      case "profile_complete":
      case "first_post":
        return JSON.stringify({ type: criteriaType });
      case "streak":
      case "car_free_streak":
      case "flight_free_streak":
        return JSON.stringify({ type: criteriaType, days: criteriaDays });
      case "total":
        return JSON.stringify({ type: criteriaType, category: criteriaCategory, value: criteriaValue });
      case "transport_distance":
        return JSON.stringify({ type: criteriaType, mode: criteriaMode, km: criteriaValue });
      case "transport_count":
        return JSON.stringify({ type: criteriaType, mode: criteriaMode, count: criteriaValue });
      case "challenges_completed":
      case "posts_count":
        return JSON.stringify({ type: criteriaType, count: criteriaValue });
      case "reactions_received":
        return JSON.stringify({ type: criteriaType, reaction: criteriaReaction, count: criteriaValue });
      default:
        return JSON.stringify({ type: criteriaType });
    }
  }

  function handleSubmit() {
    setError("");
    startTransition(async () => {
      try {
        const input = {
          name: name.trim(),
          description: description.trim(),
          icon,
          category,
          rarity,
          criteria: buildCriteriaJSON(),
        };

        if (mode === "edit" && badgeId) {
          await updateBadge(badgeId, input);
          router.push(`/admin/badges/${badgeId}`);
        } else {
          const result = await createBadge(input);
          router.push(`/admin/badges/${result.badgeId}`);
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    });
  }

  // Criteria fields based on type
  const needsDays = ["streak", "car_free_streak", "flight_free_streak"].includes(criteriaType);
  const needsCategory = criteriaType === "total";
  const needsMode = ["transport_distance", "transport_count"].includes(criteriaType);
  const needsValue = ["total", "transport_distance", "transport_count", "challenges_completed", "posts_count", "reactions_received"].includes(criteriaType);
  const needsReaction = criteriaType === "reactions_received";
  const noExtraFields = ["first_activity", "profile_complete", "first_post"].includes(criteriaType);

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Water Hero"
          maxLength={100}
          className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
        <p className="mt-1 text-xs text-slate/60">{name.length}/100 characters</p>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what the user needs to do to earn this badge..."
          maxLength={500}
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
        <p className="mt-1 text-xs text-slate/60">{description.length}/500 characters</p>
      </div>

      {/* Icon Picker */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">Icon</label>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
          {ICON_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setIcon(opt.value)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${
                icon === opt.value
                  ? "border-forest bg-forest/10 text-forest"
                  : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
              }`}
              title={opt.label}
            >
              <FontAwesomeIcon icon={opt.icon} className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Category + Rarity */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Rarity</label>
          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          >
            {RARITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Criteria Builder */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-charcoal">Unlock Criteria</label>
        <div className="rounded-lg border border-gray-200 p-4 space-y-3">
          <select
            value={criteriaType}
            onChange={(e) => setCriteriaType(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          >
            {CRITERIA_TYPES.map((ct) => (
              <option key={ct.value} value={ct.value}>{ct.label}</option>
            ))}
          </select>

          {noExtraFields && (
            <p className="text-xs text-slate">No additional configuration needed - badge is earned automatically.</p>
          )}

          {needsDays && (
            <div>
              <label className="mb-1 block text-xs text-slate">Days Required</label>
              <input
                type="number"
                value={criteriaDays}
                onChange={(e) => setCriteriaDays(parseInt(e.target.value) || 0)}
                min={1}
                className="w-32 rounded-lg border border-gray-200 p-2.5 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          )}

          {needsCategory && (
            <div>
              <label className="mb-1 block text-xs text-slate">Activity Category</label>
              <select
                value={criteriaCategory}
                onChange={(e) => setCriteriaCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              >
                {ACTIVITY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {needsMode && (
            <div>
              <label className="mb-1 block text-xs text-slate">Transport Mode</label>
              <select
                value={criteriaMode}
                onChange={(e) => setCriteriaMode(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              >
                {TRANSPORT_MODES.map((m) => (
                  <option key={m} value={m}>{m.replace("_", " ")}</option>
                ))}
              </select>
            </div>
          )}

          {needsReaction && (
            <div>
              <label className="mb-1 block text-xs text-slate">Reaction Type</label>
              <select
                value={criteriaReaction}
                onChange={(e) => setCriteriaReaction(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              >
                {REACTION_TYPES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}

          {needsValue && (
            <div>
              <label className="mb-1 block text-xs text-slate">
                {criteriaType === "transport_distance" ? "Distance (km)" :
                 criteriaType === "total" ? "Target Value" : "Count"}
              </label>
              <input
                type="number"
                value={criteriaValue}
                onChange={(e) => setCriteriaValue(parseFloat(e.target.value) || 0)}
                min={1}
                step="any"
                className="w-32 rounded-lg border border-gray-200 p-2.5 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>
          )}

          <p className="text-[10px] text-slate/50 font-mono break-all">
            Preview: {buildCriteriaJSON()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-50"
        >
          {isPending ? (
            <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} className="h-3.5 w-3.5" />
          )}
          {mode === "edit" ? "Save Changes" : "Create Badge"}
        </button>
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
