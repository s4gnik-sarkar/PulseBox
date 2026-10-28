import "server-only";

import { getSessionPersonaId } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type AuthPersona = {
  id: string;
  nickname: string;
  avatar_id: number;
};

export async function requirePersona(): Promise<AuthPersona | null> {
  const personaId = await getSessionPersonaId();
  if (!personaId) {
    return null;
  }

  const { data, error } = await getSupabaseAdmin()
    .from("personas")
    .select("id,nickname,avatar_id")
    .eq("id", personaId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}
