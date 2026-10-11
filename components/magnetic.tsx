"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Magnetic hover for desktop mice. Touch / pen pointers and reduced-motion
 * users are ignored. Only `transform` is animated, so it stays on the compositor.
 * The wrapper has 8px of invisible padding (cancelled by a negative margin) so
 * the pull starts slightly before the cursor reaches the element.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
  role,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
  role?: React.AriaRole
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    // subtract the current offset so the centre we measure is the resting centre (no feedback jitter)
    const cx = r.left + r.width / 2 - sx.get()
    const cy = r.top + r.height / 2 - sy.get()
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      role={role}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: sx, y: sy }}
      className={cn("-m-2 inline-block p-2 will-change-transform", className)}
    >
      {children}
    </motion.div>
  )
}
