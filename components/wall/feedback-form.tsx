"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  CATEGORIES,
  FEEDBACK_MAX,
  MOODS,
  PROMPTS,
  type CategoryKey,
  type MoodKey,
} from "@/lib/feedback-config";
import type { Persona } from "@/hooks/use-persona";
import type { WallItem } from "./wall-types";

export function FeedbackForm({
  slug,
  isClosed,
  persona,
  onCreated,
}: {
  slug: string;
  isClosed: boolean;
  persona: Persona | null;
  onCreated: (item: WallItem) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [placeholder, setPlaceholder] = useState("Share what felt real...");
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [category, setCategory] = useState<CategoryKey>("experience");
  const [rating, setRating] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isClosed) {
    return (
      <div className="sticker rounded-2xl bg-blush p-5 text-plum">
        <p className="font-hand text-xl">The mic is taking a tiny nap.</p>
        <p>Feedback is closed for this event, but you can still read the wall.</p>
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="sticker rounded-2xl bg-butter p-5 text-plum">
        <h2 className="font-hand text-2xl">Want to spill your thoughts?</h2>
        <p className="mt-1">Make a persona first. Your real name stays out of it.</p>
        <Link
          href={`/persona?next=${encodeURIComponent(`/event/${slug}`)}`}
          className="sticker press mt-4 inline-block rounded-full bg-mint px-5 py-3 font-bold"
        >
          Make or recover a persona
        </Link>
      </div>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mood || message.trim().length === 0 || message.length > FEEDBACK_MAX) {
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/events/${encodeURIComponent(slug)}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, category, mood, rating }),
      });
      const result = (await response.json()) as WallItem | { message?: string };
      if (!response.ok) {
        const apiMessage = "message" in result ? result.message : null;
        if (response.status === 401) {
          throw new Error(apiMessage || "Make a persona first.");
        }
        if (response.status === 403) {
          throw new Error(apiMessage || "Feedback is closed for this event.");
        }
        if (response.status === 429) {
          throw new Error(apiMessage || "You have posted a lot lately. Please try again soon.");
        }
        if (response.status === 400) {
          throw new Error(apiMessage || "Please check your feedback and try again.");
        }
        throw new Error(apiMessage || "We could not post your feedback. Please try again.");
      }

      if (!("id" in result)) {
        throw new Error("We could not post your feedback. Please try again.");
      }
      onCreated(result);
      setMessage("");
      setMood(null);
      setCategory("experience");
      setRating(null);
      setPlaceholder("Share what felt real...");
      setExpanded(false);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Could not reach PulseBox. Check your connection and try again."
          : requestError instanceof Error
            ? requestError.message
            : "Could not reach PulseBox. Check your connection and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const isValid = Boolean(mood && message.trim() && message.length <= FEEDBACK_MAX);

  return (
    <section className="sticker rounded-[1.75rem] bg-card p-4 sm:p-6">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="sticker press w-full rounded-2xl bg-butter px-5 py-4 text-left font-hand text-2xl text-plum md:hidden"
      >
        Spill your thoughts {expanded ? "↑" : "↓"}
      </button>
      <div className={expanded ? "mt-5 md:mt-0" : "hidden md:block"}>
        <h2 className="hidden font-hand text-3xl text-plum dark:text-lilac md:block">
          Spill your thoughts
        </h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setPlaceholder(prompt)}
              className="rounded-full bg-lilac/60 px-3 py-2 text-left text-xs font-semibold text-plum hover:bg-lilac sm:text-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor={`feedback-${slug}`} className="sr-only">Your feedback</label>
            <textarea
              id={`feedback-${slug}`}
              value={message}
              maxLength={FEEDBACK_MAX}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={placeholder}
              rows={4}
              className="w-full resize-y rounded-2xl border-2 border-plum bg-background px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-4 focus:ring-lilac"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {message.length}/{FEEDBACK_MAX}
            </p>
          </div>

          <fieldset>
            <legend className="mb-2 font-bold">What&apos;s the vibe? <span className="text-red-700">*</span></legend>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {MOODS.map(({ key, emoji, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-label={label}
                  aria-pressed={mood === key}
                  onClick={() => setMood(key)}
                  className={`sticker press relative flex min-h-16 flex-col items-center justify-center rounded-xl px-2 py-2 text-plum ${
                    mood === key
                      ? "bg-peach ring-4 ring-plum ring-offset-2 ring-offset-background dark:ring-lilac"
                      : "bg-sky"
                  }`}
                >
                  {mood === key && (
                    <span
                      className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-plum text-[10px] font-bold text-cream"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                  <span className="text-2xl" aria-hidden>{emoji}</span>
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-bold">Post type</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={category === key}
                  onClick={() => setCategory(key)}
                  className={`rounded-full border-2 border-plum px-4 py-2 text-sm font-bold text-plum dark:border-lilac dark:text-cream ${category === key ? "bg-peach" : "bg-background"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 font-bold">Optional rating</legend>
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={rating === value}
                    onClick={() => setRating((previous) => previous === value ? null : value)}
                    className="rounded-lg p-1 text-3xl leading-none text-plum hover:bg-butter dark:text-cream"
                  >
                    {rating !== null && value <= rating ? "★" : "☆"}
                  </button>
                );
              })}
              {rating !== null && <span className="self-center text-sm text-muted-foreground">{rating}/5</span>}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="rounded-xl bg-blush p-3 text-sm font-semibold text-plum">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || !isValid}
            className="sticker press w-full rounded-full bg-mint px-5 py-3 text-lg font-extrabold text-plum disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Posting..." : "Post to the wall"}
          </button>
          <p className="text-center text-xs text-muted-foreground">This post will be public.</p>
        </form>
      </div>
    </section>
  );
}
