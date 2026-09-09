import { sql } from "drizzle-orm"
import { check, integer, jsonb, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core"

import { createdAt, id, tstz, updatedAt } from "./columns"
import { turnos } from "./agenda"
import { pacientes } from "./pacientes"
import { insumos } from "./stock"

export type Signos = { ta?: string; fc?: number; sato2?: number; temp?: number; peso?: number }

/**
 * One infusion session (docs/08-REGLAS-SISTEMA.md section 6). Duration is the inherited
 * `max(1, floor((fin - inicio) / 60000))`, computed in code at close time.
 * WHEN stock is decremented is contradiction 0.2 and waits for the client.
 */
export const registrosEnfermeria = pgTable(
  "registros_enfermeria",
  {
    id: id(),
    pacienteId: uuid("paciente_id").references(() => pacientes.id),
    turnoId: uuid("turno_id").references(() => turnos.id),
    enfermera: text("enfermera"),
    estado: text("estado").notNull().default("EN CURSO"),
    inicio: tstz("inicio").notNull(),
    fin: tstz("fin"),
    signos: jsonb("signos").$type<Signos>(),
    viaTipo: text("via_tipo"),
    viaCalibre: text("via_calibre"),
    formulaId: uuid("formula_id"),
    formulaNombre: text("formula_nombre"),
    lote: text("lote"),
    duracionMin: integer("duracion_min"),
    observaciones: text("observaciones"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [check("registros_estado_valido", sql`${t.estado} in ('EN CURSO', 'FINALIZADO')`)],
)

/** What each session actually consumed, so a session can be audited or reversed. */
export const registroMateriales = pgTable("registro_materiales", {
  id: id(),
  registroId: uuid("registro_id")
    .notNull()
    .references(() => registrosEnfermeria.id),
  insumoId: uuid("insumo_id")
    .notNull()
    .references(() => insumos.id),
  cantidad: numeric("cantidad", { precision: 10, scale: 3 }).notNull(),
  createdAt: createdAt(),
})
