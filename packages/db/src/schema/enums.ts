import { pgEnum } from "drizzle-orm/pg-core"

/**
 * Closed sets the inherited UI hard-codes (docs/03-DATOS.md section 1).
 * The turno set is the canonical one of section 3.3; the per-screen spellings of
 * docs/08-REGLAS-SISTEMA.md section 0.1 are mapped on import and on every screen.
 */
export const turnoEstado = pgEnum("turno_estado", [
  "PENDIENTE",
  "CONFIRMADO",
  "ESPERA",
  "PAGADO",
  "TRATAMIENTO",
  "FINALIZADO",
  "CUMPLIDO",
  "AUSENTE",
  "CANCELADO",
])

export const cajaTipo = pgEnum("caja_tipo", ["INGRESO", "EGRESO", "CIERRE"])

export const insumoTipo = pgEnum("insumo_tipo", ["solucion", "puro", "unidad"])

export const leadEtapa = pgEnum("lead_etapa", [
  "nuevos",
  "seguimiento",
  "presupuesto",
  "ganado",
  "perdido",
])
