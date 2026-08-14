"use client";

import SectionHeading from "./SectionHeading";
import ValueCard from "./ValueCard";

export default function ValuesSection({ values }) {
  return (
    <section className="relative overflow-hidden border-y border-[#f0e8dc]/70 bg-white/60">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-blob absolute -right-40 -top-24 h-[420px] w-[420px] rounded-full bg-[#fde68a]/25 blur-3xl" />
        <div className="fd-noise absolute inset-0 opacity-20 mix-blend-multiply" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 sm:px-10 md:px-14 lg:px-16 lg:py-20">
        <SectionHeading
          eyebrow="Our Values"
          title={
            <>
              The principles that guide{" "}
              <span className="fd-text-gradient">everything we do</span>
            </>
          }
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <ValueCard key={value.title} {...value} />
          ))}
        </div>
      </div>
    </section>
  );
}
