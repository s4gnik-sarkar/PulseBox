import type { NextRequest } from "next/server";
import { REPLY_MAX } from "@/lib/feedback-config";
import { requirePersona } from "@/lib/auth-persona";
import { sanitizeMessage } from "@/lib/text";
import { assertSameOrigin, json, rateLimit } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { WallReply } from "@/lib/wall-types";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type JoinedReply = {
  id: string;
  message: string;
  created_at: string;
  persona: { id: string; nickname: string; avatar_id: number } |
    { id: string; nickname: string; avatar_id: number }[] | null;
};

function mapReply(row: JoinedReply): WallReply | null {
  const persona = Array.isArray(row.persona) ? row.persona[0] : row.persona;
  if (!persona) {
    return null;
  }
  return {
    id: row.id,
    message: row.message,
    createdAt: row.created_at,
    persona: {
      id: persona.id,
      nickname: persona.nickname,
      avatarId: persona.avatar_id,
    },
  };
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return json({ message: "Feedback not found." }, 404);
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: parent, error: parentError } = await admin
      .from("feedback")
      .select("id")
      .eq("id", id)
      .eq("is_hidden", false)
      .maybeSingle();

    if (parentError) {
      return json({ message: "We could not load replies." }, 500);
    }
    if (!parent) {
      return json({ message: "Feedback not found." }, 404);
    }

    const { data, error } = await admin
      .from("replies")
      .select("id,message,created_at,persona:personas!replies_persona_id_fkey(id,nickname,avatar_id)")
      .eq("feedback_id", id)
      .eq("is_hidden", false)
      .order("created_at", { ascending: true })
      .limit(100);

    if (error) {
      return json({ message: "We could not load replies." }, 500);
    }
    const replies = (data as JoinedReply[]).flatMap((row) => {
      const reply = mapReply(row);
      return reply ? [reply] : [];
    });
    return json({ replies });
  } catch {
    return json({ message: "We could not load replies." }, 500);
  }
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

  const ipAllowed = await rateLimit(req, "reply-post", 30, 600);
  const personaAllowed = await rateLimit(req, "reply-post", 15, 600, persona.id);
  if (!ipAllowed || !personaAllowed) {
    return json({ message: "You have replied a lot lately. Please try again soon." }, 429);
  }

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return json({ message: "Feedback not found." }, 404);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Please check your reply and try again." }, 400);
  }
  const message =
    typeof body === "object" && body !== null && "message" in body
      ? sanitizeMessage(body.message, REPLY_MAX)
      : null;
  if (!message) {
    return json({ message: "Please enter a reply of up to 500 characters." }, 400);
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: parent, error: parentError } = await admin
      .from("feedback")
      .select("id")
      .eq("id", id)
      .eq("is_hidden", false)
      .maybeSingle();
    if (parentError) {
      return json({ message: "We could not post your reply." }, 500);
    }
    if (!parent) {
      return json({ message: "Feedback not found." }, 404);
    }

    const { data, error } = await admin
      .from("replies")
      .insert({ feedback_id: id, persona_id: persona.id, message })
      .select("id,message,created_at,persona:personas!replies_persona_id_fkey(id,nickname,avatar_id)")
      .single();
    if (error || !data) {
      return json({ message: "We could not post your reply. Please try again." }, 500);
    }

    const reply = mapReply(data as JoinedReply);
    return reply
      ? json({ reply }, 201)
      : json({ message: "We could not post your reply. Please try again." }, 500);
  } catch {
    return json({ message: "We could not post your reply. Please try again." }, 500);
  }
}
