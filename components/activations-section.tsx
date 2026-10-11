"use client"

import { revealLine, revealParent } from "@/lib/reveal"
import { motion, useInView } from "framer-motion"
import { useSound } from "./sound-provider"
import { useRef } from "react"
import { Sparkles, Dumbbell, Building2, Calendar } from "lucide-react"

const activations = [
  {
    icon: Sparkles,
    title: "Free Tasting Events",
    description: "Experience objectified at exclusive tasting events near you.",
    cta: "Find Events",
  },
  {
    icon: Dumbbell,
    title: "Gyms & Studios",
    description: "Partner with us to fuel your fitness community.",
    cta: "Partner With Us",
  },
  {
    icon: Building2,
    title: "Corporate Offices",
    description: "Power up your workplace. Bulk orders available.",
    cta: "Get Quote",
  },
  {
    icon: Calendar,
    title: "Event Organizers",
    description: "Sponsor your next event with objectified energy.",
    cta: "Sponsor Event",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
}

export function ActivationsSection() {
  const { play } = useSound()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="distributors" className="relative py-16 bg-[#09090B]/75 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-10"
        >
          <motion.span
            className="font-mono text-[#B9B9C2] md:text-[#A1A1AA] text-xs tracking-widest inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            ACTIVATIONS
          </motion.span>
          <motion.h2
            className="text-3xl md:text-5xl font-black text-white tracking-tighter mt-2 overflow-hidden"
            variants={revealParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            <motion.span
              className="inline-block text-gloss"
              variants={revealLine}
            >
              EXPERIENCE{" "}
            </motion.span>
            <motion.span
              className="text-shine inline-block"
              variants={revealLine}
            >
              GIGI
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-sm text-[#B9B9C2] md:text-[#A1A1AA] font-mono mt-2 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            From tasting events to corporate partnerships, bring objectified into your world.
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {activations.map((activation, index) => (
            <motion.div
              key={activation.title}
              onClick={() => play("click")}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              className="group bg-[#18181B] border border-white/10 rounded-2xl p-6 cursor-pointer relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-[#E5FF00]/0 group-hover:bg-[#E5FF00]"
                transition={{ duration: 0.4 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="w-11 h-11 rounded-xl bg-[#E5FF00] flex items-center justify-center mb-4 group-hover:bg-[#121212] transition-colors duration-300"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <activation.icon className="w-5 h-5 text-[#121212] group-hover:text-[#E5FF00] transition-colors duration-300" />
                </motion.div>

                <h3 className="text-lg font-black text-white group-hover:text-[#121212] tracking-tight mb-2 transition-colors duration-300">
                  {activation.title}
                </h3>
                <p className="text-white/60 group-hover:text-black/60 font-mono text-xs leading-relaxed mb-4 transition-colors duration-300">
                  {activation.description}
                </p>

                <motion.button
                  className="flex items-center gap-2 text-[#E5FF00] group-hover:text-[#121212] font-bold text-xs tracking-wide transition-colors duration-300"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {activation.cta}
                  <motion.svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </motion.svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
