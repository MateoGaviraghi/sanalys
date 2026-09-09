/**
 * `pnpm db:seed` — idempotent. It inserts only what is missing, so running it twice never
 * overwrites a value the clinic changed from Admin.
 *
 * Needs DATABASE_URL_DIRECT (the unpooled Neon string). Run with Node's type stripping:
 * `node --experimental-strip-types seeds/index.ts`.
 */
import { neon } from "@neondatabase/serverless"
import { inArray } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-http"

import { config, formulas } from "../src/schema/index.ts"
import { CONFIG_SEED } from "./config.ts"
import { DRIPS_SEED } from "./formulas.ts"
import { SALAS_SEED } from "./salas.ts"

const url = process.env.DATABASE_URL_DIRECT

if (!url) {
  throw new Error(
    "DATABASE_URL_DIRECT is not set. It is the direct (unpooled) Neon connection string; " +
      "it lives in an untracked .env.local, never in the repo.",
  )
}

const db = drizzle(neon(url))

const configInsertadas = await db
  .insert(config)
  .values(CONFIG_SEED.map((row) => ({ clave: row.clave, valor: row.valor })))
  .onConflictDoNothing()
  .returning({ clave: config.clave })

const drips = [...DRIPS_SEED]
const yaEstan = await db
  .select({ nombre: formulas.nombre })
  .from(formulas)
  .where(inArray(formulas.nombre, drips))

const faltantes = drips.filter((nombre) => !yaEstan.some((f) => f.nombre === nombre))

if (faltantes.length > 0) {
  await db.insert(formulas).values(faltantes.map((nombre) => ({ nombre })))
}

console.log(`config: ${configInsertadas.length} nuevas de ${CONFIG_SEED.length}`)
console.log(`formulas (Drips): ${faltantes.length} nuevas de ${drips.length}`)
console.log(`salas: ${SALAS_SEED.length} (ver seeds/salas.ts)`)
