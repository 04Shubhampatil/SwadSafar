import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";

const MAX_FILE_BYTES = 3 * 1024 * 1024;
const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function sniffImageType(buffer) {
  if (!buffer || buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (pngSignature.every((byte, index) => buffer[index] === byte)) {
    return "image/png";
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const declaredMime = (file.type || "").toLowerCase();
  if (!MIME_TO_EXT[declaredMime]) {
    return NextResponse.json({ error: "Only JPG, PNG and WebP images are allowed" }, { status: 400 });
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "Image must be 3 MB or smaller" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageType(buffer);
  if (!sniffed || sniffed !== declaredMime) {
    return NextResponse.json({ error: "That file does not appear to be a valid image" }, { status: 400 });
  }

  const extension = MIME_TO_EXT[sniffed];
  const fileName = `profile-${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, buffer, {
    contentType: sniffed,
    upsert: false,
  });

  if (uploadError) {
    console.error("[api/profile/avatar] upload error:", uploadError.message);
    return NextResponse.json(
      { error: "Could not upload profile photo. Please try again." },
      { status: 500 }
    );
  }

  const publicUrl = supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;

  if (!publicUrl) {
    console.error("[api/profile/avatar] unable to resolve uploaded avatar URL");
    return NextResponse.json(
      { error: "Photo uploaded but could not be saved. Please try again." },
      { status: 500 }
    );
  }

  const { data: previousProfile } = await supabase
    .from("profiles")
    .select("id, user_id, avatar_url")
    .or(`user_id.eq.${user.id},id.eq.${user.id}`)
    .maybeSingle();

  if (previousProfile?.avatar_url) {
    const publicPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`;
    const signedPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/avatars/`;
    const url = previousProfile.avatar_url;

    if (url.startsWith(publicPrefix)) {
      const oldPath = url.slice(publicPrefix.length);
      if (oldPath.startsWith(`profiles/${user.id}/`) || oldPath.startsWith(`${user.id}/`)) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }
    } else if (url.startsWith(signedPrefix)) {
      const oldPath = url.slice(signedPrefix.length).split("?")[0];
      if (oldPath.startsWith(`profiles/${user.id}/`) || oldPath.startsWith(`${user.id}/`)) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }
    }
  }

  const updateBase = previousProfile?.id ? supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", previousProfile.id) : supabase.from("profiles").upsert({ id: user.id, user_id: user.id, avatar_url: publicUrl }, { onConflict: "user_id" });
  const { data: updated, error: updateError } = await updateBase.select().maybeSingle();

  if (updateError) {
    console.error("[api/profile/avatar] profile update error:", updateError.message);
    return NextResponse.json(
      { error: "Photo uploaded but could not be saved. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ profile: updated });
}
