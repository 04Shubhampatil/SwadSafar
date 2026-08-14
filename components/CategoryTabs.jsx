"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Coffee,
  Utensils,
  Moon,
  IceCream,
  Leaf,
  Zap,
  Globe2,
} from "lucide-react";

const CATEGORIES = [
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "lunch", label: "Lunch", icon: Utensils },
  { id: "dinner", label: "Dinner", icon: Moon },
  { id: "desserts", label: "Desserts", icon: IceCream },
  { id: "vegan", label: "Vegan", icon: Leaf },
  { id: "trending", label: "Trending", icon: Zap },
  { id: "quick", label: "Quick Meals", icon: Zap },
  { id: "world", label: "World Cuisine", icon: Globe2 },
];

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState("dinner");

  return (
    <div
      role="tablist"
      aria-label="Recipe categories"
      className="flex w-full items-center gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeTab === cat.id;

        return (
          <motion.button
            key={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(cat.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={[
              "relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]",
              isActive
                ? "text-white shadow-[0_12px_28px_rgba(249,115,22,0.38)]"
                : "border border-white/80 bg-white/60 text-[#61564a] shadow-[0_6px_18px_rgba(111,80,50,0.07)] backdrop-blur-xl hover:border-[#fed7aa] hover:text-[#9a3412] hover:shadow-[0_10px_24px_rgba(249,115,22,0.14)]",
            ].join(" ")}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill-bg"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#fb923c]"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
            )}
            <motion.span
              animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5, delay: isActive ? 0 : 0 }}
              className={`relative z-10 transition-colors duration-300 ${
                isActive ? "text-white" : "text-[#7c7267]"
              }`}
            >
              <Icon size={15} />
            </motion.span>
            <span className="relative z-10">{cat.label}</span>
            {isActive && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 z-10 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#ea580c] to-[#fb923c]" />
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
