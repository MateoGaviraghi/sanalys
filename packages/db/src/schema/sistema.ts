import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core"

import { createdAt, id, tstz, updatedAt } from "./columns.ts"
import { personas } from "./usuarios.ts"

/**
 * News, written in the internal system and read by the public site through ISR (D-009).
 * The author must be a `personas` row with a matrícula — enforced by a trigger in
 * 0001_init.sql, because a FK cannot express "and that row has a matrícula".
 */
export const novedades = pgTable(
  "novedades",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    titulo: text("titulo").notNull(),
    resumen: text("resumen"),
    cuerpoMd: text("cuerpo_md").notNull(),
    autoraPersonaId: uuid("autora_persona_id")
      .notNull()
      .references(() => personas.id),
    publicada: boolean("publicada").notNull().default(false),
    publicadaAt: tstz("publicada_at"),
    actualizadaAt: tstz("actualizada_at"),
    portadaR2Key: text("portada_r2_key"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("novedades_publicadas_idx").on(t.publicada, t.publicadaAt.desc())],
)

/**
 * The 14 inherited configuration documents, one row each, seeded with their defaults
 * (docs/08-REGLAS-SISTEMA.md section 12). Client-changeable parameters live here —
 * percentages, slot duration, capacity, timeout, thresholds, templates — never as constraints.
 */
export const config = pgTable("config", {
  clave: text("clave").primaryKey(),
  valor: jsonb("valor").notNull(),
  actualizadoPor: text("actualizado_por"),
  updatedAt: updatedAt(),
})

/**
 * Append-only audit trail. `usuario` comes from the server session, never from the request;
 * the app role has no UPDATE or DELETE on this table (0001_init.sql).
 */
export const auditoria = pgTable(
  "auditoria",
  {
    id: id(),
    ts: tstz("ts").notNull().defaultNow(),
    usuarioId: uuid("usuario_id"),
    usuario: text("usuario"),
    accion: text("accion").notNull(),
    detalle: text("detalle"),
    tabla: text("tabla"),
    filaId: uuid("fila_id"),
    antes: jsonb("antes"),
    despues: jsonb("despues"),
  },
  (t) => [index("auditoria_ts_idx").on(t.ts.desc())],
)

/**
 * Rate limiting for the public forms and the system's mutations (docs/06-SEGURIDAD.md
 * section 5). Vercel KV is paid, so the counter lives in Postgres: booking 5/h per phone
 * and 20/h per IP, contact 5/h per IP, system mutations 120/min per user.
 */
export const rateLimits = pgTable(
  "rate_limits",
  {
    key: text("key").notNull(),
    windowStart: tstz("window_start").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.key, t.windowStart] })],
)
