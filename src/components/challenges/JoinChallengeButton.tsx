"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { faPlus } from "@/lib/fontawesome";
import { joinChallenge } from "@/lib/actions";

interface JoinChallengeButtonProps {
  challengeId: string;
}

export function JoinChallengeButton({ challengeId }: JoinChallengeButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleJoin() {
    startTransition(async () => {
      const result = await joinChallenge(challengeId);
      if (result?.error) {
        // Could show a toast here in the future
        console.error(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Button
      variant="primary"
      size="sm"
      leftIcon={faPlus}
      loading={isPending}
      onClick={handleJoin}
      className="w-full"
    >
      Join Challenge
    </Button>
  );
}
