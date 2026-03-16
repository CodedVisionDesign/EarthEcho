"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleReaction } from "@/lib/actions";

const REACTION_EMOJI: Record<string, string> = {
  cheer: "\uD83D\uDC4F",
  helpful: "\uD83D\uDCA1",
  inspiring: "\u2B50",
};

const REACTION_LABEL: Record<string, string> = {
  cheer: "Cheer",
  helpful: "Helpful",
  inspiring: "Inspiring",
};

interface ReactionButtonProps {
  replyId: string;
  type: "cheer" | "helpful" | "inspiring";
  count: number;
  active: boolean;
}

export function ReactionButton({
  replyId,
  type,
  count,
  active,
}: ReactionButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [optimistic, setOptimistic] = useOptimistic(
    { count, active },
    (_state, newActive: boolean) => ({
      count: newActive ? _state.count + 1 : _state.count - 1,
      active: newActive,
    })
  );

  function handleClick() {
    startTransition(async () => {
      setOptimistic(!optimistic.active);
      await toggleReaction({ replyId, type });
      router.refresh();
    });
  }

  const emoji = REACTION_EMOJI[type] ?? "";
  const label = REACTION_LABEL[type] ?? type;

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={label}
      aria-label={`${label} (${optimistic.count})`}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
        optimistic.active
          ? "border-2 border-forest/30 bg-forest/5 text-forest"
          : "border border-gray-200 bg-white text-slate hover:border-gray-300 hover:bg-gray-50"
      } disabled:opacity-50`}
    >
      <span>{emoji}</span>
      {optimistic.count > 0 && <span>{optimistic.count}</span>}
    </button>
  );
}
