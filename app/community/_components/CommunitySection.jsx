"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, CheckCircle2, Loader2, PenLine, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CommunityHero from "./CommunityHero";
import CommunityPostCard from "./CommunityPostCard";
import WeeklyChallenge from "./WeeklyChallenge";
import Sidebar from "./Sidebar";
import { useAuth } from "@/lib/useAuth";
import { PostSkeleton } from "@/components/loading-skeletons";

const CreatePostCard = dynamic(() => import("./CreatePostCard"), {
  loading: () => <CreatePostCardSkeleton />,
});

function CreatePostCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_12px_30px_rgba(111,80,50,0.08)]"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#f0e2d0]" />
        <div className="min-h-14 flex-1 animate-pulse rounded-2xl bg-[#f0e2d0]" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="h-9 w-9 animate-pulse rounded-full bg-[#f0e2d0]" />
          ))}
        </div>
        <div className="h-9 w-24 animate-pulse rounded-full bg-[#ead9c2]" />
      </div>
    </div>
  );
}

const EMPTY_DRAFT = { content: "", category: "Dinner", images: [], poll: null, recipe: null };

const FILTERS = ["Latest", "Trending", "Following"];

export default function CommunitySection() {
  const router = useRouter();
  const { user } = useAuth();
  const composerRef = useRef(null);
  const feedRef = useRef(null);
  const sentinelRef = useRef(null);
  const touchStartY = useRef(null);
  const [pullDistance, setPullDistance] = useState(0);

  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [activeFilter, setActiveFilter] = useState("Latest");
  const [refreshState, setRefreshState] = useState("idle");
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [allCaughtUp, setAllCaughtUp] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const postingRef = useRef(false);

  // Load the real feed from Supabase on mount. The demo seed posts remain a
  // fallback so the page never looks empty (fresh DB, offline, guest).
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await null; // keep setState out of the synchronous effect body
      if (cancelled) return;
      try {
        const res = await fetch("/api/community/posts");
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
          setAllCaughtUp(data.posts.length === 0);
        }
      } catch {
        setPosts([]);
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const focusComposer = () => {
    // Require auth to start composing a post
    if (!user) {
      router.push("/sign-in?redirectTo=/community");
      return;
    }
    composerRef.current?.focus();
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    // Require auth to publish a post
    if (!user) {
      router.push("/sign-in?redirectTo=/community");
      return;
    }
    if (postingRef.current) return;
    const content = draft.content.trim();
    const hasContent = content.length > 0;
    const hasMedia = draft.images.length > 0;
    const hasRecipe = Boolean(draft.recipe);
    const pollOptions = (draft.poll?.options || []).filter((o) => o.trim());
    const hasPoll = pollOptions.length >= 2;

    if (!hasContent && !hasMedia && !hasRecipe && !hasPoll) {
      composerRef.current?.focus();
      return;
    }

    postingRef.current = true;
    try {
      // Local previews are blob/data URLs — push them to storage so the post
      // can reference a stable public URL. Static assets (GIFs) are kept as-is.
      const imageUrls = [];
      for (const image of draft.images) {
        if (!/^data:/.test(image.src)) {
          imageUrls.push(image.src);
          continue;
        }
        const blob = await (await fetch(image.src)).blob();
        const ext = (blob.type?.split("/")[1] || "jpg").replace(/^jpeg$/, "jpg");
        const file = new File([blob], `post-${Date.now()}.${ext}`, {
          type: blob.type || "image/jpeg",
        });
        const form = new FormData();
        form.append("file", file);
        const upRes = await fetch("/api/recipes/upload-image", { method: "POST", body: form });
        if (upRes.status === 401) {
          router.push("/sign-in?redirectTo=/community");
          return;
        }
        const upData = await upRes.json().catch(() => ({}));
        if (!upRes.ok) {
          toast.error(upData.error || "Couldn't upload your photo — please try again");
          return;
        }
        imageUrls.push(upData.url);
      }

      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content || "Shared a new post ✨",
          category: draft.category,
          images: imageUrls,
          poll: hasPoll ? { options: pollOptions } : null,
        }),
      });
      if (res.status === 401) {
        router.push("/sign-in?redirectTo=/community");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not create your post");
        return;
      }
      setPosts((current) => [data.post, ...current]);
      setDraft(EMPTY_DRAFT);
      composerRef.current?.focus();
      toast.success("Post published!");
    } catch {
      toast.error("Network error — please try again");
    } finally {
      postingRef.current = false;
    }
  };

  const refresh = async () => {
    if (refreshState !== "idle") return;
    setRefreshState("refreshing");
    try {
      const res = await fetch("/api/community/posts");
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
          setAllCaughtUp(data.posts.length === 0);
        }
      }
      setRefreshState("done");
    } catch {
      setRefreshState("idle");
    }
    window.setTimeout(() => setRefreshState("idle"), 1600);
  };

  const loadMore = () => {
    if (loadingMore || allCaughtUp) return;
    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((count) => {
        const next = count + 2;
        if (next >= posts.length) setAllCaughtUp(true);
        return next;
      });
      setLoadingMore(false);
    }, 800);
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingMore, allCaughtUp]);

  const onTouchStart = (e) => {
    if (window.scrollY <= 0) touchStartY.current = e.touches[0].clientY;
    else touchStartY.current = null;
  };

  const onTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    const pull = Math.max(0, Math.min(delta, 110));
    setPullDistance(pull);
    setRefreshState(pull > 70 ? "release" : "pulling");
  };

  const onTouchEnd = () => {
    if (pullDistance > 70) refresh();
    setPullDistance(0);
    touchStartY.current = null;
    setRefreshState("idle");
  };

  return (
    <main
      className="min-h-screen bg-[#FFF9F3] px-4 py-8 text-[#1c1917] md:px-6 lg:px-10"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Hero */}
        <CommunityHero onScrollToComposer={focusComposer} />

        {/* Weekly challenge */}
        <WeeklyChallenge />

        {/* Pull-to-refresh indicator */}
        <div className="flex h-0 justify-center overflow-visible">
          <AnimatePresence>
            {refreshState === "pulling" || refreshState === "release" || refreshState === "refreshing" ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="relative z-10 -translate-y-4"
              >
                <motion.div
                  animate={{ rotate: refreshState === "refreshing" ? 360 : 0 }}
                  transition={
                    refreshState === "refreshing"
                      ? { repeat: Infinity, duration: 0.8, ease: "linear" }
                      : { duration: 0.2 }
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-100 bg-white shadow-lg"
                >
                  {refreshState === "refreshing" ? (
                    <Loader2 size={18} className="text-orange-600" />
                  ) : (
                    <RefreshCw size={18} className="text-orange-600" />
                  )}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Feed + sidebar */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Feed column */}
          <div
            ref={feedRef}
            style={{ transform: `translateY(${pullDistance}px)` }}
            className="min-w-0 transition-transform duration-200 ease-out"
          >
            {/* Feed header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-extrabold tracking-tight text-[#1c1917] sm:text-2xl">
                  Community feed
                </h2>
                <p className="mt-0.5 text-xs font-medium text-[#8c827a]">
                  Recipes, tips &amp; kitchen wins from fellow food lovers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      aria-pressed={activeFilter === filter}
                      className={[
                        "rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-200",
                        activeFilter === filter
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm"
                          : "text-[#8c827a] hover:text-[#1c1917]",
                      ].join(" ")}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={refresh}
                  aria-label="Refresh feed"
                  disabled={refreshState === "refreshing"}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-[#8c827a] shadow-sm transition-all hover:border-orange-300 hover:text-orange-700 disabled:opacity-60"
                >
                  <motion.span
                    animate={{ rotate: refreshState === "refreshing" ? 360 : 0 }}
                    transition={
                      refreshState === "refreshing"
                        ? { repeat: Infinity, duration: 0.8, ease: "linear" }
                        : { duration: 0.2 }
                    }
                  >
                    <RefreshCw size={15} />
                  </motion.span>
                </button>
              </div>
            </div>

            {/* Refreshed toast */}
            <AnimatePresence>
              {refreshState === "done" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200"
                >
                  <CheckCircle2 size={14} /> Feed refreshed
                </motion.div>
              )}
            </AnimatePresence>

            {/* Composer */}
            <CreatePostCard
              draft={draft}
              onDraftChange={setDraft}
              onSubmit={handleCreatePost}
              composerRef={composerRef}
              user={user}
            />

            {/* Posts */}
            <div className="mt-6 space-y-6">
              {initialLoading && posts.length === 0 ? (
                <div className="space-y-6">
                  {[0, 1, 2, 3].map((index) => (
                    <PostSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {posts.slice(0, visibleCount).map((post, index) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={index === 0 ? { opacity: 0, y: -16, scale: 0.98 } : false}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <CommunityPostCard post={post} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {/* Load more sentinel */}
              <div ref={sentinelRef} className="flex flex-col items-center justify-center py-6">
                {loadingMore && (
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#8c827a]">
                    <Loader2 size={15} className="animate-spin text-orange-600" /> Cooking up more posts…
                  </span>
                )}
                {allCaughtUp && !loadingMore && (
                  <p className="text-xs font-semibold text-[#b3a798]">
                    You&apos;re all caught up — check back soon 🍜
                  </p>
                )}
              </div>
            </div>


          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] space-y-4 overflow-y-auto pb-4 pr-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Floating action button */}
      <motion.button
        type="button"
        onClick={focusComposer}
        aria-label="Write a new post"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileTap={{ scale: 0.9 }}
        className="fd-sheen fd-gradient-btn fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_18px_36px_-10px_rgba(249,115,22,0.65)] lg:hidden"
      >
        <PenLine size={22} />
        <span className="absolute inset-0 rounded-full fd-pulse-ring" aria-hidden="true" />
      </motion.button>

      {/* Scroll-to-top */}
      <motion.button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-[#8c827a] shadow-lg backdrop-blur-md transition-colors hover:text-orange-700 lg:flex"
      >
        <ArrowUp size={18} />
      </motion.button>
    </main>
  );
}
