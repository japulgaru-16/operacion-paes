import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" solo para entornos propios (contenedor local).
  // En Vercel (process.env.VERCEL) se usa el despliegue estándar.
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
