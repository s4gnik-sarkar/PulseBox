import { Blob as BlobShape } from "@/components/doodles";
import type { WallEventView } from "./wall-types";

export function EventHeader({ event }: { event: WallEventView }) {
  const closed = event.isClosed;
  const formattedDate = event.eventDate
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeZone: "UTC",
      }).format(new Date(`${event.eventDate}T12:00:00Z`))
    : null;
  const formattedDeadline = event.feedbackDeadline
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(new Date(event.feedbackDeadline))
    : null;

  return (
    <header className="sticker relative overflow-hidden rounded-[2rem] bg-card p-5 sm:p-8">
      <BlobShape className="pointer-events-none absolute -right-7 -top-8 size-36 text-lilac/70" />
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-hand text-lg text-plum dark:text-lilac">The feedback wall</p>
          <h1 className="mt-1 break-words text-3xl font-extrabold sm:text-5xl">{event.title}</h1>
          {event.description && (
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-muted-foreground">
              {event.description}
            </p>
          )}
        </div>
        <span
          className={`sticker inline-flex shrink-0 rounded-full px-4 py-2 font-bold text-plum ${closed ? "bg-blush" : "bg-mint"}`}
        >
          {closed ? "Closed" : "Open"}
        </span>
      </div>
      {(formattedDate || formattedDeadline) && (
        <div className="relative z-10 mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-muted-foreground">
          {formattedDate && <span>{formattedDate}</span>}
          {formattedDeadline && <span>Feedback closes {formattedDeadline}</span>}
        </div>
      )}
      <p className="relative z-10 mt-5 rounded-xl bg-cream/70 p-3 text-sm font-semibold text-plum dark:bg-plum dark:text-cream">
        Everything you post here is public. Only your nickname and avatar are shown.
      </p>
    </header>
  );
}
