import type { NextRequest } from "next/server";
import { AVATAR_COUNT } from "@/lib/avatars";
import { isValidNickname } from "@/lib/nickname";
import {
  generatePulsePass,
  hashPulsePass,
  normalizePulsePass,
} from "@/lib/pulsepass";
import { assertSameOrigin, json, rateLimit } from "@/lib/request-guards";
import { setSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }

  if (!(await rateLimit(req, "persona-create", 30, 3600))) {
    return json({ message: "Too many tries right now. Please try again later." }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Please check your details and try again." }, 400);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("nickname" in body) ||
    !("avatarId" in body) ||
    !isValidNickname(body.nickname) ||
    typeof body.avatarId !== "number" ||
    !Number.isInteger(body.avatarId) ||
    body.avatarId < 0 ||
    body.avatarId >= AVATAR_COUNT
  ) {
    return json({ message: "Please check your nickname and avatar." }, 400);
  }

  let createdPersonaId: string | null = null;
  let pulsePass: string | null = null;

  try {
    const { data: persona, error: personaError } = await getSupabaseAdmin()
      .from("personas")
      .insert({ nickname: body.nickname, avatar_id: body.avatarId })
      .select("id,nickname,avatar_id")
      .single();

    if (personaError || !persona) {
      return json({ message: "We could not create your persona. Please try again." }, 500);
    }

    createdPersonaId = persona.id;
    let credentialCreated = false;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      pulsePass = generatePulsePass();
      const normalizedPulsePass = normalizePulsePass(pulsePass);
      if (!normalizedPulsePass) {
        throw new Error("Could not normalize generated PulsePass.");
      }
      const { error: credentialError } = await getSupabaseAdmin()
        .from("persona_credentials")
        .insert({
          persona_id: persona.id,
          credential_hash: hashPulsePass(normalizedPulsePass),
        });

      if (!credentialError) {
        credentialCreated = true;
        break;
      }

      if (credentialError.code !== "23505") {
        break;
      }
    }

    if (!credentialCreated || !pulsePass) {
      await getSupabaseAdmin().from("personas").delete().eq("id", persona.id);
      return json({ message: "We could not create your persona. Please try again." }, 500);
    }

    await setSession(persona.id);
    return json(
      {
        persona: {
          id: persona.id,
          nickname: persona.nickname,
          avatarId: persona.avatar_id,
        },
        pulsePass,
      },
      201,
    );
  } catch {
    if (createdPersonaId) {
      try {
        await getSupabaseAdmin().from("personas").delete().eq("id", createdPersonaId);
      } catch {
        return json({ message: "We could not create your persona. Please try again." }, 500);
      }
    }
    return json({ message: "We could not create your persona. Please try again." }, 500);
  }
}
