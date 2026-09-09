import { boolean, inet, index, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core"

import { createdAt, id, tstz, updatedAt } from "./columns"
import { pacientes } from "./pacientes"

/** Every text a patient signs is versioned; a consent points at a version, never at a string. */
export const consentimientoTextos = pgTable("consentimiento_textos", {
  id: id(),
  tipoSlug: text("tipo_slug").notNull(),
  tipoNombre: text("tipo_nombre").notNull(),
  version: integer("version").notNull().default(1),
  texto: text("texto").notNull(),
  vigente: boolean("vigente").notNull().default(true),
  creadoPor: text("creado_por"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

/**
 * Signature evidence (docs/03-DATOS.md section 3.4). **Append-only**: the app role has
 * INSERT and SELECT only. We store what we captured — image key, SHA-256, server clock,
 * IP, user agent — and assert nothing about its legal validity (OQ-01, CI-07).
 * What the patient signs and when is CI-02.
 */
export const consentimientos = pgTable(
  "consentimientos",
  {
    id: id(),
    pacienteId: uuid("paciente_id").references(() => pacientes.id),
    pacienteNombre: text("paciente_nombre").notNull(),
    dni: text("dni"),
    tipoSlug: text("tipo_slug").notNull(),
    textoVersionId: uuid("texto_version_id")
      .notNull()
      .references(() => consentimientoTextos.id),
    medica: text("medica"),
    alergias: text("alergias"),
    /** The five inherited booleans of the pre-signature checklist. */
    checklist: jsonb("checklist"),
    firmado: boolean("firmado").notNull().default(false),
    firmaR2Key: text("firma_r2_key"),
    firmaSha256: text("firma_sha256"),
    /** Server clock, never the browser's. */
    firmadoAt: tstz("firmado_at"),
    ip: inet("ip"),
    userAgent: text("user_agent"),
    registradoPor: text("registrado_por"),
    createdAt: createdAt(),
  },
  (t) => [
    index("consentimientos_dni_idx").on(t.dni),
    index("consentimientos_paciente_idx").on(t.pacienteId),
  ],
)
