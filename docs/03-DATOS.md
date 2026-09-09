# 03 — DATOS

> The Postgres model that replaces the 14 Firestore collections, the invariants the database itself enforces, the indexes with their reasons, money/time rules, access posture and retention. Field names keep the inherited Spanish names so `docs/08-REGLAS-SISTEMA.md` maps one-to-one.

## 1. Conventions (non-negotiable)

- Table and column names `snake_case`, Spanish, matching the inherited field names where one exists (`nro_comp`, `centro_costo`, `stock_disp`).
- Primary keys `uuid` (v7, time-ordered) except `config` (natural key).
- Every table: `created_at timestamptz not null default now()`, `updated_at timestamptz` maintained by the `touch_updated_at` trigger (the only trigger doing anything mechanical).
- **Money**: `numeric(12,2)`, `Decimal` in code, string on the wire. `CHECK (monto > 0)` where the inherited UI enforced `> 0`.
- **Time**: `timestamptz` in UTC. Rendered in `America/Argentina/Buenos_Aires`. Inherited string formats (`dd/mm/yyyy`, `HH:MM`, `YYYY-MM`) are **presentation**, produced by formatters in `packages/db/src/format.ts`, never stored. Appointment slots store `inicio timestamptz` and `fin timestamptz`.
- Soft delete where the inherited system had it (`activo`, `anulado`); hard delete nowhere except `leads` and `turnos` (the inherited agenda deletes turnos with confirmation — kept, but every delete writes `auditoria`).
- Enums as Postgres `enum` types for the closed sets the inherited UI hard-codes (turno state, caja type, insumo type, lead stage).

## 2. Entity map

```
usuarios ──┐                     personas (médicas / socias)
           │                          │
           │   salas ──< turnos >── pacientes ──< evoluciones
           │              │             ├──< planes
           │              │             ├──< archivos
           │              │             ├──< bitacora
           │              │             ├──< consentimientos ── consentimiento_textos
           │              └──< registros_enfermeria ──< registro_materiales
           │
           ├── caja_movimientos ── periodos_cerrados
           ├── insumos ──< formula_componentes >── formulas
           ├── pedidos
           ├── inversiones · deudas
           ├── leads ──< lead_bitacora
           ├── novedades
           ├── config (key → jsonb)
           └── auditoria (append-only)
```

## 3. Tables

### 3.1 Identity and staff
- **`usuarios`** — `id`, `clerk_user_id text unique not null`, `email text unique not null`, `nombre`, `rol text not null default 'operativo'` (`'admin' | 'operativo'`), `permisos text[] not null default '{}'` (values from the closed list: `admin, pacientes, stock, formulas, caja, balance, agenda, enfermeria, sueros, legal, crm`), `activo boolean not null default true`. **The single source of authorization.** Clerk holds identity only.
- **`personas`** — `nombre, dni, tel, email, especialidad, matricula, es_medica bool, pct_medica_individual numeric(5,2) null, es_socia bool, parte_sociedad numeric(5,2) null, activo bool default true, tipo text`.

### 3.2 Patients (`S3` data)
- **`pacientes`** — `nombre, dni text not null, fecha_nac date, sexo text default 'F', tel, email, loc, alergias text, obra_social, contacto_emergencia, tel_emergencia, hc_dieta text default 'Omnivora', hc_ayuno int, hc_tox_tabaco bool, hc_tox_alcohol bool, hc_tox_otros bool, hc_antecedentes text, hc_expectativas text, perfil_profesion, perfil_canal text, perfil_recomendado_por, perfil_alerta text, perfil_notas text, seguridad jsonb` (the pre/post checklist with `firma`, `fecha`), `activo bool default true, fecha_alta timestamptz, creado_por text, origen_crm, interes_crm, crm_lead_id uuid null, ultima_modificacion timestamptz, modificado_por text`.
  - `UNIQUE (dni_normalizado)` where `dni_normalizado = regexp_replace(dni, '\D', '', 'g')` as a generated column. The inherited duplicate check by DNI becomes a constraint.
- **`evoluciones`** — `paciente_id, fecha timestamptz, medico text, tipo text` (`'Consulta' | 'Enfermería'`), `peso, talla, imc, ta, fc, sat, cin, cad, motivo, diagnostico, plan, notas, detalle`. IMC and ICC are computed in code with the inherited formulas and stored as the inherited system stored them (strings with one/two decimals) — store `numeric(5,1)` / `numeric(4,2)` and format on read.
- **`planes`** — `paciente_id, nombre, sesiones int, sesiones_usadas int default 0, costo_total numeric(12,2), pagado numeric(12,2) default 0, saldo_pendiente numeric(12,2) default 0, validez_dias int, fecha_vencimiento date, es_presupuesto bool, estado text, items jsonb` (`[{desc, monto}]`).
- **`archivos`** — `paciente_id, nombre, r2_key text not null, mime, bytes int, fecha_subida timestamptz, subido_por`.
- **`bitacora`** — `paciente_id, creado timestamptz, autor, etiquetas jsonb, comentario text not null`. Append-only (no UPDATE/DELETE privilege).

### 3.3 Agenda
- **`salas`** — `nombre, tipo text` (`'consulta' | 'sueros'`), `capacidad int not null default 1 check (capacidad >= 1)`, `profesional_id uuid null → personas`, `horarios jsonb` (`{1..7: [{desde, hasta}]}`), `bloqueos jsonb` (`[{desde, hasta, motivo}]`), `activa bool`.
- **`turnos`** — `paciente_id uuid null → pacientes` (null for a public booking whose DNI matched nobody yet), `paciente_nombre text not null, dni text, telefono, email, servicio, motivo, sala_id → salas, puesto int not null default 1, inicio timestamptz not null, fin timestamptz not null, duracion_min int generated`, `estado turno_estado not null default 'PENDIENTE'`, `notas, profesional_id, medica, origen text` (`'sistema' | 'web'`), `hora_inicio_infusion timestamptz, registro_ref_id, formula_nombre, duracion_real_min int, email_enviado_at, email_error, cancelado_motivo`.
  - **Slot invariant**: `EXCLUDE USING gist (sala_id WITH =, puesto WITH =, tstzrange(inicio, fin, '[)') WITH &&) WHERE (estado NOT IN ('CANCELADO','AUSENTE'))` — requires `btree_gist`. The booking transaction picks the first free `puesto` in `1..capacidad`; two concurrent bookings of the last chair: one fails and is retried on the next chair or rejected. This replaces the inherited "count then insert" check.
  - `CHECK (fin > inicio)`.
- **`turno_estado` enum** — canonical set: `PENDIENTE, CONFIRMADO, ESPERA, PAGADO, TRATAMIENTO, FINALIZADO, CUMPLIDO, AUSENTE, CANCELADO`. The inherited screens disagree on spellings (`docs/08-REGLAS-SISTEMA.md` §0.1); the mapping table there is applied at import and in every screen. Allowed transitions enforced by a `CHECK`-backed transition table in code plus a DB trigger `turno_estado_transicion` that rejects transitions not in the table.

### 3.4 Nursing and consent
- **`registros_enfermeria`** — `paciente_id, turno_id, enfermera, estado text` (`'EN CURSO' | 'FINALIZADO'`), `inicio timestamptz, fin timestamptz, signos jsonb {ta, fc, sato2, temp, peso}, via_tipo, via_calibre, formula_id, formula_nombre, lote, duracion_min int, observaciones`.
- **`registro_materiales`** — `registro_id, insumo_id, cantidad numeric(10,3)` — what was decremented, so a session can be audited and, if the client so decides, reversed.
- **`consentimiento_textos`** — `tipo_slug text, tipo_nombre, version int, texto text, vigente bool, creado_por` — every text the patient signs is versioned; a consent references a version, never a mutable string.
- **`consentimientos`** — `paciente_id null, paciente_nombre, dni, tipo_slug, texto_version_id → consentimiento_textos, medica, alergias, checklist jsonb` (5 booleans), `firmado bool, firma_r2_key text null, firma_sha256 text null, firmado_at timestamptz` (server clock), `ip inet, user_agent text, registrado_por`. **Append-only**: the app role has `INSERT, SELECT` only. What the patient signs, and whether the public booking signs anything, is CI-02.

### 3.5 Stock
- **`insumos`** — `nombre text unique` (upper-cased on write), `lab, tipo insumo_tipo` (`solucion | puro | unidad`), `concentracion numeric(6,2), vol_por_vial numeric(10,3), unidad_vial text, unidad_uso text, stock_disp numeric(12,3) not null default 0 check (stock_disp >= 0), stock_disp_ml numeric(12,3), costo numeric(12,2), lote, fecha_vencimiento date, minimo_viales numeric(10,2)`.
- **`formulas`** — `nombre, pvp numeric(12,2), vol_total numeric(10,2)`.
- **`formula_componentes`** — `formula_id, insumo_id, dosis numeric(10,3), unidad, ml_equivalente numeric(10,3), costo numeric(12,2)`.
- **`pedidos`** — `tipo text` (`'RECETA MÉDICA' | 'ORDEN PROVEEDOR'`), `medica, items int, detalle text, usuario, creado timestamptz`.

### 3.6 Money
- **`caja_movimientos`** — `ticket_id uuid` (groups items of one ticket), `nro_comp text not null` (`OI-26-0001`), `tipo caja_tipo` (`INGRESO | EGRESO | CIERRE`), `det text, monto numeric(12,2) not null check (monto > 0), medio text not null, dni text, fecha timestamptz not null, usuario, profesional, centro_costo, honorario_calculado numeric(12,2), es_honorario bool default false, es_traspaso bool default false, destino text, anulado bool default false, motivo_anulacion, anulado_por, anulado_at, periodo char(7) not null` (`YYYY-MM`), `arqueo jsonb null` (for `CIERRE`: `{fisico, sistema, diferencia, motivo, billetes[]}`).
  - **Numbering**: one Postgres sequence per prefix and year, created on first use (`comprobantes_seq` table: `prefijo, anio, ultimo int`) and read with `SELECT … FOR UPDATE` inside the ticket transaction. Format preserved; the inherited in-memory race (G-009) disappears. `UNIQUE (nro_comp)` except that a ticket's items share the same `OI` number as today — so `UNIQUE (nro_comp, id)` is not the rule; instead `UNIQUE (nro_comp)` on `EGRESO/CIERRE` rows and per-ticket sharing on `INGRESO` is enforced by the transaction (documented gotcha G-010).
  - **Period lock**: trigger `caja_periodo_abierto` rejects `INSERT` and the `anulado` update when `periodo` is in `periodos_cerrados`.
  - The honorario pair (EGRESO to `Honorarios x Pagar {prof}` + INGRESO on that account) is written in the same transaction as the ticket item, exactly as the inherited code does sequentially.
- **`periodos_cerrados`** — `periodo char(7) primary key, cerrado_por, cerrado_at`.
- **`saldos_iniciales`** — `periodo char(7) primary key, monto numeric(12,2), usuario, fecha` (inherited `config/saldoInicial_{periodo}`).
- **`inversiones`** — `descripcion, tipo, entidad, fecha_inicio date, fecha_venc date, capital numeric(12,2), valor_actual numeric(12,2), estado text, notas`.
- **`deudas`** — present in the inherited backup list only; shape `{{CONFIRMAR}}` on migration (OQ-08).

### 3.7 Commercial, news, system
- **`leads`** — `nombre, tel, origen text, etapa lead_etapa` (`nuevos | seguimiento | presupuesto | ganado | perdido`), `interes, proximo_contacto date, convertido bool, motivo, paciente_id null, creado_en timestamptz`.
- **`lead_bitacora`** — `lead_id, f timestamptz, t text, tipo text` (`positivo | negativo | neutro`).
- **`novedades`** — `slug text unique, titulo, resumen, cuerpo_md text, autora_persona_id → personas` (must have `matricula`), `publicada bool, publicada_at, actualizada_at, portada_r2_key`.
- **`config`** — `clave text primary key, valor jsonb not null, actualizado_por, updated_at`. Seeded with the 14 inherited documents and their defaults (`docs/08-REGLAS-SISTEMA.md` §Admin).
- **`auditoria`** — `ts timestamptz default now(), usuario_id uuid null, usuario text, accion text, detalle text, tabla text, fila_id uuid null, antes jsonb, despues jsonb`. **Append-only**; `usuario` comes from the server session, never from the request.

## 4. Invariants and where each is enforced

| Invariant | Zod (message) | Server Action (assert) | DB (constraint) |
|---|---|---|---|
| Two bookings never share a chair | — | picks the chair | `EXCLUDE` §3.3 |
| Capacity per sala | — | loop over `1..capacidad` | `EXCLUDE` + `capacidad >= 1` |
| Money > 0, two decimals | ✓ | ✓ | `CHECK`, `numeric(12,2)` |
| No movement in a closed period | ✓ | ✓ | trigger |
| Comprobante numbers unique and sequential per prefix/year | — | sequence `FOR UPDATE` | `UNIQUE` |
| Stock never negative | ✓ | ✓ (returns the inherited "⚠ Stock insuficiente de …") | `CHECK` |
| Consent and audit rows immutable | — | — | no `UPDATE/DELETE` privilege for the app role |
| Patient DNI unique | ✓ (inherited banner text) | ✓ | `UNIQUE` on generated column |
| Turno state transitions | ✓ | ✓ | trigger |
| `novedades.autora` has a matrícula | ✓ | ✓ | `CHECK` via FK to a `personas` row with non-null `matricula` (trigger) |

What is **not** a constraint (client-changeable parameters, kept in `config`): honorario percentages, slot duration, capacity, session timeout, inactivity days, stock minimum, message templates, treatment types.

## 5. Indexes — why each exists

| Index | Query it serves |
|---|---|
| `turnos (inicio)` | agenda day/week views, waiting room, public availability |
| `turnos (sala_id, inicio)` | availability per sala; also the GiST index of the `EXCLUDE` |
| `turnos (dni)` | cash → mark today's turno `PAGADO`; patient history |
| `pacientes (dni_normalizado) unique` | duplicate check, cash lookup, consent autocomplete |
| `pacientes (nombre text_pattern_ops)` | list search |
| `caja_movimientos (periodo, fecha)` | cash screen by period, balance by range |
| `caja_movimientos (dni)` | patient payment history |
| `caja_movimientos (nro_comp)` | cancellation cascade, comprobante PDF |
| `evoluciones (paciente_id, fecha desc)` | last evolution, inactivity alert |
| `consentimientos (dni)`, `(paciente_id)` | history and patient tab |
| `leads (etapa)`, `(proximo_contacto)` | kanban, "contact today" alert |
| `novedades (publicada, publicada_at desc)` | public list |
| `auditoria (ts desc)` | admin viewer |

No index without a query above. The inherited "load the whole collection and filter in the browser" is replaced by these bounded queries.

## 6. Access posture

- **No RLS.** Neon is reached only from server code through `packages/db`; there is no browser-facing key. Authorization is the canonical guard in each app's DAL (`docs/06-SEGURIDAD.md` §4).
- Two Postgres roles: `sanalys_app` (DML with the privilege exceptions above) and `sanalys_migrate` (DDL, used by `drizzle-kit` only, direct connection string). Runtime uses the **pooled** connection string.
- `web/` uses a narrower query surface than `sistema/`: it may read `salas`, `config.agenda`, published `novedades`, and insert into `turnos` (plus read-only lookups it needs); it never reads `pacientes`, `caja_movimientos` or any clinical table. Enforced by exporting a separate `webQueries` module from `packages/db` and by a Postgres role `sanalys_web` with grants limited to those tables.

## 7. Retention (until counsel says otherwise — OQ-01)

| Data | Retention | Mechanism |
|---|---|---|
| Clinical record, consents, audit | Indefinite (medical record) — `{{CONFIRMAR}}` with counsel | none |
| Public booking rows with no patient match | 24 months after `inicio` | documented manual procedure with a named owner |
| Leads `perdido` | 12 months | same |
| Backups | 30 daily dumps, then monthly for 12 months | R2 lifecycle rule |
| Sentry events | provider default, PII scrubbed | — |

## 8. Migration from Firestore (unit 24, only if CI-04 says real data exists)

Export the admin JSON backup (all 11 collections; subcollections `bitacora`, `consentimientos`, `registrosEnfermeria` exported separately with a script), then import with a one-off script in `packages/db/scripts/import-firestore.ts`: normalise dates (`dd/mm/yyyy`, `d/m/yyyy`, ISO) to `timestamptz` assuming Buenos Aires local time; normalise turno states with the §0.1 mapping; money strings/numbers to `numeric`; base64 signatures to R2 with SHA-256. Dry-run on a Neon branch first; row counts written to `docs/10-MEMORY.md`.
