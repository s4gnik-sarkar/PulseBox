import type { NextRequest } from "next/server";
import { getApprovedOrganizer, getOrganizerUser } from "@/lib/organizer-auth";
import { assertSameOrigin, json } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_req: Request, { params }: RouteContext) {
  const user = await getOrganizerUser();
  if (!user) {
    return json({ message: "Sign in to view event analytics." }, 401);
  }
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return json({ message: "Event not found." }, 404);
  }
  try {
    const approval = await getApprovedOrganizer(user.id);
    if (!approval) {
      return json({ message: "An approved organizer account is required." }, 403);
    }
    const { data: event, error: eventError } = await getSupabaseAdmin()
      .from("events")
      .select("id")
      .eq("id", id)
      .eq("organizer_id", user.id)
      .maybeSingle();
    if (eventError) {
      return json({ message: "We could not load event analytics." }, 500);
    }
    if (!event) {
      return json({ message: "Event not found." }, 404);
    }
    const { data, error } = await getSupabaseAdmin().rpc("get_organizer_event_analytics", {
      p_event_id: id,
      p_organizer_id: user.id,
    });
    if (error || !data) {
      return json({ message: "We could not load event analytics." }, 500);
    }
    return json({ analytics: data });
  } catch {
    return json({ message: "We could not load event analytics." }, 500);
  }
}

function validDate(value: unknown): value is string | null {
  if (value === null) {
    return true;
  }
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }
  const user = await getOrganizerUser();
  if (!user) {
    return json({ message: "Sign in to manage events." }, 401);
  }
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return json({ message: "Event not found." }, 404);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Check the event details and try again." }, 400);
  }
  if (typeof body !== "object" || body === null) {
    return json({ message: "Check the event details and try again." }, 400);
  }

  const update: {
    title?: string;
    description?: string | null;
    event_date?: string | null;
    is_open?: boolean;
  } = {};
  if ("title" in body || "description" in body || "eventDate" in body) {
    const title = "title" in body && typeof body.title === "string" ? body.title.trim() : null;
    const description = "description" in body && typeof body.description === "string"
      ? body.description.trim()
      : null;
    const eventDate = "eventDate" in body ? body.eventDate : null;
    if (
      !title || title.length < 3 || title.length > 120 ||
      description === null || description.length > 2000 ||
      !validDate(eventDate)
    ) {
      return json({ message: "Use a 3–120 character title, description up to 2,000 characters, and a valid date." }, 400);
    }
    update.title = title;
    update.description = description || null;
    update.event_date = eventDate;
  }
  if ("isOpen" in body) {
    if (typeof body.isOpen !== "boolean") {
      return json({ message: "Choose whether feedback is open." }, 400);
    }
    update.is_open = body.isOpen;
  }
  if (Object.keys(update).length === 0) {
    return json({ message: "Choose event details to update." }, 400);
  }

  try {
    const approval = await getApprovedOrganizer(user.id);
    if (!approval) {
      return json({ message: "An approved organizer account is required." }, 403);
    }
    const db = getSupabaseAdmin();
    const { data: event, error: lookupError } = await db
      .from("events")
      .select("is_suspended")
      .eq("id", id)
      .eq("organizer_id", user.id)
      .maybeSingle();
    if (lookupError) {
      return json({ message: "We could not update the event." }, 500);
    }
    if (!event) {
      return json({ message: "Event not found." }, 404);
    }
    if (event.is_suspended) {
      return json({ message: "This event has been suspended by the platform administrator." }, 403);
    }
    const { data, error } = await db
      .from("events")
      .update(update)
      .eq("id", id)
      .eq("organizer_id", user.id)
      .select("id,title,description,slug,is_open,is_suspended,event_date,created_at")
      .single();
    if (error || !data) {
      return json({ message: "We could not update the event." }, 500);
    }
    return json({ event: data });
  } catch {
    return json({ message: "We could not update the event." }, 500);
  }
}
