"use client";

import { Users, BookOpen, Flame, LayoutGrid } from "lucide-react";
import CountUp from "./CountUp";

const ICONS = { Users, BookOpen, Flame, LayoutGrid };

export default function CommunityStats({ stats, variant = "hero", className = "" }) {
  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 gap-3 ${className}`}>
        {stats.map((stat, index) => {
          const Icon = ICONS[stat.icon] || Users;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-neutral-100 bg-white p-3.5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Icon size={14} />
                </span>
                <span className="font-display text-base font-extrabold tracking-tight text-[#1c1917]">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <p className="mt-1 text-[11px] font-medium text-[#8c827a]">{stat.label}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <dl className={`grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = ICONS[stat.icon] || Users;
        return (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-12px_rgba(249,115,22,0.25)]"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600 ring-1 ring-orange-100">
                <Icon size={18} />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b3a798]">
                {stat.label}
              </span>
            </div>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[#1c1917] sm:text-4xl">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </dd>
            <p className="mt-1 text-xs font-medium text-[#8c827a]">{stat.sub}</p>
          </div>
        );
      })}
    </dl>
  );
}
