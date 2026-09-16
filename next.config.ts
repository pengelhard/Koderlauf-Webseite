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
        source: "/fassjagd/:slug/og.jpg",
        destination: "/api/fassjagd/og/:slug",
      },
    ];
  },
  async headers() {
    const noStoreIcon = [
      { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
    ];
    return [
      "/favicon.ico",
      "/koder-icon.png",
      "/koder-icon-192.png",
      "/koder-icon.svg",
      "/apple-touch-icon.png",
      "/mascot-koderlauf.png",
    ].map((source) => ({ source, headers: noStoreIcon }));
  },
};

export default nextConfig;
