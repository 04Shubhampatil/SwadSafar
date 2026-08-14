"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BadgeCheck,
  Bookmark,
  ChevronDown,
  Clock,
  Eye,
  Flame,
  Heart,
  Link2,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Users,
} from "lucide-react";
import PostCarousel from "./PostCarousel";
import { CommentSkeleton } from "@/components/loading-skeletons";
import { useAuth } from "@/lib/useAuth";

const DIFFICULTY_HEAT = { Easy: 1, Medium: 2, Hard: 3 };

function HighlightedContent({ content }) {
  const parts = content.split(/(#[A-Za-z0-9_]+)/g);
  return (
    <>
      {parts.map((part, index) =>
        /^#[A-Za-z0-9_]+$/.test(part) ? (
          <span key={index} className="font-semibold text-orange-600">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export default function CommunityPostCard({ post }) {
  const router = useRouter();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(Boolean(post.liked));
  const [likesCount, setLikesCount] = useState(
    Number(post.likesCount ?? post.stats?.likes) || 0,
  );
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(
    Number(post.commentsCount ?? post.stats?.comments) || 0,
  );
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [liking, setLiking] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const commentsLoaded = useRef(false);

  // Seed/demo posts have no uuid - only real Supabase posts are persisted.
  const postId = post.id && /^[0-9a-f-]{36}$/i.test(post.id) ? post.id : null;

  const saveCount = (post.stats?.saves ?? 0) + (saved ? 1 : 0);
  const shareCount = (post.stats?.shares ?? 0) + (shared ? 1 : 0);

  const isLong = post.content.length > 180 || post.content.includes("\n");

  const requireAuth = () => {
    if (user) return true;
    router.push("/sign-in?redirectTo=/community");
    return false;
  };

  const toggleLike = async () => {
    if (liking) return;
    if (!postId) {
      setLiked((current) => !current);
      setLikesCount((current) => current + (liked ? -1 : 1));
      return;
    }
    if (!requireAuth()) return;

    const next = !liked;
    const prevCount = likesCount;
    setLiked(next);
    setLikesCount((current) => current + (next ? 1 : -1));
    setLiking(true);

    try {
      const res = await fetch("/api/community/likes", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.status === 401) {
        router.push("/sign-in?redirectTo=/community");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not update like");
        setLiked(!next);
        setLikesCount(prevCount);
      }
    } catch {
      toast.error("Network error - please try again");
      setLiked(!next);
      setLikesCount(prevCount);
    } finally {
      setLiking(false);
    }
  };

  useEffect(() => {
    if (!showComments || !postId || commentsLoaded.current) return;
    let cancelled = false;
    const run = async () => {
      await null;
      if (cancelled || commentsLoaded.current) return;
      commentsLoaded.current = true;
      setCommentsLoading(true);
      try {
        const res = await fetch(`/api/community/comments?postId=${postId}`);
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!cancelled && Array.isArray(data.comments)) {
            setComments(data.comments);
            setCommentCount(data.comments.length);
          }
        }
      } catch {
        commentsLoaded.current = false;
      } finally {
        if (!cancelled) setCommentsLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [showComments, postId]);

  const handleShare = () => {
    setShared(true);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (commentSubmitting) return;
    const text = commentText.trim();
    if (!text) return;
    if (!requireAuth()) return;

    setCommentText("");
    if (!postId) {
      setComments((current) => [{ id: Date.now(), text, author: null }, ...current]);
      setCommentCount((current) => current + 1);
      return;
    }

    const prev = comments;
    setCommentSubmitting(true);
    setComments((current) => [{ id: "pending", text, author: null }, ...current]);
    setCommentCount((current) => current + 1);

    try {
      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text }),
      });
      if (res.status === 401) {
        router.push("/sign-in?redirectTo=/community");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Could not add your comment");
        setComments(prev);
        setCommentCount((current) => Math.max(0, current - 1));
        return;
      }
      setComments((current) => current.map((comment) => (comment.id === "pending" ? data.comment : comment)));
    } catch {
      toast.error("Network error - please try again");
      setComments(prev);
      setCommentCount((current) => Math.max(0, current - 1));
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-neutral-100/90 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(111,80,50,0.12)] transition-shadow duration-300 hover:shadow-[0_24px_48px_-16px_rgba(111,80,50,0.2)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="rounded-full bg-gradient-to-br from-orange-400 via-amber-400 to-orange-300 p-[2px]">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-11 w-11 rounded-full border-2 border-white object-cover sm:h-12 sm:w-12"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-1.5 py-[1px] text-[9px] font-black text-white shadow-sm">
              Lv {post.author.level}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
              <h3 className="truncate text-sm font-bold text-[#1c1917]">{post.author.name}</h3>
              {post.author.verified && (
                <BadgeCheck size={15} className="shrink-0 fill-orange-500 text-white" aria-label="Verified chef" />
              )}
              <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-600">
                {post.author.levelName}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-[#a39a90]">
              <span className="truncate">{post.author.handle}</span>
              <span aria-hidden="true">·</span>
              <span>{post.author.timeAgo}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#8c827a]">
              <Users size={11} className="text-orange-500" />
              {post.author.followers} followers
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-3 py-1 text-[11px] font-bold text-orange-700 ring-1 ring-orange-200/70 sm:inline-flex">
            {post.category}
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((current) => !current)}
              aria-label="More options"
              aria-expanded={showMenu}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#a39a90] transition-colors hover:bg-neutral-100 hover:text-[#1c1917]"
            >
              <MoreHorizontal size={18} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  className="absolute right-0 top-11 z-30 w-44 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-1.5 shadow-xl"
                  role="menu"
                >
                  {["Report post", "Copy link", "Mute author", "Share to collection"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      role="menuitem"
                      onClick={() => setShowMenu(false)}
                      className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-neutral-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-3.5">
        <p
          className={`whitespace-pre-line text-sm leading-relaxed text-[#44403c] sm:text-[15px] ${
            isLong && !expanded ? "line-clamp-3" : ""
          }`}
        >
          <HighlightedContent content={post.content} />
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="mt-1 inline-flex items-center gap-0.5 text-xs font-bold text-orange-600 transition-colors hover:text-orange-700"
          >
            {expanded ? "Show less" : "Show more"}
            <ChevronDown size={13} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {post.images && post.images.length > 0 && (
        <div className="mt-4">
          <PostCarousel images={post.images} title={`${post.author.name}'s post`} />
        </div>
      )}

      {post.poll && (
        <div className="mt-4 rounded-2xl border border-neutral-100 bg-[#faf8f4] p-4">
          <p className="text-sm font-bold text-[#1c1917]">Which one should I cook next?</p>
          <div className="mt-3 space-y-2">
            {post.poll.options.map((option, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5">
                <div
                  className="absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100"
                  style={{ width: index === 0 ? "64%" : index === 1 ? "36%" : "18%" }}
                />
                <span className="relative text-xs font-bold text-[#1c1917]">
                  {option} <span className="ml-1 font-semibold text-orange-600">{index === 0 ? "64%" : index === 1 ? "36%" : "18%"}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-[11px] font-medium text-[#a39a90]">1,204 votes · 2 days left</p>
        </div>
      )}

      {post.recipe && (
        <div className="mt-4 overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-[0_18px_36px_-14px_rgba(111,80,50,0.25)]">
          <div className="flex items-stretch">
            <div className="relative w-28 shrink-0 overflow-hidden sm:w-36">
              <img
                src={post.recipe.image}
                alt={post.recipe.title}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="flex-1 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">Recipe</p>
              <h4 className="mt-0.5 text-sm font-extrabold leading-snug text-[#1c1917]">{post.recipe.title}</h4>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-[#8c827a]">
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} className="text-orange-500" /> {post.recipe.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Flame size={12} className="text-orange-500" />
                  {"🔥".repeat(DIFFICULTY_HEAT[post.recipe.difficulty] || 1)}
                  <span className="sr-only">{post.recipe.difficulty}</span>
                </span>
                <span>{post.recipe.servings} servings</span>
                <span>{post.recipe.calories} kcal</span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {post.recipe.ingredients.slice(0, 4).map((ingredient) => (
                  <span key={ingredient} className="rounded-full bg-[#faf8f4] px-2 py-0.5 text-[10px] font-semibold text-[#6b6157]">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-1 border-t border-neutral-100 pt-3">
        <ActionButton
          label="Like"
          active={liked}
          activeClass="text-rose-500"
          count={likesCount}
          onClick={toggleLike}
          busy={liking}
          icon={(active, busy) =>
            busy ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Heart size={19} className={active ? "fill-rose-500" : ""} />
            )
          }
        />
        <ActionButton
          label="Comment"
          active={showComments}
          activeClass="text-orange-600"
          count={commentCount}
          onClick={() => setShowComments((current) => !current)}
          icon={() => <MessageCircle size={19} />}
        />
        <ActionButton
          label="Share"
          active={shared}
          activeClass="text-emerald-600"
          count={shareCount}
          onClick={handleShare}
          icon={(active) => <Share2 size={19} className={active ? "fill-emerald-500" : ""} />}
        />
        <ActionButton
          label="Save"
          active={saved}
          activeClass="text-orange-500"
          count={saveCount}
          onClick={() => setSaved((current) => !current)}
          icon={(active) => <Bookmark size={19} className={active ? "fill-orange-500" : ""} />}
        />

        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#a39a90]">
          <Eye size={14} />
          {(post.stats?.views ?? 0).toLocaleString("en-US")} views
        </span>
      </div>

      <AnimatePresence>
        {copied && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-bold text-white"
          >
            <Link2 size={12} className="text-orange-400" /> Link copied
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {commentsLoading && comments.length === 0 && (
                <div className="space-y-2">
                  {[0, 1, 2].map((index) => (
                    <CommentSkeleton key={index} />
                  ))}
                </div>
              )}
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5">
                  <img
                    src={comment.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"}
                    alt={comment.author?.name || "Comment author"}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                  />
                  <div className="rounded-2xl rounded-tl-sm bg-[#faf8f4] px-3.5 py-2">
                    <p className="text-[11px] font-bold text-[#1c1917]">{comment.author?.name || "You"}</p>
                    <p className="text-xs leading-relaxed text-[#44403c]">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleComment} className="mt-3 flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                alt="You"
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                aria-label="Add a comment"
                className="min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs text-[#1c1917] outline-none transition-colors focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              />
              <button
                type="submit"
                aria-label="Post comment"
                disabled={!commentText.trim() || commentSubmitting}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {commentSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

function ActionButton({ label, icon, count, active, activeClass, onClick, busy = false }) {
  const ref = useRef(null);

  const spawnRipple = (event) => {
    const el = ref.current;
    if (!el || busy) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const ripple = document.createElement("span");
    ripple.className = "fd-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 850);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onPointerDown={spawnRipple}
      onClick={onClick}
      whileTap={{ scale: busy ? 1 : 0.82 }}
      aria-label={label}
      aria-pressed={active}
      disabled={busy}
      className={`fd-ripple-host inline-flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors duration-200 ${
        active ? `${activeClass} bg-orange-50/70` : "text-[#8c827a] hover:text-[#1c1917]"
      } ${busy ? "cursor-not-allowed opacity-70" : ""}`}
    >
      {icon(active, busy)}
      <motion.span
        key={count}
        initial={{ scale: 1.45, y: -2 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className="text-xs font-bold tabular-nums"
      >
        {count.toLocaleString("en-US")}
      </motion.span>
    </motion.button>
  );
}
