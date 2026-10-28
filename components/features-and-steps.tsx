"use client";

import React from "react";

/* =========================================================================
   SVG ILLUSTRATIONS FOR "WHY IT SLAPS" & "3 STEPS. ZERO CRINGE."
   ========================================================================= */

// 1. Smiling Chai Cup (Card 1)
export function ChaiCupGraphic({ className = "size-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      {/* Accent tick rays around cup */}
      <path d="M16 42 L8 38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 28 L14 20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <path d="M78 40 L86 38" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <path d="M74 26 L82 18" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

      {/* Steam lines */}
      <path d="M42 22 Q46 16 42 10 Q38 4 42 0" stroke="#0b0810" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 24 Q54 18 50 12 Q46 6 50 2" stroke="#0b0810" strokeWidth="3" strokeLinecap="round" />
      <path d="M58 22 Q62 16 58 10 Q54 4 58 0" stroke="#0b0810" strokeWidth="3" strokeLinecap="round" />

      {/* Sparkle star right */}
      <path
        d="M84 26 C84 30 87 32 91 32 C87 32 84 34 84 38 C84 34 81 32 77 32 C81 32 84 30 84 26 Z"
        fill="#ffffff"
        stroke="#0b0810"
        strokeWidth="1.5"
      />

      {/* Cup Handle on left */}
      <path
        d="M32 44 C20 44 20 62 32 62"
        fill="none"
        stroke="#0b0810"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Cup Body */}
      <path
        d="M30 36 H70 L64 74 A6 6 0 0 1 58 80 H42 A6 6 0 0 1 36 74 Z"
        fill="#fdf6e7"
        stroke="#0b0810"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Tea Level inside top */}
      <ellipse cx="50" cy="38" rx="17" ry="4" fill="#8d4925" stroke="#0b0810" strokeWidth="2.5" />

      {/* Cute Face: 2 eyes + happy smile */}
      <circle cx="44" cy="54" r="2.5" fill="#0b0810" />
      <circle cx="56" cy="54" r="2.5" fill="#0b0810" />
      <path d="M47 59 Q50 63 53 59" stroke="#0b0810" strokeWidth="2.5" strokeLinecap="round" />
      {/* Pink blush cheeks */}
      <circle cx="40" cy="57" r="2" fill="#ff70a6" opacity="0.8" />
      <circle cx="60" cy="57" r="2" fill="#ff70a6" opacity="0.8" />
    </svg>
  );
}

// 2. King of the Wall Crowned Avatar (Card 2)
export function KingGraphic({ className = "size-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      {/* Accent tick rays around head */}
      <path d="M24 38 L14 34" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 24 L16 16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <path d="M76 38 L86 34" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      <path d="M74 24 L84 16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />

      {/* Sparkle star bottom right */}
      <path
        d="M84 62 C84 66 87 68 91 68 C87 68 84 70 84 74 C84 70 81 68 77 68 C81 68 84 66 84 62 Z"
        fill="#ffffff"
        stroke="#0b0810"
        strokeWidth="1.5"
      />

      {/* Head circle */}
      <circle cx="50" cy="56" r="26" fill="#fdf6e7" stroke="#0b0810" strokeWidth="4" />

      {/* Golden Crown on head */}
      <path
        d="M34 38 L30 16 L42 26 L50 12 L58 26 L70 16 L66 38 Z"
        fill="#ffd23f"
        stroke="#0b0810"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Cute face: happy eyes + smile */}
      <circle cx="42" cy="54" r="3" fill="#0b0810" />
      <circle cx="58" cy="54" r="3" fill="#0b0810" />
      <path d="M46 62 Q50 67 54 62" stroke="#0b0810" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// 3. Cute One-Eyed Monster (Card 3)
export function MonsterGraphic({ className = "size-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      {/* Accent tick rays around monster */}
      <path d="M24 38 L14 34" stroke="#0b0810" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 22 L18 14" stroke="#0b0810" strokeWidth="3" strokeLinecap="round" />
      <path d="M76 38 L86 34" stroke="#0b0810" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 22 L82 14" stroke="#0b0810" strokeWidth="3" strokeLinecap="round" />

      {/* Sparkle star top right */}
      <path
        d="M84 20 C84 24 87 26 91 26 C87 26 84 28 84 32 C84 28 81 26 77 26 C81 26 84 24 84 20 Z"
        fill="#ffffff"
        stroke="#0b0810"
        strokeWidth="1.5"
      />

      {/* Monster Body: dome shape with tentacles at bottom */}
      <path
        d="M26 62 C26 32 36 20 50 20 C64 20 74 32 74 62 C74 72 70 76 66 72 C62 68 58 76 50 72 C42 76 38 68 34 72 C30 76 26 72 26 62 Z"
        fill="#d8b4fe"
        stroke="#0b0810"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Big Single Eye in center */}
      <circle cx="50" cy="46" r="14" fill="#ffffff" stroke="#0b0810" strokeWidth="3" />
      <circle cx="50" cy="47" r="7" fill="#0b0810" />
      <circle cx="52" cy="45" r="2.5" fill="#ffffff" />

      {/* Mouth */}
      <path d="M46 63 Q50 67 54 63" stroke="#0b0810" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 4. Pair of 3D Dice (Step 01)
export function DiceGraphic({ className = "size-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" className={className} fill="none" aria-hidden>
      {/* Accent tick marks */}
      <path d="M68 18 L76 10" stroke="#0b0810" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M80 26 L88 24" stroke="#0b0810" strokeWidth="2.5" strokeLinecap="round" />

      {/* Die 1 (Back/Left) */}
      <g stroke="#0b0810" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Top face */}
        <polygon points="28,16 46,12 40,24 22,28" fill="#ffffff" />
        {/* Left face */}
        <polygon points="22,28 40,24 40,46 22,50" fill="#ffffff" />
        {/* Right face */}
        <polygon points="40,24 46,12 58,22 52,38" fill="#f3edf7" />
        {/* Dots */}
        <circle cx="31" cy="37" r="1.8" fill="#0b0810" stroke="none" />
        <circle cx="26" cy="45" r="1.8" fill="#0b0810" stroke="none" />
        <circle cx="36" cy="30" r="1.8" fill="#0b0810" stroke="none" />
        <circle cx="48" cy="24" r="1.8" fill="#0b0810" stroke="none" />
      </g>

      {/* Die 2 (Front/Right) */}
      <g stroke="#0b0810" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round">
        {/* Top face */}
        <polygon points="52,40 70,32 62,44 44,52" fill="#ffffff" />
        {/* Left face */}
        <polygon points="44,52 62,44 62,68 44,76" fill="#ffffff" />
        {/* Right face */}
        <polygon points="62,44 70,32 82,42 74,60" fill="#f3edf7" />
        {/* Dots on front face */}
        <circle cx="53" cy="60" r="2" fill="#0b0810" stroke="none" />
        <circle cx="48" cy="56" r="2" fill="#0b0810" stroke="none" />
        <circle cx="58" cy="64" r="2" fill="#0b0810" stroke="none" />
        <circle cx="48" cy="68" r="2" fill="#0b0810" stroke="none" />
        <circle cx="58" cy="52" r="2" fill="#0b0810" stroke="none" />
        {/* Dots on top face */}
        <circle cx="57" cy="42" r="1.8" fill="#0b0810" stroke="none" />
      </g>

      {/* Flourish line under dice */}
      <path
        d="M72 74 Q80 72 82 78 Q84 84 76 82"
        stroke="#0b0810"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 5. Speech Bubble with Dots (Step 02)
export function BubbleGraphic({ className = "size-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" className={className} fill="none" aria-hidden>
      {/* Accent tick marks above */}
      <path d="M48 18 L50 8" stroke="#0b0810" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M62 20 L70 12" stroke="#0b0810" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M72 32 L82 28" stroke="#0b0810" strokeWidth="2.5" strokeLinecap="round" />

      {/* Drop shadow */}
      <path
        d="M32 30 H66 A14 14 0 0 1 80 44 A14 14 0 0 1 66 58 H46 L34 68 V58 A14 14 0 0 1 20 44 A14 14 0 0 1 34 30 Z"
        fill="#0b0810"
        transform="translate(4, 4)"
      />

      {/* Speech bubble */}
      <path
        d="M34 28 H66 A14 14 0 0 1 80 42 A14 14 0 0 1 66 56 H46 L34 66 V56 A14 14 0 0 1 20 42 A14 14 0 0 1 34 28 Z"
        fill="#d8b4fe"
        stroke="#0b0810"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />

      {/* Three dots (...) */}
      <circle cx="40" cy="42" r="3.2" fill="#0b0810" />
      <circle cx="50" cy="42" r="3.2" fill="#0b0810" />
      <circle cx="60" cy="42" r="3.2" fill="#0b0810" />
    </svg>
  );
}

// 6. Colorful Crowd Avatars (Step 03)
export function CrowdAvatarsGraphic({ className = "size-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" className={className} fill="none" aria-hidden>
      {/* Left Avatar (Cyan) */}
      <g stroke="#0b0810" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="32" cy="46" r="8" fill="#38bdf8" />
        <path d="M18 72 C18 60 46 60 46 72 Z" fill="#38bdf8" />
      </g>

      {/* Right Avatar (Pink) */}
      <g stroke="#0b0810" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="66" cy="46" r="8" fill="#f472b6" />
        <path d="M52 72 C52 60 80 60 80 72 Z" fill="#f472b6" />
      </g>

      {/* Center Avatar (Purple - in front) */}
      <g stroke="#0b0810" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="49" cy="40" r="9" fill="#8a2bff" />
        <path d="M33 72 C33 56 65 56 65 72 Z" fill="#8a2bff" />
      </g>
    </svg>
  );
}

// 7. Hand-drawn Underline Brush Stroke
export function HandDrawnUnderline({ className = "w-36 h-3 text-[#4f46e5]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 16" className={className} fill="none" aria-hidden>
      <path
        d="M4 11 C40 4, 110 3, 156 8"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 8. Crown Doodle (top-left of "WHY IT")
export function CrownDoodle({ className = "w-10 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 40" className={className} fill="none" aria-hidden>
      <path
        d="M 6 26 L 6 12 L 17 20 L 25 7 L 33 20 L 44 12 L 44 26 Z"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M 4 30 L 46 30" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

// 9. Spiral Curl Doodle (next to Leave it to Fate card)
export function SpiralCurlDoodle({ className = "w-8 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 60" className={className} fill="none" aria-hidden>
      <path
        d="M 12 12 C 32 12, 34 34, 18 36 C 8 38, 8 22, 22 22 C 36 22, 38 48, 20 54"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 10. Zig-Zag Doodle (bottom-right corner)
export function ZigZagDoodle({ className = "w-16 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 20" className={className} fill="none" aria-hidden>
      <path
        d="M 4 14 L 16 6 L 28 14 L 40 6 L 52 14"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Accent tick rays flanking pills
function PillRays({ side }: { side: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-1 ${side === "left" ? "rotate-0" : "scale-x-[-1]"}`}>
      <span className="block h-3.5 w-0.5 rotate-[-35deg] bg-current rounded-full" />
      <span className="block h-4 w-0.5 rotate-[-90deg] bg-current rounded-full" />
      <span className="block h-3.5 w-0.5 rotate-[-145deg] bg-current rounded-full" />
    </div>
  );
}

/* =========================================================================
   COMBINED "WHY IT SLAPS" & "3 STEPS. ZERO CRINGE." SECTION
   WITH SUBTLE NOTEBOOK GRID BACKGROUND & THEME BASED (DARK/LIGHT)
   ========================================================================= */

export function FeaturesAndSteps() {
  return (
    <section className="relative overflow-hidden border-t-[3px] border-[#0b0810] dark:border-[#2a1f3d] bg-[#fbf8f1] dark:bg-[#0c0814] text-[#0b0810] dark:text-white py-20 sm:py-24 transition-colors duration-300 ease-out">
      {/* ================= SUBTLE GRID BACKGROUND (Theme-based) ================= */}
      <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--grid-line-color, rgba(11, 8, 16, 0.05)) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-line-color, rgba(11, 8, 16, 0.05)) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Dynamic theme style injection for CSS variable --grid-line-color */}
      <style jsx global>{`
        :root {
          --grid-line-color: rgba(11, 8, 16, 0.06);
        }
        .dark {
          --grid-line-color: rgba(255, 255, 255, 0.06);
        }
      `}</style>

      {/* ================= ORGANIC PASTEL CORNER BLOBS & DOODLES ================= */}
      {/* Top-Left Corner: Soft Lavender Blob */}
      <div className="absolute top-0 left-0 w-44 sm:w-64 h-36 sm:h-52 rounded-br-[6rem] bg-[#ede8fd] dark:bg-[#1f1638]/50 pointer-events-none -z-0" />

      {/* Top-Right Corner: Curved Dashed Line Doodle */}
      <svg
        viewBox="0 0 100 100"
        className="absolute top-0 right-0 w-28 sm:w-40 h-28 sm:h-40 pointer-events-none text-[#0b0810]/40 dark:text-white/30 -z-0"
        fill="none"
      >
        <path d="M 10 0 C 10 50, 50 90, 100 90" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" />
      </svg>

      {/* Bottom-Left Corner: Soft Lavender Blob & Curved Dashed Arc */}
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-40 sm:h-56 rounded-tr-[7rem] bg-[#ede8fd] dark:bg-[#1f1638]/50 pointer-events-none -z-0" />
      <svg
        viewBox="0 0 120 120"
        className="absolute bottom-0 left-0 w-32 sm:w-44 h-32 sm:h-44 pointer-events-none text-[#0b0810]/40 dark:text-white/30 -z-0"
        fill="none"
      >
        <path d="M 0 30 C 50 30, 90 70, 90 120" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" />
        <circle cx="58" cy="85" r="3" fill="currentColor" />
      </svg>

      {/* Bottom-Right Corner: Warm Peach Blob & Zig-Zag Doodle */}
      <div className="absolute bottom-0 right-0 w-48 sm:w-64 h-40 sm:h-56 rounded-tl-[7rem] bg-[#fef0e6] dark:bg-[#281b24]/50 pointer-events-none -z-0" />
      <div className="absolute bottom-6 right-8 pointer-events-none text-[#0b0810] dark:text-white/90 z-10">
        <ZigZagDoodle className="w-16 sm:w-20 h-6" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        {/* =========================================================================
            PART 1: "WHY IT SLAPS"
            ========================================================================= */}
        <div className="text-center relative">
          {/* Centered Pill Tag: WHY PULSEBOX? */}
          <div className="inline-flex items-center gap-3 text-[#0b0810] dark:text-white mb-3">
            <PillRays side="left" />
            <span className="rounded-full border-[2.5px] border-[#0b0810] bg-[#d8b4fe] dark:bg-[#7c3aed] px-4 py-1 font-bold text-xs uppercase tracking-wider text-[#0b0810] dark:text-white shadow-[2px_2px_0_#0b0810] dark:shadow-[2px_2px_0_#f6e7c8]">
              Why PulseBox?
            </span>
            <PillRays side="right" />
          </div>

          {/* Heading with Doodles and Handwriting Note */}
          <div className="relative inline-block mx-auto">
            {/* Crown Doodle (Top-Left of Heading) */}
            <div className="absolute -top-7 -left-10 sm:-left-12 text-[#0b0810] dark:text-white pointer-events-none -rotate-6">
              <CrownDoodle className="w-10 sm:w-12 h-8" />
            </div>

            {/* Left Accent Rays */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-8 sm:-left-10 flex gap-1 pointer-events-none text-[#0b0810] dark:text-white opacity-80">
              <span className="block h-4 w-0.8 rotate-[25deg] bg-current rounded-full" />
              <span className="block h-4 w-0.8 rotate-[25deg] bg-current rounded-full" />
            </div>

            {/* Main Heading Text */}
            <h2 className="font-marker uppercase text-5xl sm:text-7xl font-extrabold tracking-tight flex items-baseline justify-center gap-3">
              <span className="text-[#0b0810] dark:text-white">Why it</span>
              <span className="relative text-[#4f46e5] dark:text-[#818cf8] inline-block">
                slaps
                {/* Hand-drawn organic brush underline under SLAPS */}
                <HandDrawnUnderline className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-[#4f46e5] dark:text-[#818cf8]" />
              </span>
            </h2>

            {/* Right Accent Rays */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-8 sm:-right-10 flex gap-1 pointer-events-none text-[#0b0810] dark:text-white opacity-80">
              <span className="block h-4 w-0.8 rotate-[-25deg] bg-current rounded-full" />
              <span className="block h-4 w-0.8 rotate-[-25deg] bg-current rounded-full" />
              <span className="block h-4 w-0.8 rotate-[-25deg] bg-current rounded-full" />
            </div>

            {/* Hand-written Note (Top-Right of Heading) */}
            <div className="hidden md:block absolute -top-4 -right-48 lg:-right-56 text-left pointer-events-none -rotate-3">
              <p className="font-marker text-sm sm:text-base text-[#52495d] dark:text-[#c4b5fd] leading-tight">
                Real
                <br />
                reactions
                <br />
                &gt; boring likes.
              </p>
            </div>
          </div>

          {/* 3 FEATURE CARDS - With cream/white drop shadow in dark mode */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Card 1: YOU'VE GOT A CHAI! (Coral/Orange) */}
            <div className="relative group">
              {/* Accents outside left */}
              <div className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 flex-col gap-1 text-[#0b0810] dark:text-white opacity-80 pointer-events-none">
                <span className="block h-3.5 w-0.8 rotate-[-20deg] bg-current rounded-full" />
                <span className="block h-3.5 w-0.8 rotate-[-20deg] bg-current rounded-full" />
              </div>

              <div className="rounded-3xl border-[3px] border-[#0b0810] bg-[#ff4a1c] p-6 pt-5 text-white shadow-[6px_6px_0_#0b0810] dark:shadow-[6px_6px_0_#f6e7c8] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[9px_9px_0_#0b0810] dark:hover:shadow-[9px_9px_0_#f6e7c8]">
                <div className="flex justify-center">
                  <ChaiCupGraphic className="size-20" />
                </div>
                <h3 className="mt-4 font-marker uppercase text-2xl tracking-wide text-white">
                  You&apos;ve got a chai!
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/95 font-medium">
                  Cosmic Chai reacted to your feedback. Send gifts instead of boring likes.
                </p>
              </div>
            </div>

            {/* Card 2: KING OF THE WALL (Volt/Purple) */}
            <div className="group">
              <div className="rounded-3xl border-[3px] border-[#0b0810] bg-[#6c47ff] p-6 pt-5 text-white shadow-[6px_6px_0_#0b0810] dark:shadow-[6px_6px_0_#f6e7c8] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[9px_9px_0_#0b0810] dark:hover:shadow-[9px_9px_0_#f6e7c8]">
                <div className="flex justify-center">
                  <KingGraphic className="size-20" />
                </div>
                <h3 className="mt-4 font-marker uppercase text-2xl tracking-wide text-white">
                  King of the wall
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/95 font-medium">
                  The most loved feedback of every event sits on top.
                </p>
              </div>
            </div>

            {/* Card 3: LEAVE IT TO FATE (Mint Green) */}
            <div className="relative group">
              <div className="rounded-3xl border-[3px] border-[#0b0810] bg-[#6ee7b7] p-6 pt-5 text-[#0b0810] shadow-[6px_6px_0_#0b0810] dark:shadow-[6px_6px_0_#f6e7c8] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[9px_9px_0_#0b0810] dark:hover:shadow-[9px_9px_0_#f6e7c8]">
                <div className="flex justify-center">
                  <MonsterGraphic className="size-20" />
                </div>
                <h3 className="mt-4 font-marker uppercase text-2xl tracking-wide text-[#0b0810]">
                  Leave it to fate
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#0b0810]/85 font-medium">
                  Roll your persona. Lose it? Recover it with your PulsePass.
                </p>
              </div>

              {/* Accents outside right: Spiral Curl Doodle */}
              <div className="hidden lg:block absolute -right-7 top-1/2 -translate-y-1/2 text-[#0b0810] dark:text-white pointer-events-none">
                <SpiralCurlDoodle className="w-8 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PART 2: "3 STEPS. ZERO CRINGE."
            ========================================================================= */}
        <div className="mt-24 sm:mt-28 text-center relative">
          {/* Centered Pill Tag: HOW IT WORKS */}
          <div className="inline-flex items-center gap-3 text-[#0b0810] dark:text-white mb-3">
            <PillRays side="left" />
            <span className="rounded-full border-[2.5px] border-[#0b0810] bg-[#d8b4fe] dark:bg-[#7c3aed] px-4 py-1 font-bold text-xs uppercase tracking-wider text-[#0b0810] dark:text-white shadow-[2px_2px_0_#0b0810] dark:shadow-[2px_2px_0_#f6e7c8]">
              How it works
            </span>
            <PillRays side="right" />
          </div>

          {/* Heading with Doodles */}
          <div className="relative inline-block mx-auto">
            {/* Left Far Tick Marks */}
            <div className="hidden sm:flex absolute -left-14 top-1/3 -translate-y-1/2 flex-col gap-1 pointer-events-none text-[#0b0810] dark:text-white opacity-80">
              <span className="block h-3.5 w-0.8 rotate-[-30deg] bg-current rounded-full" />
              <span className="block h-3.5 w-0.8 rotate-[-30deg] bg-current rounded-full" />
            </div>

            {/* Left Accent Rays near 3 STEPS */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-8 sm:-left-10 flex gap-1 pointer-events-none text-[#4f46e5] dark:text-[#818cf8]">
              <span className="block h-4 w-0.8 rotate-[25deg] bg-current rounded-full" />
              <span className="block h-4 w-0.8 rotate-[0deg] bg-current rounded-full" />
              <span className="block h-4 w-0.8 rotate-[-25deg] bg-current rounded-full" />
            </div>

            {/* Main Heading Text */}
            <h2 className="font-marker uppercase text-5xl sm:text-7xl font-extrabold tracking-tight flex items-baseline justify-center gap-3">
              <span className="text-[#0b0810] dark:text-white">3 steps.</span>
              <span className="relative text-[#4f46e5] dark:text-[#818cf8] inline-block">
                zero cringe.
                {/* Hand-drawn organic brush underline under ZERO CRINGE. */}
                <HandDrawnUnderline className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-[#4f46e5] dark:text-[#818cf8]" />
              </span>
            </h2>

            {/* Right Accent Rays */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-8 sm:-right-10 flex gap-1 pointer-events-none text-[#0b0810] dark:text-white opacity-80">
              <span className="block h-4 w-0.8 rotate-[-25deg] bg-current rounded-full" />
              <span className="block h-4 w-0.8 rotate-[-25deg] bg-current rounded-full" />
            </div>

            {/* Far Right Sparkle Star */}
            <div className="hidden sm:block absolute -right-16 top-1/4 pointer-events-none text-[#0b0810] dark:text-white">
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
                <path d="M12 0 C12 6.6 17.4 12 24 12 C17.4 12 12 17.4 12 24 C12 17.4 6.6 12 0 12 C6.6 12 12 6.6 12 0 Z" />
              </svg>
            </div>
          </div>

          {/* 3 STEP CARDS WITH COLORED SHADOWS */}
          <div className="mt-12 grid gap-6 md:grid-cols-3 text-left">
            {/* Step 01: Roll a persona (Orange shadow) */}
            <div className="group rounded-3xl border-[3px] border-[#0b0810] dark:border-[#382b52] bg-white dark:bg-[#181224] p-6 shadow-[6px_6px_0_#ff4a1c] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[9px_9px_0_#ff4a1c]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-marker text-5xl sm:text-6xl font-extrabold text-[#ff8a65] block leading-none">
                    01
                  </span>
                  <h3 className="mt-2 text-xl font-extrabold text-[#0b0810] dark:text-white">
                    Roll a persona
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#5b5066] dark:text-[#b9aecb] font-medium leading-relaxed">
                    Dice decide your avatar and nickname.
                  </p>
                </div>
                <div className="shrink-0 -mt-2 -mr-2">
                  <DiceGraphic className="size-16 sm:size-18" />
                </div>
              </div>
            </div>

            {/* Step 02: Drop your take (Purple shadow) */}
            <div className="group rounded-3xl border-[3px] border-[#0b0810] dark:border-[#382b52] bg-white dark:bg-[#181224] p-6 shadow-[6px_6px_0_#6c47ff] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[9px_9px_0_#6c47ff]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-marker text-5xl sm:text-6xl font-extrabold text-[#a78bfa] block leading-none">
                    02
                  </span>
                  <h3 className="mt-2 text-xl font-extrabold text-[#0b0810] dark:text-white">
                    Drop your take
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#5b5066] dark:text-[#b9aecb] font-medium leading-relaxed">
                    Pick a mood, add stars, say it.
                  </p>
                </div>
                <div className="shrink-0 -mt-2 -mr-2">
                  <BubbleGraphic className="size-16 sm:size-18" />
                </div>
              </div>
            </div>

            {/* Step 03: Join the chaos (Mint Green shadow) */}
            <div className="group rounded-3xl border-[3px] border-[#0b0810] dark:border-[#382b52] bg-white dark:bg-[#181224] p-6 shadow-[6px_6px_0_#10b981] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[9px_9px_0_#10b981]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-marker text-5xl sm:text-6xl font-extrabold text-[#34d399] block leading-none">
                    03
                  </span>
                  <h3 className="mt-2 text-xl font-extrabold text-[#0b0810] dark:text-white">
                    Join the chaos
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#5b5066] dark:text-[#b9aecb] font-medium leading-relaxed">
                    Reply, react, recover with your PulsePass.
                  </p>
                </div>
                <div className="shrink-0 -mt-2 -mr-2">
                  <CrowdAvatarsGraphic className="size-16 sm:size-18" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
