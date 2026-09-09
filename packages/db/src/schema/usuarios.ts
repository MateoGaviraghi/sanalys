import { sql } from "drizzle-orm"
import { boolean, check, numeric, pgTable, text } from "drizzle-orm/pg-core"

import { createdAt, id, updatedAt } from "./columns"

/** The closed permission list of docs/06-SEGURIDAD.md section 4. */
export const PERMISOS = [
  "admin",
  "pacientes",
  "stock",
  "formulas",
  "caja",
  "balance",
  "agenda",
  "enfermeria",
  "sueros",
  "legal",
  "crm",
] as const

/**
 * The single source of authorization (docs/03-DATOS.md section 3.1).
 * Clerk holds identity only; the role and the permissions are read from this row.
 */
export const usuarios = pgTable(
  "usuarios",
  {
    id: id(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").notNull().unique(),
    nombre: text("nombre").notNull(),
    rol: text("rol").notNull().default("operativo"),
    permisos: text("permisos").array().notNull().default(sql`'{}'::text[]`),
    activo: boolean("activo").notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check("usuarios_rol_valido", sql`${t.rol} in ('admin', 'operativo')`),
    check(
      "usuarios_permisos_validos",
      sql`${t.permisos} <@ array['admin','pacientes','stock','formulas','caja','balance','agenda','enfermeria','sueros','legal','crm']::text[]`,
    ),
  ],
)

/** Doctors and partners (docs/03-DATOS.md section 3.1). Percentages are 0..100. */
export const personas = pgTable(
  "personas",
  {
    id: id(),
    nombre: text("nombre").notNull(),
    dni: text("dni"),
    tel: text("tel"),
    email: text("email"),
    especialidad: text("especialidad"),
    matricula: text("matricula"),
    esMedica: boolean("es_medica").notNull().default(false),
    pctMedicaIndividual: numeric("pct_medica_individual", { precision: 5, scale: 2 }),
    esSocia: boolean("es_socia").notNull().default(false),
    parteSociedad: numeric("parte_sociedad", { precision: 5, scale: 2 }),
    activo: boolean("activo").notNull().default(true),
    tipo: text("tipo"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check(
      "personas_pct_medica_rango",
      sql`${t.pctMedicaIndividual} is null or (${t.pctMedicaIndividual} >= 0 and ${t.pctMedicaIndividual} <= 100)`,
    ),
    check(
      "personas_parte_sociedad_rango",
      sql`${t.parteSociedad} is null or (${t.parteSociedad} >= 0 and ${t.parteSociedad} <= 100)`,
    ),
  ],
)
