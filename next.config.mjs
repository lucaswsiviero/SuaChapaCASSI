/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve o app sob /suachapacassi (mesmo padrão dos outros projetos em sivie.ro)
  basePath: "/suachapacassi",
  // Required for better-sqlite3 (native module) to work in API routes
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;
