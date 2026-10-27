import "server-only";

import { createHmac, randomBytes } from "node:crypto";
import { getPulsepassPepper } from "@/lib/secrets";

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function generatePulsePass(): string {
  const bytes = randomBytes(20);
  let buffer = 0;
  let bits = 0;
  let encoded = "";

  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      encoded += ALPHABET[(buffer >> bits) & 31];
      buffer &= (1 << bits) - 1;
    }
  }

  const groups = encoded.match(/.{4}/g);
  if (!groups || groups.length !== 8) {
    throw new Error("Could not generate a valid PulsePass.");
  }
  return `PB-${groups.join("-")}`;
}

export function normalizePulsePass(input: unknown): string | null {
  if (typeof input !== "string" || input.length >= 100) {
    return null;
  }

  let normalized = input.toUpperCase().replace(/[\s-]/g, "");
  if (normalized.startsWith("PB")) {
    normalized = normalized.slice(2);
  }

  normalized = normalized.replace(/[O]/g, "0").replace(/[IL]/g, "1");
  return normalized.length === 32 &&
    [...normalized].every((character) => ALPHABET.includes(character))
    ? normalized
    : null;
}

export function hashPulsePass(normalized: string): string {
  return createHmac("sha256", getPulsepassPepper()).update(normalized).digest("hex");
}
