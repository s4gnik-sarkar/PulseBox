import { json } from "@/lib/request-guards";
import { getOrganizerUser, isOrganizerAdmin } from "@/lib/organizer-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getOrganizerUser();
    if (!user) {
      return json({ user: null, application: null, isAdmin: false });
    }
    const { data: application, error } = await getSupabaseAdmin()
      .from("organizer_applications")
      .select("id,institution_name,status,review_note,created_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) {
      return json({ message: "We could not load your organizer status." }, 500);
    }
    return json({
      user: { id: user.id, email: user.email ?? "" },
      application,
      isAdmin: isOrganizerAdmin(user.email),
    });
  } catch {
    return json({ message: "We could not load your organizer status." }, 500);
  }
}
