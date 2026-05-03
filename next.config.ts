import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Satisfactory-Planner-FR',
  assetPrefix: '/Satisfactory-Planner-FR',
};

export default nextConfig;
