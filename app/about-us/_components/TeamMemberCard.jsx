"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, ArrowUpRight } from "lucide-react";

export default function TeamMemberCard({ member }) {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(null)}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/80 bg-white/70 shadow-[0_16px_38px_rgba(111,80,50,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_32px_64px_-16px_rgba(249,115,22,0.22)]"
    >
      {/* Portrait */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-t from-[#111827]/25 via-transparent to-transparent ${member.accent}`} style={{ mixBlendMode: "multiply", opacity: 0.12 }} />

        {/* Verified badge */}
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/85 text-[#22c55e] shadow-[0_8px_18px_rgba(0,0,0,0.18)] backdrop-blur-md">
          <BadgeCheck size={18} />
        </span>

        {/* Name overlay */}
        <div className="absolute inset-x-4 bottom-3">
          <h3 className="text-[17px] font-extrabold tracking-tight text-white drop-shadow">
            {member.name}
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#fdba74]">
            {member.role}
          </p>
        </div>
      </div>

      {/* Bio + socials */}
      <div className="relative flex flex-1 flex-col gap-4 p-5">
        <p className="text-[13px] leading-relaxed text-[#7c7267]">{member.bio}</p>

        <div className="mt-auto flex items-center justify-between gap-3">
          {/* Floating social buttons */}
          <div className="flex gap-2">
            {member.socials.map((social, idx) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={`${member.name} on ${social.label}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
                  whileHover={{
                    y: -6,
                    rotate: hovered === idx ? -6 : 0,
                    scale: 1.12,
                  }}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f0e8dc] bg-white text-[#8a7d6d] shadow-[0_6px_16px_rgba(111,80,50,0.12)] transition-colors duration-300 hover:border-transparent hover:bg-gradient-to-br hover:from-[#ea580c] hover:to-[#fb923c] hover:text-white hover:shadow-[0_12px_26px_rgba(249,115,22,0.4)]"
                >
                  <Icon size={15} />
                </motion.a>
              );
            })}
          </div>

          <motion.a
            href="#"
            aria-label={`View ${member.name}'s profile`}
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#fb923c] text-white shadow-[0_10px_22px_rgba(249,115,22,0.4)]"
          >
            <ArrowUpRight size={15} />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}
