"use client";

import { useState } from "react";
import { Doodle } from "@/components/doodles";
import { usePersona } from "@/hooks/use-persona";
import type { WallItem } from "@/lib/wall-types";
import { EventHeader } from "./event-header";
import { FeedbackCard } from "./feedback-card";
import { FeedbackForm } from "./feedback-form";
import { PersonaBar } from "./persona-bar";
import type { WallEventView } from "./wall-types";

type SortOrder = "newest" | "oldest";
type WallPage = { items: WallItem[]; nextCursor: string | null };

async function fetchWall(
  slug: string,
  sort: SortOrder,
  cursor?: string | null,
): Promise<WallPage> {
  const query = new URLSearchParams({ sort });
  if (cursor) {
    query.set("cursor", cursor);
  }
  let response: Response;
  try {
    response = await fetch(
      `/api/events/${encodeURIComponent(slug)}/feedback?${query.toString()}`,
      { cache: "no-store" },
    );
  } catch {
    throw new Error("Could not reach PulseBox. Check your connection and try again.");
  }
  const result = (await response.json()) as WallPage & { message?: string };
  if (!response.ok) {
    throw new Error(result.message || "We could not load the feedback wall.");
  }
  return result;
}

function SkeletonCard() {
  return (
    <div className="sticker animate-pulse space-y-4 rounded-[1.5rem] bg-card p-5" aria-hidden>
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full bg-lilac" />
        <div className="space-y-2">
          <div className="h-4 w-28 rounded bg-lilac" />
          <div className="h-3 w-20 rounded bg-sky" />
        </div>
      </div>
      <div className="h-16 rounded-xl bg-peach/60" />
      <div className="h-8 rounded-full bg-butter/70" />
    </div>
  );
}

export function EventWall({
  event,
  initialItems,
  initialCursor,
}: {
  event: WallEventView;
  initialItems: WallItem[];
  initialCursor: string | null;
}) {
  const { persona } = usePersona();
  const [sort, setSort] = useState<SortOrder>("newest");
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedId) ?? null;

  function addItem(item: WallItem) {
    setItems((current) => {
      const withoutDuplicate = current.filter((existing) => existing.id !== item.id);
      return sort === "newest"
        ? [item, ...withoutDuplicate]
        : [...withoutDuplicate, item];
    });
  }

  async function changeSort(nextSort: SortOrder) {
    if (nextSort === sort || loading) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const page = await fetchWall(event.slug, nextSort);
      setSort(nextSort);
      setItems(page.items);
      setNextCursor(page.nextCursor);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load feedback.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!nextCursor || loading) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const page = await fetchWall(event.slug, sort, nextCursor);
      setItems((current) => [...current, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load more feedback.");
    } finally {
      setLoading(false);
    }
  }

  function updateReactions(
    id: string,
    reactions: WallItem["reactions"],
    mine: string[],
  ) {
    setItems((current) =>
      current.map((item) => item.id === id ? { ...item, reactions, mine } : item),
    );
  }

  function updateReplyCount(id: string, replyCount: number) {
    setItems((current) =>
      current.map((item) => item.id === id ? { ...item, replyCount } : item),
    );
  }

  return (
    <main className="min-h-screen bg-background px-3 py-6 text-foreground sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        <EventHeader event={event} />
        <PersonaBar persona={persona} slug={event.slug} />
        <FeedbackForm
          slug={event.slug}
          isClosed={event.isClosed}
          persona={persona}
          onCreated={addItem}
        />

        <section aria-labelledby="wall-title" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-hand text-lg text-plum dark:text-lilac">The real talk</p>
              <h2 id="wall-title" className="text-2xl font-extrabold sm:text-3xl">The wall</h2>
            </div>
            <div className="flex gap-2 rounded-full bg-lilac/50 p-1">
              {(["newest", "oldest"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={sort === option}
                  disabled={loading}
                  onClick={() => void changeSort(option)}
                  className={`rounded-full px-4 py-2 text-sm font-bold capitalize disabled:opacity-50 ${sort === option ? "sticker bg-cream text-plum" : "text-plum"}`}
                >
                  {option === "newest" ? "Newest" : "Oldest"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-blush p-3 font-semibold text-plum">
              {error}
            </p>
          )}

          {items.length === 0 && !loading ? (
            <div className="sticker flex flex-col items-center rounded-[2rem] bg-butter px-5 py-10 text-center">
              <Doodle kind={4} className="size-24" />
              <h3 className="mt-2 font-hand text-3xl text-plum">Be the first to spill the chai ☕</h3>
              <p className="mt-2 max-w-sm text-plum">Your honest take can help make the next event even better.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="relative">
                <div
                  className="overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  style={{ scrollBehavior: "smooth" }}
                >
                  <div className="flex min-w-max gap-4 px-1 py-2">
                    {items.map((item) => (
                      <FeedbackCard
                        key={item.id}
                        item={item}
                        persona={persona}
                        compact
                        selected={selectedId === item.id}
                        onOpen={(id) => setSelectedId(id)}
                        onReactionChange={updateReactions}
                        onReplyCountChange={updateReplyCount}
                      />
                    ))}
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />
              </div>

              {selectedItem && (
                <section className="sticker rounded-[2rem] bg-card p-4 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-hand text-lg text-plum dark:text-lilac">Selected feedback</p>
                      <h3 className="text-xl font-extrabold">Thread & reactions</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="rounded-full bg-cream px-3 py-1.5 text-sm font-bold text-plum"
                    >
                      Close
                    </button>
                  </div>
                  <FeedbackCard
                    item={selectedItem}
                    persona={persona}
                    selected
                    defaultOpenThread
                    onReactionChange={updateReactions}
                    onReplyCountChange={updateReplyCount}
                  />
                </section>
              )}

              {loading && <><SkeletonCard /><SkeletonCard /></>}
            </div>
          )}

          {nextCursor && (
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loading}
              className="sticker press w-full rounded-full bg-sky px-5 py-3 font-bold text-plum disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
