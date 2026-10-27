"use client";
import { useState } from "react";
import { Dices } from "lucide-react";
import { Burst, DOODLE_COUNT, Doodle } from "./doodles";
import { CardBurstRays } from "./floating-icons";

const A = [
  "Pixel", "Cosmic", "Neon", "Spicy", "Turbo", "Cheeky", "Sleepy",
  "Glitchy", "Chaotic", "Hyped", "Sassy", "Crispy", "Derpy", "Zen",
  "Dapper", "Secret", "Dramatic", "Zesty", "Funky", "Breezy"
];

const N = [
  "Samosa", "Chai", "Panda", "Dino", "Capybara", "Ghost", "Robo",
  "Duck", "Potato", "Frog", "Cactus", "Monster", "Ninja", "Wizard",
  "Gecko", "Noodle", "Falcon", "Taco", "Dumpling", "Waffle"
];

const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function PersonaRoller() {
  const [p, setP] = useState({ name: "Cheeky Samosa", face: 0 });
  const [spin, setSpin] = useState(0);

  const roll = () => {
    // Pick from all 14 unique eye-catchy persona DPs
    const nextFace = Math.floor(Math.random() * DOODLE_COUNT);
    setP({
      name: `${pick(A)} ${pick(N)}`,
      face: nextFace,
    });
    setSpin((s) => s + 1);
  };

  return (
    <div className="relative mx-auto w-full max-w-xs">
      <div className="sticker w-full -rotate-3 rounded-[2rem] bg-void p-3">
        <div className="rounded-3xl bg-flame p-5 text-white">
          <p className="text-lg font-light uppercase leading-tight tracking-wide">
            You&apos;ve got
            <br />a new persona!
          </p>
        </div>
        <div className="relative mt-3 flex flex-col items-center rounded-3xl bg-gradient-to-b from-volt to-hot px-4 pb-5 pt-6">
          <div className="relative size-44">
            <Burst className="absolute inset-0 size-full" />
            <Doodle kind={p.face} className="absolute inset-0 m-auto size-32 transition-transform duration-200 hover:scale-110" />
          </div>
          <p key={p.name} className="mt-3 text-center font-marker text-3xl text-white outlined">{p.name}</p>
          <p className="text-sm text-white/80">100% anonymous · no real name</p>
          <button
            onClick={roll}
            aria-label="Roll a new persona"
            className="sticker press mt-4 flex items-center gap-2 rounded-full bg-cream px-5 py-3 font-bold text-void"
          >
            <Dices key={spin} className={`size-6 ${spin ? "animate-spin-dice" : ""}`} strokeWidth={2.5} />
            Leave it to fate
          </button>
        </div>
      </div>

      {/* 3 white accent burst rays at bottom-left corner of card as shown in reference image */}
      <div className="absolute -bottom-4 -left-6 z-10 pointer-events-none">
        <CardBurstRays className="w-12 h-12 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
      </div>
    </div>
  );
}
