import type { NextRequest } from "next/server";
import { bindPersonaDevice } from "@/lib/persona-device";
import { assertSameOrigin, json } from "@/lib/request-guards";
import { clearSession, getSessionPersonaId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }

  try {
    const personaId = await getSessionPersonaId();
    if (personaId) {
      await bindPersonaDevice(personaId);
    }
    await clearSession();
    return json({ ok: true });
  } catch {
    return json({ message: "We could not switch personas. Please try again." }, 500);
  }
}
