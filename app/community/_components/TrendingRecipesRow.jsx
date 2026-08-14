"use client";

import { motion } from "framer-motion";
import { Clock, Flame, Heart, TrendingUp } from "lucide-react";
import { TRENDING_RECIPES } from "./communityData";
import ScrollRow from "./ScrollRow";

export default function TrendingRecipesRow() {
  return (
    <div>
      <ScrollRow label="Trending recipes today" icon={<TrendingUp size={17} />}>
        {TRENDING_RECIPES.map((recipe, index) => (
          <motion.article
            key={recipe.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group w-56 shrink-0 snap-start cursor-pointer overflow-hidden rounded-3xl border border-neutral-100/90 bg-white shadow-[0_10px_30px_-12px_rgba(111,80,50,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(249,115,22,0.3)] sm:w-64"
          >
            <div className="relative h-40 overflow-hidden sm:h-44">
              <img
                src={recipe.image}
                alt={recipe.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10" />
              <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold text-[#1c1917] backdrop-blur-sm">
                {recipe.category}
              </span>
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                <Heart size={11} className="fill-rose-400 text-rose-400" />
                {recipe.likes.toLocaleString("en-US")}
              </span>
            </div>
            <div className="p-3.5">
              <h3 className="truncate text-sm font-extrabold text-[#1c1917]">{recipe.title}</h3>
              <p className="mt-0.5 text-[11px] font-semibold text-[#a39a90]">by {recipe.author}</p>
              <div className="mt-2.5 flex items-center gap-3 text-[11px] font-semibold text-[#8c827a]">
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} className="text-orange-500" /> {recipe.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Flame size={12} className="text-orange-500" />
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </ScrollRow>
    </div>
  );
}
