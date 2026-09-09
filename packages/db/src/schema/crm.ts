import { sql } from "drizzle-orm"
import { boolean, check, date, index, pgTable, text, uuid } from "drizzle-orm/pg-core"

import { createdAt, id, tstz, updatedAt } from "./columns"
import { leadEtapa } from "./enums"
import { pacientes } from "./pacientes"

/**
 * Commercial pipeline (docs/08-REGLAS-SISTEMA.md section 11). Converting a lead creates a
 * patient; unlike the inherited code, the rebuild applies the DNI duplicate check (G-011).
 */
export const leads = pgTable(
  "leads",
  {
    id: id(),
    nombre: text("nombre").notNull(),
    tel: text("tel"),
    origen: text("origen"),
    etapa: leadEtapa("etapa").notNull().default("nuevos"),
    interes: text("interes"),
    proximoContacto: date("proximo_contacto"),
    convertido: boolean("convertido").notNull().default(false),
    motivo: text("motivo"),
    pacienteId: uuid("paciente_id").references(() => pacientes.id),
    creadoEn: tstz("creado_en").notNull().defaultNow(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("leads_etapa_idx").on(t.etapa),
    index("leads_proximo_contacto_idx").on(t.proximoContacto),
  ],
)

export const leadBitacora = pgTable(
  "lead_bitacora",
  {
    id: id(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id),
    f: tstz("f").notNull().defaultNow(),
    t: text("t").notNull(),
    tipo: text("tipo").notNull().default("neutro"),
    createdAt: createdAt(),
  },
  (table) => [
    check("lead_bitacora_tipo_valido", sql`${table.tipo} in ('positivo', 'negativo', 'neutro')`),
  ],
)
