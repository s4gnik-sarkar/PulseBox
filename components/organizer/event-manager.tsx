"use client";

import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState, type FormEvent } from "react";

type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  is_open: boolean;
  is_suspended: boolean;
  event_date: string | null;
  created_at: string;
};

type FeedbackRecord = {
  id: string;
  message: string;
  category: string;
  mood: string;
  rating: number | null;
  created_at: string;
};

type Analytics = {
  feedbackCount: number;
  averageRating: number | string | null;
  moodCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  feedback: FeedbackRecord[];
};

async function readJson<T>(response: Response): Promise<T> {
  const result = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(result.message || "Could not complete the request.");
  }
  return result;
}

function EventCard({
  event,
  onChange,
}: {
  event: EventRecord;
  onChange: (event: EventRecord) => void;
}) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [editing, setEditing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description ?? "");
  const [eventDate, setEventDate] = useState(event.event_date ?? "");
  const eventUrl = `${typeof window === "undefined" ? "" : window.location.origin}/event/${event.slug}`;

  useEffect(() => {
    if (!showAnalytics || analytics) {
      return;
    }
    let active = true;
    fetch(`/api/organizer/events/${event.id}`, { cache: "no-store" })
      .then(readJson<{ analytics: Analytics }>)
      .then((result) => {
        if (active) {
          setAnalytics(result.analytics);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Could not load analytics.");
        }
      })
      .finally(() => {
        if (active) {
          setAnalyticsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [analytics, event.id, showAnalytics]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setMessage("Event link copied.");
    } catch {
      setError("Could not copy the event link. Select and copy the URL instead.");
    }
  }

  async function toggleQr() {
    if (qr) {
      setQr(null);
      return;
    }
    try {
      setQr(await QRCode.toDataURL(eventUrl, { width: 220, margin: 1 }));
    } catch {
      setError("Could not generate the event QR code.");
    }
  }

  async function updateEvent(eventForm: FormEvent<HTMLFormElement>) {
    eventForm.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/organizer/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, eventDate: eventDate || null }),
      });
      const result = await readJson<{ event: EventRecord }>(response);
      onChange(result.event);
      setEditing(false);
      setMessage("Event updated.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update the event.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleFeedback() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/organizer/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: !event.is_open }),
      });
      const result = await readJson<{ event: EventRecord }>(response);
      onChange(result.event);
      setMessage(result.event.is_open ? "Feedback reopened." : "Feedback closed.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not change feedback status.");
    } finally {
      setBusy(false);
    }
  }

  function toggleAnalytics() {
    if (showAnalytics) {
      setAnalyticsLoading(false);
    }
    if (!showAnalytics && !analytics) {
      setAnalyticsLoading(true);
      setError(null);
    }
    setShowAnalytics((current) => !current);
  }

  return (
    <article className="rounded-2xl border-2 border-plum/20 bg-background p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-extrabold">{event.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${event.is_suspended ? "bg-blush text-plum" : event.is_open ? "bg-mint text-plum" : "bg-butter text-plum"}`}>
              {event.is_suspended ? "Suspended" : event.is_open ? "Feedback open" : "Feedback closed"}
            </span>
          </div>
          {event.event_date && <p className="mt-1 text-sm text-muted-foreground">{event.event_date}</p>}
          {event.description && <p className="mt-2 whitespace-pre-wrap text-sm">{event.description}</p>}
        </div>
        <Link href={`/event/${event.slug}`} target="_blank" rel="noreferrer" className="font-semibold text-plum underline dark:text-lilac">
          View wall
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => void copyLink()} className="rounded-full bg-lilac px-4 py-2 text-sm font-bold text-plum">
          Copy feedback link
        </button>
        <button type="button" onClick={() => void toggleQr()} className="rounded-full bg-sky px-4 py-2 text-sm font-bold text-plum">
          {qr ? "Hide QR code" : "Show QR code"}
        </button>
        {!event.is_suspended && (
          <>
            <button type="button" onClick={() => setEditing((current) => !current)} className="rounded-full border-2 border-plum px-4 py-2 text-sm font-bold">
              {editing ? "Cancel edit" : "Edit event"}
            </button>
            <button type="button" disabled={busy} onClick={() => void toggleFeedback()} className="rounded-full border-2 border-plum px-4 py-2 text-sm font-bold disabled:opacity-50">
              {event.is_open ? "Close feedback" : "Reopen feedback"}
            </button>
          </>
        )}
        <button type="button" onClick={toggleAnalytics} className="rounded-full bg-peach px-4 py-2 text-sm font-bold text-plum">
          {showAnalytics ? "Hide analytics" : "Feedback & analytics"}
        </button>
      </div>
      <p className="mt-3 break-all text-xs text-muted-foreground">
        <Link href={`/event/${event.slug}`} target="_blank" className="underline">{eventUrl}</Link>
      </p>

      {qr && (
        <div className="mt-4 inline-flex flex-col items-center rounded-xl bg-white p-3">
          {/* QR image generated locally; the feedback URL is not sent to an external QR service. */}
          <Image src={qr} alt={`QR code for ${event.title}`} width={220} height={220} unoptimized />
          <span className="mt-1 text-xs text-plum">{event.slug}</span>
        </div>
      )}

      {editing && (
        <form onSubmit={updateEvent} className="mt-4 grid gap-3 rounded-xl bg-sky/40 p-4">
          <label className="space-y-1 font-semibold">
            Event title
            <input required minLength={3} maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border-2 border-plum bg-background px-3 py-2 font-normal" />
          </label>
          <label className="space-y-1 font-semibold">
            Description
            <textarea maxLength={2000} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border-2 border-plum bg-background px-3 py-2 font-normal" rows={3} />
          </label>
          <label className="space-y-1 font-semibold">
            Event date
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="block rounded-lg border-2 border-plum bg-background px-3 py-2 font-normal" />
          </label>
          <button type="submit" disabled={busy} className="justify-self-start rounded-full bg-mint px-4 py-2 font-bold text-plum disabled:opacity-50">
            Save event
          </button>
        </form>
      )}

      {showAnalytics && (
        <section className="mt-4 rounded-xl bg-butter/40 p-4">
          {analyticsLoading && <p>Loading analytics...</p>}
          {analytics && (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Feedback posts" value={analytics.feedbackCount} />
                <Metric label="Average rating" value={analytics.averageRating === null ? "—" : `${analytics.averageRating}/5`} />
                <Metric label="Categories" value={Object.entries(analytics.categoryCounts).map(([name, count]) => `${name}: ${count}`).join(" · ") || "No feedback"} />
              </div>
              <p className="mt-3 text-sm"><strong>Vibes:</strong> {Object.entries(analytics.moodCounts).map(([name, count]) => `${name}: ${count}`).join(" · ") || "No feedback yet"}</p>
              <h4 className="mt-5 font-extrabold">Latest feedback ({analytics.feedback.length}{analytics.feedbackCount > analytics.feedback.length ? " of 100 max" : ""})</h4>
              <div className="mt-2 max-h-96 space-y-2 overflow-auto">
                {analytics.feedback.map((item) => (
                  <article key={item.id} className="rounded-xl bg-card p-3">
                    <p className="whitespace-pre-wrap break-words">{item.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.category} · {item.mood} · {item.rating ? `${item.rating}/5` : "no rating"} · {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </article>
                ))}
                {analytics.feedback.length === 0 && <p className="text-sm text-muted-foreground">No feedback yet.</p>}
              </div>
            </>
          )}
        </section>
      )}

      {message && <p role="status" className="mt-3 text-sm font-semibold text-plum">{message}</p>}
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-card p-3">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-lg font-extrabold">{value}</p>
    </div>
  );
}

export function EventManager() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/organizer/events", { cache: "no-store" })
      .then(readJson<{ events: EventRecord[] }>)
      .then((result) => {
        if (active) {
          setEvents(result.events);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Could not load your events.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  async function createEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/organizer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, eventDate: eventDate || null }),
      });
      const result = await readJson<{ event: EventRecord }>(response);
      setEvents((current) => [result.event, ...current]);
      setTitle("");
      setDescription("");
      setEventDate("");
      setMessage("Event created. Copy its feedback link or share the QR code.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not create the event.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold">Your events</h2>
        <p className="text-sm text-muted-foreground">Create event walls, share QR codes, and review analytics.</p>
      </div>
      <form onSubmit={createEvent} className="grid gap-3 rounded-2xl bg-sky/50 p-4 sm:grid-cols-2 sm:p-5">
        <h3 className="text-lg font-extrabold sm:col-span-2">Create event</h3>
        <label className="space-y-1 font-semibold">
          Event title
          <input required minLength={3} maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border-2 border-plum bg-background px-3 py-2 font-normal" />
        </label>
        <label className="space-y-1 font-semibold">
          Event date (optional)
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="block w-full rounded-lg border-2 border-plum bg-background px-3 py-2 font-normal" />
        </label>
        <label className="space-y-1 font-semibold sm:col-span-2">
          Description (optional)
          <textarea maxLength={2000} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border-2 border-plum bg-background px-3 py-2 font-normal" />
        </label>
        <button type="submit" disabled={creating} className="sticker press justify-self-start rounded-full bg-mint px-5 py-2.5 font-bold text-plum disabled:opacity-50">
          {creating ? "Creating..." : "Create event wall"}
        </button>
      </form>
      {message && <p role="status" className="rounded-xl bg-mint/60 p-3 font-semibold">{message}</p>}
      {error && <p role="alert" className="rounded-xl bg-blush p-3 font-semibold text-plum">{error}</p>}
      {loading && <p className="text-muted-foreground">Loading events...</p>}
      {!loading && events.length === 0 && <p className="rounded-xl bg-butter/60 p-4">No events yet. Create your first event wall above.</p>}
      <div className="space-y-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onChange={(next) => setEvents((current) => current.map((item) => item.id === next.id ? next : item))}
          />
        ))}
      </div>
    </section>
  );
}
