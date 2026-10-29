import type { NextRequest } from "next/server";
import { getOrganizerUser, isOrganizerAdmin } from "@/lib/organizer-auth";
import { assertSameOrigin, json } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest, { params }: RouteContext) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }
  const user = await getOrganizerUser();
  if (!user || !isOrganizerAdmin(user.email)) {
    return json({ message: "Administrator access required." }, 403);
  }
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return json({ message: "Event not found." }, 404);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Choose whether to suspend or restore the event." }, 400);
  }
  const action = typeof body === "object" && body !== null && "action" in body
    ? body.action
    : null;
  if (action !== "suspend" && action !== "restore") {
    return json({ message: "Choose whether to suspend or restore the event." }, 400);
  }
  try {
    const { error } = await getSupabaseAdmin()
      .from("events")
      .update({
        is_suspended: action === "suspend",
        is_open: false,
      })
      .eq("id", id);
    if (error) {
      return json({ message: "We could not update this event." }, 500);
    }
    return json({ updated: true });
  } catch {
    return json({ message: "We could not update this event." }, 500);
  }
}
