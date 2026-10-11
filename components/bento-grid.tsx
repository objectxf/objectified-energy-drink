"use client"

import type React from "react"

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useSound } from "./sound-provider"
import { Zap, Flame, Brain, Sparkles } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "75mg",
    subtitle: "Natural Caffeine",
    description: "Clean energy without the crash",
    accent: "#E5FF00",
  },
  {
    icon: Flame,
    title: "Zero",
    subtitle: "Sugar Added",
    description: "All the taste, none of the guilt",
    accent: "#FF5500",
  },
  {
    icon: Brain,
    title: "100%",
    subtitle: "Mental Clarity",
    description: "Enhanced focus & concentration",
    accent: "#00E5FF",
  },
  {
    icon: Sparkles,
    title: "B12",
    subtitle: "Vitamin Complex",
    description: "Essential nutrients for energy",
    accent: "#E5FF00",
  },
]

const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\+=?"
const CIPHER_CYCLE_MS = 500
const CIPHER_DECODE_STEP_MS = 80
const CIPHER_FRAME_MS = 45

function randomChar() {
  return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]
}

function useCipher(finalText: string, active: boolean, delayMs: number) {
  const reduceMotion = useReducedMotion()
  const [text, setText] = useState(finalText)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!active || reduceMotion) {
      setText(finalText)
      return
    }
    if (hasRun.current) {
      setText(finalText)
      return
    }
    hasRun.current = true

    const chars = finalText.split("")
    let frame = 0
    let lastUpdate = 0
    const begin = performance.now() + delayMs

    setText(chars.map(randomChar).join(""))

    const tick = (now: number) => {
      const elapsed = now - begin

      if (elapsed >= 0 && now - lastUpdate >= CIPHER_FRAME_MS) {
        lastUpdate = now
        const revealed = elapsed < CIPHER_CYCLE_MS ? 0 : Math.floor((elapsed - CIPHER_CYCLE_MS) / CIPHER_DECODE_STEP_MS) + 1

        if (revealed >= chars.length) {
          setText(finalText)
          return
        }

        setText(chars.map((char, i) => (i < revealed ? char : randomChar())).join(""))
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, finalText, delayMs, reduceMotion])

  return text
}

function BorderBeam({
  accent,
  opacity,
  spin,
}: {
  accent: string
  opacity: MotionValue<number>
  spin: boolean
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-2xl p-px"
      style={{
        opacity,
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
      }}
    >
      {/* CSS keyframes (see .beam-spin in globals.css); paused while the card is off-screen */}
      <div
        className="beam-spin absolute left-1/2 top-1/2 aspect-square w-[220%]"
        data-run={spin ? "true" : "false"}
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 250deg, ${accent} 335deg, transparent 360deg)`,
        }}
      />
    </motion.div>
  )
}

const focusSpring = { stiffness: 120, damping: 24, mass: 0.6 }
const tiltSpring = { stiffness: 140, damping: 22, mass: 0.6 }

const hoverSpring = { stiffness: 220, damping: 22, mass: 0.5 }

/**
 * Cheap by design: nothing here subscribes to scroll position.
 *  - Phones / any touch screen: the card fades + scales in once (whileInView, once),
 *    plays a single glare sweep when it first enters the screen, and "lights up"
 *    (glow, border, progress bar) while it is mostly on screen. No rotateX/rotateY,
 *    no backdrop-blur, no continuous rotation.
 *  - Desktop with a mouse (pointerType === "mouse"): full 3D tilt that follows the
 *    cursor, a cursor-following spotlight, a glass glare sweep on enter, glass blur.
 * Detection is by pointer type, so there is no screen-size check to mismatch on hydration.
 */
function FeatureCard({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { play } = useSound()
  const decodeOnce = useInView(ref, { once: true, amount: 0.4 })
  const onScreen = useInView(ref, { amount: 0.55 })
  const swept = useRef(false)

  // 0 -> 1 while the card is mostly on screen. Animated on enter/leave only (no per-scroll-frame work).
  const lit = useMotionValue(0)
  // 0 -> 1 while a mouse hovers the card
  const mix = useSpring(0, { stiffness: 140, damping: 22 })
  const px = useMotionValue(0) // cursor inside the card, -0.5 .. 0.5
  const py = useMotionValue(0)
  const spx = useSpring(px, hoverSpring)
  const spy = useSpring(py, hoverSpring)
  const sweep = useMotionValue(-120)
  const sweepX = useMotionTemplate`${sweep}%`

  const playSweep = () => {
    if (reduceMotion) return
    sweep.set(-120)
    animate(sweep, 220, { duration: 0.9, ease: "easeInOut" })
  }

  useEffect(() => {
    const controls = animate(lit, onScreen ? 1 : 0, { duration: 0.6, ease: "easeOut" })
    if (onScreen && !swept.current) {
      swept.current = true
      playSweep()
    }
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onScreen])

  // mouse-only 3D tilt (stays 0 on touch devices)
  const tiltX = useTransform(spy, [-0.5, 0.5], [12, -12])
  const tiltY = useTransform(spx, [-0.5, 0.5], [-12, 12])
  // spotlight layer is 200% of the card: cursor offset d (fraction of width) = d * 50% of the layer
  const spotX = useTransform(spx, (v: number) => `${v * 50}%`)
  const spotY = useTransform(spy, (v: number) => `${v * 50}%`)

  // how "lit" the card is, from either source
  const energy = useTransform([lit, mix], (v: number[]) => v[0] + (1 - v[0]) * v[1])
  const spotOpacity = useTransform(mix, [0, 1], [0, 1])
  const beamOpacity = useTransform(energy, [0, 1], [0.15, 1])
  const cornerGlow = useTransform(energy, [0, 1], [0.2, 0.55])
  const iconScale = useTransform(energy, [0, 1], [1, 1.12])
  const iconGlow = useTransform(energy, [0, 1], [0, 0.7])
  const barScale = useTransform(energy, [0, 0.4, 1], [0, 0.62, 1])
  const barBlur = useTransform(energy, [0, 1], [0, 18])
  const barShadow = useMotionTemplate`0 0 ${barBlur}px ${feature.accent}`

  const title = useCipher(feature.title, decodeOnce, index * 100)

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduceMotion) return
    mix.set(1)
    playSweep()
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduceMotion) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onPointerLeave = () => {
    mix.set(0)
    px.set(0)
    py.set(0)
  }

  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.5, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ amount: 0.2, once: true }}
      whileTap={{ scale: 0.985 }}
      onClick={() => play("click")}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      transition={{ duration: 0.5 }}
      className="relative transform-gpu will-change-transform"
    >
      <motion.div
        className="relative h-full transform-gpu will-change-transform"
        style={{
          rotateX: reduceMotion ? 0 : tiltX,
          rotateY: reduceMotion ? 0 : tiltY,
          transformPerspective: 1000,
        }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-8 -top-8 h-32 w-32 rounded-full"
          style={{
            opacity: cornerGlow,
            background: `radial-gradient(closest-side, ${feature.accent}, transparent)`,
          }}
        />

        {/* phones: dense fill, no backdrop-filter. md and up: glass. */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/85 md:bg-zinc-900/60 md:backdrop-blur-xl">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none select-none absolute -left-1/2 -top-1/2 h-[200%] w-[200%] transform-gpu will-change-transform"
            style={{
              x: spotX,
              y: spotY,
              opacity: spotOpacity,
              background:
                "radial-gradient(circle 260px at 50% 50%, rgba(255,255,255,0.16), rgba(255,255,255,0.04) 45%, transparent 70%)",
            }}
          />
          {!reduceMotion && (
            // glass glare sweep: once when the card first appears, and again on every mouse enter
            <motion.div
              aria-hidden="true"
              className="pointer-events-none select-none absolute inset-0 z-0 transform-gpu will-change-transform"
              style={{
                x: sweepX,
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.26) 50%, transparent 70%)",
              }}
            />
          )}
        </div>

        <BorderBeam accent={feature.accent} opacity={beamOpacity} spin={onScreen && !reduceMotion} />

        <div className="relative z-20 flex h-full min-h-[190px] flex-col p-6">
          <div className="relative mb-5 h-12 w-12">
            <motion.div
              aria-hidden="true"
              className="pointer-events-none select-none absolute -inset-3 rounded-full"
              style={{
                opacity: iconGlow,
                background: `radial-gradient(closest-side, ${feature.accent}, transparent)`,
              }}
            />
            <motion.div
              className="relative flex h-12 w-12 items-center justify-center rounded-xl border will-change-transform"
              style={{
                backgroundColor: `${feature.accent}1f`,
                borderColor: `${feature.accent}40`,
                scale: reduceMotion ? 1 : iconScale,
              }}
            >
              <Icon className="h-5 w-5" style={{ color: feature.accent }} />
            </motion.div>
          </div>

          <div className="relative flex-1">
            <div className="text-4xl font-black tracking-tight" style={{ color: feature.accent }}>
              <span className="sr-only">{feature.title}</span>
              <span aria-hidden="true" className="relative inline-block whitespace-nowrap">
                <span className="invisible">{feature.title}</span>
                <span className="absolute left-0 top-0">{title}</span>
              </span>
            </div>
            <h3 className="mt-1 text-sm font-semibold text-white">{feature.subtitle}</h3>
            <p className="mt-1 font-mono text-xs text-white/70 md:text-white/50">{feature.description}</p>
          </div>

          <div className="mt-5 h-[2px] w-full">
            <motion.div
              className="h-full w-full origin-left rounded-full will-change-transform"
              style={{ backgroundColor: feature.accent, scaleX: barScale, boxShadow: barShadow }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function BentoGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section id="formula" className="relative overflow-hidden bg-[#121212]/75 py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/60 via-[#0a0a0a]/50 to-[#121212]/60" />

      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <motion.span
            className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-[#E5FF00]"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
          >
            {"What's Inside"}
          </motion.span>

          <div className="mt-2 overflow-hidden">
            <motion.h2
              className="text-gloss text-3xl font-black tracking-tight md:text-4xl"
              initial={{ y: 60 }}
              animate={isInView ? { y: 0 } : { y: 60 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.15 }}
            >
              Formula & Benefits
            </motion.h2>
          </div>

          <motion.div
            className="mx-auto mt-3 h-[2px] w-12 rounded-full bg-[#E5FF00]"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          />
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
