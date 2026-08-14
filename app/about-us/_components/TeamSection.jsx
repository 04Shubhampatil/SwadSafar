"use client";

import SectionHeading from "./SectionHeading";
import TeamMemberCard from "./TeamMemberCard";

export default function TeamSection({ members }) {
  return (
    <section className="relative overflow-hidden border-y border-[#f0e8dc]/70 bg-white/50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-20 mix-blend-multiply" />
        <div className="fd-blob absolute -right-48 top-0 h-[440px] w-[440px] rounded-full bg-[#fdba74]/25 blur-3xl" />
        <div className="fd-blob absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#fde68a]/25 blur-3xl" style={{ animationDelay: "6s" }} />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 sm:px-10 md:px-14 lg:px-16 lg:py-20">
        <SectionHeading
          eyebrow="Meet the Team"
          title={
            <>
              The passionate people behind{" "}
              <span className="fd-text-gradient">Foodi</span>
            </>
          }
          subtitle="A small, focused group of designers, cooks, and product builders bringing the Foodi experience to life."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
