import "server-only";

function getSecret(name: "SESSION_SECRET" | "PULSEPASS_PEPPER"): string {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(`${name} must be set and contain at least 32 characters.`);
  }
  return value;
}

export function getSessionSecret(): string {
  return getSecret("SESSION_SECRET");
}

export function getPulsepassPepper(): string {
  return getSecret("PULSEPASS_PEPPER");
}
