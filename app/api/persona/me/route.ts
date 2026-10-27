import { clearSession, getSessionPersonaId } from "@/lib/session";
import { json } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function getPersonaResponse() {
  try {
    const personaId = await getSessionPersonaId();
    if (!personaId) {
      return json({ persona: null });
    }

    const { data: persona, error } = await getSupabaseAdmin()
      .from("personas")
      .select("id,nickname,avatar_id")
      .eq("id", personaId)
      .maybeSingle();

    if (error) {
      return json({ message: "We could not load your persona." }, 500);
    }
    if (!persona) {
      await clearSession();
      return json({ persona: null });
    }

    return json({
      persona: {
        id: persona.id,
        nickname: persona.nickname,
        avatarId: persona.avatar_id,
      },
    });
  } catch {
    return json({ message: "We could not load your persona." }, 500);
  }
}

export async function GET() {
  return getPersonaResponse();
}

export async function POST() {
  return getPersonaResponse();
}
