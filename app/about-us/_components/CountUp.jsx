"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

export default function CountUp({
  to,
  suffix = "",
  decimals = 0,
  duration = 1.6,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  const formatted = decimals
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString("en-US");

  return (
    <span ref={ref} className={className}>
      {formatted}
      {suffix}
    </span>
  );
}
