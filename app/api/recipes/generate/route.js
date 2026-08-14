import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/profile";
import { generateRequestSchema } from "@/lib/validations/recipe";
import { generateRecipeWithMistral, MistralError } from "@/lib/ai/mistral";
import { consumeRateLimit } from "@/lib/rate-limit";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * POST /api/recipes/generate
 *
 * The single AI generation endpoint shared by the Generate Recipe page and
 * the Community AI Assistant. Pipeline:
 *
 *   1. Supabase authentication (401 if no user)
 *   2. Input validation via zod (400)
 *   3. Server-side rate limiting (429)
 *   4. Mistral structured-JSON generation (server env key only)
 *   5. Server-side validation of Mistral output (safe error on failure)
 *
 * Body: { mode, prompt, recipe }  →  Response: { result }
 * `result` has the shape { fill?, appendIngredients?, nutrition? }.
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

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { allowed, resetAt } = consumeRateLimit(`generate:${user.id}`);
  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: "You've hit the AI generation limit. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let result;
  try {
    result = await generateRecipeWithMistral({
      mode: parsed.data.mode,
      prompt: parsed.data.prompt,
      stepText: parsed.data.stepText,
      stepIndex: parsed.data.stepIndex,
      currentRecipe: parsed.data.recipe,
    });
  } catch (error) {
    // Log for diagnosis but never leak keys, provider errors, or stack traces.
    console.error("[api/recipes/generate]", error?.message);
    if (error instanceof MistralError && error.status === 503) {
      return NextResponse.json(
        { error: "AI generation isn't configured yet." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Unable to generate the recipe right now. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ result });
}
