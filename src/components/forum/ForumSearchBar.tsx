"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export function ForumSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        params.set("q", query.trim());
      } else {
        params.delete("q");
      }
      params.delete("page"); // Reset to page 1 on search
      router.push(`/forum?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, router, searchParams]);

  return (
    <div className="relative">
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
        aria-hidden
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search threads..."
        className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-charcoal placeholder:text-gray-400 focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20"
      />
    </div>
  );
}
