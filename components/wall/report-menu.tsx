"use client";

import { useState } from "react";
import { REPORT_REASONS, type ReportReasonKey } from "@/lib/feedback-config";

export function ReportMenu({
  target,
  id,
}: {
  target: "feedback" | "reply";
  id: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function report(reason: ReportReasonKey) {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, id, reason }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message || "We could not send your report.");
      }
      setMessage("Thanks, we'll take a look.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not send your report.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Report this content"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="rounded-full px-2 py-1 text-xl leading-none hover:bg-lilac/60"
      >
        ...
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-56 rounded-2xl border-2 border-plum bg-card p-3 shadow-xl dark:border-lilac">
          {message ? (
            <p role="status" className="text-sm font-semibold">{message}</p>
          ) : (
            <>
              <p className="mb-2 text-sm font-bold">Why are you reporting this?</p>
              <div className="grid gap-1">
                {REPORT_REASONS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    disabled={busy}
                    onClick={() => void report(key)}
                    className="rounded-lg px-3 py-2 text-left text-sm hover:bg-lilac/50 disabled:opacity-50"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
