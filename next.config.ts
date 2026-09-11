import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dulsyqvhylxjdtntbzbw.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/anmeldungen", destination: "/teilnehmer", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/RRPublish/:path*",
        destination: "https://my.raceresult.com/RRPublish/:path*",
      },
      {
        source: "/RRComponents/:path*",
        destination: "https://my.raceresult.com/RRComponents/:path*",
      },
      {
        source: "/391760/:path*",
        destination: "https://my.raceresult.com/391760/:path*",
      },
    ];
  },
};

export default nextConfig;
