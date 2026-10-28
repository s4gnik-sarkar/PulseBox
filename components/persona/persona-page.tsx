"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dices } from "lucide-react";
import { Blob as BlobShape, Doodle } from "@/components/doodles";
import { AVATAR_COUNT, AVATAR_NAMES } from "@/lib/avatars";
import { generateNickname, isValidNickname } from "@/lib/nickname";
import { usePersona, type Persona } from "@/hooks/use-persona";

type Tab = "create" | "recover";

type ApiResult = {
  message?: string;
  persona?: Persona;
  pulsePass?: string;
};

async function postJson(path: string, body: unknown): Promise<ApiResult> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach PulseBox. Check your connection and try again.");
  }

  let result: ApiResult;
  try {
    result = (await response.json()) as ApiResult;
  } catch {
    throw new Error("PulseBox sent an unexpected reply. Please try again.");
  }

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong. Please try again.");
  }
  return result;
}

const avatarColors = [
  "bg-lilac",
  "bg-peach",
  "bg-mint",
  "bg-sky",
  "bg-butter",
];

export function PersonaPage({ nextPath = "/event/demo" }: { nextPath?: string }) {
  const router = useRouter();
  const { persona, loading, error: sessionError, setPersona } = usePersona();
  const [tab, setTab] = useState<Tab>("create");
  const [nickname, setNickname] = useState("Pixel Panda");
  const [avatarId, setAvatarId] = useState(0);
  const [pulsePass, setPulsePass] = useState<string | null>(null);
  const [savedPass, setSavedPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoveryPass, setRecoveryPass] = useState("");
  const [copied, setCopied] = useState(false);

  const nicknameIsValid = isValidNickname(nickname);

  async function createPersona(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!nicknameIsValid) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await postJson("/api/persona/create", { nickname, avatarId });
      if (!result.persona || !result.pulsePass) {
        throw new Error("We could not create your persona. Please try again.");
      }
      setPersona(result.persona);
      setPulsePass(result.pulsePass);
      setSavedPass(false);
      setCopied(false);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not create your persona. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function recoverPersona(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await postJson("/api/persona/recover", {
        pulsePass: recoveryPass,
      });
      if (!result.persona) {
        throw new Error("We could not recover your persona. Please try again.");
      }
      setPersona(result.persona);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not recover your persona. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function switchPersona() {
    setBusy(true);
    setError(null);
    try {
      await postJson("/api/persona/logout", {});
      setPersona(null);
      setPulsePass(null);
      setTab("create");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not switch personas. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyPulsePass() {
    if (!pulsePass) {
      return;
    }
    try {
      await navigator.clipboard.writeText(pulsePass);
      setCopied(true);
    } catch {
      setError("Could not copy automatically. Please select and copy your PulsePass.");
    }
  }

  function downloadPulsePass() {
    if (!pulsePass || !persona) {
      return;
    }
    const file = new globalThis.Blob(
      [`PulseBox persona: ${persona.nickname}\nPulsePass: ${pulsePass}\n`],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pulsepass.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  function rollForMe() {
    setNickname(generateNickname());
    setAvatarId(Math.floor(Math.random() * AVATAR_COUNT));
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <p className="font-hand text-2xl">Finding your persona...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <Link href="/" className="font-hand text-lg text-plum underline underline-offset-4 dark:text-cream">
          ← PulseBox home
        </Link>

        <section className="sticker mt-6 rounded-[2rem] bg-card p-5 sm:p-8">
          {pulsePass ? (
            <div className="space-y-5">
              <p className="font-hand text-lg text-plum dark:text-lilac">Your new persona is ready!</p>
              <h1 className="text-3xl font-extrabold sm:text-4xl">Save your PulsePass</h1>
              {persona && (
                <div className="flex items-center gap-3">
                  <Doodle kind={persona.avatarId} className="size-16 shrink-0" />
                  <p className="font-hand text-2xl">{persona.nickname}</p>
                </div>
              )}
              <div className="break-all rounded-2xl border-2 border-plum bg-cream p-4 text-center font-mono text-lg font-bold tracking-wider text-plum sm:p-6 sm:text-2xl dark:border-lilac">
                {pulsePass}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void copyPulsePass()}
                  className="sticker press rounded-full bg-lilac px-5 py-3 font-bold text-plum"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={downloadPulsePass}
                  className="sticker press rounded-full bg-peach px-5 py-3 font-bold text-plum"
                >
                  Download .txt
                </button>
              </div>
              <p className="rounded-2xl border-2 border-plum bg-blush p-4 font-semibold text-plum">
                This is shown ONCE. We only store a scrambled version, so we cannot recover it for you. Lose it and you lose this persona on other devices.
              </p>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl p-2 text-base">
                <input
                  type="checkbox"
                  checked={savedPass}
                  onChange={(event) => setSavedPass(event.target.checked)}
                  className="mt-1 size-5 accent-plum"
                />
                <span>I saved my PulsePass</span>
              </label>
              <button
                type="button"
                disabled={!savedPass}
                onClick={() => router.push(nextPath)}
                className="sticker press w-full rounded-full bg-mint px-6 py-3 text-lg font-extrabold text-plum disabled:cursor-not-allowed disabled:opacity-50"
              >
                Let&apos;s go
              </button>
              {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
            </div>
          ) : persona ? (
            <div className="space-y-5 text-center">
              <BlobShape className="mx-auto size-24 text-lilac" />
              <div className="-mt-20 flex flex-col items-center">
                <Doodle kind={persona.avatarId} className="size-24" />
                <p className="font-hand text-2xl text-plum dark:text-lilac">Welcome back</p>
                <h1 className="text-3xl font-extrabold">{persona.nickname}</h1>
              </div>
              <Link
                href={nextPath}
                className="sticker press inline-block rounded-full bg-butter px-6 py-3 font-extrabold text-plum"
              >
                Continue to event
              </Link>
              <div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void switchPersona()}
                  className="font-hand text-lg underline underline-offset-4 disabled:opacity-50"
                >
                  Not me? Switch persona
                </button>
              </div>
              {(error || sessionError) && (
                <p role="alert" className="text-sm font-semibold text-red-700">{error || sessionError}</p>
              )}
            </div>
          ) : (
            <>
              <p className="font-hand text-lg text-plum dark:text-lilac">Anonymous vibes, your way</p>
              <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Get your persona</h1>
              {(error || sessionError) && (
                <p role="alert" className="mt-4 rounded-xl bg-blush p-3 font-semibold text-plum">
                  {error || sessionError}
                </p>
              )}
              <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-lilac/40 p-1">
                <button
                  type="button"
                  aria-pressed={tab === "create"}
                  onClick={() => {
                    setTab("create");
                    setError(null);
                  }}
                  className={`rounded-full px-3 py-3 text-sm font-bold sm:text-base ${tab === "create" ? "sticker bg-cream text-plum" : ""}`}
                >
                  Make a new persona
                </button>
                <button
                  type="button"
                  aria-pressed={tab === "recover"}
                  onClick={() => {
                    setTab("recover");
                    setError(null);
                  }}
                  className={`rounded-full px-3 py-3 text-sm font-bold sm:text-base ${tab === "recover" ? "sticker bg-cream text-plum" : ""}`}
                >
                  I have a PulsePass
                </button>
              </div>

              {tab === "create" ? (
                <form onSubmit={createPersona} className="mt-6 space-y-5">
                  <div className="relative mx-auto flex aspect-square w-full max-w-64 items-center justify-center overflow-hidden rounded-[2rem] bg-peach">
                    <BlobShape className="absolute inset-3 size-[calc(100%-1.5rem)] text-butter" />
                    <Doodle kind={avatarId} className="relative z-10 size-40 sm:size-48" />
                  </div>

                  <div>
                    <label htmlFor="nickname" className="mb-2 block font-bold">Your nickname</label>
                    <input
                      id="nickname"
                      value={nickname}
                      maxLength={30}
                      onChange={(event) => setNickname(event.target.value)}
                      aria-describedby="nickname-hint"
                      className="w-full rounded-xl border-2 border-plum bg-background px-4 py-3 text-lg text-foreground outline-none focus:ring-4 focus:ring-lilac"
                    />
                    <p id="nickname-hint" className={`mt-2 text-sm ${nicknameIsValid ? "text-muted-foreground" : "font-semibold text-red-700"}`}>
                      {nicknameIsValid ? "Looks good! 2–30 letters, numbers, spaces or hyphens." : "Use 2–30 letters, numbers, spaces or hyphens. No extra spaces."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={rollForMe}
                    className="sticker press flex w-full items-center justify-center gap-2 rounded-full bg-butter px-5 py-3 font-bold text-plum"
                  >
                    <Dices className="size-5" />
                    Leave it to fate
                  </button>

                  <fieldset>
                    <legend className="mb-3 font-bold">Pick your avatar</legend>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: AVATAR_COUNT }, (_, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-label={`Choose ${AVATAR_NAMES[index]} avatar`}
                          aria-pressed={avatarId === index}
                          onClick={() => setAvatarId(index)}
                          className={`sticker press flex aspect-square flex-col items-center justify-center rounded-2xl ${avatarColors[index]} ${avatarId === index ? "ring-4 ring-plum ring-offset-2 dark:ring-lilac" : ""}`}
                        >
                          <Doodle kind={index} className="size-10 sm:size-14" />
                          <span className="hidden text-xs font-bold text-plum sm:block">{AVATAR_NAMES[index]}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <p className="rounded-xl bg-lilac/40 p-3 text-sm">
                    Your feedback and replies are public. Only your nickname and avatar are shown.
                  </p>
                  {error && <p role="alert" className="text-sm font-semibold text-red-700">{error}</p>}
                  <button
                    type="submit"
                    disabled={busy || !nicknameIsValid}
                    className="sticker press w-full rounded-full bg-mint px-6 py-3 text-lg font-extrabold text-plum disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? "Creating..." : "Create my persona"}
                  </button>
                </form>
              ) : (
                <form onSubmit={recoverPersona} className="mt-6 space-y-5">
                  <label htmlFor="pulsepass" className="block font-bold">Enter your PulsePass</label>
                  <input
                    id="pulsepass"
                    value={recoveryPass}
                    onChange={(event) => setRecoveryPass(event.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={99}
                    className="w-full rounded-xl border-2 border-plum bg-background px-4 py-3 font-mono text-lg text-foreground outline-none focus:ring-4 focus:ring-lilac"
                  />
                  {error && <p role="alert" className="rounded-xl bg-blush p-3 font-semibold text-plum">{error}</p>}
                  <button
                    type="submit"
                    disabled={busy || !recoveryPass}
                    className="sticker press w-full rounded-full bg-mint px-6 py-3 text-lg font-extrabold text-plum disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busy ? "Checking..." : "Recover my persona"}
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
