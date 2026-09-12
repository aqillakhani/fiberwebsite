import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/get-started", destination: "/check-availability", permanent: true },
      { source: "/locations/:city", destination: "/check-availability", permanent: false },
      { source: "/verify-rep", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
