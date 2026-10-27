import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PersonaRoller } from "@/components/persona-roller";
import { Drip } from "@/components/doodles";
import { FloatingHeroIcons, SparkleStar, TopSwirlDoodle } from "@/components/floating-icons";
import { FeaturesAndSteps } from "@/components/features-and-steps";

const ticker = [
  "100% ANON CHARACTER ENERGY",
  "NO REAL NAMES",
  "SPILL THE CHAI ☕",
  "ANON & LOUD",
  "RATE THE FEST ⭐",
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-void pb-28 text-white min-h-[660px] lg:min-h-[720px]">
        <div aria-hidden className="swirl absolute -inset-[15%] -z-10" />

        {/* Floating Icons exactly as shown in the reference image (with rich mouse hover interactivity) */}
        <FloatingHeroIcons />

        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 sm:px-12 lg:px-20 xl:px-24 py-5">
          <Link href="/" className="font-marker text-3xl outlined -rotate-2 flex items-center gap-2 group">
            <span>pulsebox</span>
            <SparkleStar className="size-6 text-white transition-transform duration-300 group-hover:rotate-45 group-hover:scale-125" />
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/organizer" className="sticker press hidden rounded-full bg-cream px-5 py-2.5 text-sm font-bold text-void sm:block">
              For hosts
            </Link>
            <ThemeToggle />
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-12 lg:px-20 xl:px-24 pt-6 lg:pt-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative">
            {/* White loop flourish doodle above "CATCH THE REAL" */}
            <div className="absolute -top-7 left-2 sm:left-4 z-10 pointer-events-none">
              <TopSwirlDoodle className="w-14 sm:w-16 h-8 sm:h-10 text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
            </div>

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

      {/* WHY IT SLAPS & 3 STEPS. ZERO CRINGE. (SUBTLE GRID BG + THEME BASED DARK/LIGHT) */}
      <FeaturesAndSteps />

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
