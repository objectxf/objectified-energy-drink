"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react"
import type React from "react"
import { Volume2, VolumeX } from "lucide-react"

export type SoundName = "click" | "flip" | "flavor" | "toggle"

type SoundContextValue = {
  enabled: boolean
  toggle: () => void
  play: (name: SoundName, variant?: number) => void
}

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => {},
  play: () => {},
})

export const useSound = () => useContext(SoundContext)

type AudioCtor = typeof AudioContext

function getAudioCtor(): AudioCtor | null {
  const w = window as unknown as { AudioContext?: AudioCtor; webkitAudioContext?: AudioCtor }
  return w.AudioContext ?? w.webkitAudioContext ?? null
}

type ToneOpts = { type?: OscillatorType; from: number; to?: number; at?: number; dur: number; gain: number }
type NoiseOpts = { type: BiquadFilterType; from: number; to: number; at?: number; dur: number; gain: number; q?: number }

function tone(ctx: AudioContext, out: AudioNode, o: ToneOpts) {
  const t = ctx.currentTime + (o.at ?? 0)
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = o.type ?? "sine"
  osc.frequency.setValueAtTime(o.from, t)
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(o.gain, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
  osc.connect(g)
  g.connect(out)
  osc.start(t)
  osc.stop(t + o.dur + 0.03)
}

function noise(ctx: AudioContext, out: AudioNode, buf: AudioBuffer, o: NoiseOpts) {
  const t = ctx.currentTime + (o.at ?? 0)
  const src = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const g = ctx.createGain()
  src.buffer = buf
  filter.type = o.type
  filter.Q.value = o.q ?? 0.8
  filter.frequency.setValueAtTime(o.from, t)
  filter.frequency.exponentialRampToValueAtTime(o.to, t + o.dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(o.gain, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur)
  src.connect(filter)
  filter.connect(g)
  g.connect(out)
  src.start(t)
  src.stop(t + o.dur + 0.03)
}

// All sounds are synthesised, very quiet, and under ~0.3s. No audio files.
const SOUNDS: Record<SoundName, (ctx: AudioContext, out: AudioNode, buf: AudioBuffer, variant: number) => void> = {
  click: (ctx, out) => {
    tone(ctx, out, { from: 1400, to: 800, dur: 0.05, gain: 0.05 })
    tone(ctx, out, { type: "triangle", from: 220, dur: 0.04, gain: 0.03 })
  },
  flip: (ctx, out, buf) => {
    noise(ctx, out, buf, { type: "bandpass", from: 500, to: 3800, dur: 0.24, gain: 0.07, q: 1.2 })
    tone(ctx, out, { from: 1760, dur: 0.22, gain: 0.035, at: 0.12 })
    tone(ctx, out, { from: 2637, dur: 0.16, gain: 0.02, at: 0.13 })
  },
  flavor: (ctx, out, buf, variant) => {
    const base = 392 * Math.pow(2, (variant * 3) / 12)
    noise(ctx, out, buf, { type: "highpass", from: 4000, to: 7000, dur: 0.16, gain: 0.035 })
    tone(ctx, out, { type: "triangle", from: base, dur: 0.11, gain: 0.045 })
    tone(ctx, out, { type: "triangle", from: base * 1.5, dur: 0.16, gain: 0.04, at: 0.07 })
  },
  toggle: (ctx, out) => {
    tone(ctx, out, { from: 660, to: 990, dur: 0.12, gain: 0.05 })
    tone(ctx, out, { from: 1320, dur: 0.1, gain: 0.025, at: 0.07 })
  },
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false) // muted by default
  const enabledRef = useRef(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const outRef = useRef<AudioNode | null>(null)
  const noiseRef = useRef<AudioBuffer | null>(null)

  // The AudioContext is created lazily, inside a user gesture (the toggle click).
  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = getAudioCtor()
      if (!Ctor) return null
      const ctx = new Ctor()
      const master = ctx.createGain()
      master.gain.value = 0.7
      const limiter = ctx.createDynamicsCompressor()
      master.connect(limiter)
      limiter.connect(ctx.destination)
      const buf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      ctxRef.current = ctx
      outRef.current = master
      noiseRef.current = buf
    }
    const ctx = ctxRef.current
    if (ctx.state === "suspended") void ctx.resume()
    return ctx
  }, [])

  const play = useCallback(
    (name: SoundName, variant = 0) => {
      if (!enabledRef.current) return
      const ctx = ensure()
      const out = outRef.current
      const buf = noiseRef.current
      if (!ctx || !out || !buf) return
      SOUNDS[name](ctx, out, buf, variant)
    },
    [ensure],
  )

  const toggle = useCallback(() => {
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)
    if (next) {
      play("toggle")
    } else if (ctxRef.current && ctxRef.current.state === "running") {
      void ctxRef.current.suspend() // stop the audio thread while muted
    }
  }, [play])

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function SoundToggle() {
  const { enabled, toggle } = useSound()
  const Icon = enabled ? Volume2 : VolumeX

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Mute interface sounds" : "Unmute interface sounds"}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-[#09090B]/90 text-white/70 transition-colors hover:border-white/40 hover:text-white md:bg-[#09090B]/70 md:backdrop-blur-md"
    >
      <Icon className={`h-5 w-5 ${enabled ? "text-[color:var(--ambient)]" : ""}`} aria-hidden="true" />
    </button>
  )
}
