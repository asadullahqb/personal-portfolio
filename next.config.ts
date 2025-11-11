import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "play.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tools.applemediaservices.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
