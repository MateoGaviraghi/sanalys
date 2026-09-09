import type { NextConfig } from "next"

/**
 * Scaffold only. Security headers and CSP land here in WU-05 (web) and WU-12 (sistema),
 * per docs/06-SEGURIDAD.md section 5.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
}

export default nextConfig
