"use client";

import { motion } from "framer-motion";
import { Flame, Layers } from "lucide-react";
import { COLLECTIONS } from "./communityData";
import ScrollRow from "./ScrollRow";

export default function CollectionsRow() {
  return (
    <ScrollRow label="Recipe collections" icon={<Layers size={17} />}>
      {COLLECTIONS.map((collection, index) => (
        <motion.article
          key={collection.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="group relative h-44 w-60 shrink-0 snap-start cursor-pointer overflow-hidden rounded-3xl sm:h-48 sm:w-64"
        >
          <img
            src={collection.cover}
            alt={collection.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              <Flame size={10} className="text-amber-300" />
              {collection.recipes} recipes
            </span>
            <h3 className="mt-1.5 font-display text-base font-extrabold tracking-tight text-white">
              {collection.title}
            </h3>
            <p className="text-[11px] font-semibold text-white/80">
              {collection.members} members cooking together
            </p>
          </div>
        </motion.article>
      ))}
    </ScrollRow>
  );
}
