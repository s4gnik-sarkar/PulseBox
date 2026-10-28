import "server-only";

import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getPulsepassPepper } from "@/lib/secrets";

export function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function assertSameOrigin(req: NextRequest): Response | null {
  const origin = req.headers.get("origin");
  const host =
    req.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    req.headers.get("host")?.trim();

  if (!origin || !host) {
    return json({ message: "Request origin could not be verified." }, 403);
  }

  try {
    if (new URL(origin).host.toLowerCase() !== host.toLowerCase()) {
      return json({ message: "Request origin could not be verified." }, 403);
    }
  } catch {
    return json({ message: "Request origin could not be verified." }, 403);
  }

  return null;
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function rateLimit(
  req: NextRequest,
  action: string,
  limit: number,
  windowSeconds: number,
  subject?: string,
): Promise<boolean> {
  try {
    const ipHash = createHmac("sha256", getPulsepassPepper())
      .update(subject ?? getClientIp(req))
      .digest("hex");
    const { data, error } = await getSupabaseAdmin().rpc("hit_rate_limit", {
      p_key: `${action}:${ipHash}`,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    return !error && data === true;
  } catch {
    return false;
  }
}
