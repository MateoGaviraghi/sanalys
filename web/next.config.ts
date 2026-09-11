import type { NextConfig } from "next"

/**
 * Scaffold only. Security headers and CSP land here in WU-05 (web) and WU-12 (sistema),
 * per docs/06-SEGURIDAD.md section 5.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,

  /**
   * `next dev` escribe web/AGENTS.md y web/CLAUDE.md en cada arranque, con reglas genericas
   * de Next para agentes. Un chat futuro que abriera web/ las leeria como instrucciones del
   * proyecto y pisarian a las de CLAUDE.md de la raiz. Las instrucciones de este repo son las
   * del repo: se apaga.
   */
  agentRules: false,
}

export default nextConfig
