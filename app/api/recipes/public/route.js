import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeDbRecipe } from "@/lib/recipe-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  try {
    const supabase = await createClient();
    const { data, count, error } = await supabase
      .from("recipes")
      .select("id, title, image, cuisine, prep_time, difficulty, rating, user_id, created_at, status", { count: "exact" })
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) {
      console.error("[api/recipes/public] DB error:", error.message);
      return NextResponse.json({ error: "Could not fetch recipes" }, { status: 500 });
    }

    let profilesMap = {};
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map((r) => r.user_id).filter(Boolean))];
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, username, avatar_url")
          .in("user_id", userIds);
        if (profiles) {
          profiles.forEach((p) => {
            profilesMap[p.user_id] = p;
          });
        }
      }
    }

    const recipes = (data || []).map((row) => normalizeDbRecipe(row, profilesMap[row.user_id]));
    const hasMore = end + 1 < (count || 0);
    return NextResponse.json({ recipes, hasMore, count });
  } catch (err) {
    console.error("[api/recipes/public] Server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
