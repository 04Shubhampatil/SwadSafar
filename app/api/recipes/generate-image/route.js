import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureStorageBucket } from "@/lib/supabase/admin";
import { getServerUser } from "@/lib/profile";
import { generateImageRequestSchema } from "@/lib/validations/recipe";
import { generateFoodImage, ImageGenerationError, buildStoragePath } from "@/lib/ai/image";
import { consumeRateLimit } from "@/lib/rate-limit";

const IMAGE_RATE_LIMIT = Number(process.env.IMAGE_RATE_LIMIT) || 10;
const IMAGE_RATE_WINDOW_MS = Number(process.env.IMAGE_RATE_WINDOW_MS) || 60 * 60 * 1000;
const BUCKET = process.env.RECIPE_IMAGES_BUCKET || "recipe-images";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * POST /api/recipes/generate-image
 *
 * Generates a food photograph with Pollinations Z-Image Turbo and stores it in
 * Supabase Storage under recipe-images/<user-id>/<unique>.jpg|png|webp.
 *
 * Pipeline:
 *   1. Supabase authentication (401 if no user)
 *   2. Input validation via zod (400)
 *   3. Server-side rate limiting by user id (429)
 *   4. Controlled prompt built from validated recipe fields (injection-safe)
 *   5. Pollinations Z-Image Turbo (model: zimage)
 *   6. Image validation (type, size, signature)
 *   7. Upload to Supabase Storage (user id always comes from the session)
 *   8. Return the public URL
 *
 * Body: { recipe: { title, description, cuisine, ingredients } }
 * Response: { imageUrl, path }
 */
export async function POST(request) {
  const supabase = await createClient();
  const user = await getServerUser(supabase);
  if (!user) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = generateImageRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid recipe" },
      { status: 400 }
    );
  }

  const { allowed, resetAt } = consumeRateLimit(`image:${user.id}`, {
    limit: IMAGE_RATE_LIMIT,
    windowMs: IMAGE_RATE_WINDOW_MS,
  });
  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "You've hit the image generation limit. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let generated;
  try {
    generated = await generateFoodImage({ recipe: parsed.data.recipe });
  } catch (error) {
    // Log for diagnosis but never leak keys, provider errors, or stack traces.
    console.error("[api/recipes/generate-image]", error?.message);
    if (error instanceof ImageGenerationError) {
      return NextResponse.json(
        { error: "Unable to generate the food image right now. Please try again." },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: "Unable to generate the food image right now. Please try again." },
      { status: 502 }
    );
  }

  // STEP 2: persist to Supabase Storage. The bucket is provisioned first (if
  // missing/private) with the service-role client, but the upload itself runs
  // as the authenticated user so RLS ownership policies still apply.
  await ensureStorageBucket(BUCKET, { public: true });

  const path = buildStoragePath(user.id, generated.contentType);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, generated.buffer, {
      contentType: generated.contentType,
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    console.error(
      `[api/recipes/generate-image] storage upload failed (bucket="${BUCKET}", path="${path}", bytes=${generated.buffer.length}, type=${generated.contentType}): ${uploadError.message}`
    );
    return NextResponse.json(
      { error: "Could not save the generated image. Please try again.", code: "SAVE_FAILED" },
      { status: 500 }
    );
  }

  const imageUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  if (!imageUrl) {
    console.error(`[api/recipes/generate-image] could not resolve a URL for path "${path}".`);
    return NextResponse.json(
      { error: "Could not save the generated image. Please try again.", code: "SAVE_FAILED" },
      { status: 500 }
    );
  }

  return NextResponse.json({ imageUrl, path });
}
