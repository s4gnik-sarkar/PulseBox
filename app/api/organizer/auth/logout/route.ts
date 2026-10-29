import type { NextRequest } from "next/server";
import { assertSameOrigin, json } from "@/lib/request-guards";
import { clearOrganizerSession } from "@/lib/organizer-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }
  await clearOrganizerSession();
  return json({ signedOut: true });
}
