"use client"

import type React from "react"
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { flavors } from "@/lib/flavors"
import { setAmbient } from "@/lib/ambient"
import { Magnetic } from "./magnetic"
import { useSound } from "./sound-provider"

export function FlavorCarousel() {
  const [[currentIndex, direction], setPage] = useState([0, 0])
  const currentFlavor = flavors[currentIndex]
  const swipeStartX = useRef<number | null>(null)
  const swipeStartY = useRef<number | null>(null)

  const { play } = useSound()

  // the whole page glows in the colour of the selected flavour
  useEffect(() => {
    setAmbient(currentFlavor.accent)
  }, [currentFlavor.accent])

  const goTo = (index: number, dir: number) => {
    play("flavor", index)
    setPage([index, dir])
  }
  const paginate = (dir: number) => goTo((currentIndex + dir + flavors.length) % flavors.length, dir)

  const handleSwipeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return
    swipeStartX.current = event.clientX
    swipeStartY.current = event.clientY
  }

  const handleSwipeEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null || swipeStartY.current === null) return
    const deltaX = event.clientX - swipeStartX.current
    const deltaY = event.clientY - swipeStartY.current
    swipeStartX.current = null
    swipeStartY.current = null

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return
    paginate(deltaX < 0 ? 1 : -1)
  }

  const handleSwipeCancel = () => {
    swipeStartX.current = null
    swipeStartY.current = null
  }

  return (
    <section id="flavours" className="relative pt-2 pb-16 md:py-16 bg-[#09090B]/70 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-10"
        >
          <span className="font-mono text-[#B9B9C2] md:text-[#A1A1AA] text-xs tracking-widest">OUR FLAVOURS</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mt-2">
            <span className="text-gloss">CHOOSE YOUR</span>{" "}
            <span className="text-stroke-neon">FUEL</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div
            className="flex items-center justify-center gap-6 touch-pan-y"
            onPointerDown={handleSwipeStart}
            onPointerUp={handleSwipeEnd}
            onPointerCancel={handleSwipeCancel}
          >
            <ArrowButton direction="prev" onClick={() => paginate(-1)} className="hidden md:flex" />

            <TiltCard accent={currentFlavor.accent}>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <ScrollParallax accent={currentFlavor.accent}>
                  {flavors.map((flavor, index) => (
                    <div
                      key={flavor.id}
                      aria-hidden={index !== currentIndex}
                      className={cn(
                        "absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_65%,transparent_100%)]",
                        index === currentIndex ? "visible opacity-100" : "invisible opacity-0",
                      )}
                    >
                      <Image
                        src={flavor.image}
                        alt={
                          flavor.unreleased
                            ? "Redacted silhouette of an unreleased objectified can"
                            : `objectified ${flavor.name} energy drink can`
                        }
                        fill
                        sizes="(min-width: 768px) 360px, 80vw"
                        quality={75}
                        loading="lazy"
                        className={cn(
                          "object-cover",
                          flavor.unreleased && "brightness-[0.08] grayscale contrast-150 blur-[2px]",
                        )}
                      />
                      {flavor.unreleased && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[8rem] md:text-[10rem] font-black leading-none text-white/90 select-none [text-shadow:0_0_18px_rgba(255,255,255,0.55),0_0_48px_rgba(229,255,0,0.35)]">
                            ?
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollParallax>

                <div className="space-y-4 min-h-[260px]" aria-live="polite">
                  <div>
                    <span className="font-mono text-xs tracking-widest" style={{ color: currentFlavor.accent }}>
                      {currentFlavor.tagline}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mt-1">
                      {currentFlavor.name}
                    </h3>
                  </div>

                  {currentFlavor.unreleased ? (
                    <div className="space-y-2" aria-label={currentFlavor.description}>
                      <p className="text-sm text-[#B9B9C2] md:text-[#A1A1AA] font-mono text-pretty">{currentFlavor.description}</p>
                      <div aria-hidden="true" className="flex flex-col gap-1.5 pt-1">
                        <span className="h-3 w-full rounded-sm bg-white/10" />
                        <span className="h-3 w-4/5 rounded-sm bg-white/10" />
                        <span className="h-3 w-2/3 rounded-sm bg-white/10" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#B9B9C2] md:text-[#A1A1AA] font-mono text-pretty">{currentFlavor.description}</p>
                  )}

                  <ul className="flex flex-wrap gap-2">
                    {currentFlavor.badges.map((badge) => (
                      <li
                        key={badge}
                        className="px-2.5 py-1 rounded-full text-xs font-mono border border-white/10 bg-white/[0.04] text-[#D4D4D8]"
                      >
                        {badge}
                      </li>
                    ))}
                  </ul>

                  {currentFlavor.unreleased ? (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm tracking-wide w-full md:w-auto border border-white/15 text-white/60 bg-white/[0.04] cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4" aria-hidden="true" />
                      Join Waitlist
                    </button>
                  ) : (
                    <Magnetic className="block md:inline-block">
                      <button
                        type="button"
                        onClick={() => play("click")}
                        className="px-6 py-3 rounded-full font-bold text-sm tracking-wide w-full md:w-auto text-[#000000] transition-[filter,transform] duration-200 hover:brightness-90 active:scale-[0.98]"
                        style={{ backgroundColor: currentFlavor.accent }}
                      >
                        Add {currentFlavor.name} to Cart
                      </button>
                    </Magnetic>
                  )}
                </div>
              </div>
            </TiltCard>

            <ArrowButton direction="next" onClick={() => paginate(1)} className="hidden md:flex" />
          </div>

          <div className="flex md:hidden justify-center gap-4 mt-6">
            <ArrowButton direction="prev" onClick={() => paginate(-1)} className="flex" />
            <ArrowButton direction="next" onClick={() => paginate(1)} className="flex" />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6" role="tablist" aria-label="Flavours">
            {flavors.map((flavor, index) => {
              const active = index === currentIndex
              return (
                <Magnetic key={flavor.id} role="presentation" strength={0.25}>
                <button
                  role="tab"
                  aria-selected={active}
                  onClick={() => goTo(index, index > currentIndex ? 1 : -1)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-mono tracking-wider border transition-colors duration-150",
                    active
                      ? "text-[#000000]"
                      : "text-[#B9B9C2] md:text-[#A1A1AA] border-white/10 bg-transparent hover:text-white hover:bg-white/[0.06]",
                  )}
                  style={active ? { backgroundColor: flavor.accent, borderColor: flavor.accent } : undefined}
                >
                  {flavor.name.toUpperCase()}
                </button>
                </Magnetic>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

const canMask = "[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_65%,transparent_100%)]"

const focusSpring = { stiffness: 120, damping: 24, mass: 0.6 }
const tiltSpring = { stiffness: 140, damping: 22, mass: 0.6 }
const hoverSpring = { stiffness: 220, damping: 22, mass: 0.5 }

// 0 -> 1 -> 0 while an element crosses the screen (scrollYProgress 0 -> 0.5 -> 1)
const FOCUS_INPUT = [0, 0.3, 0.5, 0.7, 1]
const FOCUS_OUTPUT = [0, 0.7, 1, 0.7, 0]

/** blend(scroll, hover, mix): touch devices keep mix = 0 (scroll only), a mouse hover pushes mix to 1 */
const blend = (v: number[]) => v[0] * (1 - v[2]) + v[1] * v[2]

function ScrollParallax({ accent, children }: { accent: string; children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  // ---- scroll-driven (touch + idle desktop)
  const scrollRotX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]), tiltSpring)
  const scrollRotY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 8]), tiltSpring)
  const scrollFocus = useSpring(useTransform(scrollYProgress, FOCUS_INPUT, FOCUS_OUTPUT), focusSpring)
  const scrollGlare = useTransform(scrollYProgress, [0.2, 0.65], [-100, 200])

  // ---- hover-driven (mouse only)
  const mix = useSpring(0, { stiffness: 140, damping: 22 })
  const px = useMotionValue(0) // cursor inside the can area, -0.5 .. 0.5
  const py = useMotionValue(0)
  const spx = useSpring(px, hoverSpring)
  const spy = useSpring(py, hoverSpring)

  const hoverRotX = useTransform(spy, [-0.5, 0.5], [12, -12])
  const hoverRotY = useTransform(spx, [-0.5, 0.5], [-14, 14])
  const rotateX = useTransform([scrollRotX, hoverRotX, mix], blend)
  const rotateY = useTransform([scrollRotY, hoverRotY, mix], blend)

  // micro-parallax: the can drifts with the cursor, its halo drifts the other way
  const shiftX = useTransform([spx, mix], (v: number[]) => v[0] * 28 * v[1])
  const shiftY = useTransform([spy, mix], (v: number[]) => v[0] * 28 * v[1])
  const haloX = useTransform(shiftX, (v: number) => -v * 1.6)
  const haloY = useTransform(shiftY, (v: number) => -v * 1.6)

  const energy = useTransform([scrollFocus, mix], (v: number[]) => v[0] + (1 - v[0]) * v[1])
  const glowOpacity = useTransform(energy, [0, 1], [0.2, 1])
  // glare streak: scroll position on touch, follows the cursor on hover
  const glareX = useTransform([scrollGlare, spx, mix], (v: number[]) => `${v[0] * (1 - v[2]) + v[1] * 100 * v[2]}%`)

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && !reducedMotion) mix.set(1)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reducedMotion) return
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.8, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ amount: 0.35, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.5 }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative aspect-[3/4]"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 rounded-full will-change-transform"
        style={{
          opacity: glowOpacity,
          x: haloX,
          y: haloY,
          background: `radial-gradient(closest-side, ${accent}40, transparent)`,
        }}
      />
      <motion.div
        className="absolute inset-0 transform-gpu will-change-transform"
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          x: reducedMotion ? 0 : shiftX,
          y: reducedMotion ? 0 : shiftY,
          transformPerspective: 900,
        }}
      >
        {children}
        {!reducedMotion && (
          <div aria-hidden="true" className={cn("pointer-events-none select-none absolute inset-0 overflow-hidden", canMask)}>
            <motion.div
              className="absolute inset-0 mix-blend-screen transform-gpu will-change-transform"
              style={{
                x: glareX,
                background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)",
              }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function TiltCard({ accent, children }: { accent: string; children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  // ---- scroll-driven (touch + idle desktop)
  const scrollRotX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [6, 0, -6]), tiltSpring)
  const scrollRotY = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5]), tiltSpring)
  const scrollNeon = useSpring(useTransform(scrollYProgress, FOCUS_INPUT, FOCUS_OUTPUT), focusSpring)

  // ---- hover-driven (mouse only). Pointer is read on the (untransformed) wrapper, so the tilt never feeds back into it.
  const mix = useSpring(0, { stiffness: 140, damping: 22 })
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spx = useSpring(px, hoverSpring)
  const spy = useSpring(py, hoverSpring)
  const sweep = useMotionValue(-120)
  const sweepX = useMotionTemplate`${sweep}%`

  const hoverRotX = useTransform(spy, [-0.5, 0.5], [6, -6])
  const hoverRotY = useTransform(spx, [-0.5, 0.5], [-8, 8])
  const rotateX = useTransform([scrollRotX, hoverRotX, mix], blend)
  const rotateY = useTransform([scrollRotY, hoverRotY, mix], blend)
  const neon = useTransform([scrollNeon, mix], (v: number[]) => v[0] + (1 - v[0]) * v[1])

  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reducedMotion) return
    mix.set(1)
    sweep.set(-120)
    animate(sweep, 220, { duration: 1, ease: "easeInOut" })
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reducedMotion) return
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

  return (
    <div
      ref={ref}
      className="w-full max-w-3xl"
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.article
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformPerspective: 1400,
        }}
        className="relative w-full transform-gpu rounded-3xl border border-white/10 bg-[#0c0c0f]/90 p-6 will-change-transform md:bg-[#0c0c0f]/70 md:p-8 md:backdrop-blur-md"
      >
        {/* neon frame + outer glow: fades in near the centre of the screen, full on hover */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 rounded-3xl"
          style={{
            opacity: neon,
            boxShadow: `0 0 35px ${accent}33, 0 20px 60px -20px ${accent}40, inset 0 0 0 1px ${accent}66`,
          }}
        />
        {/* glass glare sweep on hover (mouse) */}
        {!reducedMotion && (
          <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0 overflow-hidden rounded-3xl">
            <motion.div
              className="absolute inset-0 transform-gpu will-change-transform"
              style={{
                x: sweepX,
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)",
              }}
            />
          </div>
        )}
        {children}
      </motion.article>
    </div>
  )
}

function ArrowButton({
  direction,
  onClick,
  className,
}: {
  direction: "prev" | "next"
  onClick: () => void
  className?: string
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous flavour" : "Next flavour"}
      className={cn(
        "w-11 h-11 shrink-0 rounded-full border border-white/10 text-white items-center justify-center bg-white/[0.03] hover:bg-white/10 transition-colors duration-200",
        className,
      )}
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}
