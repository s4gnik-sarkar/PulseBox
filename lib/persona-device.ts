import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const DEVICE_COOKIE = "pb_persona_device";
const DEVICE_COOKIE_MAX_AGE = 10 * 365 * 24 * 60 * 60;
const DEVICE_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export async function getPersonaDeviceToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(DEVICE_COOKIE)?.value;
  return token && DEVICE_TOKEN_PATTERN.test(token)
    ? token
    : randomBytes(32).toString("base64url");
}

export function hashPersonaDeviceToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function getPersonaDeviceClaim(
  token: string,
): Promise<{ persona_id: string } | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("persona_device_claims")
    .select("persona_id")
    .eq("device_token_hash", hashPersonaDeviceToken(token))
    .maybeSingle();

  if (error) {
    throw new Error("Could not check this browser's persona limit.");
  }
  return data;
}

export async function claimPersonaDevice(token: string, personaId: string): Promise<boolean> {
  const { error } = await getSupabaseAdmin()
    .from("persona_device_claims")
    .insert({
      device_token_hash: hashPersonaDeviceToken(token),
      persona_id: personaId,
    });

  if (error?.code === "23505") {
    return false;
  }
  if (error) {
    throw new Error("Could not save this browser's persona limit.");
  }
  return true;
}

export async function setPersonaDeviceToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEVICE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DEVICE_COOKIE_MAX_AGE,
  });
}

export async function bindPersonaDevice(personaId: string): Promise<void> {
  const token = await getPersonaDeviceToken();
  const claim = await getPersonaDeviceClaim(token);
  if (!claim) {
    await claimPersonaDevice(token, personaId);
  }
  await setPersonaDeviceToken(token);
}
