"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"
import { useSound } from "./sound-provider"

const tiltSpring = { stiffness: 180, damping: 18, mass: 0.8 }

type Face = {
  src: string
  alt: string
  aspectRatio: string
  sizes: string
  rotateY?: number
  priority?: boolean
  glare?: boolean
}

// Front face is the LCP image of the page: preloaded. The back face is only
// needed after a tap, so it is lazy.
const FRONT: Face = {
  src: "/images/front.png",
  alt: "Front of the matte black objectified Classic Focus zero sugar energy drink can",
  aspectRatio: "1600 / 1600",
  sizes: "(min-width: 1024px) 640px, 90vw",
  priority: true,
  glare: true,
}
const BACK: Face = {
  src: "/images/back.png",
  alt: "Back label with nutrition declaration, high caffeine content warning, ingredients and barcode, 330 ml",
  aspectRatio: "535 / 1024",
  sizes: "(min-width: 1024px) 360px, 50vw",
  rotateY: 180,
}

export default function HeroCanFlip({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [flipped, setFlipped] = useState(false)
  const { play } = useSound()

  // Flip angle as a motion value. Instead of trusting `backface-visibility` (Chrome/Android leak the
  // hidden face through composited layers, which showed the front can behind the back label), the
  // face that points away is switched to opacity 0 exactly when the can is edge-on (90deg).
  const flip = useSpring(0, { stiffness: 70, damping: 14 })
  useEffect(() => {
    const target = flipped ? 180 : 0
    if (reducedMotion) flip.jump(target)
    else flip.set(target)
  }, [flipped, reducedMotion, flip])
  const frontOpacity = useTransform(flip, (v: number) => (v < 90 ? 1 : 0))
  const backOpacity = useTransform(flip, (v: number) => (v < 90 ? 0 : 1))

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [18, -18]), tiltSpring)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-22, 22]), tiltSpring)
  // micro-parallax: the can drifts a few px with the cursor
  const shiftX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), tiltSpring)
  const shiftY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-8, 8]), tiltSpring)

  // Specular streak: follows the tilt on desktop and the page scroll on touch screens.
  const { scrollY } = useScroll()
  const glareX = useTransform([rotateY, scrollY], (v: number[]) => {
    const x = -8 + v[0] * 0.75 - Math.min(v[1], 900) * 0.02
    return `${Math.max(-18, Math.min(18, x))}%`
  })

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === "touch") return
    const rect = e.currentTarget.getBoundingClientRect()
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onPointerLeave = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    // Clicks anywhere in the can area (and the hint below) bubble here; the inner button keeps keyboard access.
    <div
      className="flex w-full cursor-pointer select-none flex-col items-center bg-transparent"
      onClick={() => {
        play("flip")
        setFlipped((f) => !f)
      }}
    >
      <div
        className="flex aspect-square w-full items-center justify-center bg-transparent p-6 md:p-8 [perspective:1400px]"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        {/* idle bob is a CSS animation (compositor); it pauses on real hover devices only */}
        <div
          className={`h-full w-full will-change-transform [transform-style:preserve-3d] ${
            reducedMotion ? "" : "animate-can-bob hover:[animation-play-state:paused]"
          }`}
        >
          <motion.div
            className="h-full w-full will-change-transform [transform-style:preserve-3d]"
            style={{ rotateX, rotateY, x: shiftX, y: shiftY }}
          >
            <motion.button
              type="button"
              aria-pressed={flipped}
              aria-label={flipped ? "Show front of the can" : "Show back label of the can"}
              className="relative block h-full w-full cursor-pointer bg-transparent outline-none [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-[#E5FF00] focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              style={{ rotateY: flip }}
            >
              <CanFace face={FRONT} glareX={glareX} opacity={frontOpacity} />
              <CanFace face={BACK} opacity={backOpacity} />
            </motion.button>
          </motion.div>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="pt-0 font-mono md:pt-2 text-[10px] tracking-widest text-[#8E8E99] md:text-[#71717A] transition-colors duration-200 hover:text-[#E5FF00]"
      >
        {flipped ? "TAP TO FLIP BACK" : "TAP TO FLIP"}
      </span>
    </div>
  )
}

function CanFace({
  face,
  glareX,
  opacity,
}: {
  face: Face
  glareX?: MotionValue<string>
  opacity: MotionValue<number>
}) {
  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center bg-transparent [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
      style={face.rotateY ? { opacity, rotateY: face.rotateY } : { opacity }}
    >
      {/* relative + aspect-ratio box gives `fill` a fixed size, so there is no layout shift */}
      <span className="relative block h-full max-w-full bg-transparent" style={{ aspectRatio: face.aspectRatio }}>
        <Image
          src={face.src}
          alt={face.alt}
          fill
          sizes={face.sizes}
          quality={75}
          draggable={false}
          {...(face.priority ? { priority: true } : { loading: "lazy" as const })}
          className="block object-contain bg-transparent"
        />
        {face.glare && glareX && (
          // Clipped to the can's own silhouette (tiny alpha mask made from the PNG), so the streak
          // can never draw a rectangle or corners outside the can.
          <span
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 overflow-hidden"
            style={{
              WebkitMaskImage: "url(/images/front-mask.png)",
              maskImage: "url(/images/front-mask.png)",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
            }}
          >
            <motion.span
              className="absolute inset-y-0 left-[-3%] w-[105%] will-change-transform"
              style={{
                x: glareX,
                background:
                  "linear-gradient(100deg, transparent 42%, rgba(255,255,255,0.2) 48%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 52%, transparent 58%)",
              }}
            />
          </span>
        )}
      </span>
    </motion.span>
  )
}
