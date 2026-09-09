import next from "eslint-config-next"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

/**
 * Flat config for the whole workspace. Next 16 has no `next lint`, so `pnpm lint`
 * runs `eslint .` from the root (docs/02-STACK.md section 2).
 */
const config = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/next-env.d.ts",
      // Read-only parity reference and git-ignored identity sources: never linted, never edited.
      "sistema-interno/**",
      "brandign-sanalys/**",
    ],
  },
  ...next,
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    settings: {
      next: { rootDir: ["web/", "sistema/"] },
      // Pinned on purpose: eslint-plugin-react's "detect" path calls context.getFilename(),
      // which ESLint 10 removed, and it crashes the run (G-021).
      react: { version: "19.2.8" },
    },
  },
]

export default config
