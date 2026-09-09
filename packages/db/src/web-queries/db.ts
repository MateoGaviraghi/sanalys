/**
 * The public site's database handle: a deliberately narrow surface (docs/03-DATOS.md
 * section 6). `web/` may read rooms, the agenda configuration and published news, insert a
 * booking, and count its own rate limits. It never reads a clinical or a money table.
 *
 * What actually enforces that is the `sanalys_web` Postgres role and its grants in
 * migrations/0001_init.sql — this narrowed schema only makes the boundary visible in code.
 * Availability is read through the `turnos_ocupacion` view, which is added with the booking
 * queries in WU-08; the `turnos` table appears here only because the site inserts into it.
 */
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { config, novedades, rateLimits, salas, turnos } from "../schema/index.ts"

export const esquemaWeb = { salas, config, novedades, turnos, rateLimits }

export const crearDbWeb = (connectionString: string) =>
  drizzle(neon(connectionString), { schema: esquemaWeb })

export type DbWeb = ReturnType<typeof crearDbWeb>
