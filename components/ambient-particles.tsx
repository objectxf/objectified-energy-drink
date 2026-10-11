"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  r: number
  vy: number
  amp: number
  freq: number
  phase: number
  a: number
}

/**
 * Floating carbonation bubbles for the hero.
 * - one <canvas>, plain 2D, no shadowBlur / gradients per particle
 * - phones: 14 particles, DPR 1. Desktop: 52 particles, DPR <= 1.5
 * - the loop only runs while the hero is on screen and the tab is visible
 * - colour follows the --ambient CSS variable (sampled twice a second)
 * - prefers-reduced-motion: a single static frame
 */
export function AmbientParticles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !parent || !ctx) return

    const mobile = window.matchMedia("(max-width: 767px)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const count = mobile ? 14 : 52
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5)
    const root = document.documentElement

    let w = 0
    let h = 0
    let color = "#E5FF00"
    let colorAt = 0
    let last = 0
    let raf = 0
    let running = false
    let visible = true
    const particles: Particle[] = []

    const make = (anywhere: boolean): Particle => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10 + Math.random() * 40,
      r: 1.2 + Math.random() * (mobile ? 3 : 4.5),
      vy: 14 + Math.random() * 34,
      amp: 4 + Math.random() * 14,
      freq: 0.6 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      a: 0.25 + Math.random() * 0.5,
    })

    const resize = () => {
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (particles.length === 0) for (let i = 0; i < count; i++) particles.push(make(true))
    }

    const draw = (now: number, dt: number) => {
      if (now - colorAt > 500) {
        const v = getComputedStyle(root).getPropertyValue("--ambient").trim()
        if (v) color = v
        colorAt = now
      }
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 1

      for (const p of particles) {
        if (dt > 0) {
          p.y -= p.vy * dt
          p.phase += p.freq * dt
          if (p.y < -p.r * 2) Object.assign(p, make(false))
        }
        const x = p.x + Math.sin(p.phase) * p.amp
        const fade = Math.min(1, Math.max(0, p.y / (h * 0.3)))
        // bubble: soft body, thin rim, tiny specular dot
        ctx.globalAlpha = p.a * fade * 0.1
        ctx.beginPath()
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = p.a * fade * 0.6
        ctx.stroke()
        if (p.r > 2.4) {
          ctx.globalAlpha = p.a * fade
          ctx.fillStyle = "#fff"
          ctx.beginPath()
          ctx.arc(x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.22, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = color
        }
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      draw(now, dt)
      raf = requestAnimationFrame(frame)
    }

    const update = () => {
      const should = visible && !document.hidden && !reduce
      if (should && !running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(frame)
      } else if (!should && running) {
        running = false
        cancelAnimationFrame(raf)
      }
    }

    resize()
    if (reduce) draw(performance.now(), 0)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    io.observe(parent)

    let resizeTimer: ReturnType<typeof setTimeout>
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        if (reduce) draw(performance.now(), 0)
      }, 150)
    })
    ro.observe(parent)
    document.addEventListener("visibilitychange", update)
    update()

    return () => {
      running = false
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", update)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className={className ?? "pointer-events-none select-none absolute inset-0 z-0"} />
}
