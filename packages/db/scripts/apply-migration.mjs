/**
 * `pnpm db:migrate` — applies the migrations in migrations/ in journal order.
 *
 * Why not `drizzle-kit migrate`: against Neon it exits 1 with an empty error message
 * (G-028), which is unusable when a 93-statement file fails on one line. This sends each
 * statement over Neon's HTTP driver and, on failure, prints which statement failed, the
 * database's own message, and the first lines of that statement.
 *
 * It records applied migrations in drizzle's own table, with drizzle's own hash, so the
 * two stay compatible if drizzle-kit is ever used again.
 *
 * Caveat: statements are sent one by one, so a migration is NOT atomic. If one fails
 * half-way the database is left half-migrated and the fix is manual — acceptable because
 * every migration is applied to a throwaway Neon branch first.
 *
 * Needs DATABASE_URL_DIRECT: the unpooled string of a role that OWNS schema public
 * (G-027). On Neon that is the project owner, not sanalys_migrate.
 */
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { neon } from "@neondatabase/serverless"

const aqui = dirname(fileURLToPath(import.meta.url))
const carpeta = resolve(aqui, "..", "migrations")

const url = process.env.DATABASE_URL_DIRECT

if (!url) {
  console.error(
    "DATABASE_URL_DIRECT is not set. It is the direct (unpooled) Neon connection string of\n" +
      "the role that owns schema public; it lives in an untracked .env.local, never in the repo.",
  )
  process.exit(1)
}

const sql = neon(url)

const filas = async (texto, params) => {
  const r = await sql.query(texto, params)
  return Array.isArray(r) ? r : (r?.rows ?? [])
}

/** Statements are separated by drizzle's marker, and comment-only chunks are skipped. */
const partir = (contenido) =>
  contenido
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => {
      const sinComentarios = s
        .split("\n")
        .filter((l) => !l.trim().startsWith("--"))
        .join("\n")
        .trim()
      return sinComentarios.length > 0
    })

await sql.query("create schema if not exists drizzle")
await sql.query(
  "create table if not exists drizzle.__drizzle_migrations (id serial primary key, hash text not null, created_at bigint)",
)

const yaAplicadas = new Set(
  (await filas("select hash from drizzle.__drizzle_migrations")).map((f) => f.hash),
)

const journal = JSON.parse(readFileSync(join(carpeta, "meta", "_journal.json"), "utf8"))

for (const entrada of journal.entries) {
  const archivo = join(carpeta, `${entrada.tag}.sql`)
  const contenido = readFileSync(archivo, "utf8")
  const hash = createHash("sha256").update(contenido).digest("hex")

  if (yaAplicadas.has(hash)) {
    console.log(`= ${entrada.tag} ya estaba aplicada`)
    continue
  }

  const statements = partir(contenido)
  let i = 0

  for (const statement of statements) {
    i += 1
    try {
      await sql.query(statement)
    } catch (e) {
      console.error(`\nFALLO en ${entrada.tag}, statement ${i} de ${statements.length}:`)
      console.error(e.message)
      console.error("---")
      console.error(statement.slice(0, 400))
      process.exit(1)
    }
  }

  await sql.query(
    "insert into drizzle.__drizzle_migrations (hash, created_at) values ($1, $2)",
    [hash, entrada.when],
  )
  console.log(`+ ${entrada.tag}: ${statements.length} statements aplicados`)
}

// The bookkeeping schema is created here, by whoever runs the migration, but it belongs to
// the migration role: otherwise `pg_dump` run as sanalys_migrate stops with "permission
// denied for schema drizzle" and the daily backup never completes (G-032).
try {
  await sql.query(`do $do$
    begin
      if exists (select 1 from pg_roles where rolname = 'sanalys_migrate') then
        execute 'alter schema drizzle owner to sanalys_migrate';
        execute 'alter table drizzle.__drizzle_migrations owner to sanalys_migrate';
      end if;
    end
  $do$;`)
} catch (e) {
  console.warn(`aviso: no se pudo pasar el esquema drizzle a sanalys_migrate (${e.message})`)
}

console.log("migraciones al dia")
