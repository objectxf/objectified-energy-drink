"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/** Neon scroll progress bar. scaleX only (compositor), colour follows --ambient. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left will-change-transform"
      style={{
        scaleX,
        background: "linear-gradient(90deg, color-mix(in srgb, var(--ambient) 45%, transparent), var(--ambient))",
        boxShadow: "0 0 10px var(--ambient), 0 0 22px color-mix(in srgb, var(--ambient) 60%, transparent)",
      }}
    />
  )
}
