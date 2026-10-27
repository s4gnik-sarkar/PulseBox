"use client";

import React, { useState, useRef } from "react";

// Web Audio synthesizer for cute tactile pop sounds on hover/click
function playPopSound(freq = 520) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Ignore if audio is restricted
  }
}

// 4-pointed sparkle star exactly like in the image
export function SparkleStar({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="white" aria-hidden>
      <path
        d="M16 0 C16 8.836 23.164 16 32 16 C23.164 16 16 23.164 16 32 C16 23.164 8.836 16 0 16 C8.836 16 16 8.836 16 0 Z"
        stroke="#0b0810"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// Hand-drawn loop squiggle doodle above heading
export function TopSwirlDoodle({ className = "w-16 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 40" className={className} fill="none" aria-hidden>
      <path
        d="M8 28 C14 10 30 8 40 18 C50 28 34 38 22 26 C12 15 32 4 64 14"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Hand-drawn curl loop doodle for bottom-right cyan icon
export function BottomRightSwirlDoodle({ className = "size-14" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 70" className={className} fill="none" aria-hidden>
      <path
        d="M50 14 C32 8 16 22 24 42 C30 54 48 56 50 42 C52 28 34 26 14 38"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Three radiating white rays at bottom-left of persona card
export function CardBurstRays({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 50" className={className} fill="none" aria-hidden>
      <path d="M10 40 L24 28" stroke="#ffffff" strokeWidth="3.8" strokeLinecap="round" />
      <path d="M18 48 L32 36" stroke="#ffffff" strokeWidth="3.8" strokeLinecap="round" />
      <path d="M6 28 L20 18" stroke="#ffffff" strokeWidth="3.8" strokeLinecap="round" />
    </svg>
  );
}

/* =========================================================================
   EXACT SVG GRAPHICS FOR THE 9 ICONS AS SHOWN IN THE IMAGE
   ========================================================================= */

// 1. Crowd / Audience Discussion (Speech bubble + 3 people silhouettes)
export function CrowdIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      {/* Speech bubble */}
      <g stroke="#0b0810" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M23 15 h34 a6 6 0 0 1 6 6 v13 a6 6 0 0 1 -6 6 h-18 l-6 6 v-6 h-10 a6 6 0 0 1 -6 -6 v-13 a6 6 0 0 1 6 -6 z"
          fill="#ffffff"
        />
        <path d="M29 23 h22" strokeWidth="2.6" />
        <path d="M29 29 h16" strokeWidth="2.6" />
      </g>
      {/* 3 People avatars below */}
      <g stroke="#0b0810" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="#ffffff">
        {/* Left person */}
        <circle cx="25" cy="51" r="4.2" />
        <path d="M16 64 c0 -6 6 -8 11 -8 c2 0 4 0.5 5 1.5" />
        {/* Right person */}
        <circle cx="55" cy="51" r="4.2" />
        <path d="M48 58.5 c1 -1 3 -1.5 5 -1.5 c5 0 11 2 11 8" />
        {/* Center person */}
        <circle cx="40" cy="49" r="4.8" />
        <path d="M30 64 c0 -6.5 8 -9 10 -9 s10 2.5 10 9" />
      </g>
    </svg>
  );
}

// 2. Thumbs Up 👍
export function ThumbsUpIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <g stroke="#0b0810" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Wrist cuff */}
        <path
          d="M26 38 v22 h-6 a3 3 0 0 1 -3 -3 v-16 a3 3 0 0 1 3 -3 z"
          fill="#ffffff"
        />
        {/* Hand and upright thumb */}
        <path
          d="M26 40 c3 -8 5 -18 10 -20 c3.5 -1.5 7 0.5 7 5 c0 5 -2.5 10 -1.5 14 h13.5 a5 5 0 0 1 5 5 c0 2.5 -1.5 4.5 -1 6.5 c2 1 3 3.5 2 6 c-0.8 2 -2 3.5 -1 5.5 c1.2 1.5 0.8 4 -1 5.5 c-2 1.8 -4.5 1.5 -8 1.5 h-19"
          fill="#ffffff"
        />
        {/* Knuckle accent lines */}
        <path d="M41 46 h7" strokeWidth="2.4" />
        <path d="M41 53 h8" strokeWidth="2.4" />
        <path d="M40 60 h7" strokeWidth="2.4" />
      </g>
    </svg>
  );
}

// 3. Heart ❤️
export function HeartIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <path
        d="M40 62 C23 48 18 34 25 25 C31 17 38 20 40 26 C42 20 49 17 55 25 C62 34 57 48 40 62 Z"
        fill="#ffffff"
        stroke="#0b0810"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 4. Chat Lines 💬 (Bottom-left & bottom-right)
export function ChatLinesIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <g stroke="#0b0810" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M22 25 c0 -5.5 4.5 -9 10 -9 h26 c5.5 0 10 3.5 10 9 v18 c0 5.5 -4.5 9 -10 9 h-14 l-10 8 v-8 h-2 c-5.5 0 -10 -3.5 -10 -9 z"
          fill="#ffffff"
        />
        <path d="M30 29 h20" strokeWidth="2.8" />
        <path d="M30 37 h14" strokeWidth="2.8" />
      </g>
    </svg>
  );
}

// 5. Stars Review Bubble ⭐⭐⭐ (Top-right)
export function StarsBubbleIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      {/* Speech bubble */}
      <g stroke="#0b0810" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M20 25 c0 -5.5 4.5 -9 10 -9 h28 c5.5 0 10 3.5 10 9 v18 c0 5.5 -4.5 9 -10 9 h-15 l-10 8 v-8 h-3 c-5.5 0 -10 -3.5 -10 -9 z"
          fill="#ffffff"
        />
      </g>
      {/* 3 Stars inside */}
      <g fill="#0b0810" stroke="#0b0810" strokeWidth="0.8">
        <polygon points="31,29 32.5,33.5 37,33.5 33.5,36 35,40.5 31,37.5 27,40.5 28.5,36 25,33.5 29.5,33.5" />
        <polygon points="41,29 42.5,33.5 47,33.5 43.5,36 45,40.5 41,37.5 37,40.5 38.5,36 35,33.5 39.5,33.5" />
        <polygon points="51,29 52.5,33.5 57,33.5 53.5,36 55,40.5 51,37.5 47,40.5 48.5,36 45,33.5 49.5,33.5" />
      </g>
    </svg>
  );
}

// 6. Checklist Clipboard 📋 (Right mid-top)
export function ClipboardChecklistIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <g stroke="#0b0810" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Board */}
        <rect x="24" y="20" width="32" height="42" rx="4" fill="#ffffff" />
        {/* Clip at top */}
        <path d="M33 20 v-4 a2 2 0 0 1 2 -2 h10 a2 2 0 0 1 2 2 v4 z" fill="#0b0810" />
        <circle cx="40" cy="17" r="1.5" fill="#ffffff" stroke="none" />
        {/* Row 1 */}
        <rect x="29" y="27" width="5" height="5" rx="1" fill="#ffffff" strokeWidth="2" />
        <path d="M29.5 29.5 l1.5 1.5 l3 -3" strokeWidth="1.8" />
        <path d="M38 30 h13" strokeWidth="2.5" />
        {/* Row 2 */}
        <rect x="29" y="37" width="5" height="5" rx="1" fill="#ffffff" strokeWidth="2" />
        <path d="M29.5 39.5 l1.5 1.5 l3 -3" strokeWidth="1.8" />
        <path d="M38 40 h13" strokeWidth="2.5" />
        {/* Row 3 */}
        <rect x="29" y="47" width="5" height="5" rx="1" fill="#ffffff" strokeWidth="2" />
        <path d="M29.5 49.5 l1.5 1.5 l3 -3" strokeWidth="1.8" />
        <path d="M38 50 h10" strokeWidth="2.5" />
      </g>
    </svg>
  );
}

// 8. Heart Speech Bubble 💌 (Right lower-mid)
export function HeartBubbleIcon({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <g stroke="#0b0810" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Speech bubble */}
        <path
          d="M21 26 c0 -5.5 4.5 -9 10 -9 h26 c5.5 0 10 3.5 10 9 v17 c0 5.5 -4.5 9 -10 9 h-14 l-9 7 v-7 h-3 c-5.5 0 -10 -3.5 -10 -9 z"
          fill="#ffffff"
        />
        {/* Heart inside */}
        <path
          d="M40 44 C30 35 27 26 31 21 C35 16 39 18 40 22 C41 18 45 16 49 21 C53 26 50 35 40 44 Z"
          fill="#ffffff"
          strokeWidth="2.8"
        />
      </g>
    </svg>
  );
}

/* =========================================================================
   INDIVIDUAL INTERACTIVE FLOATING BADGE COMPONENT
   ========================================================================= */

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface FloatingBadgeProps {
  id: string;
  side: "left" | "right";
  topPercent: number; // e.g. 18 for 18%
  offsetClass: string;
  bgColor: string;
  tooltipText: string;
  initialRotate: number;
  floatDuration: string;
  floatDelay: string;
  children: React.ReactNode;
}

export function InteractiveFloatingBadge({
  topPercent,
  offsetClass,
  bgColor,
  tooltipText,
  side,
  initialRotate,
  floatDuration,
  floatDelay,
  children,
}: FloatingBadgeProps) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Mouse move handler for dynamic 3D perspective tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    // Subtle 3D tilt
    setTilt({
      x: -deltaY * 18,
      y: deltaX * 18,
    });
  };

  const handleMouseEnter = () => {
    setHovered(true);
    playPopSound(580 + (initialRotate + 10) * 15);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setClicked(true);
    playPopSound(860);

    // Spawn 6 colorful bursting particles
    const colors = ["#ff2bd6", "#8a2bff", "#ff4a1c", "#f6e7c8", "#7dd3fc", "#86efac"];
    const newParticles: Particle[] = Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 32 + Math.random() * 20;
      return {
        id: Date.now() + i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        color: colors[i % colors.length],
      };
    });

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
    setTimeout(() => setClicked(false), 300);
  };

  // Determine computed transform
  const dynamicTransform = hovered
    ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${clicked ? 0.92 : 1.22}) translateY(-8px) rotateZ(${initialRotate * 1.5}deg)`
    : clicked
    ? `scale(0.9) rotate(${initialRotate}deg)`
    : undefined;

  return (
    <div
      className={`absolute ${offsetClass} z-20 pointer-events-auto transition-transform duration-200 select-none`}
      style={{
        top: `${topPercent}%`,
      }}
    >
      <div
        ref={badgeRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="group relative cursor-pointer"
        style={{
          perspective: 600,
        }}
      >
        {/* Floating animated wrapper (pauses on hover) */}
        <div
          className="relative transition-all duration-150 ease-out"
          style={{
            animation: hovered ? "none" : `float-bob ${floatDuration} ease-in-out infinite`,
            animationDelay: floatDelay,
            transform: dynamicTransform,
            willChange: "transform",
          }}
        >
          {/* Responsive Badge Circle with Neobrutalist border & shadow */}
          <div
            className={`flex items-center justify-center rounded-full border-[3px] lg:border-[3.5px] border-[#0b0810] size-14 md:size-16 lg:size-20 xl:size-[84px] p-2 lg:p-2.5 transition-shadow duration-150 ${
              hovered ? "shadow-[7px_7px_0_#0b0810]" : "shadow-[4px_4px_0_#0b0810]"
            }`}
            style={{
              backgroundColor: bgColor,
            }}
          >
            {children}
          </div>

          {/* Interactive Tooltip Pill on Hover */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 z-30 ${
              side === "left"
                ? "left-full ml-3 origin-left"
                : "right-full mr-3 origin-right"
            } ${
              hovered
                ? "opacity-100 scale-100 translate-x-0"
                : "opacity-0 scale-75 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-[#0b0810] bg-[#f6e7c8] px-3 py-1 font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#0b0810] shadow-[3px_3px_0_#0b0810]">
              <span>{tooltipText}</span>
              <span className="text-[10px]">✨</span>
            </div>
          </div>

          {/* Click confetti particles */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute pointer-events-none size-2.5 rounded-full border border-[#0b0810] animate-ping"
              style={{
                top: "50%",
                left: "50%",
                backgroundColor: p.color,
                transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
                transition: "transform 0.5s ease-out, opacity 0.5s ease-out",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   HERO FLOATING ICONS OVERLAY (9 ICONS + SPARKLES + DOODLES)
   Responsive: hidden on mobile (< md), visible & scaled on md, lg, xl
   ========================================================================= */

export function FloatingHeroIcons() {
  return (
    <div className="hidden md:block absolute inset-0 pointer-events-none overflow-visible">
      {/* ================= LEFT COLUMN ================= */}

      {/* 1. Left Top: Crowd Discussion (Cream / Yellow) */}
      <InteractiveFloatingBadge
        id="left-crowd"
        side="left"
        topPercent={14}
        offsetClass="left-2 md:left-3 lg:left-5 xl:left-8"
        bgColor="#fef08a" // Pastel cream yellow
        tooltipText="Crowd Talk"
        initialRotate={-4}
        floatDuration="4.2s"
        floatDelay="0s"
      >
        <CrowdIcon className="size-full" />
      </InteractiveFloatingBadge>

      {/* White sparkle next to Left Top Crowd Icon */}
      <div
        className="absolute top-[17%] left-[10%] md:left-[8%] lg:left-[8.5%] xl:left-[11%] z-10 pointer-events-none animate-pulse"
        style={{ animationDuration: "3s" }}
      >
        <SparkleStar className="size-5 sm:size-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
      </div>

      {/* 2. Left Mid-Top: Thumbs Up 👍 (Sky Blue) */}
      <InteractiveFloatingBadge
        id="left-thumbs"
        side="left"
        topPercent={33}
        offsetClass="left-1 md:left-2 lg:left-4 xl:left-6"
        bgColor="#7dd3fc" // Pastel sky blue
        tooltipText="100% Slaps!"
        initialRotate={3}
        floatDuration="3.8s"
        floatDelay="0.7s"
      >
        <ThumbsUpIcon className="size-full" />
      </InteractiveFloatingBadge>

      {/* 3. Left Mid-Bottom: Heart ❤️ (Pink) */}
      <InteractiveFloatingBadge
        id="left-heart"
        side="left"
        topPercent={52}
        offsetClass="left-2 md:left-3 lg:left-5 xl:left-8"
        bgColor="#f472b6" // Candy pink
        tooltipText="Much Love"
        initialRotate={-3}
        floatDuration="4.5s"
        floatDelay="1.3s"
      >
        <HeartIcon className="size-full" />
      </InteractiveFloatingBadge>

      {/* 4. Left Bottom: Chat Bubble 💬 (Mint Green) */}
      <InteractiveFloatingBadge
        id="left-chat"
        side="left"
        topPercent={71}
        offsetClass="left-2 md:left-4 lg:left-6 xl:left-9"
        bgColor="#86efac" // Pastel mint green
        tooltipText="Spill the Chai"
        initialRotate={4}
        floatDuration="3.6s"
        floatDelay="0.4s"
      >
        <ChatLinesIcon className="size-full" />
      </InteractiveFloatingBadge>

      {/* White sparkle below Left Bottom Chat Icon */}
      <div
        className="absolute top-[82%] left-[6%] md:left-[7%] lg:left-[8%] xl:left-[10%] z-10 pointer-events-none animate-pulse"
        style={{ animationDuration: "2.8s", animationDelay: "1s" }}
      >
        <SparkleStar className="size-5 sm:size-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
      </div>

      {/* ================= RIGHT COLUMN ================= */}

      {/* 5. Right Top: Stars Review Bubble ⭐⭐⭐ (Lavender / Violet) */}
      <InteractiveFloatingBadge
        id="right-stars"
        side="right"
        topPercent={14}
        offsetClass="right-2 md:right-3 lg:right-5 xl:right-8"
        bgColor="#d8b4fe" // Pastel lavender
        tooltipText="5-Star Vibe"
        initialRotate={3}
        floatDuration="4.4s"
        floatDelay="0.5s"
      >
        <StarsBubbleIcon className="size-full" />
      </InteractiveFloatingBadge>

      {/* 6. Right Upper-Mid: Checklist Clipboard 📋 (Cream Yellow) */}
      <InteractiveFloatingBadge
        id="right-clipboard"
        side="right"
        topPercent={30}
        offsetClass="right-1 md:right-2 lg:right-4 xl:right-7"
        bgColor="#fef08a" // Pastel cream yellow
        tooltipText="Rate the Fest"
        initialRotate={-3}
        floatDuration="3.9s"
        floatDelay="1.1s"
      >
        <ClipboardChecklistIcon className="size-full" />
      </InteractiveFloatingBadge>

      {/* 7. Right Center: Crowd Discussion 👥 (Mint Green) */}
      <InteractiveFloatingBadge
        id="right-crowd"
        side="right"
        topPercent={46}
        offsetClass="right-2 md:right-3 lg:right-5 xl:right-8"
        bgColor="#86efac" // Pastel mint green
        tooltipText="Anon Crowd"
        initialRotate={2}
        floatDuration="4.7s"
        floatDelay="0.2s"
      >
        <CrowdIcon className="size-full" />
      </InteractiveFloatingBadge>

      {/* White sparkle to the left of Right Center Crowd Icon */}
      <div
        className="absolute top-[49%] right-[10%] md:right-[9%] lg:right-[9.5%] xl:right-[12%] z-10 pointer-events-none animate-pulse"
        style={{ animationDuration: "3.2s", animationDelay: "0.5s" }}
      >
        <SparkleStar className="size-5 sm:size-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
      </div>

      {/* 8. Right Lower-Mid: Heart Speech Bubble 💌 (Candy Pink) */}
      <InteractiveFloatingBadge
        id="right-heart"
        side="right"
        topPercent={62}
        offsetClass="right-1 md:right-2 lg:right-4 xl:right-7"
        bgColor="#f472b6" // Candy pink
        tooltipText="Real Takes"
        initialRotate={-4}
        floatDuration="3.7s"
        floatDelay="1.6s"
      >
        <HeartBubbleIcon className="size-full" />
      </InteractiveFloatingBadge>

      {/* 9. Right Bottom: Chat Message 💬 (Sky Blue / Cyan) */}
      <InteractiveFloatingBadge
        id="right-chat"
        side="right"
        topPercent={77}
        offsetClass="right-2 md:right-3 lg:right-6 xl:right-9"
        bgColor="#7dd3fc" // Pastel sky blue
        tooltipText="No Filter"
        initialRotate={4}
        floatDuration="4.1s"
        floatDelay="0.9s"
      >
        <ChatLinesIcon className="size-full" />
      </InteractiveFloatingBadge>

      {/* White squiggle doodle looping around bottom-right cyan icon */}
      <div className="absolute top-[75%] right-[9%] md:right-[8%] lg:right-[7.5%] xl:right-[11%] z-10 pointer-events-none -rotate-12">
        <BottomRightSwirlDoodle className="w-12 h-12 sm:w-16 sm:h-16 text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
      </div>
    </div>
  );
}
