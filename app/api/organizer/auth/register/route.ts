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
  if (!(await rateLimit(req, "organizer-register", 5, 3600))) {
    return json({ message: "Too many registration attempts. Try again later." }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ message: "Enter a valid email and password." }, 400);
  }
  const email = typeof body === "object" && body !== null && "email" in body &&
      typeof body.email === "string"
    ? body.email.trim().toLowerCase()
    : "";
  const password = typeof body === "object" && body !== null && "password" in body &&
      typeof body.password === "string"
    ? body.password
    : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6 || password.length > 128) {
    return json({ message: "Use a valid email and a password of 6–128 characters." }, 400);
  }

  try {
    const { data, error } = await getSupabasePublic().auth.signUp({
      email,
      password,
    });
    if (error) {
      return json({ message: error.message }, 400);
    }
    if (data.session) {
      await setOrganizerSession(data.session);
    }
    return json({
      registered: true,
      confirmationRequired: !data.session,
      message: data.session
        ? "Account created. You can now submit verification."
        : "Check your email to confirm your account, then log in to continue.",
    }, 201);
  } catch {
    return json({ message: "We could not create your account. Please try again." }, 500);
  }
}
