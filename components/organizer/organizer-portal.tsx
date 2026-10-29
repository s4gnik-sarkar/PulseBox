"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { EventManager } from "@/components/organizer/event-manager";

type Application = {
  id: string;
  institution_name: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  review_note: string | null;
  created_at: string;
};

type OrganizerStatus = {
  user: { id: string; email: string } | null;
  application: Application | null;
  isAdmin: boolean;
  message?: string;
};

async function loadStatus(): Promise<OrganizerStatus> {
  const response = await fetch("/api/organizer/me", { cache: "no-store" });
  const result = (await response.json()) as OrganizerStatus;
  if (!response.ok) {
    throw new Error(result.message || "Could not load your organizer account.");
  }
  return result;
}

export function OrganizerPortal() {
  const [status, setStatus] = useState<OrganizerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const result = await loadStatus();
    setStatus(result);
  }

  useEffect(() => {
    loadStatus()
      .then(setStatus)
      .catch((loadError: unknown) => setError(
        loadError instanceof Error ? loadError.message : "Could not load your account.",
      ))
      .finally(() => setLoading(false));
  }, []);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/organizer/auth/${mode === "register" ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as {
        message?: string;
        confirmationRequired?: boolean;
      };
      if (!response.ok) {
        throw new Error(result.message || "Could not continue.");
      }
      if (result.confirmationRequired) {
        setMessage(result.message ?? "Confirm your email, then sign in.");
      } else {
        await refresh();
        setMessage(result.message ?? "Signed in.");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not continue.");
    } finally {
      setBusy(false);
    }
  }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!proof) {
      setError("Choose a PDF or JPG verification file.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    const form = new FormData();
    form.set("institution", institution);
    form.set("proof", proof);
    try {
      const response = await fetch("/api/organizer/application", { method: "POST", body: form });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message || "Could not submit your application.");
      }
      await refresh();
      setMessage("Application submitted. You can create events after an administrator approves it.");
      setProof(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not submit your application.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/organizer/auth/logout", { method: "POST" });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message || "Could not sign out.");
      }
      setStatus(null);
      setMessage("You are signed out.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not sign out.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="font-hand text-lg text-plum underline underline-offset-4 dark:text-cream">
          ← PulseBox home
        </Link>
        <section className="sticker mt-6 rounded-[2rem] bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-hand text-xl text-plum dark:text-lilac">For hosts</p>
              <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Organizer workspace</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Verify your institution to create event walls and see feedback analytics.
              </p>
            </div>
            {status?.user && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void signOut()}
                className="rounded-full border-2 border-plum px-4 py-2 text-sm font-bold text-plum dark:border-lilac dark:text-lilac"
              >
                Sign out
              </button>
            )}
          </div>

          {loading && <p className="mt-6 text-muted-foreground">Loading your account...</p>}
          {!loading && !status?.user && (
            <form onSubmit={authenticate} className="mt-6 max-w-lg space-y-4">
              <div className="flex gap-2">
                {(["register", "login"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={mode === option}
                    onClick={() => {
                      setMode(option);
                      setError(null);
                    }}
                    className={`rounded-full border-2 border-plum px-4 py-2 text-sm font-bold capitalize dark:border-lilac ${mode === option ? "bg-peach text-plum" : "bg-background"}`}
                  >
                    {option === "register" ? "Create account" : "Sign in"}
                  </button>
                ))}
              </div>
              <label className="block space-y-1 font-semibold">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border-2 border-plum bg-background px-4 py-3 font-normal text-foreground"
                />
              </label>
              <label className="block space-y-1 font-semibold">
                Password
                <input
                  type="password"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  minLength={10}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border-2 border-plum bg-background px-4 py-3 font-normal text-foreground"
                />
                {mode === "register" && <span className="block text-xs font-normal text-muted-foreground">At least 10 characters.</span>}
              </label>
              <button
                type="submit"
                disabled={busy}
                className="sticker press rounded-full bg-mint px-6 py-3 font-extrabold text-plum disabled:opacity-50"
              >
                {busy ? "Please wait..." : mode === "register" ? "Create organizer account" : "Sign in"}
              </button>
            </form>
          )}

          {!loading && status?.user && (
            <div className="mt-6 space-y-5">
              <p className="text-sm text-muted-foreground">Signed in as <strong>{status.user.email}</strong></p>
              {status.isAdmin && (
                <Link
                  href="/admin/organizers"
                  className="inline-block rounded-full bg-lilac px-4 py-2 font-bold text-plum"
                >
                  Open administrator review
                </Link>
              )}
              {status.application?.status === "approved" ? (
                <EventManager />
              ) : status.application?.status === "pending" ? (
                <div className="rounded-2xl bg-butter/70 p-5">
                  <h2 className="text-xl font-extrabold">Application under review</h2>
                  <p className="mt-1">We’ll let you know once your institution has been verified.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Institution: {status.application.institution_name}</p>
                </div>
              ) : status.application?.status === "suspended" ? (
                <div className="rounded-2xl bg-blush p-5">
                  <h2 className="text-xl font-extrabold">Organizer access suspended</h2>
                  {status.application.review_note && <p className="mt-2">{status.application.review_note}</p>}
                </div>
              ) : (
                <form onSubmit={submitApplication} className="max-w-xl space-y-4 rounded-2xl bg-sky/50 p-5">
                  <h2 className="text-xl font-extrabold">
                    {status.application?.status === "rejected" ? "Update and resubmit" : "Request organizer verification"}
                  </h2>
                  {status.application?.review_note && (
                    <p className="rounded-xl bg-blush p-3 text-sm">{status.application.review_note}</p>
                  )}
                  <label className="block space-y-1 font-semibold">
                    Institution or organization
                    <input
                      required
                      minLength={2}
                      maxLength={150}
                      value={institution}
                      onChange={(event) => setInstitution(event.target.value)}
                      className="w-full rounded-xl border-2 border-plum bg-background px-4 py-3 font-normal text-foreground"
                    />
                  </label>
                  <label className="block space-y-1 font-semibold">
                    Verification proof (PDF or JPG, max 1 MB)
                    <input
                      required
                      type="file"
                      accept="application/pdf,image/jpeg,.pdf,.jpg,.jpeg"
                      onChange={(event) => setProof(event.target.files?.[0] ?? null)}
                      className="block w-full text-sm"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Your proof is stored privately and can only be opened by an administrator reviewing your application.
                  </p>
                  <button
                    type="submit"
                    disabled={busy}
                    className="sticker press rounded-full bg-mint px-5 py-3 font-bold text-plum disabled:opacity-50"
                  >
                    {busy ? "Submitting..." : "Submit for approval"}
                  </button>
                </form>
              )}
            </div>
          )}

          {message && <p role="status" className="mt-4 rounded-xl bg-mint/60 p-3 font-semibold">{message}</p>}
          {error && <p role="alert" className="mt-4 rounded-xl bg-blush p-3 font-semibold text-plum">{error}</p>}
        </section>
      </div>
    </main>
  );
}
