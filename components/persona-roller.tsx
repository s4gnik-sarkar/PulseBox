"use client";
import { useState } from "react";
import { Dices } from "lucide-react";
import { Burst, Doodle } from "./doodles";
import { CardBurstRays } from "./floating-icons";

const A = ["Pixel", "Cosmic", "Neon", "Spicy", "Turbo", "Cheeky", "Sleepy", "Glitchy"];
const N = ["Panda", "Chai", "Ninja", "Samosa", "Gecko", "Wizard", "Noodle", "Falcon"];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export function PersonaRoller() {
  const [p, setP] = useState({ name: "Cheeky Samosa", face: 0 });
  const [spin, setSpin] = useState(0);

  const roll = () => {
    setP({ name: `${pick(A)} ${pick(N)}`, face: Math.floor(Math.random() * 3) });
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
            <Doodle kind={p.face} className="absolute inset-0 m-auto size-32" />
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
