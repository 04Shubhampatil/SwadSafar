"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Bot,
  CalendarClock,
  Check,
  CircleDot,
  Crown,
  Flame,
  Hash,
  Loader2,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import CommunityStats from "./CommunityStats";
import CommunityRecipePreview from "./CommunityRecipePreview";
import { HERO_STATS, ACTIVITY, ACTIVE_MEMBERS, EVENTS, LEADERBOARD, POPULAR_TAGS, TOP_CHEFS } from "./communityData";
import { useAuth } from "@/lib/useAuth";

export default function Sidebar() {
  return (
    <aside aria-label="Community sidebar" className="flex flex-col gap-4">
      <SectionCard icon={<Bot size={15} />} title="AI Recipe Assistant">
        <AiAssistant />
      </SectionCard>
      <SectionCard icon={<TrendingUp size={15} />} title="Trending topics">
        <TrendingTopics />
      </SectionCard>
      <SectionCard icon={<Users size={15} />} title="Community stats">
        <CommunityStats stats={HERO_STATS} variant="compact" />
      </SectionCard>
      <SectionCard icon={<CircleDot size={15} />} title="Active right now">
        <ActiveUsers />
      </SectionCard>
      <SectionCard icon={<Sparkles size={15} />} title="Suggested to follow">
        <SuggestedChefs />
      </SectionCard>
      <SectionCard icon={<CalendarClock size={15} />} title="Cooking events">
        <EventsList />
      </SectionCard>
      <SectionCard icon={<Crown size={15} />} title="Top contributors">
        <Leaderboard />
      </SectionCard>
      <SectionCard icon={<Activity size={15} />} title="Recent activity">
        <ActivityList />
      </SectionCard>
      <SectionCard icon={<Hash size={15} />} title="Popular tags">
        <PopularTags />
      </SectionCard>
    </aside>
  );
}

function SectionCard({ icon, title, children }) {
  return (
    <section className="rounded-3xl border border-neutral-100/90 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(111,80,50,0.12)]">
      <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#8c827a]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function AiAssistant() {
  const router = useRouter();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState("idle");
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  const reset = () => {
    setRecipe(null);
    setPhase("idle");
    setPrompt("");
    setError("");
  };

  const generate = async (e) => {
    e.preventDefault();
    if (phase !== "idle" || !prompt.trim()) return;
    if (!user) {
      router.push("/sign-in?redirectTo=/community");
      return;
    }
    setError("");
    setPhase("thinking");
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "dish", prompt, recipe: {} }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.push("/sign-in?redirectTo=/community");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Couldn't generate a recipe");
        setPhase("idle");
        return;
      }
      setRecipe(data.result?.fill ?? null);
      setPhase("done");
    } catch {
      setError("Network error — please try again");
      setPhase("idle");
    }
  };

  return (
    <div>
      <div className="min-h-[40px]">
        <AnimatePresence>
          {phase === "thinking" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2 rounded-2xl rounded-tl-sm bg-gradient-to-br from-orange-50 to-amber-50 px-3.5 py-3 text-xs font-semibold text-orange-600 ring-1 ring-orange-100"
            >
              <Loader2 size={14} className="animate-spin" /> AI chef is whipping something up…
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-2 rounded-2xl bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-100"
            >
              {error}
              <button
                type="button"
                aria-label="Dismiss error"
                onClick={() => setError("")}
                className="text-rose-400 hover:text-rose-600"
              >
                <X size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <form onSubmit={generate} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Try "What should I cook tonight?"'
          aria-label="Ask the AI chef assistant"
          disabled={phase !== "idle"}
          className="min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs text-[#1c1917] outline-none transition-colors focus:border-orange-300 focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
        />
        <button
          type="submit"
          aria-label="Ask assistant"
          disabled={!prompt.trim() || phase !== "idle"}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm transition-all hover:shadow-md active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Dinner ideas", "Meal prep", "Vegan swap"].map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => setPrompt(chip.toLowerCase())}
            className="rounded-full bg-[#faf8f4] px-3 py-1.5 text-[11px] font-semibold text-[#8c827a] transition-colors hover:bg-orange-50 hover:text-orange-700"
          >
            {chip}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {recipe && phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <CommunityRecipePreview recipe={recipe} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TrendingTopics() {
  const topics = [
    { tag: "#biryaninational", posts: "12.4k", share: 100 },
    { tag: "#sundaybrunch", posts: "8.1k", share: 78 },
    { tag: "#30minutemeals", posts: "6.7k", share: 64 },
    { tag: "#sourdoughchronicles", posts: "4.9k", share: 46 },
    { tag: "#streetfoodatHome", posts: "3.2k", share: 31 },
  ];
  return (
    <ul className="space-y-3">
      {topics.map((topic, index) => (
        <li key={topic.tag}>
          <button
            type="button"
            className="group w-full text-left"
            onClick={() => {}}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold text-[#1c1917] transition-colors group-hover:text-orange-600">
                <TrendingUp size={12} className={index === 0 ? "text-rose-500" : "text-orange-400"} />
                {topic.tag}
              </span>
              <span className="text-[11px] font-semibold text-[#a39a90]">{topic.posts}</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-500 group-hover:from-orange-500 group-hover:to-amber-500"
                style={{ width: `${topic.share}%` }}
              />
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function ActiveUsers() {
  return (
    <div>
      <div className="flex -space-x-2.5">
        {ACTIVE_MEMBERS.map((member) => (
          <img
            key={member.name}
            src={member.avatar}
            alt={member.name}
            className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
          />
        ))}
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-orange-100 text-[10px] font-black text-orange-700">
          +2k
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-[#8c827a]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        2,431 members cooking right now
      </div>
    </div>
  );
}

function SuggestedChefs() {
  const [following, setFollowing] = useState({});
  return (
    <ul className="space-y-3.5">
      {TOP_CHEFS.map((chef) => {
        const isFollowing = Boolean(following[chef.handle]);
        return (
          <li key={chef.handle} className="flex items-center gap-3">
            <img src={chef.avatar} alt={chef.name} className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-orange-100" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[#1c1917]">
                {chef.name}
                {chef.verified && (
                  <span className="ml-1 align-middle text-orange-500">✓</span>
                )}
              </p>
              <p className="truncate text-[11px] font-medium text-[#a39a90]">{chef.bio}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFollowing((f) => ({ ...f, [chef.handle]: !f[chef.handle] }))
              }
              aria-pressed={isFollowing}
              className={[
                "inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all duration-200 active:scale-90",
                isFollowing
                  ? "border border-neutral-200 bg-white text-neutral-700"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_8px_18px_-6px_rgba(249,115,22,0.5)] hover:-translate-y-0.5",
              ].join(" ")}
            >
              {isFollowing ? (
                <>
                  <Check size={12} /> Following
                </>
              ) : (
                "Follow"
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function EventsList() {
  return (
    <ul className="space-y-3">
      {EVENTS.map((event) => (
        <li
          key={event.title}
          className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-100 bg-[#faf8f4] p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-md"
        >
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <img src={event.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {event.live && (
              <span className="absolute left-1 top-1 rounded-md bg-rose-500 px-1.5 py-0.5 text-[9px] font-black text-white">
                LIVE
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-[#1c1917]">{event.title}</p>
            <p className="text-[11px] font-medium text-[#8c827a]">
              {event.host} · {event.viewers.toLocaleString("en-US")} watching
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-orange-600">
              {event.date} · {event.time}
            </p>
          </div>
          <span className="rounded-full border border-neutral-200 bg-white px-2 py-1 text-[10px] font-bold text-[#8c827a] transition-colors group-hover:border-orange-300 group-hover:text-orange-700">
            RSVP
          </span>
        </li>
      ))}
    </ul>
  );
}

function Leaderboard() {
  const rankStyle = [
    "bg-amber-100 text-amber-700",
    "bg-neutral-100 text-neutral-600",
    "bg-orange-100 text-orange-700",
  ];
  return (
    <ol className="space-y-2.5">
      {LEADERBOARD.slice(0, 4).map((entry) => (
        <li key={entry.rank} className="flex items-center gap-3">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black ${
              rankStyle[entry.rank - 1] || "bg-neutral-50 text-neutral-500"
            }`}
          >
            {entry.rank}
          </span>
          <img src={entry.avatar} alt={entry.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-[#1c1917]">{entry.name}</p>
            <p className="flex items-center gap-1 text-[10px] font-semibold text-[#a39a90]">
              <Flame size={10} className="text-orange-500" /> {entry.streak} day streak
            </p>
          </div>
          <span className="text-[11px] font-black tabular-nums text-orange-600">
            {entry.points.toLocaleString("en-US")}
          </span>
        </li>
      ))}
    </ol>
  );
}

function ActivityList() {
  return (
    <ul className="space-y-3">
      {ACTIVITY.map((item) => (
        <li key={item.text} className="flex items-start gap-2.5">
          <img src={item.avatar} alt="" className="mt-0.5 h-8 w-8 shrink-0 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="text-xs leading-relaxed text-[#44403c]">
              <span className="font-bold text-[#1c1917]">{item.text.split(" ").slice(0, 2).join(" ")}</span>
              {" "}
              <span className="text-[#6b6157]">{item.text.split(" ").slice(2).join(" ")}</span>
            </p>
            <p className="mt-0.5 text-[10px] font-semibold text-[#b3a798]">{item.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PopularTags() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {POPULAR_TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#6b6157] transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
