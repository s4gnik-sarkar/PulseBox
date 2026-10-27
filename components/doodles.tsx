const S = { stroke: "#0b0810", strokeWidth: 5, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const cream = "#f6e7c8";

export const DOODLE_COUNT = 5;
const AVATAR_DOODLE_KINDS: number[] = [7, 4, 13, 14, 15];

export function Doodle({ kind, className = "" }: { kind: number; className?: string }) {
  const v = AVATAR_DOODLE_KINDS[Math.abs(kind) % DOODLE_COUNT];
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      {/* 0: Cheeky Fox */}
      {v === 0 && (
        <g {...S} fill={cream}>
          <path d="M20 52 28 12 52 34M100 52 92 12 68 34" />
          <path d="M20 52Q60 20 100 52Q106 92 60 108Q14 92 20 52Z" />
          <circle cx="44" cy="62" r="6" fill="#0b0810" />
          <circle cx="76" cy="62" r="6" fill="#0b0810" />
          <path d="M52 80Q60 90 68 80" fill="none" />
          <path d="M56 72h8l-4 5z" fill="#0b0810" />
        </g>
      )}

      {/* 1: Crowned Cat (King of the Wall) */}
      {v === 1 && (
        <g {...S} fill={cream}>
          <path d="M26 54 30 26 52 40M94 54 90 26 68 40" />
          <circle cx="60" cy="70" r="38" />
          <path d="M38 36 42 12 52 26 60 8 68 26 78 12 82 36Z" fill="#ffd23f" />
          <path d="M40 66q5-6 10 0M70 66q5-6 10 0" fill="none" />
          <path d="M52 82q8 8 16 0M60 74v6" fill="none" />
        </g>
      )}

      {/* 2: Cyclops Tentacle Monster */}
      {v === 2 && (
        <g {...S} fill={cream}>
          <path d="M22 70Q22 22 60 22T98 70Q98 96 84 106Q76 90 70 106Q60 88 50 106Q44 90 36 106Q22 96 22 70Z" />
          <circle cx="60" cy="56" r="20" fill="#fff" />
          <circle cx="60" cy="58" r="9" fill="#0b0810" />
          <circle cx="63" cy="54" r="3" fill="#fff" />
          <path d="M44 88Q60 98 76 88" fill="none" />
        </g>
      )}

      {/* 3: Thug Life Samosa with Sunglasses */}
      {v === 3 && (
        <g {...S}>
          {/* Samosa body */}
          <path d="M60 18 L104 96 Q60 108 16 96 Z" fill="#ffd066" />
          <path d="M50 20 Q60 8 70 20" fill="none" />
          <path d="M60 24 L60 84" stroke="#d99920" strokeWidth="4" />
          {/* Cool Black Sunglasses */}
          <rect x="28" y="50" width="28" height="20" rx="3" fill="#0b0810" />
          <rect x="64" y="50" width="28" height="20" rx="3" fill="#0b0810" />
          <path d="M56 56 H64" stroke="#0b0810" strokeWidth="5" />
          {/* White glass gleams */}
          <path d="M33 54 L44 54 M33 60 L40 60" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M69 54 L80 54 M69 60 L76 60" stroke="#ffffff" strokeWidth="2.5" />
          {/* Smirking mouth */}
          <path d="M50 82 Q62 90 72 80 L76 83" fill="none" />
          {/* Heat sizzles */}
          <path d="M12 58 L4 54 M108 58 L116 54" fill="none" strokeWidth="4" />
        </g>
      )}

      {/* 4: Side-Eye Cosmic Chai */}
      {v === 4 && (
        <g {...S}>
          {/* Steam curls */}
          <path d="M46 22 Q52 14 46 6 M62 24 Q68 16 62 8 M78 22 Q84 14 78 6" fill="none" strokeWidth="4" />
          {/* Cup Handle */}
          <path d="M36 52 C16 52 16 82 36 82" fill="none" />
          {/* Cup Body */}
          <path d="M34 38 H88 L80 98 A6 6 0 0 1 74 104 H48 A6 6 0 0 1 42 98 Z" fill={cream} />
          {/* Chai Tea Rim */}
          <ellipse cx="61" cy="40" rx="26" ry="5" fill="#8d4925" />
          {/* Big side-eye pupils */}
          <circle cx="52" cy="64" r="10" fill="#ffffff" />
          <circle cx="56" cy="64" r="5" fill="#0b0810" stroke="none" />
          <circle cx="74" cy="64" r="10" fill="#ffffff" />
          <circle cx="78" cy="64" r="5" fill="#0b0810" stroke="none" />
          {/* Blush cheeks */}
          <circle cx="42" cy="74" r="3.5" fill="#ff70c5" stroke="none" />
          <circle cx="84" cy="74" r="3.5" fill="#ff70c5" stroke="none" />
          {/* Flat skeptical mouth */}
          <path d="M56 82 H68" fill="none" />
        </g>
      )}

      {/* 5: Derpy Dino */}
      {v === 5 && (
        <g {...S}>
          {/* Spikes on head */}
          <path d="M30 42 L16 34 L26 54 L12 48 L22 68" fill="#ff7849" />
          {/* Dino Head */}
          <path d="M26 68 Q26 26 70 26 Q96 26 102 52 Q106 72 96 82 Q88 88 64 88 H48 Q26 88 26 68 Z" fill="#86efac" />
          {/* Derpy googly eye on top */}
          <circle cx="56" cy="38" r="13" fill="#ffffff" />
          <circle cx="58" cy="34" r="6" fill="#0b0810" stroke="none" />
          <circle cx="60" cy="32" r="2" fill="#ffffff" stroke="none" />
          {/* Nostril */}
          <circle cx="94" cy="54" r="3" fill="#0b0810" stroke="none" />
          {/* Mouth & cute teeth */}
          <path d="M50 72 H96" fill="none" />
          <polygon points="62,72 67,80 72,72" fill="#ffffff" />
          <polygon points="76,72 81,80 86,72" fill="#ffffff" />
          {/* Tongue hanging out */}
          <path d="M54 74 Q52 86 60 84 Q64 82 62 74" fill="#ff2bd6" />
        </g>
      )}

      {/* 6: Zen Capybara with Orange */}
      {v === 6 && (
        <g {...S}>
          {/* Capybara Head */}
          <path d="M32 50 C26 36 40 32 44 42 C48 40 72 40 76 42 C80 32 94 36 88 50 C94 56 94 88 78 98 Q60 102 42 98 C26 88 26 56 32 50 Z" fill="#d4a373" />
          {/* Zen closed eyes (- _ -) */}
          <path d="M38 58 Q46 52 54 58" fill="none" strokeWidth="5" />
          <path d="M66 58 Q74 52 82 58" fill="none" strokeWidth="5" />
          {/* Snout & nose */}
          <ellipse cx="60" cy="74" rx="14" ry="8" fill="#bc6c25" />
          <circle cx="54" cy="74" r="2.5" fill="#0b0810" stroke="none" />
          <circle cx="66" cy="74" r="2.5" fill="#0b0810" stroke="none" />
          <path d="M60 82 V88 M54 88 Q60 92 66 88" fill="none" />
          {/* Orange on head */}
          <circle cx="60" cy="24" r="14" fill="#ff7849" />
          <path d="M60 10 Q68 2 64 12" fill="#86efac" />
        </g>
      )}

      {/* 7: Derpy Ghost */}
      {v === 7 && (
        <g {...S}>
          {/* Sheet Body */}
          <path d="M30 58 Q30 16 60 16 T90 58 Q90 98 82 98 Q75 90 68 98 Q60 90 52 98 Q45 90 38 98 Q30 98 30 58 Z" fill="#ffffff" />
          {/* Derpy Cross-Eyes */}
          <circle cx="48" cy="48" r="9" fill={cream} />
          <circle cx="44" cy="45" r="4.5" fill="#0b0810" stroke="none" />
          <circle cx="72" cy="48" r="9" fill={cream} />
          <circle cx="76" cy="52" r="4.5" fill="#0b0810" stroke="none" />
          {/* Open mouth */}
          <ellipse cx="60" cy="68" rx="8" ry="11" fill="#0b0810" />
          <ellipse cx="60" cy="72" rx="5" ry="4" fill="#ff2bd6" stroke="none" />
          {/* Little floating arms */}
          <path d="M26 62 Q16 60 22 52 M94 62 Q104 60 98 52" fill="none" />
        </g>
      )}

      {/* 8: Glitchy Retro Robot */}
      {v === 8 && (
        <g {...S}>
          {/* Antenna */}
          <path d="M60 32 V18" />
          <path d="M60 18 L54 10 L66 10 L60 2" stroke="#ffd23f" strokeWidth="4" />
          {/* Side Dials */}
          <rect x="18" y="52" width="8" height="18" rx="2" fill="#ffd23f" />
          <rect x="94" y="52" width="8" height="18" rx="2" fill="#ffd23f" />
          {/* TV Head */}
          <rect x="24" y="30" width="72" height="66" rx="14" fill={cream} />
          {/* Screen */}
          <rect x="33" y="39" width="54" height="46" rx="8" fill="#0b0810" />
          {/* Cyber Eyes */}
          <path d="M42 50 L52 60 M52 50 L42 60" stroke="#67e8f9" strokeWidth="4" />
          <path d="M68 50 L78 60 M78 50 L68 60" stroke="#67e8f9" strokeWidth="4" />
          {/* Pixel Mouth */}
          <path d="M44 72 L49 68 L54 72 L60 68 L65 72 L70 68 L76 72" fill="none" stroke="#67e8f9" strokeWidth="3" />
        </g>
      )}

      {/* 9: Hyped Screaming Duck */}
      {v === 9 && (
        <g {...S}>
          {/* Feather tuft */}
          <path d="M60 24 Q54 10 50 16 Q60 12 62 24 Q68 10 70 16" fill="#ffd066" />
          {/* Head */}
          <circle cx="60" cy="62" r="38" fill="#ffd066" />
          {/* Screaming > < Eyes */}
          <path d="M34 50 L44 54 L34 58" fill="none" strokeWidth="4.5" />
          <path d="M86 50 L76 54 L86 58" fill="none" strokeWidth="4.5" />
          {/* Open Beak */}
          <path d="M36 60 Q60 46 84 60 Q60 96 36 60 Z" fill="#ff5722" />
          <path d="M44 63 Q60 55 76 63 Q60 88 44 63 Z" fill="#0b0810" />
          <path d="M52 74 Q60 70 68 74 Q60 84 52 74 Z" fill="#ff2bd6" stroke="none" />
          {/* Blush */}
          <circle cx="32" cy="66" r="4" fill="#ff70c5" stroke="none" />
          <circle cx="88" cy="66" r="4" fill="#ff70c5" stroke="none" />
        </g>
      )}

      {/* 10: Gentleman Potato */}
      {v === 10 && (
        <g {...S}>
          {/* Tilted Top Hat */}
          <path d="M46 22 L52 4 L76 10 L70 28" fill="#0b0810" />
          <ellipse cx="60" cy="26" rx="24" ry="6" fill="#0b0810" />
          {/* Potato Body */}
          <path d="M30 62 Q22 28 60 26 Q98 24 94 62 Q96 102 60 102 Q24 104 30 62 Z" fill="#e9c46a" />
          {/* Left Wink */}
          <path d="M38 52 Q46 44 54 52" fill="none" strokeWidth="4.5" />
          {/* Monocle */}
          <circle cx="72" cy="50" r="10" fill="none" stroke="#ffd23f" strokeWidth="4" />
          <circle cx="72" cy="50" r="4" fill="#0b0810" stroke="none" />
          <path d="M82 52 Q88 64 82 74" fill="none" stroke="#ffd23f" strokeWidth="2.5" />
          {/* Handlebar Mustache */}
          <path d="M60 72 C46 60 30 74 24 80 C34 82 50 76 60 74 C70 76 86 82 96 80 C90 74 74 60 60 72 Z" fill="#0b0810" />
        </g>
      )}

      {/* 11: Ninja Panda */}
      {v === 11 && (
        <g {...S}>
          {/* Ears */}
          <circle cx="28" cy="30" r="14" fill="#0b0810" />
          <circle cx="92" cy="30" r="14" fill="#0b0810" />
          {/* Head */}
          <circle cx="60" cy="68" r="38" fill={cream} />
          {/* Eye Patches */}
          <ellipse cx="44" cy="66" rx="10" ry="12" fill="#0b0810" />
          <ellipse cx="76" cy="66" rx="10" ry="12" fill="#0b0810" />
          {/* Fierce Eyes */}
          <circle cx="46" cy="65" r="4" fill="#ffffff" stroke="none" />
          <circle cx="48" cy="65" r="2" fill="#0b0810" stroke="none" />
          <circle cx="74" cy="65" r="4" fill="#ffffff" stroke="none" />
          <circle cx="72" cy="65" r="2" fill="#0b0810" stroke="none" />
          {/* Headband */}
          <path d="M22 46 Q60 40 98 46" stroke="#ff2bd6" strokeWidth="8" fill="none" strokeLinecap="butt" />
          <path d="M20 48 Q8 38 6 54 Q14 50 22 50" fill="#ff2bd6" />
          {/* Nose & Mouth */}
          <ellipse cx="60" cy="80" rx="5" ry="3.5" fill="#0b0810" />
          <path d="M54 88 Q60 85 66 88" fill="none" />
        </g>
      )}

      {/* 12: Wizard Frog */}
      {v === 12 && (
        <g {...S}>
          {/* Frog Head */}
          <path d="M22 72 Q20 46 60 46 Q100 46 98 72 Q98 98 60 98 Q22 98 22 72 Z" fill="#6ee7b7" />
          {/* Bulging Eyes */}
          <circle cx="34" cy="46" r="14" fill="#6ee7b7" />
          <circle cx="86" cy="46" r="14" fill="#6ee7b7" />
          <circle cx="34" cy="46" r="9" fill="#ffd23f" />
          <rect x="28" y="44" width="12" height="4" rx="2" fill="#0b0810" stroke="none" />
          <circle cx="86" cy="46" r="9" fill="#ffd23f" />
          <rect x="80" y="44" width="12" height="4" rx="2" fill="#0b0810" stroke="none" />
          {/* Mouth */}
          <path d="M30 76 Q60 92 90 76" fill="none" strokeWidth="4.5" />
          <circle cx="28" cy="74" r="3" fill="#ff70c5" stroke="none" />
          <circle cx="92" cy="74" r="3" fill="#ff70c5" stroke="none" />
          {/* Wizard Hat */}
          <ellipse cx="60" cy="40" rx="44" ry="10" fill="#6c47ff" />
          <path d="M30 38 Q52 4 84 12 Q68 22 88 38 Z" fill="#8a2bff" />
          {/* Star on hat */}
          <polygon points="62,18 64,22 68,22 65,25 66,29 62,26 58,29 59,25 56,22 60,22" fill="#ffd23f" stroke="#0b0810" strokeWidth="1.5" />
        </g>
      )}

      {/* 13: Hugging Cactus */}
      {v === 13 && (
        <g {...S}>
          {/* Cactus Arms */}
          <path d="M28 62 H16 V46 H26" fill="#86efac" />
          <path d="M92 62 H104 V46 H94" fill="#86efac" />
          {/* Main Body */}
          <rect x="36" y="24" width="48" height="64" rx="24" fill="#86efac" />
          {/* Flower on head */}
          <circle cx="44" cy="20" r="7" fill="#ff2bd6" />
          <circle cx="44" cy="20" r="3" fill="#ffd23f" stroke="none" />
          {/* Big Anime Eyes */}
          <circle cx="50" cy="50" r="7" fill="#0b0810" />
          <circle cx="48" cy="48" r="2.5" fill="#ffffff" stroke="none" />
          <circle cx="52" cy="52" r="1.2" fill="#ffffff" stroke="none" />
          <circle cx="70" cy="50" r="7" fill="#0b0810" />
          <circle cx="68" cy="48" r="2.5" fill="#ffffff" stroke="none" />
          <circle cx="72" cy="52" r="1.2" fill="#ffffff" stroke="none" />
          {/* Cute Cat Mouth */}
          <path d="M55 64 Q60 68 65 64" fill="none" strokeWidth="4" />
          {/* Pot */}
          <path d="M34 84 H86 L80 110 H40 Z" fill="#ff7849" />
          <rect x="30" y="80" width="60" height="8" rx="2" fill="#ff7849" />
        </g>
      )}

      {/* 14: Sleepy Cloud */}
      {v === 14 && (
        <g {...S} fill="#bfe7ff">
          <path d="M30 88H90Q108 88 108 70Q108 54 92 52Q88 28 66 28Q46 28 40 48Q20 46 16 64Q12 84 30 88Z" />
          <path d="M42 64q5 6 10 0M68 64q5 6 10 0M50 76q10 8 20 0" fill="none" />
        </g>
      )}

      {/* 15: Happy Sun */}
      {v === 15 && (
        <g {...S}>
          <path d="M60 8V20M60 100V112M8 60H20M100 60H112M23 23L32 32M88 88L97 97M97 23L88 32M32 88L23 97" fill="none" stroke="#ffd23f" strokeWidth="8" />
          <circle cx="60" cy="60" r="36" fill="#ffd23f" />
          <circle cx="48" cy="54" r="4" fill="#0b0810" stroke="none" />
          <circle cx="72" cy="54" r="4" fill="#0b0810" stroke="none" />
          <path d="M46 70Q60 84 74 70" fill="none" />
        </g>
      )}
    </svg>
  );
}

export function Blob({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="currentColor" aria-hidden>
      <path d="M60 7C77 4 91 17 102 29c12 13 14 29 9 44-5 17-17 30-34 37-17 7-35 5-49-6C13 94 6 79 7 62 8 44 14 27 29 17 38 11 49 8 60 7Z" />
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
