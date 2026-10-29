import type { NextRequest } from "next/server";
import { requirePersona } from "@/lib/auth-persona";
import { assertSameOrigin, json } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
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

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return json({ message: "Feedback not found." }, 404);
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: feedback, error: feedbackError } = await admin
      .from("feedback")
      .select("persona_id")
      .eq("id", id)
      .maybeSingle();

    if (feedbackError) {
      return json({ message: "We could not delete this feedback." }, 500);
    }
    if (!feedback) {
      return json({ message: "Feedback not found." }, 404);
    }
    if (feedback.persona_id !== persona.id) {
      return json({ message: "You can only delete your own feedback." }, 403);
    }

    const { error } = await admin
      .from("feedback")
      .delete()
      .eq("id", id)
      .eq("persona_id", persona.id);

    return error
      ? json({ message: "We could not delete this feedback." }, 500)
      : json({ success: true });
  } catch {
    return json({ message: "We could not delete this feedback." }, 500);
  }
}
