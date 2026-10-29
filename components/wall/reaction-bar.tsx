"use client";

import Link from "next/link";
import { useState } from "react";
import {
  REACTIONS,
  type ReactionKey,
} from "@/lib/feedback-config";
import type { Persona } from "@/hooks/use-persona";
import type { WallItem } from "./wall-types";

type Counts = WallItem["reactions"];

export function ReactionBar({
  feedbackId,
  persona,
  initialCounts,
  initialMine,
  onChange,
}: {
  feedbackId: string;
  persona: Persona | null;
  initialCounts: Counts;
  initialMine: string[];
  onChange: (counts: Counts, mine: string[]) => void;
}) {
  const [counts, setCounts] = useState(initialCounts);
  const [mine, setMine] = useState(initialMine);
  const [busy, setBusy] = useState<ReactionKey | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function toggle(key: ReactionKey) {
    if (!persona) {
      setMessage("Make a persona to react.");
      return;
    }
    if (busy || mine.includes(key)) {
      return;
    }

    const previousCounts = counts;
    const previousMine = mine;
    const currentReaction = REACTIONS.find(({ key: reaction }) => mine.includes(reaction))?.key;
    const optimisticCounts = { ...counts };
    if (currentReaction) {
      optimisticCounts[currentReaction] = Math.max(0, optimisticCounts[currentReaction] - 1);
    }
    optimisticCounts[key] += 1;
    const optimisticMine = [key];
    setCounts(optimisticCounts);
    setMine(optimisticMine);
    setBusy(key);
    setMessage(null);

    try {
      const response = await fetch(`/api/feedback/${feedbackId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji: key }),
      });
      const result = (await response.json()) as {
        reactions?: Counts;
        mine?: string[];
        message?: string;
      };
      if (!response.ok || !result.reactions || !result.mine) {
        throw new Error(result.message || "Could not update your reaction.");
      }
      setCounts(result.reactions);
      setMine(result.mine);
      onChange(result.reactions, result.mine);
    } catch (error) {
      setCounts(previousCounts);
      setMine(previousMine);
      setMessage(
        error instanceof TypeError
          ? "Could not reach PulseBox. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Could not update your reaction.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map(({ key, emoji }) => (
          <button
            key={key}
            type="button"
            aria-label={`${key} reaction, ${counts[key]}`}
            aria-pressed={mine.includes(key)}
            disabled={busy !== null || mine.includes(key)}
            onClick={() => void toggle(key)}
            className={`rounded-full border-2 px-3 py-1.5 text-sm font-bold transition ${mine.includes(key) ? "border-plum bg-lilac text-plum dark:border-lilac" : "border-plum/30 bg-background text-foreground dark:border-lilac/40"} disabled:opacity-70`}
          >
            {emoji} <span>{counts[key]}</span>
          </button>
        ))}
      </div>
      {message && (
        <p role="status" className="mt-2 text-sm font-semibold text-plum dark:text-lilac">
          {message} {!persona && <Link href="/persona" className="underline">Get a persona</Link>}
        </p>
      )}
    </div>
  );
}
