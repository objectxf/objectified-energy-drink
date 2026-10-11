export type Flavor = {
  id: string
  name: string
  tagline: string
  description: string
  image: string
  accent: string
  badges: string[]
  unreleased?: boolean
}

export const flavors: Flavor[] = [
  {
    id: "classic",
    name: "Classic",
    tagline: "SIGNATURE FOCUS",
    description: "The original objectified blend. Matte black, electric edge, locked-in focus from first sip.",
    image: "/images/can-front.jpg",
    accent: "#E5FF00",
    badges: ["Zero Sugar", "Nootropic Blend", "200mg Caffeine"],
  },
  {
    id: "mojito",
    name: "Mojito",
    tagline: "ZESTY MINT-LIME",
    description: "Crisp mint and fresh-cut lime. A cool, clean rush that keeps you sharp without the crash.",
    image: "/images/can-mojito.jpg",
    accent: "#4ADE80",
    badges: ["Zero Sugar", "Real Mint", "Electrolytes"],
  },
  {
    id: "grape",
    name: "Grape",
    tagline: "DARK GRAPE",
    description: "Deep, moody dark grape with a sharp electric finish. Late-night focus, bottled in matte black.",
    image: "/images/can-grape.jpg",
    accent: "#B565F2",
    badges: ["Zero Sugar", "Dark Grape", "B-Vitamins"],
  },
  {
    id: "mythical",
    name: "MYTHICAL",
    tagline: "\u2022 UNRELEASED / DROPPING SOON",
    description: "Formula classified. Flavor profile redacted. Only the waitlist gets the first drop.",
    image: "/images/can-front.jpg",
    accent: "#D4D4D8",
    badges: ["Classified", "Limited Run", "???"],
    unreleased: true,
  },
]
