import type { NextRequest } from "next/server";
import { assertSameOrigin, json, rateLimit } from "@/lib/request-guards";
import { setOrganizerSession } from "@/lib/organizer-auth";
import { getSupabasePublic } from "@/lib/supabase/public";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }
  if (!(await rateLimit(req, "organizer-login", 10, 600))) {
    return json({ message: "Too many login attempts. Try again later." }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Enter your email and password." }, 400);
  }
  const email = typeof body === "object" && body !== null && "email" in body &&
      typeof body.email === "string"
    ? body.email.trim().toLowerCase()
    : "";
  const password = typeof body === "object" && body !== null && "password" in body &&
      typeof body.password === "string"
    ? body.password
    : "";
  if (!email || !password) {
    return json({ message: "Enter your email and password." }, 400);
  }

  try {
    const { data, error } = await getSupabasePublic().auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.session) {
      return json({ message: "Email or password is incorrect, or your email is not confirmed." }, 401);
    }
    await setOrganizerSession(data.session);
    return json({ signedIn: true });
  } catch {
    return json({ message: "We could not sign you in. Please try again." }, 500);
  }
}
