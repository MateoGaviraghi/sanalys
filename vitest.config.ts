import { defineConfig } from "vitest/config"

/**
 * The four critical tests of docs/11-ROADMAP.md land here from WU-02 on.
 * Until then the suite is empty on purpose and must stay green.
 */
export default defineConfig({
  test: {
    passWithNoTests: true,
    include: ["**/*.test.ts"],
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "sistema-interno/**",
      "brandign-sanalys/**",
    ],
  },
})
