"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { updateForumMinAge } from "@/lib/admin-actions";

interface ForumAgeSettingProps {
  currentAge: number;
}

export function ForumAgeSetting({ currentAge }: ForumAgeSettingProps) {
  const [age, setAge] = useState(currentAge);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateForumMinAge(age);
      if (result.success) {
        setMessage({ type: "success", text: "Minimum age updated." });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update." });
      }
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="forum-min-age" className="mb-1 block text-sm font-medium text-charcoal">
          Minimum Age for Forum Posting
        </label>
        <p className="mb-2 text-xs text-slate">
          Users below this age cannot create threads, reply, or comment on guides. They can still browse.
        </p>
        <div className="flex items-center gap-3">
          <input
            id="forum-min-age"
            type="number"
            min={13}
            max={18}
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10) || 13)}
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
          <span className="text-sm text-slate">years old (13–18)</span>
          <Button
            onClick={handleSave}
            loading={isPending}
            size="sm"
            disabled={age === currentAge}
          >
            Save
          </Button>
        </div>
      </div>

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
    </div>
  );
}
