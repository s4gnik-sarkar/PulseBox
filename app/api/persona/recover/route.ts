import type { NextRequest } from "next/server";
import { normalizePulsePass, hashPulsePass } from "@/lib/pulsepass";
import { assertSameOrigin, json, rateLimit } from "@/lib/request-guards";
import { setSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const NO_MATCH = "That PulsePass did not match. Check for typos.";

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }

  if (!(await rateLimit(req, "persona-recover", 20, 600))) {
    return json(
      { message: "Too many tries right now. Give it a minute and try again." },
      429,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: NO_MATCH }, 404);
  }

  const normalized =
    typeof body === "object" && body !== null && "pulsePass" in body
      ? normalizePulsePass(body.pulsePass)
      : null;
  if (!normalized) {
    return json({ message: NO_MATCH }, 404);
  }

  try {
    const { data: credential, error: credentialError } = await getSupabaseAdmin()
      .from("persona_credentials")
      .select("persona_id")
      .eq("credential_hash", hashPulsePass(normalized))
      .maybeSingle();

    if (credentialError) {
      return json({ message: "We could not check that PulsePass. Please try again." }, 500);
    }
    if (!credential) {
      return json({ message: NO_MATCH }, 404);
    }

    const { data: persona, error: personaError } = await getSupabaseAdmin()
      .from("personas")
      .select("id,nickname,avatar_id")
      .eq("id", credential.persona_id)
      .maybeSingle();

    if (personaError) {
      return json({ message: "We could not recover your persona. Please try again." }, 500);
    }
    if (!persona) {
      return json({ message: NO_MATCH }, 404);
    }

    await setSession(persona.id);
    return json({
      persona: {
        id: persona.id,
        nickname: persona.nickname,
        avatarId: persona.avatar_id,
      },
    });
  } catch {
    return json({ message: "We could not recover your persona. Please try again." }, 500);
  }
}
