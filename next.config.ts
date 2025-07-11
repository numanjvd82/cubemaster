import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "@prisma/client": "commonjs @prisma/client",
      });
    }
    return config;
  },
  // Ensure static files are included in the build
  async rewrites() {
    return [];
  },
};

export default nextConfig;
