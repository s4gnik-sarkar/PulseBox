const S = { stroke: "#0b0810", strokeWidth: 5, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const cream = "#f6e7c8";

export function Doodle({ kind, className = "" }: { kind: number; className?: string }) {
  const v = kind % 3;
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      {v === 0 && ( // cheeky fox
        <g {...S} fill={cream}>
          <path d="M20 52 28 12 52 34M100 52 92 12 68 34" />
          <path d="M20 52Q60 20 100 52Q106 92 60 108Q14 92 20 52Z" />
          <circle cx="44" cy="62" r="6" fill="#0b0810" /><circle cx="76" cy="62" r="6" fill="#0b0810" />
          <path d="M52 80Q60 90 68 80" fill="none" /><path d="M56 72h8l-4 5z" fill="#0b0810" />
        </g>
      )}
      {v === 1 && ( // crowned cat
        <g {...S} fill={cream}>
          <path d="M26 54 30 26 52 40M94 54 90 26 68 40" />
          <circle cx="60" cy="70" r="38" />
          <path d="M38 36 42 12 52 26 60 8 68 26 78 12 82 36Z" fill="#ffd23f" />
          <path d="M40 66q5-6 10 0M70 66q5-6 10 0" fill="none" />
          <path d="M52 82q8 8 16 0M60 74v6" fill="none" />
        </g>
      )}
      {v === 2 && ( // one-eyed tentacle monster
        <g {...S} fill={cream}>
          <path d="M22 70Q22 22 60 22T98 70Q98 96 84 106Q76 90 70 106Q60 88 50 106Q44 90 36 106Q22 96 22 70Z" />
          <circle cx="60" cy="56" r="20" fill="#fff" /><circle cx="60" cy="58" r="9" fill="#0b0810" />
          <path d="M44 88Q60 98 76 88" fill="none" />
        </g>
      )}
    </svg>
  );
}

export function Burst({ className = "" }: { className?: string }) {
  const pts = Array.from({ length: 32 }, (_, i) => {
    const a = (i / 32) * Math.PI * 2, r = i % 2 ? 38 : 50;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points={pts} fill={cream} stroke="#0b0810" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

/* melting edge. Fill comes from currentColor; flip with rotate-180 to rise instead of drip */
export function Drip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" fill="currentColor" aria-hidden className={`block h-14 w-full sm:h-24 ${className}`}>
      <path d="M0 0H1440V40C1400 40 1380 100 1330 100S1250 50 1190 50 1120 110 1060 110 980 40 920 40 860 90 800 90 720 30 650 30 580 100 520 100 440 45 380 45 300 115 240 115 170 50 110 50 50 40 0 40Z" />
    </svg>
  );
}