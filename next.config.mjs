/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/api/brand-icon" }];
  },
};

export default nextConfig;
