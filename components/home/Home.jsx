import React from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '../HeroSection'
import { createClient } from "@/lib/supabase/server"
import { getServerUser } from "@/lib/profile"
import { normalizeCatalogRecipe, normalizeDbRecipe } from "@/lib/recipe-data"
import sampleRecipes from "@/json/recipes.json"

const TrendingRecipes = dynamic(() => import('../TrendingRecipes'), {
  loading: () => <TrendingRecipesSkeleton />,
})

const AiChefBanner = dynamic(() => import('../AiChefBanner'), {
  loading: () => <AiChefBannerSkeleton />,
})

function TrendingRecipesSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#FFF9F3] py-16 lg:py-24" aria-hidden="true">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        <div className="flex flex-col gap-10">
          <div className="h-10 w-full max-w-md animate-pulse rounded-full bg-[#ead9c2]" />
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="h-3 w-32 animate-pulse rounded-full bg-[#ead9c2]" />
              <div className="h-9 w-72 animate-pulse rounded-xl bg-[#ead9c2]" />
              <div className="h-3 w-56 animate-pulse rounded-full bg-[#f0e2d0]" />
            </div>
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#ead9c2]" />
          </div>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="aspect-[3/4] animate-pulse rounded-[24px] border border-white/70 bg-white/70 shadow-[0_14px_34px_rgba(111,80,50,0.09)]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AiChefBannerSkeleton() {
  return (
    <section className="relative overflow-hidden bg-[#FFF9F3] py-14 lg:py-20" aria-hidden="true">
      <div className="relative mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
        <div className="relative h-72 animate-pulse overflow-hidden rounded-[36px] bg-[#0b1f15]/80 lg:h-80" />
      </div>
    </section>
  );
}

const Home = async () => {
  const supabase = await createClient();
  const currentUser = await getServerUser(supabase);
  const currentUserId = currentUser?.id ?? null;

  let userRecipes = [];

  if (currentUserId) {
    try {
      const { data: dbData } = await supabase
        .from("recipes")
        .select("id, title, image, cuisine, prep_time, difficulty, rating, user_id, created_at, status")
        .eq("status", "published")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (dbData && dbData.length > 0) {
        const userIds = [...new Set(dbData.map(r => r.user_id).filter(Boolean))];
        let profilesMap = {};
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, full_name, username, avatar_url")
            .in("user_id", userIds);
          if (profiles) {
            profiles.forEach(p => { profilesMap[p.user_id] = p; });
          }
        }
        userRecipes = dbData.map(r => normalizeDbRecipe(r, profilesMap[r.user_id]));
      }
    } catch (error) {
      console.error("Error fetching recipes for Home:", error);
    }
  }

  const currentUserRecipes = userRecipes.filter(
    recipe => recipe.userId === currentUserId
  );

  // Sort the current user's recipes by createdAt descending (newest first)
  const sortedCurrentUserRecipes = [...currentUserRecipes].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  const userLimit = Math.min(sortedCurrentUserRecipes.length, 4);
  const jsonLimit = 4 - userLimit;

  const trendingUserRecipes = sortedCurrentUserRecipes.slice(0, userLimit);

  const trendingJsonRecipes = sampleRecipes
    .slice(0, jsonLimit)
    .map((recipe, index) => normalizeCatalogRecipe(recipe, index));

  const trendingRecipes = [...trendingUserRecipes, ...trendingJsonRecipes];

  // console.log("Current user ID:", currentUserId);
  // console.log("Current user recipes:", currentUserRecipes.length);
  // console.log("Trending recipe:", trendingRecipes[0]);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <TrendingRecipes recipes={trendingRecipes} />
      <AiChefBanner />
    </main>
  )
}

export default Home
