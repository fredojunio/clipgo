import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Next.js 15, use serverExternalPackages instead
  serverExternalPackages: ["@ffmpeg-installer/ffmpeg"],
};

export default nextConfig;
