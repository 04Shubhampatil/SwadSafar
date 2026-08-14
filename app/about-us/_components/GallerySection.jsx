"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Camera } from "lucide-react";
import SectionHeading from "./SectionHeading";

const easeOut = [0.22, 1, 0.36, 1];

export default function GallerySection({ images }) {
  return (
    <section className="relative overflow-hidden bg-[#FFF9F3]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fd-noise absolute inset-0 opacity-20 mix-blend-multiply" />
        <div className="fd-dots absolute right-[4%] top-[14%] h-40 w-40 opacity-40" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-14 sm:px-10 md:px-14 lg:px-16 lg:py-20">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Life at Foodi"
            title={
              <>
                Inside our <span className="fd-text-gradient">kitchens</span>
              </>
            }
            subtitle="From recipe photo shoots to community cook-alongs, here's a peek behind the scenes."
          />
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="flex w-fit items-center gap-2 rounded-full border border-[#fed7aa]/80 bg-white/60 px-4 py-2 text-xs font-bold text-[#ea580c] shadow-[0_8px_20px_rgba(249,115,22,0.1)] backdrop-blur-xl"
          >
            <Camera size={14} />
            {images.length} moments
          </motion.span>
        </div>

        <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:grid-cols-4">
          {images.map((img, i) => (
            <motion.figure
              key={img.src}
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: easeOut }}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-[24px] shadow-[0_14px_34px_rgba(111,80,50,0.12)] ${
                i === 0 ? "col-span-2 row-span-2" : ""
              } ${i === 3 ? "col-span-2" : ""}`}
            >
              <Image
                src={img.src}
                alt={img.caption}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <figcaption className="absolute inset-x-4 bottom-4 flex items-center gap-2">
                <span className="rounded-full border border-white/40 bg-black/30 px-3 py-1.5 text-[11px] font-bold text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-2">
                  {img.caption}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
