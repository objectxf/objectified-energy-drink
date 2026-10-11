/**
 * Ambient lighting colour. Everything that glows (background wash, hero halo,
 * particles, scroll bar, neon headings) reads the `--ambient` CSS variable, and
 * `@property --ambient` in globals.css makes the change transition smoothly.
 * Setting one variable means no React re-renders and no context.
 */
export function setAmbient(color: string) {
  if (typeof document === "undefined") return
  document.documentElement.style.setProperty("--ambient", color)
}
