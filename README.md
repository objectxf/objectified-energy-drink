<div align="center">
  <h1 align="center">⚡ OBJECTIFIED — High-Performance 3D Energy Drink Showcase</h1>
  <p align="center">
    <b>An elite, ultra-interactive D2C landing page built for modern beverage and functional drink brands.</b><br>
    Designed to deliver an Apple/Awwwards-grade visual experience with buttery-smooth 60+ FPS performance across mobile and desktop devices.
  </p>

  <p align="center">
    <a href="https://objectified.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/🚀_Live_Demo-objectified.vercel.app-purple?style=for-the-badge&logo=vercel" alt="Live Demo">
    </a>
    <img src="https://img.shields.io/badge/Next.js_14+-App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/Tailwind_CSS-Performance_Optimized-38BDF8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Framer_Motion-GPU_Accelerated-EF4444?style=for-the-badge&logo=framer" alt="Framer Motion">
  </p>
</div>

---

## 🌟 What is Objectified?

**Objectified** is a high-end portfolio showcase and product concept engineered to demonstrate the pinnacle of modern web development. Built specifically to target D2C beverage startups, functional drink creators, and innovative brands, it bridges the gap between static e-commerce templates and immersive 3D digital experiences.

---

## ✨ Core Features & Visual Architecture

* **🎨 Dynamic Ambient Lighting System:** The background radial neon glow fluidly transitions and shifts color palettes to match the currently selected beverage flavor (Classic, Mojito, Grape, Mythical).
* **🔄 Interactive 3D Can Viewer:** Immersive rotation physics, nutrition declaration flip cards, and depth-of-field details triggered by user interaction and scroll depth.
* **⚡ Mobile-First 60+ FPS Optimization:** 
  * Replaced heavy client-side scroll listeners with efficient `whileInView` viewport triggers to eliminate main-thread stutter on mobile GPUs (benchmarked on Samsung S23 Ultra and iOS devices).
  * Replaced expensive CPU-bound SVG noise filters (`feTurbulence`) with clean, performant CSS radial gradients and optimized backdrop filters (`backdrop-blur-sm` on mobile vs `backdrop-blur-xl` on desktop).
* **🛡️ Bulletproof Layout Architecture:** Zero horizontal layout shifts (CLS), fixed `overflow-x-clip` containment, and responsive hero scaling.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js (App Router)](https://nextjs.org/) — Server & Client Component architecture.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling with custom CSS variables and GPU acceleration.
* **Animations & Physics:** [Framer Motion](https://www.framer.com/motion/) — Declarative animations optimized for hardware acceleration (`transform-gpu`, `will-change`).
* **Deployment:** [Vercel](https://vercel.com/) — Edge network delivery with instant CI/CD pipelines.

---

## 🚀 Getting Started Locally

To run this project locally on your machine, follow these steps:

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/objectxf/objectified-energy-drink.git
   cd objectified-energy-drink
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the project.

5. **Build for production:**
   \`\`\`bash
   npm run build
   \`\`\`

---

## 📈 Performance Engineering Highlights

* **GPU Acceleration:** All animated containers leverage `transform-gpu` and `will-change-transform` to offload painting from the CPU to the device graphics processor.
* **Asset & Image Pipeline:** Integrated Next.js optimized `<Image />` component with lazy loading (`loading="lazy"`) for below-the-fold assets, ensuring instant First Contentful Paint (FCP).

---

## 📬 Business Inquiries & Collaboration

Looking to elevate your beverage brand's digital presence with a high-converting 3D interactive showcase? 

* **Live Showcase:** [objectified.vercel.app](https://objectified.vercel.app/)
* **GitHub Profile:** [@objectxf](https://github.com/objectxf)

---
<p align="center"><i>Engineered with precision for maximum visual impact.</i></p>
