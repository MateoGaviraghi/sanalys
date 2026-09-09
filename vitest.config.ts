import { existsSync, readFileSync } from "node:fs"

import { defineConfig } from "vitest/config"

// The integration tests need a database. The connection string lives in an untracked
// packages/db/.env.local; without it those suites skip themselves and CI stays green.
const archivoEnv = "packages/db/.env.local"

if (existsSync(archivoEnv)) {
  for (const linea of readFileSync(archivoEnv, "utf8").split(/\r?\n/)) {
    const limpia = linea.trim()
    if (limpia === "" || limpia.startsWith("#")) continue
    const corte = limpia.indexOf("=")
    if (corte === -1) continue
    const clave = limpia.slice(0, corte).trim()
    if (!process.env[clave]) process.env[clave] = limpia.slice(corte + 1).trim()
  }
}

/**
 * The four critical tests of docs/11-ROADMAP.md land here from WU-02 on.
 * Until then the suite is empty on purpose and must stay green.
 */
export default defineConfig({
  test: {
    passWithNoTests: true,
    include: ["**/*.test.ts"],
    testTimeout: 30_000,
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "sistema-interno/**",
      "brandign-sanalys/**",
    ],
  },
})
