import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prod: Supabase storage. Dev: file lokal di public/uploads (tidak lewat next/image — pakai <img>)
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
  },
};

export default nextConfig;
