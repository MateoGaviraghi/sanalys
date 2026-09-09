import { sql } from "drizzle-orm"
import { check, date, integer, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core"

import { createdAt, id, tstz, updatedAt } from "./columns.ts"
import { insumoTipo } from "./enums.ts"

/**
 * Stock (docs/08-REGLAS-SISTEMA.md section 8). `stock_disp` can never go negative: the
 * CHECK is the safety net, the action carries the inherited message
 * "Stock insuficiente de ...". The three conversion functions live in code (WU-17).
 */
export const insumos = pgTable(
  "insumos",
  {
    id: id(),
    /** Upper-cased on write, as the inherited screen does. */
    nombre: text("nombre").notNull().unique(),
    lab: text("lab"),
    tipo: insumoTipo("tipo").notNull(),
    concentracion: numeric("concentracion", { precision: 6, scale: 2 }),
    volPorVial: numeric("vol_por_vial", { precision: 10, scale: 3 }),
    unidadVial: text("unidad_vial"),
    unidadUso: text("unidad_uso"),
    stockDisp: numeric("stock_disp", { precision: 12, scale: 3 }).notNull().default("0"),
    stockDispMl: numeric("stock_disp_ml", { precision: 12, scale: 3 }),
    costo: numeric("costo", { precision: 12, scale: 2 }),
    lote: text("lote"),
    fechaVencimiento: date("fecha_vencimiento"),
    minimoViales: numeric("minimo_viales", { precision: 10, scale: 2 }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [check("insumos_stock_no_negativo", sql`${t.stockDisp} >= 0`)],
)

export const formulas = pgTable("formulas", {
  id: id(),
  nombre: text("nombre").notNull(),
  pvp: numeric("pvp", { precision: 12, scale: 2 }),
  volTotal: numeric("vol_total", { precision: 10, scale: 2 }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const formulaComponentes = pgTable("formula_componentes", {
  id: id(),
  formulaId: uuid("formula_id")
    .notNull()
    .references(() => formulas.id),
  insumoId: uuid("insumo_id")
    .notNull()
    .references(() => insumos.id),
  dosis: numeric("dosis", { precision: 10, scale: 3 }).notNull(),
  unidad: text("unidad"),
  mlEquivalente: numeric("ml_equivalente", { precision: 10, scale: 3 }),
  costo: numeric("costo", { precision: 12, scale: 2 }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

/** Prescriptions and supplier orders; both are printed as PDFs (WU-17). */
export const pedidos = pgTable(
  "pedidos",
  {
    id: id(),
    tipo: text("tipo").notNull(),
    medica: text("medica"),
    items: integer("items"),
    detalle: text("detalle"),
    usuario: text("usuario"),
    creado: tstz("creado").notNull().defaultNow(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check("pedidos_tipo_valido", sql`${t.tipo} in ('RECETA MÉDICA', 'ORDEN PROVEEDOR')`),
  ],
)
