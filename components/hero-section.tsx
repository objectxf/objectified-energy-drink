"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { useRef } from "react"
import { useLenis } from "lenis/react"
import HeroCanFlip from "./hero-can-flip"
import { AmbientParticles } from "./ambient-particles"
import { Magnetic } from "./magnetic"
import { useSound } from "./sound-provider"

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.3,
    },
  },
}

const benefits = ["Zero Sugar", "Natural Caffeine", "Nootropic Blend", "Fast Acting"]

export function HeroSection() {
  const ref = useRef(null)
  const lenis = useLenis()
  const { play } = useSound()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Plain scroll-linked transforms: the extra useSpring layers re-ran on every
  // frame after each scroll event. Lenis already smooths desktop scrolling.
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const textX1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const textX2 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const prefersReducedMotion = useReducedMotion() ?? false

  const scrollToFlavors = () => {
    const element = document.querySelector("#flavours")
    if (element && lenis) lenis.scrollTo(element as HTMLElement, { offset: -100 })
  }

  return (
    <section
      id="hero"
      ref={ref}
      className="relative isolate min-h-fit md:min-h-[90svh] flex items-center justify-center overflow-x-clip"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30" />

      {/* smooth radial wash (replaces the old animated SVG noise). Same on phones and desktop. */}
      <div aria-hidden="true" className="hero-wash pointer-events-none select-none absolute inset-0 z-0" />

      <AmbientParticles />


      {/* Soft orbs: radial-gradient fading to transparent. No blur filter, no border, nothing that
          can be clipped into a visible rectangle. CSS keyframes (compositor), desktop only. */}
      <div
        aria-hidden="true"
        className="ambient-orb animate-float pointer-events-none select-none hidden md:block absolute -top-4 -left-14 h-72 w-72 rounded-full will-change-transform"
      />
      <div
        aria-hidden="true"
        className="ambient-orb ambient-orb-soft animate-float pointer-events-none select-none hidden md:block absolute bottom-16 -right-4 h-80 w-80 rounded-full will-change-transform [animation-delay:-3s]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-6 md:pt-24 md:pb-12 w-full">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div style={{ opacity }} className="space-y-5">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 bg-[#18181B] border border-white/10 text-white px-3 py-1.5 rounded-full text-xs font-mono tracking-wider"
            >
              <motion.span
                className="w-2 h-2 bg-[#E5FF00] rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              HIGH-PERFORMANCE FUEL
            </motion.div>

            <h1 className="space-y-1 overflow-hidden text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
              <motion.span style={{ x: textX1 }} className="block">
                <motion.span
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  className="inline-block text-gloss"
                >
                  REDEFINE YOUR
                </motion.span>
              </motion.span>
              <motion.span style={{ x: textX2 }} className="block">
                <motion.span
                  variants={fadeUpVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="inline-block text-shine"
                >
                  LIMITS
                </motion.span>
              </motion.span>
            </h1>
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              className="text-lg md:text-xl font-mono text-[#B9B9C2] md:text-[#A1A1AA] tracking-tight pt-2 max-w-md text-pretty"
            >
              Zero sugar. Pure focus. High-performance formula engineered for non-stop drive.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={4}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Magnetic>
              <motion.button
                onClick={() => play("click")}
                className="bg-[#E5FF00] text-[#000000] px-6 py-3 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 group relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Order Objectified</span>
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
              </Magnetic>
              <Magnetic>
              <motion.button
                onClick={() => {
                  play("click")
                  scrollToFlavors()
                }}
                className="bg-[#18181B] border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:border-white/40 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Explore Flavors
              </motion.button>
              </Magnetic>
            </motion.div>

            <motion.ul
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2"
            >
              {benefits.map((benefit, i) => (
                <motion.li
                  key={benefit}
                  className="flex items-center gap-3 text-xs font-mono text-[#B9B9C2] md:text-[#A1A1AA]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  {i > 0 && <span aria-hidden="true" className="w-1 h-1 bg-[#E5FF00] rounded-full" />}
                  {benefit}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div style={{ y }} className="relative flex justify-center lg:will-change-transform max-lg:transform-none!">
            <motion.div style={{ scale }} className="relative will-change-transform">
            <motion.div
              variants={scaleInVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div
                aria-hidden="true"
                className="hero-glow absolute inset-[10%] rounded-full pointer-events-none select-none"
              />
              <div className="relative z-10 flex justify-center py-0 md:py-10">
                <div className="w-[min(92vw,76svh,680px)]">
                  <HeroCanFlip reducedMotion={prefersReducedMotion} />
                </div>
              </div>

            </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
              <motion.div
                className="w-1 h-2 bg-white/30 rounded-full"
                animate={{ y: [0, 6, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
