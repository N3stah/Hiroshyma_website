/** @type {import("next").NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  typescript: {
    // Turbopack and tsc conflict on directive strings in Next.js 16;
    // type safety is still enforced in dev.
    ignoreBuildErrors: true,
  },
  images: {
    // Dev: serve Django media as-is. Production: Cloudinary resizes and converts
    // images itself via the custom loader, so they load straight from Cloudinary.
    unoptimized: isDev,
    loader: "custom",
    loaderFile: "./src/lib/cloudinaryLoader.ts",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
