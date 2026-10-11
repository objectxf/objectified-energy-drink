/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // `unoptimized: true` made every <Image> serve the raw 1-2 MB PNG/JPG
    // (that is why the Instagram grid was slow). Optimisation is now on:
    // resized to the real display size and served as AVIF/WebP.
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 160, 256, 384],
  },
}

export default nextConfig
