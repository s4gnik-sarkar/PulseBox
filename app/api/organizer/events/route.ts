import type { NextRequest } from "next/server";
import { getApprovedOrganizer, getOrganizerUser } from "@/lib/organizer-auth";
import { assertSameOrigin, json } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

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

function slugBase(title: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const prefix = slug.slice(0, 49).replace(/-$/g, "");
  return prefix.length >= 3 ? prefix : `event-${prefix || "new"}`;
}

export async function GET() {
  const user = await getOrganizerUser();
  if (!user) {
    return json({ message: "Sign in to manage events." }, 401);
  }
  try {
    const approval = await getApprovedOrganizer(user.id);
    if (!approval) {
      return json({ message: "An approved organizer account is required." }, 403);
    }
    const { data, error } = await getSupabaseAdmin()
      .from("events")
      .select("id,title,description,slug,is_open,is_suspended,event_date,created_at")
      .eq("organizer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      return json({ message: "We could not load your events." }, 500);
    }
    return json({ events: data });
  } catch {
    return json({ message: "We could not load your events." }, 500);
  }
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }
  const user = await getOrganizerUser();
  if (!user) {
    return json({ message: "Sign in to create events." }, 401);
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Check the event details and try again." }, 400);
  }
  const title = typeof body === "object" && body !== null && "title" in body &&
      typeof body.title === "string"
    ? body.title.trim()
    : "";
  const description = typeof body === "object" && body !== null && "description" in body &&
      typeof body.description === "string"
    ? body.description.trim()
    : "";
  const eventDate = typeof body === "object" && body !== null && "eventDate" in body
    ? body.eventDate
    : null;
  if (
    title.length < 3 || title.length > 120 ||
    description.length > 2000 ||
    !validDate(eventDate)
  ) {
    return json({ message: "Use a 3–120 character title, description up to 2,000 characters, and a valid date." }, 400);
  }

  try {
    const approval = await getApprovedOrganizer(user.id);
    if (!approval) {
      return json({ message: "An approved organizer account is required." }, 403);
    }
    const slug = `${slugBase(title)}-${crypto.randomUUID().slice(0, 8)}`;
    const { data, error } = await getSupabaseAdmin()
      .from("events")
      .insert({
        organizer_id: user.id,
        title,
        description: description || null,
        slug,
        event_date: eventDate,
      })
      .select("id,title,description,slug,is_open,is_suspended,event_date,created_at")
      .single();
    if (error || !data) {
      return json({ message: "We could not create the event. Please try again." }, 500);
    }
    return json({ event: data }, 201);
  } catch {
    return json({ message: "We could not create the event. Please try again." }, 500);
  }
}
