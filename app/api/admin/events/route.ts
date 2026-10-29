import { getOrganizerUser, isOrganizerAdmin } from "@/lib/organizer-auth";
import { json } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getOrganizerUser();
  if (!user || !isOrganizerAdmin(user.email)) {
    return json({ message: "Administrator access required." }, 403);
  }
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("events")
      .select("id,title,slug,is_open,is_suspended,created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      return json({ message: "We could not load events." }, 500);
    }
    return json({ events: data });
  } catch {
    return json({ message: "We could not load events." }, 500);
  }
}
