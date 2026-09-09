/**
 * The internal system's database handle. It is bound to the full schema and is used with
 * the `sanalys_app` role's pooled connection string (docs/03-DATOS.md section 6).
 *
 * The connection string is passed in by the app, which reads it through its validated env
 * module; this package never touches process.env.
 */
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import * as schema from "../schema/index.ts"

export const crearDb = (connectionString: string) => drizzle(neon(connectionString), { schema })

export type DbSistema = ReturnType<typeof crearDb>
