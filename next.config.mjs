/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for better-sqlite3 (native module) to work in API routes
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;
