import type { NextRequest } from "next/server";
import { requirePersona } from "@/lib/auth-persona";
import { assertSameOrigin, json } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string; replyId: string }> };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }

  const persona = await requirePersona();
  if (!persona) {
    return json({ message: "Make a persona first." }, 401);
  }

  const { id, replyId } = await params;
  if (!UUID_PATTERN.test(id) || !UUID_PATTERN.test(replyId)) {
    return json({ message: "Reply not found." }, 404);
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: reply, error: replyError } = await admin
      .from("replies")
      .select("persona_id")
      .eq("id", replyId)
      .eq("feedback_id", id)
      .maybeSingle();

    if (replyError) {
      return json({ message: "We could not delete this reply." }, 500);
    }
    if (!reply) {
      return json({ message: "Reply not found." }, 404);
    }
    if (reply.persona_id !== persona.id) {
      return json({ message: "You can only delete your own replies." }, 403);
    }

    const { error } = await admin
      .from("replies")
      .delete()
      .eq("id", replyId)
      .eq("feedback_id", id)
      .eq("persona_id", persona.id);

    return error
      ? json({ message: "We could not delete this reply." }, 500)
      : json({ success: true });
  } catch {
    return json({ message: "We could not delete this reply." }, 500);
  }
}
