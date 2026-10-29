"use client";

import { useState } from "react";

export function DeleteContentButton({
  target,
  id,
  feedbackId,
  onDeleted,
}: {
  target: "feedback" | "reply";
  id: string;
  feedbackId?: string;
  onDeleted: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    const confirmation = target === "feedback"
      ? "Delete this feedback and all of its replies and reactions?"
      : "Delete this reply?";
    if (!window.confirm(confirmation) || busy) {
      return;
    }

    setBusy(true);
    setError(null);
    const url = target === "feedback"
      ? `/api/feedback/${id}`
      : `/api/feedback/${feedbackId}/replies/${id}`;

    try {
      const response = await fetch(url, { method: "DELETE" });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message || `We could not delete this ${target}.`);
      }
      onDeleted();
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Could not reach PulseBox. Check your connection and try again."
          : requestError instanceof Error
            ? requestError.message
            : `We could not delete this ${target}.`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => void remove()}
        className="rounded-full px-2 py-1 text-sm font-semibold text-red-700 hover:bg-blush/60 disabled:opacity-50"
      >
        {busy ? "Deleting..." : "Delete"}
      </button>
      {error && <span role="alert" className="text-xs font-semibold text-red-700">{error}</span>}
    </span>
  );
}
