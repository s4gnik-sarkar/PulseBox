import type { NextRequest } from "next/server";
import { CATEGORIES, FEEDBACK_MAX, MOODS } from "@/lib/feedback-config";
import { requirePersona } from "@/lib/auth-persona";
import { sanitizeMessage } from "@/lib/text";
import { getSessionPersonaId } from "@/lib/session";
import { assertSameOrigin, json, rateLimit } from "@/lib/request-guards";
import {
  getEventBySlug,
  getWallItemById,
  getWallPage,
  isEventFeedbackClosed,
} from "@/lib/wall";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    !Number.isNaN(Date.parse(value));
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const query = req.nextUrl.searchParams;
  const sortValue = query.get("sort") ?? "newest";
  if (sortValue !== "newest" && sortValue !== "oldest") {
    return json({ message: "Choose newest or oldest feedback." }, 400);
  }

  const cursor = query.get("cursor") ?? undefined;
  if (cursor && !isValidIsoDate(cursor)) {
    return json({ message: "That page cursor is not valid." }, 400);
  }

  try {
    const event = await getEventBySlug(slug);
    if (!event) {
      return json({ message: "Event not found." }, 404);
    }

    const viewerPersonaId = await getSessionPersonaId();
    const page = await getWallPage({
      eventId: event.id,
      viewerPersonaId,
      sort: sortValue,
      cursor,
    });
    return json(page);
  } catch {
    return json({ message: "We could not load the feedback wall." }, 500);
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

  const ipAllowed = await rateLimit(req, "feedback-post", 8, 600);
  const personaAllowed = await rateLimit(req, "feedback-post", 5, 600, persona.id);
  if (!ipAllowed || !personaAllowed) {
    return json(
      { message: "You have posted a lot lately. Take a little breather and try again soon." },
      429,
    );
  }

  const { slug } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Please check your feedback and try again." }, 400);
  }

  if (typeof body !== "object" || body === null || !("message" in body)) {
    return json({ message: "Please check your feedback and try again." }, 400);
  }
  const message = sanitizeMessage(body.message, FEEDBACK_MAX);
  const category = "category" in body ? body.category : null;
  const mood = "mood" in body ? body.mood : null;
  const rating = "rating" in body ? body.rating : null;

  if (
    !message ||
    typeof category !== "string" ||
    !CATEGORIES.some((item) => item.key === category) ||
    typeof mood !== "string" ||
    !MOODS.some((item) => item.key === mood) ||
    (rating !== null &&
      (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5))
  ) {
    return json({ message: "Please check your message, mood, category, and rating." }, 400);
  }

  try {
    const event = await getEventBySlug(slug);
    if (!event) {
      return json({ message: "Event not found." }, 404);
    }

    if (isEventFeedbackClosed(event)) {
      return json({ message: "Feedback is closed for this event." }, 403);
    }

    const { data: inserted, error } = await getSupabaseAdmin()
      .from("feedback")
      .insert({
        event_id: event.id,
        persona_id: persona.id,
        message,
        category,
        mood,
        rating,
      })
      .select("id")
      .eq("is_hidden", false)
      .single();

    if (error || !inserted) {
      return json({ message: "We could not post your feedback. Please try again." }, 500);
    }

    const item = await getWallItemById(inserted.id, await getSessionPersonaId());
    if (!item) {
      return json({ message: "We could not post your feedback. Please try again." }, 500);
    }
    return json(item, 201);
  } catch {
    return json({ message: "We could not post your feedback. Please try again." }, 500);
  }
}
