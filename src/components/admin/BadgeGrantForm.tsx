"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSearch, faCircleCheck, faTrashCan } from "@/lib/fontawesome";
import { grantBadge, revokeBadge, searchUsersForGrant } from "@/lib/badge-actions";

interface BadgeGrantFormProps {
  badgeId: string;
}

export function BadgeGrantForm({ badgeId }: BadgeGrantFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; name: string | null; displayName: string | null }[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSearch() {
    if (query.length < 2) return;
    setSearching(true);
    setError("");
    try {
      const users = await searchUsersForGrant(query);
      setResults(users);
    } catch {
      setError("Search failed");
    }
    setSearching(false);
  }

  function handleGrant(userId: string) {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        await grantBadge(badgeId, userId);
        setSuccess("Badge granted successfully");
        setResults([]);
        setQuery("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Grant failed");
      }
    });
  }

  return (
    <div>
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">{error}</div>
      )}
      {success && (
        <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-2.5 text-xs text-green-700">
          <FontAwesomeIcon icon={faCircleCheck} className="mr-1 h-3 w-3" />
          {success}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search by name or email..."
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-charcoal placeholder:text-slate/50 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
        />
        <button
          onClick={handleSearch}
          disabled={searching || query.length < 2}
          className="inline-flex items-center gap-1.5 rounded-lg bg-ocean px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-ocean/90 disabled:opacity-50"
        >
          {searching ? (
            <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FontAwesomeIcon icon={faSearch} className="h-3.5 w-3.5" />
          )}
          Search
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-200">
          {results.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-3 py-2">
              <div>
                <p className="text-sm font-medium text-charcoal">{user.displayName || user.name || "Unknown"}</p>
                <p className="text-xs text-slate">ID: {user.id.slice(0, 8)}...</p>
              </div>
              <button
                onClick={() => handleGrant(user.id)}
                disabled={isPending}
                className="rounded-lg bg-forest px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-forest/90 disabled:opacity-50"
              >
                {isPending ? (
                  <FontAwesomeIcon icon={faSpinner} className="h-3 w-3 animate-spin" />
                ) : (
                  "Grant"
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Revoke button for earned-by table
interface RevokeButtonProps {
  badgeId: string;
  userId: string;
}

export function RevokeButton({ badgeId, userId }: RevokeButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleRevoke() {
    startTransition(async () => {
      try {
        await revokeBadge(badgeId, userId);
        setShowConfirm(false);
        router.refresh();
      } catch {
        // Best effort
      }
    });
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleRevoke}
          disabled={isPending}
          className="rounded bg-red-500 px-2 py-1 text-[10px] font-medium text-white hover:bg-red-600 disabled:opacity-50"
        >
          {isPending ? <FontAwesomeIcon icon={faSpinner} className="h-2.5 w-2.5 animate-spin" /> : "Confirm"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="rounded border border-gray-200 px-2 py-1 text-[10px] text-slate hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="rounded border border-gray-200 px-2 py-1 text-[10px] text-red-500 hover:bg-red-50"
    >
      <FontAwesomeIcon icon={faTrashCan} className="mr-1 h-2.5 w-2.5" />
      Revoke
    </button>
  );
}
