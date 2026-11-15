import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async rewrites() { return [{ source: "/backend/:path*", destination: `${process.env.API_URL || "http://localhost:5042"}/api/:path*` }]; },
};
export default nextConfig;
