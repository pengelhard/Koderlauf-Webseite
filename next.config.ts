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
};

export default nextConfig;
