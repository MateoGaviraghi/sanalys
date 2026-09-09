import { sql } from "drizzle-orm"
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core"

import { createdAt, id, tstz, updatedAt } from "./columns.ts"
import { turnoEstado } from "./enums.ts"
import { pacientes } from "./pacientes.ts"
import { personas } from "./usuarios.ts"

/** One franja of a day: the inherited `{ desde: "09:00", hasta: "13:00" }`. */
export type Franja = { desde: string; hasta: string }
/** `salas.horarios`: keys are ISO weekdays 1..7 (docs/03-DATOS.md section 3.3). */
export type Horarios = Record<string, Franja[]>
export type Bloqueo = { desde: string; hasta: string; motivo?: string }

/**
 * Consulting rooms and infusion rooms. `capacidad` is the number of chairs
 * (`puesto` 1..capacidad); it is a client-changeable parameter, so it lives here and in
 * `config.agenda`, never as a hard-coded number.
 */
export const salas = pgTable(
  "salas",
  {
    id: id(),
    nombre: text("nombre").notNull(),
    tipo: text("tipo").notNull(),
    capacidad: integer("capacidad").notNull().default(1),
    profesionalId: uuid("profesional_id").references(() => personas.id),
    horarios: jsonb("horarios").$type<Horarios>(),
    bloqueos: jsonb("bloqueos").$type<Bloqueo[]>(),
    activa: boolean("activa").notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check("salas_tipo_valido", sql`${t.tipo} in ('consulta', 'sueros')`),
    check("salas_capacidad_minima", sql`${t.capacidad} >= 1`),
  ],
)

/**
 * Appointments, from both surfaces (`origen`). The chair invariant is an EXCLUDE
 * constraint created in migrations/0001_init.sql — the app picks the first free `puesto`
 * and the database is what guarantees two bookings never share it
 * (docs/03-DATOS.md section 3.3, critical test 1).
 */
export const turnos = pgTable(
  "turnos",
  {
    id: id(),
    /** Null while a public booking's DNI has not matched a patient yet. */
    pacienteId: uuid("paciente_id").references(() => pacientes.id),
    pacienteNombre: text("paciente_nombre").notNull(),
    dni: text("dni"),
    telefono: text("telefono"),
    email: text("email"),
    servicio: text("servicio"),
    motivo: text("motivo"),
    salaId: uuid("sala_id")
      .notNull()
      .references(() => salas.id),
    puesto: integer("puesto").notNull().default(1),
    inicio: tstz("inicio").notNull(),
    fin: tstz("fin").notNull(),
    duracionMin: integer("duracion_min").generatedAlwaysAs(
      sql`(extract(epoch from (fin - inicio)) / 60)::int`,
    ),
    estado: turnoEstado("estado").notNull().default("PENDIENTE"),
    notas: text("notas"),
    profesionalId: uuid("profesional_id").references(() => personas.id),
    medica: text("medica"),
    origen: text("origen").notNull().default("sistema"),
    horaInicioInfusion: tstz("hora_inicio_infusion"),
    /** FK to `registros_enfermeria` is created in 0001_init.sql, for the same circularity reason. */
    registroRefId: uuid("registro_ref_id"),
    formulaNombre: text("formula_nombre"),
    duracionRealMin: integer("duracion_real_min"),
    emailEnviadoAt: tstz("email_enviado_at"),
    emailError: text("email_error"),
    canceladoMotivo: text("cancelado_motivo"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check("turnos_fin_posterior", sql`${t.fin} > ${t.inicio}`),
    check("turnos_puesto_minimo", sql`${t.puesto} >= 1`),
    check("turnos_origen_valido", sql`${t.origen} in ('sistema', 'web')`),
    index("turnos_inicio_idx").on(t.inicio),
    index("turnos_sala_inicio_idx").on(t.salaId, t.inicio),
    index("turnos_dni_idx").on(t.dni),
  ],
)
