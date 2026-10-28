"use client";

import Link from "next/link";
import { Doodle } from "@/components/doodles";
import type { Persona } from "@/hooks/use-persona";

export function PersonaBar({
  persona,
  slug,
}: {
  persona: Persona | null;
  slug: string;
}) {
  if (!persona) {
    const next = encodeURIComponent(`/event/${slug}`);
    return (
      <div className="sticker flex flex-col gap-3 rounded-2xl bg-butter p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-plum">Want to join the conversation?</p>
        <Link
          href={`/persona?next=${next}`}
          className="sticker press rounded-full bg-mint px-5 py-2 text-center font-bold text-plum"
        >
          Make or recover a persona
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-lilac/60 p-3">
      <div className="flex min-w-0 items-center gap-2">
        <Doodle kind={persona.avatarId} className="size-11 shrink-0" />
        <span className="truncate font-bold">{persona.nickname}</span>
        <span className="shrink-0 rounded-full bg-mint px-2 py-1 text-xs font-bold text-plum">you</span>
      </div>
      <Link
        href={`/persona?next=${encodeURIComponent(`/event/${slug}`)}`}
        className="shrink-0 font-hand text-base text-plum underline underline-offset-2 dark:text-cream"
      >
        not you?
      </Link>
    </div>
  );
}
