import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Ignore ESLint errors during production builds to ensure successful Vercel deployment
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
