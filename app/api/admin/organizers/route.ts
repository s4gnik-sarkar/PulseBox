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
      .from("organizer_applications")
      .select("id,email,institution_name,status,review_note,created_at")
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) {
      return json({ message: "We could not load applications." }, 500);
    }
    return json({ applications: data });
  } catch {
    return json({ message: "We could not load applications." }, 500);
  }
}
