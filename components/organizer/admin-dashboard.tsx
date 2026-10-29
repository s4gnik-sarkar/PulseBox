"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Application = {
  id: string;
  email: string;
  institution_name: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  review_note: string | null;
  created_at: string;
};

type AdminEvent = {
  id: string;
  title: string;
  slug: string;
  is_open: boolean;
  is_suspended: boolean;
  created_at: string;
};

async function readJson<T>(response: Response): Promise<T> {
  const result = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(result.message || "Could not complete the request.");
  }
  return result;
}

export function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function fetchDashboard() {
    const [applicationResult, eventResult] = await Promise.all([
      fetch("/api/admin/organizers", { cache: "no-store" }).then(readJson<{ applications: Application[] }>),
      fetch("/api/admin/events", { cache: "no-store" }).then(readJson<{ events: AdminEvent[] }>),
    ]);
    return { applications: applicationResult.applications, events: eventResult.events };
  }

  useEffect(() => {
    let active = true;
    fetchDashboard()
      .then((result) => {
        if (active) {
          setApplications(result.applications);
          setEvents(result.events);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Could not load administrator tools.");
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

  async function review(application: Application, status: "approved" | "rejected" | "suspended") {
    setBusyId(application.id);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/organizers/${application.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNote: notes[application.id] ?? "" }),
      });
      await readJson(response);
      setMessage(`${application.email}: ${status}.`);
      const result = await fetchDashboard();
      setApplications(result.applications);
      setEvents(result.events);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update this application.");
    } finally {
      setBusyId(null);
    }
  }

  async function openProof(application: Application) {
    setBusyId(application.id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/organizers/${application.id}/proof`, { cache: "no-store" });
      const result = await readJson<{ url: string }>(response);
      setProofUrls((current) => ({ ...current, [application.id]: result.url }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not access this proof.");
    } finally {
      setBusyId(null);
    }
  }

  async function suspendEvent(event: AdminEvent) {
    if (event.is_suspended) {
      return;
    }
    setBusyId(event.id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "suspend" }),
      });
      await readJson(response);
      setEvents((current) => current.map((item) =>
        item.id === event.id ? { ...item, is_suspended: true, is_open: false } : item,
      ));
      setMessage(`Suspended "${event.title}".`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not suspend this event.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/organizer" className="font-hand text-lg text-plum underline underline-offset-4 dark:text-cream">
          ← Organizer workspace
        </Link>
        <section className="sticker mt-6 rounded-[2rem] bg-card p-5 sm:p-8">
          <p className="font-hand text-xl text-plum dark:text-lilac">Platform team</p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Organizer review</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access is limited to signed-in addresses configured in <code>ORGANIZER_ADMIN_EMAILS</code>.
          </p>
          {loading && <p className="mt-5">Loading review queue...</p>}
          {error && (
            <div role="alert" className="mt-5 rounded-xl bg-blush p-4 font-semibold text-plum">
              {error}
              {error.includes("Administrator access") && (
                <p className="mt-2 font-normal">
                  <Link href="/organizer" className="underline">Sign in with an administrator account</Link>.
                </p>
              )}
            </div>
          )}
          {message && <p role="status" className="mt-5 rounded-xl bg-mint/60 p-3 font-semibold">{message}</p>}

          {!loading && (
            <div className="mt-6 space-y-10">
              <section>
                <h2 className="text-2xl font-extrabold">Organizer applications</h2>
                <div className="mt-3 space-y-4">
                  {applications.map((application) => (
                    <article key={application.id} className="rounded-2xl border-2 border-plum/20 p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-extrabold">{application.institution_name}</h3>
                          <p className="text-sm">{application.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted {new Date(application.created_at).toLocaleString()} · {application.status}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={busyId === application.id}
                          onClick={() => void openProof(application)}
                          className="rounded-full bg-sky px-4 py-2 text-sm font-bold text-plum disabled:opacity-50"
                        >
                          {busyId === application.id ? "Loading..." : "View private proof"}
                        </button>
                      </div>
                      {proofUrls[application.id] && (
                        <p className="mt-2 text-sm">
                          <a
                            href={proofUrls[application.id]}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-plum underline dark:text-lilac"
                          >
                            Open verification document (expires in 60 seconds)
                          </a>
                        </p>
                      )}
                      {application.review_note && (
                        <p className="mt-2 rounded-lg bg-butter/60 p-2 text-sm">Previous note: {application.review_note}</p>
                      )}
                      {application.status !== "suspended" && (
                        <div className="mt-4 space-y-3">
                          <label className="block space-y-1 text-sm font-semibold">
                            Review note (optional)
                            <textarea
                              maxLength={500}
                              value={notes[application.id] ?? ""}
                              onChange={(event) => setNotes((current) => ({ ...current, [application.id]: event.target.value }))}
                              className="w-full rounded-xl border-2 border-plum bg-background px-3 py-2 font-normal"
                              rows={2}
                            />
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={busyId === application.id}
                              onClick={() => void review(application, "approved")}
                              className="rounded-full bg-mint px-4 py-2 text-sm font-bold text-plum disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={busyId === application.id}
                              onClick={() => void review(application, "rejected")}
                              className="rounded-full bg-butter px-4 py-2 text-sm font-bold text-plum disabled:opacity-50"
                            >
                              Reject
                            </button>
                            {application.status === "approved" && (
                              <button
                                type="button"
                                disabled={busyId === application.id}
                                onClick={() => void review(application, "suspended")}
                                className="rounded-full bg-blush px-4 py-2 text-sm font-bold text-plum disabled:opacity-50"
                              >
                                Suspend account
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                  {applications.length === 0 && <p className="rounded-xl bg-butter/50 p-4">No applications yet.</p>}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-extrabold">Event moderation</h2>
                <p className="mt-1 text-sm text-muted-foreground">Suspended events are closed and organizers cannot reopen them.</p>
                <div className="mt-3 space-y-2">
                  {events.map((event) => (
                    <article key={event.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-plum/20 p-3">
                      <div>
                        <h3 className="font-bold">{event.title}</h3>
                        <Link href={`/event/${event.slug}`} target="_blank" rel="noreferrer" className="text-sm text-plum underline dark:text-lilac">
                          Open wall
                        </Link>
                        <span className="ml-2 text-xs text-muted-foreground">{event.is_suspended ? "Suspended" : event.is_open ? "Open" : "Closed"}</span>
                      </div>
                      {!event.is_suspended && (
                        <button
                          type="button"
                          disabled={busyId === event.id}
                          onClick={() => void suspendEvent(event)}
                          className="rounded-full bg-blush px-4 py-2 text-sm font-bold text-plum disabled:opacity-50"
                        >
                          Suspend event
                        </button>
                      )}
                    </article>
                  ))}
                  {events.length === 0 && <p className="rounded-xl bg-butter/50 p-4">No events yet.</p>}
                </div>
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
