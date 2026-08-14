import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureStorageBucket } from "@/lib/supabase/admin";
import { getServerUser } from "@/lib/profile";
import { downloadImageToBuffer, sniffImageType, buildStoragePath } from "@/lib/ai/image";

const BUCKET = process.env.RECIPE_IMAGES_BUCKET || "recipe-images";
const MAX_FILE_BYTES = 8 * 1024 * 1024;

const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * POST /api/recipes/upload-image
 *
 * Persists an image into the `recipe-images` storage bucket on behalf of the
 * authenticated user. Two accepted payloads:
 *
 *   JSON     { "imageUrl": "https://…" }          → server downloads + validates the URL
 *   FormData { "file": <File> }                   → validates the uploaded file
 *
 * The user id always comes from the authenticated session (never the client).
 * Uploads go through the user's session so Storage RLS policies apply; the
 * service-role client is only used to provision a missing bucket.
 */
export async function POST(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  let buffer;
  let contentType;

  const requestType = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();

  if (requestType === "application/json") {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";
    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }

    try {
      const downloaded = await downloadImageToBuffer(imageUrl);
      buffer = downloaded.buffer;
      contentType = downloaded.contentType;
    } catch (error) {
      console.error(
        `[api/recipes/upload-image] external download failed (url=${imageUrl.slice(0, 160)}): ${error?.message}`
      );
      return NextResponse.json(
        { error: error?.message || "Generated image could not be downloaded." },
        { status: error?.status ?? 502 }
      );
    }
  } else {
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
      return NextResponse.json({ error: "Image format is not supported." }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Image is larger than 8 MB." }, { status: 400 });
    }

    buffer = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffImageType(buffer);
    if (!sniffed || sniffed !== declaredMime) {
      return NextResponse.json(
        { error: "That file does not appear to be a valid image" },
        { status: 400 }
      );
    }
    contentType = sniffed;
  }

  // Provision the bucket if missing/private. This does not bypass RLS — the
  // actual upload below still runs as the authenticated user.
  await ensureStorageBucket(BUCKET, { public: true });

  const path = buildStoragePath(user.id, contentType);

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });

  if (uploadError) {
    console.error(
      `[api/recipes/upload-image] storage upload failed (bucket="${BUCKET}", path="${path}", bytes=${buffer.length}, type=${contentType}): ${uploadError.message}`
    );
    return NextResponse.json(
      { error: "Could not save image to storage.", code: "SAVE_FAILED" },
      { status: 500 }
    );
  }

  const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  if (!url) {
    console.error(`[api/recipes/upload-image] could not resolve a URL for path "${path}".`);
    return NextResponse.json(
      { error: "Could not save image to storage.", code: "SAVE_FAILED" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url, path });
}
