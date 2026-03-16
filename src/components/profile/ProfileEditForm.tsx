"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { updateProfile } from "@/lib/actions";

interface ProfileEditFormProps {
  displayName: string;
  bio: string;
  isPublic: boolean;
}

export function ProfileEditForm({
  displayName: initialDisplayName,
  bio: initialBio,
  isPublic: initialIsPublic,
}: ProfileEditFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateProfile({ displayName, bio, isPublic });
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display Name */}
      <div>
        <label
          htmlFor="displayName"
          className="mb-1 block text-sm font-medium text-charcoal"
        >
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          placeholder="Your display name"
        />
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="mb-1 block text-sm font-medium text-charcoal"
        >
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-charcoal transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Public profile toggle */}
      <div className="flex items-center gap-3">
        <input
          id="isPublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-forest focus:ring-forest"
        />
        <label htmlFor="isPublic" className="text-sm text-charcoal">
          <Tooltip content="When enabled, your name and stats appear on the leaderboard" position="right">
            <span className="cursor-help border-b border-dashed border-slate/30">
              Make my profile public on the leaderboard
            </span>
          </Tooltip>
        </label>
      </div>

      {/* Feedback message */}
      {message && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" loading={isPending}>
        Save Changes
      </Button>
    </form>
  );
}
