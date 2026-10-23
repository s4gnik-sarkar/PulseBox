import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PersonaRoller } from "@/components/persona-roller";
import { Doodle, Drip } from "@/components/doodles";

const ticker = ["NO REAL NAMES", "SPILL THE CHAI ☕", "ANON & LOUD", "RATE THE FEST ⭐", "NO CAP FEEDBACK", "MAIN CHARACTER ENERGY"];

const steps = [
  ["01", "Roll a persona", "Dice decide your avatar and nickname."],
  ["02", "Drop your take", "Pick a mood, add stars, say it."],
  ["03", "Join the chaos", "Reply, react, recover with your PulsePass."],
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-void pb-28 text-white">
        <div aria-hidden className="swirl absolute -inset-[15%] -z-10" />
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Link href="/" className="font-marker text-3xl outlined -rotate-2">pulsebox</Link>
          <nav className="flex items-center gap-3">
            <Link href="/organizer" className="sticker press hidden rounded-full bg-cream px-5 py-2.5 text-sm font-bold text-void sm:block">
              For hosts
            </Link>
            <ThemeToggle />
          </nav>
        </header>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="font-marker uppercase leading-[0.95] outlined">
              <span className="block -rotate-2 text-3xl sm:text-4xl">Catch the real</span>
              <span className="block rotate-1 text-6xl sm:text-8xl">feedback</span>
              <span className="block -rotate-1 text-3xl sm:text-4xl">
                with a <span className="text-5xl text-lime-300 sm:text-7xl">mask</span> on
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg font-medium text-white [text-shadow:0_2px_8px_#0b0810]">
              Get a goofy persona, spill what you really thought, and let the whole crowd reply. No names. Just honesty.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/event/demo" className="sticker press rounded-full bg-hot px-8 py-4 text-center text-lg font-extrabold text-white">
                Find my event 🚀
              </Link>
              <Link href="/organizer" className="sticker press rounded-full bg-cream px-8 py-4 text-center text-lg font-extrabold text-void">
                I&apos;m hosting 🎤
              </Link>
            </div>
          </div>
          <PersonaRoller />
        </div>

        <Drip className="absolute bottom-0 rotate-180 text-background" />
      </section>

      {/* TICKER */}
      <div className="checker border-y-[3px] border-void py-3">
        <div className="flex w-max animate-marquee gap-10 font-marker text-2xl text-white outlined">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="whitespace-nowrap">{t} ✦</span>
          ))}
        </div>
      </div>

      {/* FEATURE BLOCKS */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <h2 className="text-center font-marker text-4xl uppercase sm:text-6xl">Why it slaps</h2>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          <div className="sticker press -rotate-2 rounded-3xl bg-flame p-6 text-white">
            <p className="text-2xl font-light uppercase leading-tight">You&apos;ve got a chai! ☕</p>
            <p className="mt-3 text-sm">Cosmic Chai reacted to your feedback. Send gifts instead of boring likes.</p>
          </div>
          <div className="sticker press rotate-1 rounded-3xl bg-volt p-6 pt-4 text-white">
            <Doodle kind={1} className="mx-auto size-28" />
            <p className="font-marker text-3xl uppercase">King of the wall</p>
            <p className="mt-2 text-sm">The most loved feedback of every event sits on top.</p>
          </div>
          <div className="sticker press -rotate-1 rounded-3xl bg-hot p-6 pt-4 text-void">
            <Doodle kind={2} className="mx-auto size-28" />
            <p className="font-marker text-3xl uppercase">Leave it to fate</p>
            <p className="mt-2 text-sm font-medium">Roll your persona. Lose it? Recover it with your PulsePass.</p>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <h2 className="text-center font-marker text-4xl uppercase sm:text-6xl">3 steps. zero cringe.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(([n, t, d]) => (
            <div key={n} className="sticker rounded-3xl bg-card p-6">
              <span className="font-marker text-6xl text-hot">{n}</span>
              <h3 className="mt-2 text-xl font-extrabold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="checker relative px-5 pb-28 pt-24 text-center">
        <div className="sticker mx-auto max-w-3xl rotate-1 rounded-[2.5rem] bg-void px-6 py-14 text-white">
          <h2 className="font-marker text-4xl uppercase sm:text-5xl">Hosting an event?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/80">Create a feedback wall in minutes and share it with one QR code.</p>
          <Link href="/organizer" className="sticker press mt-8 inline-block rounded-full bg-hot px-8 py-4 text-lg font-extrabold">
            Become an organizer ✨
          </Link>
        </div>
        <Drip className="absolute bottom-0 rotate-180 text-void" />
      </section>

      <footer className="bg-void py-8 text-center text-sm font-bold text-white/70">
        made with 💜 + too much chai · pulsebox
      </footer>
    </div>
  );
}