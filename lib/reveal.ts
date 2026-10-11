import type { Variants } from "framer-motion"

/**
 * Masked "slide up" reveal for headings that sit inside an `overflow-hidden` box.
 *
 * The trigger lives on the heading itself (visible box), and the lines inherit it through
 * variants. Do NOT put `whileInView` on the lines: while a line is translated outside the
 * clipping box the browser reports it as not intersecting, so it never starts and the text
 * stays invisible (that is what hid "GET OBJECTIFIED" on phones).
 */
export const revealParent: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.1, staggerChildren: 0.1 } },
}

export const revealLine: Variants = {
  hidden: { y: "110%" },
  visible: { y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] } },
}
