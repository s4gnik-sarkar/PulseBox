import "server-only";

import type { Session, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabasePublic } from "@/lib/supabase/public";

const ACCESS_COOKIE = "pb_organizer_access";
const REFRESH_COOKIE = "pb_organizer_refresh";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export async function setOrganizerSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, session.access_token, cookieOptions(session.expires_in));
  store.set(REFRESH_COOKIE, session.refresh_token, cookieOptions(30 * 24 * 60 * 60));
}

export async function clearOrganizerSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getOrganizerUser(): Promise<User | null> {
  const store = await cookies();
  const accessToken = store.get(ACCESS_COOKIE)?.value;
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (!accessToken && !refreshToken) {
    return null;
  }

  const client = getSupabasePublic();
  if (accessToken) {
    const { data, error } = await client.auth.getUser(accessToken);
    if (!error && data.user) {
      return data.user;
    }
  }
  if (!refreshToken) {
    await clearOrganizerSession();
    return null;
  }

  const { data: refreshed, error: refreshError } = await client.auth.refreshSession({
    refresh_token: refreshToken,
  });
  if (refreshError || !refreshed.session || !refreshed.user) {
    await clearOrganizerSession();
    return null;
  }

  await setOrganizerSession(refreshed.session);
  return refreshed.user;
}

export function isOrganizerAdmin(email: string | undefined): boolean {
  if (!email) {
    return false;
  }
  const admins = process.env.ORGANIZER_ADMIN_EMAILS?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean) ?? [];
  return admins.includes(email.toLowerCase());
}

export async function getApprovedOrganizer(userId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("organizer_applications")
    .select("id,status")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Could not check organizer approval.");
  }
  return data?.status === "approved" ? data : null;
}
