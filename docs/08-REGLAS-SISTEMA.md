# 08 — REGLAS DEL SISTEMA HEREDADO

> The parity contract. Every rule, formula, default, format, state, template and PDF the inherited system implements, extracted from the code on 2026-09-09 (line references point to `sistema-interno/sistema/*.html`). The rebuilt `sistema/` reproduces this **verbatim**; the review of each work unit diffs the screen against this file. What is not here is not invented; what is here is not changed. §0 lists the places where the inherited code contradicts itself — there the client decides (CI-01).

Spanish literals (texts, labels, toasts, templates) are kept exactly as found, including their spelling and emoji.

---

## 0. Contradictions the client must resolve (CI-01)

### 0.1 Turno states — spelled differently per screen

| Meaning | agenda.html writes/reads | index.html reads (lowercased) | enfermeria.html reads/writes | caja.html writes | PDF semanal |
|---|---|---|---|---|---|
| pending | `PENDIENTE` | `pendiente` | — | — | — |
| confirmed | `CONFIRMADO` | `confirmado` | — | — | `CONFIRMADO` |
| at reception / waiting | `ESPERA` (label "En recepción") | `espera`, `en recepcion`, `en recepción` | `EN RECEPCIÓN` (never written by anyone) | — | `ESPERA` |
| paid, waiting for the chair | — | `pagado` | `PAGADO` (waiting room) | `PAGADO` | — |
| in treatment | `TRATAMIENTO` | `en tratamiento` | `EN TRATAMIENTO` (chairs) | — | `TRATAMIENTO` |
| finished | `FINALIZADO` | — | `FINALIZADO` (+ `duracionRealMinutos`) | — | `CUMPLIDO` |
| absent / cancelled | `AUSENTE`, `CANCELADO` (capacity check, case-insensitive) | — | — | — | `AUSENTE` |

Effect today: a turno set to `TRATAMIENTO` from the agenda does not appear in a nursing chair; a turno at `ESPERA` does not appear in the nursing waiting room (only `PAGADO` does). **Proposed canonical set** (`docs/03-DATOS.md` §3.3): `PENDIENTE → CONFIRMADO → ESPERA → PAGADO → TRATAMIENTO → FINALIZADO`, plus `CUMPLIDO` (historical alias of `FINALIZADO`, imported as such), `AUSENTE`, `CANCELADO`. Labels shown: Pendiente · Confirmado · En recepción · Pagado · En tratamiento · Finalizado · Ausente · Cancelado. **Client decides**: does nursing's waiting room show `ESPERA` too, or only `PAGADO` (today's behaviour, which matches the manual)?

### 0.2 When stock is decremented
Code: at **session start** in nursing (`enfermeria.html` 500–521), materials −1 each and formula components −dosis. Manual (`manual.html` 533–534): "El descuento de stock ocurre cuando se confirma el ticket en Caja". Cash code does **not** decrement anything. **Client decides** which one is the rule; the other is removed.

### 0.3 Doctor's fee percentage
- `caja.html` 961: `porc = tipo includes 'suero'|'fórmula' ? porcentajeSueros : porcentajeMedica` — global percentages only.
- `admin.html` 1207: simulator uses `pctMedicaIndividual` per person when set, else the global.
- `balance.html` 1075–1137 (Estado profesional): uses `porcentajeMedica` only, ignoring the sueros rate; P&L (522–583) uses the caja rule.
**Client decides**: does the individual percentage apply to cash tickets? Proposed: yes (individual if set, else global), applied identically in cash, P&L and Estado profesional.

### 0.4 `porcentajeSueros` default: admin initialises 0; caja and balance default 60. Proposed: 60 (the value cash actually applies when unset).

### 0.5 Permissions
- `sueros.html` accepts `stock` or `formulas`; the sidebar shows the link for `sueros`; admin grants all three separately. Proposed: `sueros` opens the screen; `stock` and `formulas` scope its tabs — or collapse to one flag. Client decides.
- The dashboard CRM card requires `leads`, which admin cannot grant; the sidebar shows CRM to everyone; the screen checks nothing. Proposed: new `crm` flag, granted like the others.
- `consentimiento.html` checks only that a session exists; the sidebar uses `legal`. Proposed: `legal`.

### 0.6 Clinic data: address `Avellaneda 3365` (identity PDF) vs `25 de Mayo 1845` (`sueros.html` fallback); phones `342 445-2643` (PDF, turnos), `(342) 452-8533` (code), `+54 9 3425 21-8327` / `+54 9 3404 52-8533` (business cards). One value for `config.datosClinica`, set by the client (CI-09).

### 0.7 Configuration nothing implements: `config/recordatorios` (reminder sending), `config/archivado` (auto-archive after N months), `config/disp_{profesionalId}` (per-professional availability; the agenda uses `salas.horarios` only). **Client decides**: implement (each is a new work unit) or remove the settings.

### 0.8 Consent PDF footer says "Documento oficial con valor legal". Not reproduced until counsel confirms (CI-07); interim footer `{{CONFIRMAR}}`.

### 0.9 Consent WhatsApp template exists twice (admin default vs. `consentimiento.html` fallback) with different wording; `tiposTratamiento` default has 7 entries in admin and 6 in the consent screen (missing "Plasma Rico en Plaquetas"). Proposed: admin's versions win (they are what the client configures).

---

## 1. Shared behaviour

- Session: inherited `sessionStorage['usuario_sanalys']` → replaced by Clerk + `usuarios` row. Every screen redirects anonymous users to sign-in and users without the screen's permission to the dashboard.
- Sidebar (`sidebar.js` 41–52): `index.html` (all) · `agenda.html` (`agenda`) · `caja.html` (`caja`) · `pacientes.html` (`pacientes`) · `enfermeria.html` (`enfermeria`) · `sueros.html` (`sueros`) · `balance.html` (`balance`) · `crm.html` (all → `crm` after §0.5) · `consentimiento.html` (`legal`) · `admin.html` (`admin`); 72 px wide; same icons.
- Inactivity timeout (`sidebar.js` 170–210): `config/seguridad.timeoutMinutos` default 30, `0` = none; warning 2 min before if ≥ 5 min else at ⅓; events click/keydown/scroll/touchstart, mousemove throttled 5 s; check every 20 s; expiry → sign-in with `?expired=1`. Rebuilt on top of Clerk's inactivity setting (`docs/06-SEGURIDAD.md` §3).
- Toast (`sidebar.js` 214–240): `toast(msg, tipo, duracion)`, types `ok | error | warn | info`, bottom-right, 3 s.
- Utilities (`utils.js`): `parseFecha` (dd/mm/yyyy or yyyy-mm-dd), `formatFecha` (dd/mm/yyyy), `diasDesde`, `normalizarDNI` (digits), `waNumero` (digits; if not starting `54` → `549` + number without leading 0), `abrirWhatsApp`, `formatMoney` (`$ 1.234,56`), `escapeHtml`, `confirmarMontoAlto(monto, umbral)` (confirm dialog above `montoMaxOperacion`), `validarArchivo(file, {maxMB, extensiones})`, `toSlug`, `tienePermiso`.
- Money display: `Math.round(v).toLocaleString('es-AR')` on balances; two decimals kept in storage.
- Dates stored today as locale strings; the rebuild stores `timestamptz` and renders the same strings (`dd/mm/yyyy`, `HH:MM:SS`, `HH:MM`, `YYYY-MM`).

## 2. Login (`login.html`)
- E-mail + password; 5 failed attempts → 15 min lock (client-side; replaced by Clerk). `activo === false` → "Tu cuenta fue desactivada. Contactá al administrador." Password reset always answers the same message (no enumeration). Reads `config/seguridad.timeoutMinutos` into the session.

## 3. Dashboard (`index.html`)
- Cards hidden per permission: enfermeria, pacientes, agenda, caja, sueros, crm (`leads` → `crm`), balance, admin, consentimiento (`legal`, and only if `config/funcionalidades.consentimientosDigitales === true`).
- **KPI ingresos hoy**: Σ `caja` where `fecha === hoy` (dd/mm/yyyy) and `tipo === 'INGRESO'` and `!esTraspaso` and `!esHonorario`, excluding `anulado`.
- **KPI turnos hoy**: count `turnos` with `fecha === hoy` (ISO). **KPI pacientes**: total count.
- **Sin visita**: patients whose latest evolution date < today − `diasInactividad` (default 30, `config/alertas`); excludes patients with no evolutions and `archivado === true`; max 20 listed; shows `diasSin` = floor((today − last)/86 400 000) or `?`.
- **Saldos**: `Efectivo`, `Banco`, `Billetera Virtual`, and Σ of every `med` containing `Honorarios x Pagar` (shown as absolute value); sign `INGRESO ? +1 : −1`; `anulado` excluded.
- **Sala de espera**: today's turnos; "En sala" = state (lowercased, trimmed) in `['en recepción','en recepcion','en tratamiento','espera','pagado']`; "Pendientes" = `['confirmado','pendiente']`; sorted by `hora`; button "✓ Listo" hides the row for the day (per browser); refresh every 30 s.
- **Alertas**: stock ≤ (`minimoViales` or `config/alertas.stockMinimo` default 5); expiry within 30 days from `lote` `MM/YYYY` or `fechaVencimiento`; leads with `proximoContacto === today` and stage not `ganado`/`perdido`; birthdays today and next 7 days (`fechaNac` in `yyyy-mm-dd` or `dd/mm/yyyy`).
- Texts: `{n} lead(s) para contactar hoy` · `{n} insumo(s) bajo stock mínimo` · `{n} insumo(s) vence(n)` · `🎁 Cumple en {n} día(s)`.
- **WhatsApp templates** read fresh from `config/mensajes` with defaults (dashboard fallbacks): `cumpleanos` "¡Hola {nombre}! 🎉 Desde Sanalys te deseamos un muy feliz cumpleaños. 🥂✨" · `gift_card` "Hola {nombre}! 🎁 Tu cumpleaños se acerca y queremos celebrarlo con vos. En Sanalys tenemos Gift Cards especiales para regalar salud y bienestar. ¿Se lo hacemos saber a alguien especial? ✨" · `inactivo` "Hola {nombre}! Te escribimos de Sanalys para recordarte que hace un tiempo no te vemos. ¿Querés retomar tu tratamiento?". `{nombre}` = first name; `{clinica}` = "Sanalys". (Admin's richer defaults in §12 win when configured.)
- Patient search: name or DNI, ≥ 2 chars, max 6 results, opens the patient.
- Logout: Clerk sign-out.

## 4. Agenda (`agenda.html`)
- Config `config/agenda`: `hInicioM 8, hFinM 13, hInicioT 16, hFinT 20, duracion 30, salas[]`.
- Sala: `{id, nombre, tipo 'consulta'|'sueros', capacidad (default 1), profesionalId, horarios {1..7: [{desde, hasta}]}, bloqueos [{desde, hasta, motivo}]}` (1 = Monday … 7 = Sunday).
- Slot generation: for the chosen date, `diaNum` (Sunday → 7); if a `bloqueo` covers the date → options "— Bloqueado —" and notice "⚠ Este espacio tiene ese día bloqueado: {motivo}"; if no franja → "— Sin horario —" and "⚠ Este espacio no tiene horario para ese día"; else for each franja, times from `desde` to `hasta` (exclusive) stepping `duracion`, `HH:MM`.
- Saving with a visible notice → "Corregí la disponibilidad antes de guardar."
- **Capacity**: count turnos with same `fecha`, `salaId`, `hora`, excluding the one being edited and states `cancelado`/`ausente` (case-insensitive); if `ocupados >= capacidad` → error `{sala} — ya tiene un turno en ese horario.` / `sala llena ({ocupados}/{capacidad} cupos)` / `consultorio ocupado en ese horario`. Rebuilt as the `EXCLUDE` constraint with the same messages.
- Turno fields: `paciente`, `dni`, `telefono`, `email`, `servicio` (= `motivo`), `motivo`, `fecha` (ISO), `hora`, `duracion` (default 60), `salaId`, `estado` (default `PENDIENTE`), `notas`, `puesto` (1), `pacienteNombre`, `profesionalId` (from sala), `medica` (sala name if `tipo === 'consulta'`). "El paciente es obligatorio." Input "Nombre (DNI)" splits into name and DNI; phone/e-mail autofilled from the patient by DNI.
- Actions: change state → confirm "¿Cambiar estado de {paciente} a {nuevoEstado}?"; cancel → prompt "¿Por qué se cancela el turno?" default "Cancelado por paciente", then confirm "¿Eliminar turno de {paciente}?"; delete → confirm "¿Eliminar este turno?" (kept, with an `auditoria` row added).
- Views: day (sorted by `hora`; "Sin turnos para este día.") and week (Mon–Sun, today highlighted). Toasts "Turno guardado." / "Turno actualizado.".
- State colours (border): PENDIENTE `#9ca3af`, CONFIRMADO `#3b82f6`, ESPERA `#f97316`, TRATAMIENTO `#22c55e`, FINALIZADO `#8b5cf6`.
- WhatsApp reminder (button): `Hola {primerNombre}! Te recordamos tu turno el {fechaLarga} a las {hora}hs en {sala|Sanalys}.` — `fechaLarga` = `es-AR` weekday long, day numeric, month long.
- WhatsApp on create: confirm "¿Enviar confirmación de turno por WhatsApp a {paciente}?" then `config/mensajes.confirmacion_turno` (§12) with `{nombre} {fecha} {hora} {servicio} {clinica}`. Never changes the state.
- PDF semanal: Mon–Fri, columns HORA · PACIENTE · TRATAMIENTO · SALA · ESTADO; patient truncated to 30 chars; colours CONFIRMADO green, ESPERA yellow, TRATAMIENTO blue, CUMPLIDO purple, AUSENTE red.

## 5. Pacientes (`pacientes.html`)
- Access: `admin` or `pacientes`.
- List: search by name, DNI (digits), phone (digits), e-mail; sorted by name; filters `todos` (active), `archivados` (`activo === false`), `alergias` (non-empty), `deuda` (any plan with `saldoPendiente > 0`); badges "📦 archivado", "⚠ alergia" (pulsing), "$ deuda"; "{N} resultados"; header "{N} pacientes".
- Create: name required ("El nombre es obligatorio."); DNI ≥ 6 digits ("El DNI es obligatorio y debe tener al menos 6 dígitos."); duplicate DNI → banner "⛔ Ya existe un expediente con este DNI" with the existing name, date and allergy, save disabled; server duplicate → "⛔ Ya existe el paciente {nombre} con ese DNI. No se puede crear un duplicado."; defaults `fechaAlta` today, `creadoPor` user, `sexo 'F'`, `hc_dieta 'Omnivora'`, empty arrays. "✅ Expediente creado." / "✅ Datos actualizados." (`ultimaModificacion`, `modificadoPor`).
- Fields: nombre, dni, fechaNac, sexo, tel, email, loc, alergias, obraSocial, contactoEmergencia, telEmergencia. Allergy banner when present: "ALERTA MÉDICA CRÍTICA — ALERGIA DECLARADA".
- Bio-perfil: `hc_dieta` ∈ Omnivora, Vegetariana, Vegana, Keto, Otra; `hc_ayuno` (hours); `hc_tox_tabaco`, `hc_tox_alcohol`, `hc_tox_otros` (checkboxes); `hc_antecedentes`, `hc_expectativas` (voice dictation button, Chrome only: "Usá Google Chrome para el dictado por voz." / "Error al escuchar. Verificá el micrófono."). "Guardá los datos base primero." / "✅ Bio-Perfil guardado."
- Perfil comercial: `perfilProfesion`; `perfilCanal` ∈ recomendacion, instagram, google, medico, evento, otro; `perfilRecomendadoPor`; `perfilAlerta` (blue banner when set); `perfilNotas`. "Perfil guardado correctamente."; audit `PERFIL actualizado — Paciente: {nombre}`.
- Evoluciones: peso, talla, ta, fc, sat, cin, cad, motivo, diagnostico, plan, notas; **IMC** = `(peso / (talla/100)²).toFixed(1)`; **ICC** = `(cin / cad).toFixed(2)`; `medico` = user; newest first; badge ULTIMA; "Ingresá al menos un dato." / "📈 Medición guardada."; comparison of last 4/6 (default)/8/all with green (improved) / red (worse); **no edit, no delete**.
- Presupuestos: nombre, sesiones (default 10), costo, validez días (default 30, min 1), `fechaVencimiento` = today + validez; `esPresupuesto: true`, `saldoPendiente: 0` (does not create debt), `estado 'PRESUPUESTO'`, extra items `{desc, monto}`; "Completá todos los campos del presupuesto."; success message "✅ Presupuesto guardado.\n\nVálido hasta: {fecha}\n\n⚠️ Este presupuesto NO genera deuda…"; badge "⚠️ VENCIDO" after expiry. Legacy plans: `sesionesUsadas` (+1 button while < total), progress `% pagado = pagado / costoTotal × 100`, "Registrar Pago" while `saldoPendiente > 0` → "Monto inválido." / "El monto no puede superar el saldo pendiente." / "✅ Pago registrado en caja." (writes a cash INGRESO).
- Archivos: `validarArchivo` max 5 MB, PDF only ("Seleccioná un archivo." / "Escribí el nombre del estudio."); stored `{idArchivo, nombre, url, fechaSubida, pathStorage}`; delete confirm "¿Borrar este archivo?"; "✅ Archivo subido.". (Inherited UI shows "próximamente" because Storage was blocked; the rebuild enables it on R2.)
- Bitácora (read-only entries, newest first): `{fecha, hora, creado, autor, etiquetas, comentario}`; comment required ("El comentario es obligatorio. Describí lo observado."); tag groups — personalidad: Tranquilo, Conversador, Reservado, Detallista, Atención personalizada, Trato exigente, Tono fuerte, VIP · puntualidad: Muy puntual, A horario, Llega tarde, Cancela frecuente, Confirma por WSP · sensibilidad: Sensible frío, Sensible dolor, Ansiedad, Náuseas, Prefiere acompañante · comunicación: Charla, Ir al grano, Explicaciones, Prefiere WSP, Prefiere llamada · quejas: Espera, Temperatura, Precio, Resultado, Atención personal · plus one free tag per group; note "Lenguaje profesional, descriptivo, no juicios personales" and "El paciente podría pedir ver estos datos (Ley 25.326)"; "Entrada agregada a la bitácora."
- Seguridad checklist — pre: HC Completa y revisada · Consentimiento informado firmado · Paciente hidratado · Apirético (sin fiebre) · Vía periférica permeable y confirmada; post: Sin incidentes durante la infusión · Hemodinámicamente estable al alta · Indicaciones y cuidados post-terapia dados; saves `{pre1..5, pos1..3, firma: user, fecha}`; "🛡️ Seguridad validada y firmada."; shows "Validado por: {firma} · {fecha}".
- Documentos tab: consents (tipo, firmaFecha, medica, firmado) and nursing records (formulaNombre, fecha, vía, signos, observaciones, enfermera); "Sin consentimientos registrados." / "Sin registros de enfermería.".
- Pagos tab: cash rows with the patient's DNI, `!anulado && !esHonorario`, newest first, total = Σ(±monto), EGRESO in red with "-"; "Sin pagos registrados.".
- Archive/unarchive (`activo`), confirm "¿{Archivar|Desarchivar} a {nombre}?", "Paciente {archivado|desarchivado} correctamente."; **no delete**.
- PDFs: **Historia Clínica** `HC_{nombre}_{ISO}.pdf` (contact block; ALERGIA in red; bio-perfil; measurements table date · médico · peso/talla · vitals · notas; footer "Historia Clínica Electrónica Oficial. Documento médico confidencial"); **Datos ARCO** same content, confirm dialog "🔒 EXPORTACIÓN DE DATOS — DERECHO DE ACCESO (Ley 25.326)…", file `Datos_ARCO_{nombre}_{ISO}.pdf`, footer "Entregado al titular bajo derecho de acceso (Ley 25.326, arts. 14-16). Contiene datos sensibles. Confidencial", audit `EXPORTACION ARCO (derecho de acceso) — Paciente: {nombre} (DNI {dni})`, toast "Documento de acceso generado. Entregalo solo al titular."; **Presupuesto** `Presupuesto_{nombre}.pdf` with validity dates, items table, footer "No es comprobante de pago. Precios pueden variar según indicación médica."
- Excel `Pacientes_Sanalys_{ISO}.xlsx`, sheet "Pacientes", columns Nombre, DNI, F.Nac, Sexo, Teléfono, Email, Localidad, Obra Social, Contacto Emergencia, Tel. Emergencia, Fecha Alta, Alergias; "No hay pacientes cargados."
- WhatsApp "💬 Bienvenida" (when phone): "¡Hola {nombre}! 👋 Te damos la bienvenida a Sanalys Clínica Ortomolecular.\n\nTu expediente fue registrado correctamente. Ante cualquier consulta estamos a disposición.\n\n¡Gracias por elegirnos! ✨".

## 6. Enfermería (`enfermeria.html`)
- Access `enfermeria`. Today's turnos. Waiting room: `PAGADO` (or `EN RECEPCIÓN` — §0.1); chairs: `EN TRATAMIENTO`; done: `FINALIZADO` with `duracionRealMinutos`; sorted by `hora`.
- Patient card: allergy alert when `alergias` non-empty and ≠ `NINGUNA`; last evolution. "❌ Paciente no encontrado en la base de datos."
- Start session: checklist **required** — verifiqué alergias · vía correcta · identifiqué al paciente ("⚠️ Debes completar el checklist de seguridad."); vitals TA, FC, SatO2, Temp, Peso (optional); vía ∈ Periférica derecha, Periférica izquierda, PICC, IM, SC + calibre; formula from `formulas`; lote; materials ∈ jeringas, agujas, cloruro, alcohol, algodon, gasas, guantes, cateter, equipo → insumos Jeringas, Agujas, Cloruro de sodio, Alcohol, Algodón, Gasas, Guantes, Catéter, Equipo de suero.
- Writes: `registrosEnfermeria` `{timestamp, fecha, enfermera, turnoId, estado 'EN CURSO', signos, via{tipo, calibre}, tratamiento{formulaId, formulaNombre, lote, inicio HH:MM}, materiales[]}`; turno `{estado 'EN TRATAMIENTO', horaInicioInfusion, registroRefId, pacienteDocId, formulaNombre}`; **stock** (pending §0.2): materials −1 each; formula components −`dosis` matched by `insumoId` or `nombre`; floor at 0. "✅ Atención iniciada. Stock de fórmula descontado."
- Finish: `duracionMinutos = max(1, floor((fin − inicio)/60000))`; `fin` `HH:MM`; record `{estado 'FINALIZADO', tratamiento.fin, duracionMinutos, observaciones}`; patient evolution prepended `{fecha, tipo 'Enfermería', detalle "Sesión de {formulaNombre}. Duración: {min} min. [Obs: {obs}]", profesional}`; turno `{estado 'FINALIZADO', duracionRealMinutos}`.
- KPIs: average = round(Σ `duracionRealMinutos` / n finished); attended = n.
- History per patient (newest first; filter by fecha/formula/observaciones/enfermera).
- PDF `Atencion_{paciente}_{fecha}.pdf`: vitals table (TA, FC lpm, SatO2 %, Temp °C, Peso kg), treatment table (fórmula, vía + calibre, "De … a …", duración, observaciones or "Paciente tolera…"), footer "Sanalys Clínica Ortomolecular · Informe de Procedimiento · Documento médico confidencial".
- WhatsApp: "*Sanalys - Resumen de Sesión*\n\nHola {primerNombre}! 👋\nTe compartimos el resumen de tu sesión del día {fecha}:\n\n✅ *Tratamiento:* {formula}\n✅ *Duración:* {min} minutos\n[✅ *Tensión Arterial:* {ta}\n]\nGracias por elegirnos...\n\n_Sanalys - Medicina de Precisión_"; no phone → refuse.

## 7. Consentimiento (`consentimiento.html`)
- Feature flag `config/funcionalidades.consentimientosDigitales === true`; otherwise banner and "El modulo no esta habilitado. Activarlo desde Admin → Config del Sistema."
- Texts per type from `config/textosConsentimiento` (slug key); types from `config/tiposTratamiento` (admin's 7 — §0.9); slug = lowercase, ` / `→`_`, spaces→`_`, áéíóú→aeiou.
- Doctor = `personas` with `esMedica && activo !== false`. Autocomplete by DNI (≥ 6 digits) or "NOMBRE (DNI)"; allergies `(p.alergias || 'NINGUNA').toUpperCase()`.
- Checklist (5): "Los riesgos y beneficios del tratamiento fueron explicados claramente" · "Se le informaron las alternativas terapeuticas disponibles" · "Tuvo oportunidad de hacer preguntas y fueron respondidas" · "Acepta el tratamiento de forma libre y voluntaria" · "Entiende que puede retirar su consentimiento en cualquier momento"; if any missing → confirm "No todos los puntos del checklist estan marcados. Continuar de todos modos?".
- Signature: canvas 600×110, mouse and touch, JPEG 0.95 on white. Rebuilt: image to R2 + SHA-256 + server time + IP + user agent (`docs/03-DATOS.md` §3.4). "Nombre y tipo de consentimiento son obligatorios." / "Consentimiento guardado. PDF generado."
- Saved: `pacienteNombre, dni, tipo, medica, texto, alergias, checklist, firma, firmaFecha, firmado, registradoPor, timestamp`; linked to the patient by DNI when found. History newest first, filter by name/DNI, badge firmado / sin firma, view PDF.
- PDF `Consentimiento_{nombre}_{ISO}.pdf`: Datos del Paciente · Consentimiento (text) · DECLARACION DEL PACIENTE (checklist with ticks) · Firma (image 90×25 or a line) · footer (§0.8).
- WhatsApp: `config/mensajes.consentimiento` (§12) with `{nombre} {tratamiento} {clinica}`; "El paciente no tiene telefono registrado en su ficha." / "No hay consentimiento guardado en esta sesion.".

## 8. Sueros — stock y laboratorio (`sueros.html`)
- Access `stock` or `formulas` (§0.5).
- Insumo: `tipo` ∈ `solucion` (vial with `concentracion` %), `puro` (concentration forced 100), `unidad` (count); fields `nombre` (uppercase, required: "Falta el nombre del insumo."), `lab`, `concentracion`, `volPorVial`, `unidadVial` (ml|g|u), `unidadUso` (ml|mg|g|unidad), `stockDisp` (in use units), `stockDispML`, `costo` (per vial), `lote`, `fechaVencimiento`, `minimoViales` (default 2; 10 for `unidad`).
- **`unidadesPorVial(ins)`**: `conc = (concentracion || 100)/100`, `vol = volPorVial || 1`; `ml` → `vol`; `mg` → `vol × conc × 1000`; `g` → `vol × conc`; else `vol`.
- **`dosisAMlSolucion(dosis, ins)`**: `ml` → `dosis`; `mg` → `dosis / (conc × 1000)`; `g` → `dosis / conc`.
- **`stockLegible`**: `floor(stockDisp / upv)` full vials + remainder in use units ("N viales + X ml abierto").
- New stock: `stockDisp = upv × viales`, `stockDispML = volPorVial × viales`; `unidad` type: direct count.
- Excel import columns (exact headers): `Tipo | Nombre | Laboratorio | Concentracion_pct | VolPorVial_ml | UnidadUso | Viales_Sumar | CostoPorVial | Lote`; match by upper-cased name; existing → add stock, replace costo/lote; new → create; "Error al procesar el Excel."
- Formula: `nombre`, `pvp`, `volTotal`, components `{insId, nombre, dosis, unidad, mlEquivalente = dosisAMlSolucion, costo = (dosis / upv) × costoVial}`; margin `((pvp − Σcosto) / pvp) × 100`, red below 30 %; "sin stock" badge per component; "Completá el nombre y agregá al menos un componente."
- Manual use: each component `stockDisp ≥ dosis` else "⚠ Stock insuficiente de {nombre}"; decrement `max(0, stockDisp − dosis)`.
- Alerts: crítico `stock ≤ 0` (unidad) or `< 1 vial`; bajo `< minimoViales`; vence `fechaVencimiento ≤ today + 30 d`.
- Receta médica PDF `Receta_Medica_{medica}_{fecha}.pdf`: doctor (`esMedica` or `tipo` medica or has `matricula`), name/DNI/matrícula, date "Santa Fe, …", "Rp./", components (name, concentration, presentation, quantity "amp."), diagnosis editable default "Suplementación Endovenosa", signature line, footer "Documento médico confidencial…". Orden proveedor PDF `Orden_Proveedor_{fecha}.pdf`: PRINCIPIO ACTIVO · CONCENTRACIÓN · PRESENTACIÓN · CANTIDAD, total units. Both write `historialPedidos` `{fecha, hora, creado, tipo 'RECETA MÉDICA'|'ORDEN PROVEEDOR', medica|'—', items, detalle, usuario}`, listed newest first.

## 9. Caja (`caja.html`)
- Access `caja`. Config: `maestros.ingresos`, `maestros.egresos + egresosVariables`, `reparto.porcentajeMedica` (60), `porcentajeSueros` (60), `montoMaxOperacion` (1 000 000), professionals = `personas` with `esMedica && activo !== false`, `mediosPago.lista` default `['Efectivo','Banco','Billetera Virtual']` (extra media get dynamic cards), `formulas` for price autocomplete, `periodosCerrados.lista`, `saldoInicial_{periodo}`.
- Period = `YYYY-MM` of today; closed period → "El período actual está cerrado. No se pueden agregar movimientos." and "No se puede anular: el período {periodo} está cerrado."; closing a period writes `auditoria` `CIERRE DE PERÍODO: {periodo}`.
- **Comprobante numbers** `{PREFIJO}-{YY}-{NNNN}`: `OI` ingreso, `OE` egreso, `OT` traspaso, `OH` honorario, `OR` retiro, `CC` cierre; max + 1 per prefix and year, zero-padded 4; cancelled numbers are not reused. Rebuilt with sequences (G-009).
- **Ticket INGRESO**: DNI required (max 8; message "⛔ ERROR CRÍTICO:\n\nEl DNI del paciente es OBLIGATORIO para todos los ingresos.\n\nSi es un ingreso sin paciente (ejemplo: venta de producto, 'error'), usá DNI genérico: 00000000"); items `{tipo (from ingresos), detalle, monto > 0, prof (may be 'Sanalys'), formula (if tipo is suero/fórmula)}` ("Completá el tipo y el precio."); `confirmarMontoAlto`. Per item one row `{ticketId, nroComp OI (one per ticket), tipo INGRESO, det "{tipo}[ - {detalle}]", mon, med, dni, fecha dd/mm/yyyy, hora HH:MM:SS, usuario, profesional, centroCosto = tipo, honorarioCalculado, esHonorario false, esTraspaso false, anulado false, periodo}`. Prefill from other screens via `sanalys_caja_dni/_nombre/_motivo/_medica`.
- **Honorario**: if `prof` and `prof !== 'Sanalys'`: `porc = tipo includes 'suero'|'fórmula' ? porcentajeSueros : porcentajeMedica` (§0.3); `honorario = round(monto × porc) / 100`; if > 0 write EGRESO `OH` `{det "HONORARIO {prof} ({porc}%) por: {tipo}", mon honorario, med = ticket medium, centroCosto 'Honorarios Médicos', destino "Honorarios x Pagar {prof}", esHonorario true, esTraspaso true}` and INGRESO `{med "Honorarios x Pagar {prof}", usuario 'Sistema', esHonorario true, esTraspaso true}` — same transaction.
- After a ticket: today's turnos with the same DNI → `estado 'PAGADO'` (local date with the timezone fix).
- **EGRESO**: clasificación (from egresos) + concepto + monto > 0 required ("Completá la clasificación, concepto y monto."); proveedor and detalle upper-cased; factura optional; `det = "{proveedor} - {concepto} (Fact: {factura})"`; `OE`; `centroCosto = clasificación`.
- **TRASPASO**: origen ≠ destino ("Origen y destino no pueden ser iguales."), motivo, monto > 0, balance check "Saldo insuficiente en {origen}. Disponible: $ {saldo}"; accounts = media + 'Fondo Reinversión' + 'Inversiones' + every "Honorarios x Pagar {prof}"; pair EGRESO/INGRESO with the same `OT`, `det "TRASPASO: {motivo}"`, `esTraspaso true`, `destino`.
- **RETIRO**: socia, motivo, monto > 0; "Saldo insuficiente en Honorarios x Pagar {socia}. Disponible: $ {saldo}"; two EGRESO rows with the same `OR` (`med 'Efectivo'` and `med "Honorarios x Pagar {socia}"`), `centroCosto 'Retiro de Socias'`, `esTraspaso true`, `profesional = socia`.
- **Saldos**: per account = initial balance (Efectivo only, `saldoInicial_{periodo}`) + Σ(INGRESO − EGRESO) of non-cancelled, non-`CIERRE` rows with `med === account`; cards: media[0..2], Fondo Reinversión, Inversiones, Honorarios x Pagar (breakdown), dynamic extras; displayed rounded.
- **Cierre de turno (arqueo)**: system cash = initial + today's Efectivo rows (non-`CIERRE`), rounded; bill count over `[20000, 10000, 2000, 1000, 500, 200, 100, 50, 20, 10]`; `dif = fisico − sistema` (green 0, yellow > 0, red < 0); reason required only when `dif ≠ 0` ("Hay una diferencia. Escribí el motivo o cancelá para controlar antes de cerrar."); writes `CIERRE` row `{nroComp CC, det summary, mon fisico, med 'Efectivo', arqueoFisico, arqueoSistema, diferencia, motivoDiferencia, billetes[{valor, cantidad}]}`; toasts "Cierre registrado. Diferencia de $ {dif} — quedo registrada para auditoria." / "✅ Cierre de turno registrado. Caja cuadrada."
- **Anulación**: reason required; period must be open; sets `{anulado true, motivoAnulacion, anuladoPor, fechaAnulacion}` on the row **and on every related row** (same `nroComp` or same `ticketId`); "✅ {n} movimiento(s) anulado(s)".
- PDFs: daily `Caja_{fecha}.pdf` (non-cancelled, non-`CIERRE`, today); period report (non-cancelled, period); arqueo history `Arqueo_{usuario}_{fecha}.pdf` (rows between closures, no `CIERRE`, no traspasos); comprobante `Comprobante_{nroComp}.pdf` (all fields; DNI shown unless `00000000`). Excel `Caja_Sanalys_{ISO}.xlsx` columns Fecha, Hora, Tipo, Comprobante, Detalle, Monto, Medio, Profesional, Usuario.

## 10. Balance (`balance.html`)
- Access `balance`. Config `reparto` (`porcentajeMedica 60, porcentajeSueros 60, porcentajeReserva 5, divisionSociedad 3`), `maestros`.
- Filters: date range (quick: hoy, ayer, semana from Monday, mes, mesAnterior, anio, trimestre = last 3 months, todo); account filter `TODAS` | `STAFF_{nombre}` (`profesional ===`) | account (`centroCosto || tipo`); always excludes `anulado` and `CIERRE`.
- BI charts: income by month (INGRESO, non-traspaso); top treatments by `centroCosto` (suero/fórmula grouped as "Sueroterapia"); collection by weekday Mon–Sat.
- **P&L**: `ingresos = Σ INGRESO && !esTraspaso`; `honorariosVariables = Σ round(monto × porc)/100` (porc per §0.3, only when `profesional && !== 'Sanalys'`); `egresosVariables = Σ EGRESO && !esTraspaso && centroCosto ∈ egresosVariables`; `egresosFijos` = the other EGRESO; `margen = ingresos − honorarios − egresosVariables`; `EBITDA = margen − egresosFijos`; `margen% = margen / ingresos`; `puntoEquilibrio = egresosFijos / margen%`.
- **Distribución (Tricount)**: per doctor `honorarios = Σ(monto × porc/100)`, `retirosHonorarios` = RETIRO rows whose `centroCosto` does not include 'Dividendos', `dividendos` = the ones that do, `saldo = honorarios − retirosHonorarios`. If `EBITDA > 0`: `reserva = EBITDA × porcentajeReserva/100`, `utilidad = EBITDA − reserva`, `dividendoPorSocia = utilidad / divisionSociedad`.
- **Sumas y saldos** PDF: one row per account from maestros + "Honorarios {prof}" + `otro`; INGRESO/EGRESO/RETIRO sums; columns CUENTA · INGRESOS (+) · EGRESOS (−) · SALDO NETO.
- **Libro diario** PDF: N°/FECHA · CUENTA · DETALLE · INGRESO · EGRESO · CAJERO; cancelled rows "(ANULADO)" in gray; totals.
- **Asientos (partida doble)**: INGRESO (not honorario, not traspaso) → DEBE `med` / HABER `centroCosto`; EGRESO honorario → DEBE `med` / HABER "Honorarios x Pagar {prof}"; EGRESO normal → DEBE `centroCosto` / HABER `med`; TRASPASO → DEBE destino / HABER origen; RETIRO → DEBE "Honorarios x Pagar {prof}" / HABER `med`; grouped by `nroComp`; DEBE must equal HABER; "Sin movimientos en el período seleccionado."
- **Libro mayor** PDF: per `med`, parallel ING/EGR columns, per-account balance.
- **Estado profesional**: services = INGRESO && !esTraspaso && !esHonorario; fee per service (§0.3); retiros = EGRESO with `centroCosto 'Retiro de Socias'`; saldo.
- **Inversiones**: `{descripcion, tipo, entidad, fechaInicio, fechaVenc, capital, valorActual, estado activa|cerrada, notas}`; KPIs over active: capital, value, `rendimiento = valor − capital`, `%`; alerts vencido (< 0 days) red, ≤ 7 orange, ≤ 30 yellow; PDF with alert pages. "⚠️ No hay datos contables para exportar."

## 11. CRM (`crm.html`)
- Access: `crm` (§0.5). Stages: `nuevos` "Nuevas Consultas" · `seguimiento` "En Seguimiento" · `presupuesto` "Presupuesto Enviado" · `ganado` "Convertidos"; `perdido` outside the board.
- New lead `{nombre '', tel '', origen 'Instagram', etapa 'nuevos', interes 'General', bitacora [{f, t 'Creado.', tipo 'neutro'}], creadoEn}`; origins Instagram, WhatsApp, Recomendación, Web / Otro; interests Sueros / IV, Medicina Ortho, Suplementos, Consulta General; `proximoContacto` date.
- Bitácora `{f, t, tipo positivo|negativo|neutro}` newest first; automatic entries "Creado.", "Movido a {ETAPA}" (drag), "Baja: {motivo}" (negativo), "Convertido a paciente oficial." (positivo).
- Convert: lead → `ganado`, `convertido true`, `pacienteFirestoreId`; creates a patient with `nombre`, `tel`, empty clinical fields, `creadoPor 'CRM — Conversion automatica'`, `origenCRM`, `interesCRM`, `crmLeadId`; opens the patient prefilled. (Rebuild adds the DNI-duplicate check the inherited code lacks — G-011.)
- Lost: prompt reason → `etapa 'perdido'`, `motivo`.
- KPIs: conversion = round(ganados / total × 100); by origin; doughnut convertidos `#D0FF4E` / perdidos `#ef4444` / pipeline `#fbbf24`.
- WhatsApp from a lead: `wa.me/54{tel}` (inherited; normalised with `waNumero` in the rebuild — G-012).
- PDF `Reporte_CRM_Sanalys_{ISO}.pdf`: converted (nombre, origen, interes, last bitácora date) and lost (nombre, origen, interes, motivo).

## 12. Admin (`admin.html`) — configuration and its defaults
- Access `admin`. Tabs: Personas y Roles · Honorarios y Reparto · Plan de Cuentas · Agenda y Espacios · Usuarios y Accesos · Inversiones · Config del Sistema · Auditoría y Respaldo · Análisis de Pacientes · Alertas y Sesión.
- `personas` `{nombre, dni, tel, email, especialidad, matricula, esMedica, pctMedicaIndividual, esSocia, parteSociedad, activo, tipo}`.
- `config.reparto` `{porcentajeMedica 60, porcentajeSueros (§0.4), porcentajeReserva 5, modoDistribucion 'proporcional'|'igualitaria', montoMaxOperacion 1000000}`; simulator: doctor takes her %, socias split the rest by `parteSociedad` (proporcional) or equally (igualitaria; none → fund), reserve = amount × porcentajeReserva/100; monthly liquidation PDF.
- `config.maestros` `{ingresos[], egresos[], egresosVariables[], centrosCosto[]}` sorted A–Z.
- `config.agenda` (see §4) with `dias [1,2,3,4,5]`; salas `tipo 'consulta'` require `profesionalId`, `tipo 'sueros'` require `capacidad`.
- `usuarios/{email}` `{nombre, rol 'operativo', permisos[], activo}`; permissions `admin, pacientes, stock, formulas, caja, balance, agenda, enfermeria, sueros, legal` (+ `crm`); toggle `activo`; delete. Inherited alta: create in Firebase Console first → replaced by "Invitar" via Clerk.
- `inversiones.tipo` ∈ FCI, Plazo Fijo, Criptomonedas, Acciones, Inmueble, Fondo Reserva, Otro.
- `config.datosClinica` `{nombre, direccion, telefono, email, instagram, web, facebook, tiktok, slogan}` — used in every PDF header.
- `config.alertas` `{diasInactividad 30, stockMinimo 5}` · `config.mediosPago` `{lista ['Efectivo','Banco','Billetera Virtual','Inversiones']}` · `config.funcionalidades` `{consentimientosDigitales, trazabilidadLotes}` · `config.tiposTratamiento` `{lista: ['Terapia Inyectable / Sueros IV','Mesoterapia','Pellets Hormonales','Terapia Hormonal','Medicina Ortomolecular','Tratamiento Estetico','Plasma Rico en Plaquetas']}` · `config.textosConsentimiento` `{<slug>: texto}` (empty = written at signing time) · `config.seguridad` `{timeoutMinutos 30}` · `config.archivado` `{mesesInactividad 0}` (§0.7) · `config.recordatorios` `{textoPlantilla, horaEnvio 18, horasAnticipacion 24}` (§0.7) · `config.disp_{profesionalId}` (§0.7).
- **`config.mensajes` defaults** (placeholders `{nombre} {fecha} {hora} {servicio} {tratamiento} {clinica}`):
  - `confirmacion_turno`: "Hola {nombre}! 👋\n\nTe confirmamos tu turno en *Sanalys*:\n\n📅 *{fecha}*\n🕐 *{hora} hs*\n💉 {servicio}\n\nSi necesitás cancelar o reprogramar avisanos con anticipación. ¡Te esperamos!\n\n_Sanalys — La ciencia de estar bien_ 🌿"
  - `recordatorio_turno`: "Hola {nombre}! 👋\n\nTe recordamos tu turno *mañana* en *Sanalys*:\n\n📅 *{fecha}*\n🕐 *{hora} hs*\n💉 {servicio}\n\n¿Confirmás asistencia? Cualquier cambio avisanos. ✅\n\n_Sanalys — La ciencia de estar bien_ 🌿"
  - `inactivo`: "Hola {nombre}! 💚\n\nHace un tiempo que no te vemos por *Sanalys* y nos preguntamos cómo estás.\n\nSi querés retomar tu tratamiento o tenés alguna consulta, estamos disponibles para vos.\n\n¡Te esperamos! 🌿\n\n_Sanalys — La ciencia de estar bien_"
  - `cumpleanos`: "¡Hola {nombre}! 🎉🎂\n\nTodo el equipo de *Sanalys* te desea un muy feliz cumpleaños.\n\nQue este año que comienza esté lleno de salud, bienestar y momentos hermosos. ✨\n\n_Con cariño — Sanalys_"
  - `consentimiento`: "Hola {nombre}! 📋\n\nAdjuntamos tu *Consentimiento Informado* para el tratamiento de *{tratamiento}* firmado hoy en *Sanalys*.\n\nGuardá este mensaje como respaldo. Ante cualquier duda estamos a disposición.\n\n_Sanalys — La ciencia de estar bien_ 🌿"
  - `gift_card`: "Hola {nombre}! 🎁\n\nTu cumpleaños se acerca y queremos celebrarlo con vos.\n\nEn *Sanalys* tenemos *Gift Cards* especiales para regalar salud y bienestar. ¿Se lo hacemos saber a alguien especial?\n\n¡Escribinos y lo coordinamos! ✨\n\n_Sanalys — La ciencia de estar bien_"
- Auditoría: rows `{timestamp, fecha, usuario|'Sistema', accion, detalle}` written on persona changes, reparto, tipos, medios, alertas, timeout, dashboard-analysis queries, exports; viewer merges cancelled cash rows as `PAGO ANULADO` "$ {mon} Motivo: {motivo|'S/D'}", newest first. Backup JSON of caja, pacientes, insumos, formulas, config, usuarios, deudas, turnos, auditoria, personas, inversiones (subcollections excluded — the rebuild's backup is the encrypted dump, and the JSON export is kept as a feature).
- Análisis de pacientes: CSV nominal ("NO subir a IA"), CSV anonymised (hash), CSV equivalence table (confidential); inactive by bitácora ≥ `diasInactividad`, max 30 shown.
- Mass deletion removed in the inherited "C2" fix; the rebuild has no mass deletion either.

## 13. Manual (`manual.html`)
Rewritten to match the rebuilt system; the inherited manual is wrong on rules and stock timing and is not carried over as-is.
