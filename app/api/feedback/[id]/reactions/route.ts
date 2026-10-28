import type { NextRequest } from "next/server";
import { REACTIONS } from "@/lib/feedback-config";
import { requirePersona } from "@/lib/auth-persona";
import { assertSameOrigin, json, rateLimit } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type ReactionKey = (typeof REACTIONS)[number]["key"];

function emptyCounts(): Record<ReactionKey, number> {
  return { love: 0, fire: 0, laugh: 0, clap: 0, chai: 0 };
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }

  const persona = await requirePersona();
  if (!persona) {
    return json({ message: "Make a persona first." }, 401);
  }

  const ipAllowed = await rateLimit(req, "react", 120, 600);
  const personaAllowed = await rateLimit(req, "react", 60, 600, persona.id);
  if (!ipAllowed || !personaAllowed) {
    return json({ message: "You have reacted a lot lately. Please try again soon." }, 429);
  }

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return json({ message: "Feedback not found." }, 404);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Choose a reaction and try again." }, 400);
  }
  const emoji = typeof body === "object" && body !== null && "emoji" in body
    ? body.emoji
    : null;
  if (typeof emoji !== "string" || !REACTIONS.some((reaction) => reaction.key === emoji)) {
    return json({ message: "Choose a valid reaction." }, 400);
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: feedback, error: feedbackError } = await admin
      .from("feedback")
      .select("id")
      .eq("id", id)
      .eq("is_hidden", false)
      .maybeSingle();

    if (feedbackError) {
      return json({ message: "We could not update your reaction." }, 500);
    }
    if (!feedback) {
      return json({ message: "Feedback not found." }, 404);
    }

    const { data: existing, error: existingError } = await admin
      .from("reactions")
      .select("feedback_id")
      .eq("feedback_id", id)
      .eq("persona_id", persona.id)
      .eq("emoji", emoji)
      .maybeSingle();

    if (existingError) {
      return json({ message: "We could not update your reaction." }, 500);
    }

    if (existing) {
      const { error } = await admin
        .from("reactions")
        .delete()
        .eq("feedback_id", id)
        .eq("persona_id", persona.id)
        .eq("emoji", emoji);
      if (error) {
        return json({ message: "We could not update your reaction." }, 500);
      }
    } else {
      const { error } = await admin
        .from("reactions")
        .insert({ feedback_id: id, persona_id: persona.id, emoji });
      if (error) {
        return json({ message: "We could not update your reaction." }, 500);
      }
    }

    const { data: rows, error: rowsError } = await admin
      .from("reactions")
      .select("persona_id,emoji")
      .eq("feedback_id", id);

    if (rowsError) {
      return json({ message: "We could not update your reaction." }, 500);
    }

    const reactions = emptyCounts();
    const mine: string[] = [];
    for (const row of rows) {
      if (row.emoji in reactions) {
        reactions[row.emoji as ReactionKey] += 1;
      }
      if (row.persona_id === persona.id) {
        mine.push(row.emoji);
      }
    }

    return json({ reactions, mine });
  } catch {
    return json({ message: "We could not update your reaction." }, 500);
  }
}
