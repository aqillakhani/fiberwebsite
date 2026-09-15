import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/get-started", destination: "/check-availability", permanent: true },
      { source: "/pricing", destination: "/check-availability", permanent: true },
      { source: "/locations/:city", destination: "/check-availability", permanent: false },
      { source: "/verify-rep", destination: "/", permanent: false },
      // Printed door hangers carry this QR/URL; middleware stores the UTMs on the visitor's cookie.
      { source: "/hanger", destination: "/check-availability?utm_source=door_hanger&utm_medium=print&utm_campaign=hanger-v1", permanent: false },
    ];
  },
};

export default nextConfig;
