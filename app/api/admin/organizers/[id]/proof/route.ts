import { getOrganizerUser, isOrganizerAdmin } from "@/lib/organizer-auth";
import { json } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;

export async function GET(_req: Request, { params }: RouteContext) {
  const user = await getOrganizerUser();
  if (!user || !isOrganizerAdmin(user.email)) {
    return json({ message: "Administrator access required." }, 403);
  }
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return json({ message: "Application not found." }, 404);
  }
  try {
    const db = getSupabaseAdmin();
    const { data: application, error: lookupError } = await db
      .from("organizer_applications")
      .select("proof_path")
      .eq("id", id)
      .maybeSingle();
    if (lookupError) {
      return json({ message: "We could not access the verification proof." }, 500);
    }
    if (!application) {
      return json({ message: "Application not found." }, 404);
    }
    const { data, error } = await db.storage
      .from("organizer-verification")
      .createSignedUrl(application.proof_path, 60);
    if (error || !data) {
      return json({ message: "We could not access the verification proof." }, 500);
    }
    return json({ url: data.signedUrl });
  } catch {
    return json({ message: "We could not access the verification proof." }, 500);
  }
}
