import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { WallItem } from "@/lib/wall-types";

export type WallEvent = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  is_open: boolean;
  event_date: string | null;
  feedback_deadline: string | null;
};

export function isEventFeedbackClosed(
  event: Pick<WallEvent, "is_open" | "feedback_deadline">,
): boolean {
  return (
    !event.is_open ||
    (event.feedback_deadline !== null &&
      new Date(event.feedback_deadline).getTime() < Date.now())
  );
}

type JoinedPersona = {
  id: string;
  nickname: string;
  avatar_id: number;
};

type JoinedFeedback = {
  id: string;
  event_id: string;
  persona_id: string;
  message: string;
  category: WallItem["category"];
  mood: WallItem["mood"];
  rating: number | null;
  created_at: string;
  persona: JoinedPersona | JoinedPersona[] | null;
};

type ReactionCounts = WallItem["reactions"];

function emptyReactionCounts(): ReactionCounts {
  return { love: 0, fire: 0, laugh: 0, clap: 0, chai: 0 };
}

export async function getEventBySlug(slug: string): Promise<WallEvent | null> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("events")
      .select("id,title,description,slug,is_open,event_date,feedback_deadline")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.warn("Could not load event:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.warn("Could not load event:", error);
    return null;
  }
}

async function buildWallItems(
  feedback: JoinedFeedback[],
  viewerPersonaId: string | null,
): Promise<WallItem[]> {
  if (feedback.length === 0) {
    return [];
  }

  try {
    const ids = feedback.map((item) => item.id);
    const admin = getSupabaseAdmin();
    const [repliesResult, reactionsResult] = await Promise.all([
      admin
        .from("replies")
        .select("feedback_id")
        .in("feedback_id", ids)
        .eq("is_hidden", false),
      admin
        .from("reactions")
        .select("feedback_id,persona_id,emoji")
        .in("feedback_id", ids),
    ]);

    if (repliesResult.error || reactionsResult.error) {
      console.warn("Could not load wall activity:", repliesResult.error ?? reactionsResult.error);
      return [];
    }

    const replyCounts = new Map<string, number>();
    for (const reply of repliesResult.data) {
      replyCounts.set(reply.feedback_id, (replyCounts.get(reply.feedback_id) ?? 0) + 1);
    }

    const countsByFeedback = new Map<string, ReactionCounts>();
    const mineByFeedback = new Map<string, string[]>();
    for (const row of reactionsResult.data) {
      const counts = countsByFeedback.get(row.feedback_id) ?? emptyReactionCounts();
      if (row.emoji in counts) {
        const emoji = row.emoji as keyof ReactionCounts;
        counts[emoji] += 1;
      }
      countsByFeedback.set(row.feedback_id, counts);

      if (viewerPersonaId && row.persona_id === viewerPersonaId) {
        const mine = mineByFeedback.get(row.feedback_id) ?? [];
        mine.push(row.emoji);
        mineByFeedback.set(row.feedback_id, mine);
      }
    }

    return feedback.flatMap((item) => {
      const joined = Array.isArray(item.persona) ? item.persona[0] : item.persona;
      if (!joined) {
        return [];
      }
      return [{
        id: item.id,
        message: item.message,
        category: item.category,
        mood: item.mood,
        rating: item.rating,
        createdAt: item.created_at,
        persona: {
          id: joined.id,
          nickname: joined.nickname,
          avatarId: joined.avatar_id,
        },
        replyCount: replyCounts.get(item.id) ?? 0,
        reactions: countsByFeedback.get(item.id) ?? emptyReactionCounts(),
        mine: mineByFeedback.get(item.id) ?? [],
        isMine: joined.id === viewerPersonaId,
      }];
    });
  } catch (error) {
    console.warn("Could not load wall activity:", error);
    return [];
  }
}

async function fetchFeedbackById(id: string): Promise<JoinedFeedback | null> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("feedback")
      .select(
        "id,event_id,persona_id,message,category,mood,rating,created_at,persona:personas!feedback_persona_id_fkey(id,nickname,avatar_id)",
      )
      .eq("id", id)
      .eq("is_hidden", false)
      .maybeSingle();

    if (error) {
      console.warn("Could not load feedback:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.warn("Could not load feedback:", error);
    return null;
  }
}

export async function getWallItemById(
  id: string,
  viewerPersonaId: string | null,
): Promise<WallItem | null> {
  const item = await fetchFeedbackById(id);
  if (!item) {
    return null;
  }
  const [result] = await buildWallItems([item], viewerPersonaId);
  return result ?? null;
}

export async function getWallPage({
  eventId,
  viewerPersonaId,
  sort,
  cursor,
  limit = 20,
}: {
  eventId: string;
  viewerPersonaId: string | null;
  sort: "newest" | "oldest";
  cursor?: string;
  limit?: number;
}): Promise<{ items: WallItem[]; nextCursor: string | null }> {
  try {
    let query = getSupabaseAdmin()
      .from("feedback")
      .select(
        "id,event_id,persona_id,message,category,mood,rating,created_at,persona:personas!feedback_persona_id_fkey(id,nickname,avatar_id)",
      )
      .eq("event_id", eventId)
      .eq("is_hidden", false)
      .order("created_at", { ascending: sort === "oldest" })
      .limit(limit + 1);

    if (cursor) {
      query = sort === "newest"
        ? query.lt("created_at", cursor)
        : query.gt("created_at", cursor);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Could not load feedback wall:", error);
      return { items: [], nextCursor: null };
    }

    const rows = (data ?? []) as JoinedFeedback[];
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const items = await buildWallItems(page, viewerPersonaId);
    const nextCursor = hasMore && page.length > 0
      ? page[page.length - 1].created_at
      : null;
    return { items, nextCursor };
  } catch (error) {
    console.warn("Could not load feedback wall:", error);
    return { items: [], nextCursor: null };
  }
}
