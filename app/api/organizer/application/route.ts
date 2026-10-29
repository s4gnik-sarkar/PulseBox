import type { NextRequest } from "next/server";
import { getOrganizerUser } from "@/lib/organizer-auth";
import { assertSameOrigin, json, rateLimit } from "@/lib/request-guards";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
const BUCKET = "organizer-verification";

function isValidProof(file: File): Promise<boolean> {
  if (
    file.size === 0 ||
    file.size > 1_048_576 ||
    !["application/pdf", "image/jpeg"].includes(file.type)
  ) {
    return Promise.resolve(false);
  }
  return file.slice(0, 5).arrayBuffer().then((buffer) => {
    const bytes = new Uint8Array(buffer);
    return file.type === "application/pdf"
      ? String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-"
      : bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  });
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) {
    return originError;
  }

  const user = await getOrganizerUser();
  if (!user || !user.email) {
    return json({ message: "Sign in with a confirmed email to apply." }, 401);
  }
  if (!(await rateLimit(req, "organizer-application", 3, 3600, user.id))) {
    return json({ message: "Too many application attempts. Try again later." }, 429);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ message: "Submit your institution and a PDF or JPG proof file." }, 400);
  }
  const institution = form.get("institution");
  const proof = form.get("proof");
  if (
    typeof institution !== "string" ||
    institution.trim().length < 2 ||
    institution.trim().length > 150 ||
    !(proof instanceof File) ||
    !(await isValidProof(proof))
  ) {
    return json({
      message: "Enter an institution name and upload a valid PDF or JPG no larger than 1 MB.",
    }, 400);
  }

  const admin = getSupabaseAdmin();
  try {
    const { data: existing, error: existingError } = await admin
      .from("organizer_applications")
      .select("status,proof_path")
      .eq("user_id", user.id)
      .maybeSingle();
    if (existingError) {
      return json({ message: "We could not check your application status." }, 500);
    }
    if (existing?.status === "pending" || existing?.status === "approved" || existing?.status === "suspended") {
      return json({ message: "An application already exists for this account." }, 409);
    }

    const extension = proof.type === "application/pdf" ? "pdf" : "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(path, new Uint8Array(await proof.arrayBuffer()), {
        contentType: proof.type,
        upsert: false,
      });
    if (uploadError) {
      return json({ message: "We could not securely store your proof. Please try again." }, 500);
    }

    const application = {
      user_id: user.id,
      email: user.email,
      institution_name: institution.trim(),
      proof_path: path,
      status: "pending",
      review_note: null,
      reviewed_at: null,
      reviewed_by: null,
      updated_at: new Date().toISOString(),
    };
    const result = existing
      ? await admin
          .from("organizer_applications")
          .update(application)
          .eq("user_id", user.id)
      : await admin
          .from("organizer_applications")
          .insert(application);
    if (result.error) {
      const { error: cleanupError } = await admin.storage.from(BUCKET).remove([path]);
      if (cleanupError) {
        console.warn("Could not remove unreferenced organizer proof:", cleanupError);
      }
      return json({ message: "We could not submit your application. Please try again." }, 500);
    }

    if (existing?.proof_path) {
      const { error: cleanupError } = await admin.storage.from(BUCKET).remove([existing.proof_path]);
      if (cleanupError) {
        console.warn("Could not remove replaced organizer proof:", cleanupError);
      }
    }
    return json({ submitted: true }, 201);
  } catch {
    return json({ message: "We could not submit your application. Please try again." }, 500);
  }
}
