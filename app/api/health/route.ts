import { connection } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabasePublic } from "@/lib/supabase/public";

type CheckResult = {
  ok: boolean;
  error?: string;
};

function failure(error: unknown, fallback: string): CheckResult {
  const message = error instanceof Error ? error.message : fallback;
  return { ok: false, error: message || fallback };
}

export async function GET() {
  await connection();

  const checks: Record<string, CheckResult> = {};

  try {
    const { data, error } = await getSupabasePublic()
      .from("events")
      .select("title, slug")
      .eq("slug", "demo")
      .single();

    checks.publicReadsDemoEvent = error
      ? failure(error, "Could not read the demo event.")
      : data
        ? { ok: true }
        : failure(null, "The demo event was not found.");
  } catch (error) {
    checks.publicReadsDemoEvent = failure(error, "Could not read the demo event.");
  }

  try {
    const { data, error } = await getSupabasePublic()
      .from("personas")
      .insert({ nickname: "rls-test", avatar_id: 0 })
      .select("id");

    if (error) {
      checks.publicCannotWrite = { ok: true };
    } else if (data?.length) {
      const { error: deleteError } = await getSupabaseAdmin()
        .from("personas")
        .delete()
        .eq("id", data[0].id);

      checks.publicCannotWrite = deleteError
        ? failure(
            deleteError,
            "The public insert succeeded and cleanup failed.",
          )
        : failure(null, "The public client unexpectedly inserted a persona.");
    } else {
      checks.publicCannotWrite = failure(
        null,
        "The public insert returned no error and no inserted row.",
      );
    }
  } catch (error) {
    checks.publicCannotWrite = failure(error, "Could not verify public write access.");
  }

  try {
    const { data, error } = await getSupabasePublic()
      .from("persona_credentials")
      .select("*");

    checks.publicCannotReadCredentials =
      error || (Array.isArray(data) && data.length === 0)
        ? { ok: true }
        : failure(null, "The public client unexpectedly read persona credentials.");
  } catch (error) {
    checks.publicCannotReadCredentials = failure(
      error,
      "Could not verify public credential access.",
    );
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from("persona_credentials")
      .select("*", { count: "exact", head: true });

    checks.adminCanReadCredentials = error
      ? failure(error, "The admin client could not read persona credentials.")
      : { ok: true };
  } catch (error) {
    checks.adminCanReadCredentials = failure(
      error,
      "The admin client could not read persona credentials.",
    );
  }

  const ok = Object.values(checks).every((check) => check.ok);
  return Response.json({ ok, checks }, { status: ok ? 200 : 500 });
}
