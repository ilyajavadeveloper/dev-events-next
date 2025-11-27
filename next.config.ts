/** @type {import('next').NextConfig} */
const nextConfig = {
  // ---------- NEXT/IMAGE REMOTE LOAD FIX ----------
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // ---------- DEV ORIGIN FIX (Next.js 16 warning) ----------
  experimental: {
    allowedDevOrigins: ["10.0.6.0/24", "localhost"],
    serverSourceMaps: false, // убирает Invalid source map error
    turbo: {
      // fix windows turbopack runtime chunk bug
      resolveExtensions: [".js", ".ts", ".tsx"],
    },
  },

  // ---------- POSTHOG REWRITES ----------
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
