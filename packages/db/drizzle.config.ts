import { defineConfig } from "drizzle-kit"

/**
 * drizzle-kit runs as a CLI, outside Next's validated env module, so it reads the
 * variable directly. `DATABASE_URL_DIRECT` is the unpooled Neon string of the
 * `sanalys_migrate` role: DDL only, never used at runtime
 * (docs/03-DATOS.md section 6, docs/06-SEGURIDAD.md section 6).
 */
const url = process.env.DATABASE_URL_DIRECT

if (!url) {
  throw new Error(
    "DATABASE_URL_DIRECT is not set. It is the direct (unpooled) Neon connection string " +
      "for the sanalys_migrate role; it lives in an untracked .env.local, never in the repo.",
  )
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/*.ts",
  out: "./migrations",
  dbCredentials: { url },
  strict: true,
  verbose: true,
})
