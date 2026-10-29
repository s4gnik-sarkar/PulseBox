import type { NextRequest } from "next/server";
import { getOrganizerUser, isOrganizerAdmin } from "@/lib/organizer-auth";
import { assertSameOrigin, json } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function requireAdmin() {
  const user = await getOrganizerUser();
  return user && isOrganizerAdmin(user.email) ? user : null;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }
  const adminUser = await requireAdmin();
  if (!adminUser) {
    return json({ message: "Administrator access required." }, 403);
  }
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return json({ message: "Application not found." }, 404);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Choose approve, reject, or suspend." }, 400);
  }
  const status = typeof body === "object" && body !== null && "status" in body
    ? body.status
    : null;
  const reviewNote = typeof body === "object" && body !== null && "reviewNote" in body &&
      typeof body.reviewNote === "string"
    ? body.reviewNote.trim()
    : "";
  if (
    (status !== "approved" && status !== "rejected" && status !== "suspended") ||
    reviewNote.length > 500
  ) {
    return json({ message: "Choose a valid decision and a note of up to 500 characters." }, 400);
  }

  try {
    const db = getSupabaseAdmin();
    const { data: application, error: lookupError } = await db
      .from("organizer_applications")
      .select("user_id,status")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) {
      return json({ message: "We could not review this application." }, 500);
    }
    if (!application) {
      return json({ message: "Application not found." }, 404);
    }

    const { error } = await db
      .from("organizer_applications")
      .update({
        status,
        review_note: reviewNote || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUser.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      return json({ message: "We could not review this application." }, 500);
    }
    if (status === "suspended" || status === "rejected") {
      const { error: eventsError } = await db
        .from("events")
        .update({ is_open: false, is_suspended: status === "suspended" })
        .eq("organizer_id", application.user_id);
      if (eventsError) {
        return json({ message: "The application was reviewed, but its events could not be closed." }, 500);
      }
    }
    return json({ reviewed: true });
  } catch {
    return json({ message: "We could not review this application." }, 500);
  }
}
