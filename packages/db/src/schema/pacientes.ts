import { sql } from "drizzle-orm"
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

import { createdAt, id, tstz, updatedAt } from "./columns.ts"

/**
 * Clinical record (docs/03-DATOS.md section 3.2). S3 data: never logged, never in a URL.
 * `dni_normalizado` turns the inherited "check for a duplicate DNI in the browser" into a
 * database constraint (G-011).
 */
export const pacientes = pgTable(
  "pacientes",
  {
    id: id(),
    nombre: text("nombre").notNull(),
    dni: text("dni").notNull(),
    dniNormalizado: text("dni_normalizado").generatedAlwaysAs(
      sql`regexp_replace(dni, '[^0-9]', '', 'g')`,
    ),
    fechaNac: date("fecha_nac"),
    sexo: text("sexo").default("F"),
    tel: text("tel"),
    email: text("email"),
    loc: text("loc"),
    alergias: text("alergias"),
    obraSocial: text("obra_social"),
    contactoEmergencia: text("contacto_emergencia"),
    telEmergencia: text("tel_emergencia"),
    hcDieta: text("hc_dieta").default("Omnivora"),
    hcAyuno: integer("hc_ayuno"),
    hcToxTabaco: boolean("hc_tox_tabaco"),
    hcToxAlcohol: boolean("hc_tox_alcohol"),
    hcToxOtros: boolean("hc_tox_otros"),
    hcAntecedentes: text("hc_antecedentes"),
    hcExpectativas: text("hc_expectativas"),
    perfilProfesion: text("perfil_profesion"),
    perfilCanal: text("perfil_canal"),
    perfilRecomendadoPor: text("perfil_recomendado_por"),
    perfilAlerta: text("perfil_alerta"),
    perfilNotas: text("perfil_notas"),
    /** Inherited pre/post checklist: `{ firma, fecha, ... }`. */
    seguridad: jsonb("seguridad"),
    activo: boolean("activo").notNull().default(true),
    fechaAlta: tstz("fecha_alta"),
    creadoPor: text("creado_por"),
    origenCrm: text("origen_crm"),
    interesCrm: text("interes_crm"),
    /**
     * FK to `leads` is created in 0001_init.sql, not here: `pacientes` and `leads` point at
     * each other and TypeScript degrades both tables to `any` when the modules are circular.
     */
    crmLeadId: uuid("crm_lead_id"),
    ultimaModificacion: tstz("ultima_modificacion"),
    modificadoPor: text("modificado_por"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("pacientes_dni_normalizado_key").on(t.dniNormalizado),
    index("pacientes_nombre_idx").using("btree", sql`${t.nombre} text_pattern_ops`),
  ],
)

/**
 * One clinical note per visit. IMC and ICC are computed in code with the inherited
 * formulas (docs/08-REGLAS-SISTEMA.md section 5) and stored, not recomputed on read.
 */
export const evoluciones = pgTable(
  "evoluciones",
  {
    id: id(),
    pacienteId: uuid("paciente_id")
      .notNull()
      .references(() => pacientes.id),
    fecha: tstz("fecha").notNull(),
    medico: text("medico"),
    tipo: text("tipo"),
    peso: numeric("peso", { precision: 6, scale: 2 }),
    talla: numeric("talla", { precision: 5, scale: 1 }),
    imc: numeric("imc", { precision: 5, scale: 1 }),
    ta: text("ta"),
    fc: integer("fc"),
    sat: integer("sat"),
    cin: numeric("cin", { precision: 5, scale: 1 }),
    cad: numeric("cad", { precision: 5, scale: 1 }),
    icc: numeric("icc", { precision: 4, scale: 2 }),
    motivo: text("motivo"),
    diagnostico: text("diagnostico"),
    plan: text("plan"),
    notas: text("notas"),
    detalle: text("detalle"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("evoluciones_paciente_fecha_idx").on(t.pacienteId, t.fecha.desc())],
)

/** Session packs and quotes (`es_presupuesto`). Money is numeric(12,2), never a JS number. */
export const planes = pgTable("planes", {
  id: id(),
  pacienteId: uuid("paciente_id")
    .notNull()
    .references(() => pacientes.id),
  nombre: text("nombre").notNull(),
  sesiones: integer("sesiones"),
  sesionesUsadas: integer("sesiones_usadas").notNull().default(0),
  costoTotal: numeric("costo_total", { precision: 12, scale: 2 }),
  pagado: numeric("pagado", { precision: 12, scale: 2 }).notNull().default("0"),
  saldoPendiente: numeric("saldo_pendiente", { precision: 12, scale: 2 }).notNull().default("0"),
  validezDias: integer("validez_dias"),
  fechaVencimiento: date("fecha_vencimiento"),
  esPresupuesto: boolean("es_presupuesto").notNull().default(false),
  estado: text("estado"),
  /** `[{ desc, monto }]` as the inherited screen stores it. */
  items: jsonb("items"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

/** Uploaded studies and images. The bytes live in R2; only the key is stored. */
export const archivos = pgTable("archivos", {
  id: id(),
  pacienteId: uuid("paciente_id")
    .notNull()
    .references(() => pacientes.id),
  nombre: text("nombre").notNull(),
  r2Key: text("r2_key").notNull(),
  mime: text("mime"),
  bytes: integer("bytes"),
  fechaSubida: tstz("fecha_subida"),
  subidoPor: text("subido_por"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

/** Append-only: the app role gets INSERT and SELECT only (0001_init.sql). */
export const bitacora = pgTable(
  "bitacora",
  {
    id: id(),
    pacienteId: uuid("paciente_id")
      .notNull()
      .references(() => pacientes.id),
    creado: tstz("creado").notNull().defaultNow(),
    autor: text("autor"),
    etiquetas: jsonb("etiquetas"),
    comentario: text("comentario").notNull(),
    createdAt: createdAt(),
  },
)
