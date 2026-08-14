import { randomUUID } from "crypto";

/**
 * Server-side Pollinations Z-Image Turbo client for food photography.
 *
 * The model id is `zimage` (Z-Image Turbo). All API credentials stay in the
 * server environment — nothing here is ever imported by a client component.
 *
 * The generated image is returned as a buffer so the API route can upload it
 * to Supabase Storage before the URL is ever handed to the browser. There is
 * no deterministic/local fallback: if the provider fails or returns invalid
 * data, the caller receives an error.
 */

const MODEL = process.env.POLLINATIONS_IMAGE_MODEL || "zimage";
const BASE_URL = process.env.POLLINATIONS_IMAGE_URL || "https://image.pollinations.ai/prompt/";
const API_KEY = process.env.POLLINATIONS_API_KEY || "";
const WIDTH = Number(process.env.POLLINATIONS_IMAGE_WIDTH) || 1024;
const HEIGHT = Number(process.env.POLLINATIONS_IMAGE_HEIGHT) || 1024;
const REQUEST_TIMEOUT_MS = Number(process.env.POLLINATIONS_IMAGE_TIMEOUT_MS) || 90_000;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/**
 * Raised whenever the image provider cannot satisfy a request. `status` is the
 * HTTP status the API route should surface. Nothing about the provider, the
 * key, or stack traces is ever included in the message.
 */
export class ImageGenerationError extends Error {
  constructor(message, { status = 502 } = {}) {
    super(message);
    this.name = "ImageGenerationError";
    this.status = status;
  }
}

/**
 * Raised when a server-side download of an external image URL fails
 * validation (network, unsupported type, over size limit, invalid bytes).
 * `message` is always client-safe and `status` maps to an HTTP status.
 * Extends ImageGenerationError so API routes that already handle generation
 * failures treat download failures the same way.
 */
export class ImageDownloadError extends ImageGenerationError {
  constructor(message, { status = 502 } = {}) {
    super(message, { status });
    this.name = "ImageDownloadError";
  }
}

const asString = (value) => (typeof value === "string" ? value : "");

/**
 * Strips control characters, collapses whitespace and caps length so untrusted
 * client state can never smuggle extra instructions or blow up the prompt.
 */
function sanitize(value, maxLength) {
  return asString(value)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * The fixed, provider-controlled tail of the food-image prompt. This is
 * appended AFTER any recipe content so user-supplied text cannot override the
 * generation rules (prompt-injection protection).
 */
const FIXED_PROMPT_TAIL =
  "\n\n" +
  "Show the finished dish as a single hero food presentation.\n" +
  "The dish must accurately reflect the recipe and its ingredients.\n" +
  "\n" +
  "Style:\n" +
  "professional restaurant food photography,\n" +
  "photorealistic,\n" +
  "natural warm lighting,\n" +
  "realistic food texture,\n" +
  "soft shadows,\n" +
  "subtle depth of field,\n" +
  "premium editorial photography,\n" +
  "high detail,\n" +
  "natural colors,\n" +
  "appetizing presentation.\n" +
  "\n" +
  "Composition:\n" +
  "single main dish,\n" +
  "centered composition,\n" +
  "45-degree camera angle,\n" +
  "close-up food photography,\n" +
  "clean premium background,\n" +
  "minimal props.\n" +
  "\n" +
  "The food should look freshly prepared, realistic and delicious.\n" +
  "\n" +
  "Do not include:\n" +
  "people,\n" +
  "hands,\n" +
  "faces,\n" +
  "text,\n" +
  "letters,\n" +
  "logos,\n" +
  "watermarks,\n" +
  "packaging,\n" +
  "multiple dishes,\n" +
  "duplicate food,\n" +
  "cartoon style,\n" +
  "illustration,\n" +
  "unrealistic ingredients,\n" +
  "CGI appearance.\n" +
  "\n" +
  "Generate only the food photograph.";

/**
 * Builds the full food-image prompt from a validated recipe snapshot. Only
 * structured, sanitized fields are interpolated; the fixed instructions are
 * always appended last so client text cannot override them.
 */
export function buildFoodImagePrompt(recipe) {
  const data = recipe && typeof recipe === "object" ? recipe : {};
  const title = sanitize(data.title, 150) || "a home-cooked dish";
  const description = sanitize(data.description, 1000);
  const cuisine = sanitize(data.cuisine, 80);
  const ingredients = Array.isArray(data.ingredients)
    ? data.ingredients
        .slice(0, 50)
        .map((item) => sanitize(item?.name, 120) || sanitize(item?.quantity, 60))
        .filter(Boolean)
    : [];

  const parts = [
    `Create a highly realistic professional food photography image of ${title}.`,
    "",
    "Recipe description:",
    description || "A delicious home-cooked dish.",
    "",
    "Cuisine:",
    cuisine || "Homemade",
    "",
    "Ingredients:",
    ingredients.length ? ingredients.map((n) => `- ${n}`).join("\n") : "- Fresh ingredients",
    FIXED_PROMPT_TAIL,
  ];

  return parts.join("\n");
}

/**
 * Sniffs the actual image type from a buffer's magic bytes. Returns the MIME
 * type for JPEG/PNG/WebP or null when the bytes do not look like an image.
 * This is the authoritative type used for storage content-type and extension.
 */
export function sniffImageType(buffer) {
  if (!buffer || buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (pngSignature.every((byte, index) => buffer[index] === byte)) {
    return "image/png";
  }

  // WebP: "RIFF" .... "WEBP"
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

/** Detects whether a buffer starts with a valid JPEG/PNG/WebP signature. */
function hasValidImageSignature(buffer) {
  return sniffImageType(buffer) !== null;
}

/**
 * Downloads an external image URL server-side and validates it before the
 * bytes are ever handed to Supabase Storage:
 *   - HTTP status must be ok
 *   - content-type must be an allowed image/* type
 *   - content-length (when present) and the real byte length must not exceed
 *     `maxBytes`
 *   - magic bytes must match a real JPEG/PNG/WebP
 *
 * The returned contentType is derived from the actual bytes (not the header),
 * so the storage object's content-type always matches its contents.
 */
export async function downloadImageToBuffer(
  url,
  { timeoutMs = REQUEST_TIMEOUT_MS, maxBytes = MAX_IMAGE_BYTES } = {}
) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch {
    throw new ImageDownloadError("Generated image could not be downloaded.");
  }

  if (!response.ok) {
    throw new ImageDownloadError("Generated image could not be downloaded.", { status: 502 });
  }

  const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new ImageDownloadError("Image format is not supported.", { status: 415 });
  }

  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new ImageDownloadError("Image is larger than 8 MB.", { status: 413 });
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > maxBytes) {
    throw new ImageDownloadError("Image is larger than 8 MB.", { status: 413 });
  }

  const sniffed = sniffImageType(buffer);
  if (!sniffed) {
    throw new ImageDownloadError("Image format is not supported.", { status: 415 });
  }

  return { buffer, contentType: sniffed };
}

/**
 * Requests a food photograph from Pollinations Z-Image Turbo.
 *
 * @param {{ recipe: object }} input  validated recipe snapshot used to build the prompt
 * @returns {Promise<{ buffer: Buffer, contentType: string }>}
 */
export async function generateFoodImage({ recipe }) {
  const prompt = buildFoodImagePrompt(recipe);
  const url = new URL(BASE_URL + encodeURIComponent(prompt));
  url.searchParams.set("width", String(WIDTH));
  url.searchParams.set("height", String(HEIGHT));
  url.searchParams.set("model", MODEL);
  url.searchParams.set("nologo", "true");
  url.searchParams.set("seed", String(Math.floor(Math.random() * 2 ** 31)));

  let response;
  try {
    response = await fetch(url.toString(), {
      headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : undefined,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ImageGenerationError("Image generation request failed.");
  }

  if (!response.ok) {
    throw new ImageGenerationError("Image generation was rejected.", { status: 502 });
  }

  const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();

  // Pollinations sometimes returns a direct image response, and sometimes a
  // URL string or JSON payload pointing at the generated asset. Handle all
  // three cases before the upload step.
  let buffer = null;
  let resolvedType = contentType;

  if (ALLOWED_CONTENT_TYPES.has(contentType)) {
    buffer = Buffer.from(await response.arrayBuffer());
  } else {
    const text = await response.text();
    let candidate = text.trim();

    if (!candidate) {
      throw new ImageGenerationError("Image generation returned an invalid image.", {
        status: 502,
      });
    }

    if (candidate.startsWith("{") || candidate.startsWith("[")) {
      try {
        const parsed = JSON.parse(candidate);
        candidate =
          parsed?.url ||
          parsed?.image ||
          parsed?.output ||
          parsed?.data?.url ||
          parsed?.data?.image ||
          "";
      } catch {
        candidate = "";
      }
    }

    if (!candidate) {
      throw new ImageGenerationError("Image generation returned an invalid image.", {
        status: 502,
      });
    }

    if (/^https?:\/\//i.test(candidate)) {
      const downloaded = await downloadImageToBuffer(candidate);
      buffer = downloaded.buffer;
      resolvedType = downloaded.contentType;
    }
  }

  if (!buffer) {
    throw new ImageGenerationError("Image generation returned an invalid image.", { status: 502 });
  }

  if (!buffer.length || buffer.length > MAX_IMAGE_BYTES) {
    throw new ImageGenerationError("Image generation returned an invalid image.", { status: 502 });
  }
  if (!hasValidImageSignature(buffer)) {
    throw new ImageGenerationError("Image generation returned an invalid image.", { status: 502 });
  }

  

  return { buffer, contentType: resolvedType || contentType };
}

/** Generates a safe, unique storage filename (extension derived from the image type). */
export function buildStoragePath(userId, contentType) {
  const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  return `${userId}/${Date.now()}-${randomUUID()}.${ext}`;
}
