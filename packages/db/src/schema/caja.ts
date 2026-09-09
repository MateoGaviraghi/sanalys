import { sql } from "drizzle-orm"
import {
  boolean,
  char,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

import { createdAt, id, tstz, updatedAt } from "./columns.ts"
import { cajaTipo } from "./enums.ts"

/** `CIERRE` rows carry the inherited arqueo: counted cash, system total, difference, bills. */
export type Arqueo = {
  fisico?: string
  sistema?: string
  diferencia?: string
  motivo?: string
  billetes?: { valor: number; cantidad: number }[]
}

/**
 * Cash book (docs/08-REGLAS-SISTEMA.md section 9). Money is numeric(12,2) and always > 0;
 * a refund is an EGRESO, never a negative INGRESO. Movements in a closed period are
 * rejected by the `caja_periodo_abierto` trigger (0001_init.sql, critical test 4).
 */
export const cajaMovimientos = pgTable(
  "caja_movimientos",
  {
    id: id(),
    /** Groups the items of one ticket; all of them share the same OI number (G-010). */
    ticketId: uuid("ticket_id"),
    nroComp: text("nro_comp").notNull(),
    tipo: cajaTipo("tipo").notNull(),
    det: text("det"),
    monto: numeric("monto", { precision: 12, scale: 2 }).notNull(),
    medio: text("medio").notNull(),
    dni: text("dni"),
    fecha: tstz("fecha").notNull(),
    usuario: text("usuario"),
    profesional: text("profesional"),
    centroCosto: text("centro_costo"),
    honorarioCalculado: numeric("honorario_calculado", { precision: 12, scale: 2 }),
    esHonorario: boolean("es_honorario").notNull().default(false),
    esTraspaso: boolean("es_traspaso").notNull().default(false),
    destino: text("destino"),
    anulado: boolean("anulado").notNull().default(false),
    motivoAnulacion: text("motivo_anulacion"),
    anuladoPor: text("anulado_por"),
    anuladoAt: tstz("anulado_at"),
    periodo: char("periodo", { length: 7 }).notNull(),
    arqueo: jsonb("arqueo").$type<Arqueo>(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check("caja_monto_positivo", sql`${t.monto} > 0`),
    check("caja_periodo_formato", sql`${t.periodo} ~ '^[0-9]{4}-[0-9]{2}$'`),
    /** Only EGRESO and CIERRE numbers are unique; INGRESO rows share the ticket's number. */
    uniqueIndex("caja_nro_comp_unico_egreso_cierre")
      .on(t.nroComp)
      .where(sql`${t.tipo} in ('EGRESO', 'CIERRE')`),
    index("caja_periodo_fecha_idx").on(t.periodo, t.fecha),
    index("caja_dni_idx").on(t.dni),
    index("caja_nro_comp_idx").on(t.nroComp),
  ],
)

/**
 * One counter per prefix and year, read with SELECT ... FOR UPDATE inside the ticket
 * transaction. This is what removes the inherited "max + 1 in memory" race (G-009).
 * Prefixes: OI, OE, OT, OH, OR, CC. Format `PREFIJO-YY-NNNN`.
 */
export const comprobantesSeq = pgTable(
  "comprobantes_seq",
  {
    prefijo: text("prefijo").notNull(),
    anio: integer("anio").notNull(),
    ultimo: integer("ultimo").notNull().default(0),
    updatedAt: updatedAt(),
  },
  (t) => [primaryKey({ columns: [t.prefijo, t.anio] })],
)

export const periodosCerrados = pgTable("periodos_cerrados", {
  periodo: char("periodo", { length: 7 }).primaryKey(),
  cerradoPor: text("cerrado_por"),
  cerradoAt: tstz("cerrado_at").notNull().defaultNow(),
})

/** Inherited `config/saldoInicial_{periodo}`, promoted to its own table. */
export const saldosIniciales = pgTable("saldos_iniciales", {
  periodo: char("periodo", { length: 7 }).primaryKey(),
  monto: numeric("monto", { precision: 12, scale: 2 }).notNull(),
  usuario: text("usuario"),
  fecha: tstz("fecha").notNull().defaultNow(),
})

/** Admin > Inversiones. `tipo` in FCI, Plazo Fijo, Criptomonedas, Acciones, Inmueble, Fondo Reserva, Otro. */
export const inversiones = pgTable("inversiones", {
  id: id(),
  descripcion: text("descripcion").notNull(),
  tipo: text("tipo"),
  entidad: text("entidad"),
  fechaInicio: date("fecha_inicio"),
  fechaVenc: date("fecha_venc"),
  capital: numeric("capital", { precision: 12, scale: 2 }),
  valorActual: numeric("valor_actual", { precision: 12, scale: 2 }),
  estado: text("estado"),
  notas: text("notas"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

/**
 * `deudas` is deliberately absent: it appears only in the inherited backup list and its
 * shape is unknown (OQ-08). It is created in the unit that receives the client's answer,
 * not guessed here.
 */
