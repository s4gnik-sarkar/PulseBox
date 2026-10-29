"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Doodle } from "@/components/doodles";
import { REPLY_MAX } from "@/lib/feedback-config";
import type { Persona } from "@/hooks/use-persona";
import type { WallReply } from "./wall-types";
import { RelativeTime } from "./relative-time";
import { ReportMenu } from "./report-menu";
import { DeleteContentButton } from "./delete-content-button";

export function ReplyThread({
  feedbackId,
  initialCount,
  persona,
  onCountChange,
  defaultOpen = false,
}: {
  feedbackId: string;
  initialCount: number;
  persona: Persona | null;
  onCountChange: (count: number) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [replies, setReplies] = useState<WallReply[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    setOpen(defaultOpen);
    if (defaultOpen && !loaded) {
      void showReplies();
    }
  }, [defaultOpen]);

  function updateCount(nextCount: number) {
    setCount(nextCount);
    onCountChange(nextCount);
  }

  async function showReplies() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (!nextOpen || loaded) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/feedback/${feedbackId}/replies`, {
        cache: "no-store",
      });
      const result = (await response.json()) as { replies?: WallReply[]; message?: string };
      if (!response.ok || !result.replies) {
        throw new Error(result.message || "Could not load replies.");
      }
      setReplies(result.replies);
      setLoaded(true);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Could not reach PulseBox. Check your connection and try again."
          : requestError instanceof Error
            ? requestError.message
            : "Could not load replies.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const sanitizedLength = message.trim().length;
    if (!persona || sanitizedLength === 0 || message.length > REPLY_MAX) {
      return;
    }
    setBusy(true);
    setError(null);
    const optimisticId = `temp-${Date.now()}`;
    const optimisticReply: WallReply = {
      id: optimisticId,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      persona: { id: persona.id, nickname: persona.nickname, avatarId: persona.avatarId },
    };
    setReplies((current) => [...current, optimisticReply]);
    updateCount(count + 1);
    setMessage("");

    try {
      const response = await fetch(`/api/feedback/${feedbackId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: optimisticReply.message }),
      });
      const result = (await response.json()) as { reply?: WallReply; message?: string };
      if (!response.ok || !result.reply) {
        throw new Error(result.message || "Could not post your reply.");
      }
      setReplies((current) => current.map((reply) => reply.id === optimisticId ? result.reply! : reply));
    } catch (requestError) {
      setReplies((current) => current.filter((reply) => reply.id !== optimisticId));
      updateCount(Math.max(0, count));
      setMessage(optimisticReply.message);
      setError(
        requestError instanceof TypeError
          ? "Could not reach PulseBox. Check your connection and try again."
          : requestError instanceof Error
            ? requestError.message
            : "Could not post your reply.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border-t border-plum/15 pt-3 dark:border-lilac/20">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => void showReplies()}
        className="font-semibold text-plum underline decoration-plum/40 underline-offset-4 dark:text-lilac"
      >
        {count} {count === 1 ? "reply" : "replies"} {open ? "↑" : "↓"}
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          {loading && <p className="text-sm text-muted-foreground">Loading replies...</p>}
          {!loading && replies.length === 0 && loaded && (
            <p className="text-sm text-muted-foreground">No replies yet. Start the conversation.</p>
          )}
          {replies.map((reply) => (
            <article key={reply.id} className="flex gap-2 rounded-xl bg-sky/50 p-3 dark:bg-plum/70">
              <Doodle kind={reply.persona.avatarId} className="size-9 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2">
                  <span className="font-bold">{reply.persona.nickname}</span>
                  <span className="text-xs text-muted-foreground"><RelativeTime date={reply.createdAt} /></span>
                  {persona?.id === reply.persona.id && (
                    <DeleteContentButton
                      target="reply"
                      id={reply.id}
                      feedbackId={feedbackId}
                      onDeleted={() => {
                        setReplies((current) => current.filter((entry) => entry.id !== reply.id));
                        updateCount(Math.max(0, count - 1));
                      }}
                    />
                  )}
                  <ReportMenu target="reply" id={reply.id} />
                </div>
                <p className="whitespace-pre-wrap break-words text-sm">{reply.message}</p>
              </div>
            </article>
          ))}
          {persona ? (
            <form onSubmit={submitReply} className="flex items-start gap-2">
              <input
                value={message}
                maxLength={REPLY_MAX}
                onChange={(event) => setMessage(event.target.value)}
                aria-label="Write a reply"
                placeholder="Add a kind reply..."
                className="min-w-0 flex-1 rounded-full border-2 border-plum bg-background px-4 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-lilac"
              />
              <button
                type="submit"
                disabled={busy || !message.trim()}
                className="sticker press shrink-0 rounded-full bg-mint px-4 py-2 text-sm font-bold text-plum disabled:opacity-50"
              >
                Reply
              </button>
            </form>
          ) : (
            <Link href="/persona" className="font-hand text-lg text-plum underline dark:text-lilac">
              Make a persona to reply
            </Link>
          )}
          {persona && (
            <p className="text-right text-xs text-muted-foreground">{message.length}/{REPLY_MAX}</p>
          )}
          {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
        </div>
      )}
    </section>
  );
}
