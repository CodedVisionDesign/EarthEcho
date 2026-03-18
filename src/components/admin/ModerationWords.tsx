"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan, faFlag, faBan } from "@/lib/fontawesome";
import { Badge } from "@/components/ui/Badge";
import { addModerationWord, removeModerationWord } from "@/lib/admin-actions";

interface Word {
  id: string;
  word: string;
  type: string;
}

interface ModerationWordsProps {
  words: Word[];
}

export function ModerationWords({ words }: ModerationWordsProps) {
  const [newWord, setNewWord] = useState("");
  const [wordType, setWordType] = useState<"flag" | "ban">("flag");
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "flag" | "ban">("all");

  const filtered = filter === "all" ? words : words.filter((w) => w.type === filter);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newWord.trim()) return;
    startTransition(async () => {
      await addModerationWord(newWord, wordType);
      setNewWord("");
    });
  }

  function handleRemove(id: string) {
    startTransition(() => removeModerationWord(id));
  }

  return (
    <div>
      {/* Add form */}
      <form onSubmit={handleAdd} className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Add word or phrase..."
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          disabled={isPending}
        />
        <select
          value={wordType}
          onChange={(e) => setWordType(e.target.value as "flag" | "ban")}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-charcoal focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
          disabled={isPending}
        >
          <option value="flag">Flag (alert admin)</option>
          <option value="ban">Auto-block post</option>
        </select>
        <button
          type="submit"
          disabled={isPending || !newWord.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
          Add
        </button>
      </form>

      {/* Filter tabs */}
      <div className="mb-3 flex gap-2">
        {(["all", "flag", "ban"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === f
                ? "bg-forest/10 text-forest"
                : "text-slate hover:bg-gray-100"
            }`}
          >
            {f === "all" ? "All" : f === "flag" ? "Flag Words" : "Auto-block"}
            {f === "all" ? ` (${words.length})` : ` (${words.filter((w) => w.type === f).length})`}
          </button>
        ))}
      </div>

      {/* Word list */}
      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate">
          No moderation words set up yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {filtered.map((w) => (
            <span
              key={w.id}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                w.type === "ban"
                  ? "border-coral/20 bg-coral/5 text-coral"
                  : "border-sunshine/30 bg-sunshine/5 text-amber-700"
              }`}
            >
              <FontAwesomeIcon
                icon={w.type === "ban" ? faBan : faFlag}
                className="h-2.5 w-2.5"
              />
              {w.word}
              <button
                onClick={() => handleRemove(w.id)}
                disabled={isPending}
                className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10 disabled:opacity-50"
                aria-label={`Remove "${w.word}"`}
              >
                <FontAwesomeIcon icon={faTrashCan} className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
