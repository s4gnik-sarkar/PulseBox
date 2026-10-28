import type { NextRequest } from "next/server";
import { REPORT_REASONS } from "@/lib/feedback-config";
import { requirePersona } from "@/lib/auth-persona";
import { assertSameOrigin, json, rateLimit } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const THANKS = "Thanks for helping keep this space welcoming. We'll take a look.";

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }

  const persona = await requirePersona();
  if (!persona) {
    return json({ message: "Make a persona first." }, 401);
  }

  const ipAllowed = await rateLimit(req, "report", 20, 3600);
  const personaAllowed = await rateLimit(req, "report", 10, 3600, persona.id);
  if (!ipAllowed || !personaAllowed) {
    return json({ message: "You have sent a lot of reports lately. Please try again later." }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Please choose a valid report reason." }, 400);
  }
  if (typeof body !== "object" || body === null) {
    return json({ message: "Please choose a valid report reason." }, 400);
  }

  const target = "target" in body ? body.target : null;
  const id = "id" in body ? body.id : null;
  const reason = "reason" in body ? body.reason : null;
  if (
    (target !== "feedback" && target !== "reply") ||
    typeof id !== "string" ||
    !UUID_PATTERN.test(id) ||
    typeof reason !== "string" ||
    !REPORT_REASONS.some((item) => item.key === reason)
  ) {
    return json({ message: "Please choose a valid report reason." }, 400);
  }

  try {
    const admin = getSupabaseAdmin();
    let feedbackId: string;

    if (target === "feedback") {
      const { data, error } = await admin
        .from("feedback")
        .select("id")
        .eq("id", id)
        .eq("is_hidden", false)
        .maybeSingle();
      if (error) {
        return json({ message: "We could not send your report." }, 500);
      }
      if (!data) {
        return json({ message: "That post is no longer available." }, 404);
      }
      feedbackId = data.id;
    } else {
      const { data, error } = await admin
        .from("replies")
        .select("id,feedback_id")
        .eq("id", id)
        .eq("is_hidden", false)
        .maybeSingle();
      if (error) {
        return json({ message: "We could not send your report." }, 500);
      }
      if (!data) {
        return json({ message: "That reply is no longer available." }, 404);
      }
      const { data: parent, error: parentError } = await admin
        .from("feedback")
        .select("id")
        .eq("id", data.feedback_id)
        .eq("is_hidden", false)
        .maybeSingle();
      if (parentError) {
        return json({ message: "We could not send your report." }, 500);
      }
      if (!parent) {
        return json({ message: "That reply is no longer available." }, 404);
      }
      feedbackId = data.feedback_id;
    }

    const { error: insertError } = await admin.from("reports").insert({
      feedback_id: target === "feedback" ? id : feedbackId,
      reply_id: target === "reply" ? id : null,
      reporter_persona_id: persona.id,
      reason,
    });

    if (insertError?.code === "23505") {
      return json({ ok: true, message: THANKS });
    }
    if (insertError) {
      return json({ message: "We could not send your report. Please try again." }, 500);
    }

    const reportQuery = admin
      .from("reports")
      .select("reporter_persona_id")
      .eq(target === "feedback" ? "feedback_id" : "reply_id", id);
    const { data: reports, error: reportsError } = target === "feedback"
      ? await reportQuery.is("reply_id", null)
      : await reportQuery;

    if (reportsError) {
      return json({ message: "We could not send your report. Please try again." }, 500);
    }

    const uniqueReporters = new Set(reports.map((report) => report.reporter_persona_id));
    if (uniqueReporters.size >= 5) {
      const { error: hideError } = target === "feedback"
        ? await admin.from("feedback").update({ is_hidden: true }).eq("id", id)
        : await admin.from("replies").update({ is_hidden: true }).eq("id", id);
      if (hideError) {
        return json({ message: "We could not send your report. Please try again." }, 500);
      }
    }

    return json({ ok: true, message: THANKS });
  } catch {
    return json({ message: "We could not send your report. Please try again." }, 500);
  }
}
