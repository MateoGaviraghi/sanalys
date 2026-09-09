# 12 — CLIENT QUESTIONS

> The `docs/00-BRIEF.md` §8 ledger rewritten as short questions the client can answer in one line each. Mateo's decision (2026-09-09): they are **not** sent one by one as units need them; they go in one batch in WU-22b, unless a unit is hard-blocked by one of them — then only that question is sent, and its answer is recorded in §8 and `docs/10-MEMORY.md`. The questions are in Spanish because they are sent verbatim; the framing is English like every other doc. When an answer arrives: update the §8 row, add a `D-NNN` or `G-NNN` if it changes anything already built, and strike the question here.

| # | Pregunta (verbatim, to send) | Ledger | Blocks |
|---|---|---|---|
| 1 | ¿De quién es la cuenta de Firebase donde corre el sistema actual? ¿Tenés el usuario? | CI-05 | WU-01b, launch date |
| 2 | ¿De quién es la cuenta de Netlify? | CI-05 | WU-01b, launch date |
| 3 | ¿Dónde está registrado el dominio sanalys.com.ar y a nombre de quién? | CI-05 | WU-01b, launch date |
| 4 | ¿Tenés cuenta en Vercel? Si no, ¿la abrimos a tu nombre? | CI-05 | WU-01b |
| 5 | ¿Qué tarjeta va a pagar el dominio y cualquier servicio que en el futuro deje de ser gratis? | CI-05 | WU-01b |
| 6 | ¿Hay pacientes, cobros o inversiones cargados de verdad en el sistema actual, o son datos de prueba? | CI-04 | WU-24 |
| 7 | Dirección exacta de la clínica. | CI-09 | Contacto, footer |
| 8 | Teléfono / WhatsApp para pacientes (el manual dice 342 445-2643 y el sistema viejo 342 452-8533: ¿cuál?). | CI-09 | Contacto, footer |
| 9 | Mail de contacto. | CI-09 | Contacto |
| 10 | Días y horarios de atención. | CI-09 | Contacto |
| 11 | Instagram y cualquier otra red. | CI-09 | Contacto, footer |
| 12 | Nombre completo, título y matrícula de cada médica (el manual muestra el mismo número en dos tarjetas: ¿cuál es de quién?). | CI-10 | Credentials block, Nosotros |
| 13 | ¿Quién aparece en la web con foto y quién no? | CR-01 | Nosotros |
| 14 | Para cada uno de los 8 Drips: 2 o 3 frases de qué es y para quién. | CR-02 | Tratamientos |
| 15 | ¿Se publica el precio o va "consultar"? | CR-02 | Tratamientos |
| 16 | ¿Cuánto dura una sesión y cada cuánto se repite? | CR-02 | Tratamientos (SPEC-TABLE) |
| 17 | ¿Cuántas salas hay? ¿Cuántos sillones en cada una? | OQ-13 | **WU-08 calendar** |
| 18 | ¿Qué días y horarios se dan turnos online? | OQ-13 | **WU-08 calendar** |
| 19 | ¿Cuánto dura un turno? | OQ-13 / `config.agenda.duracion` | WU-08 |
| 20 | Política de cancelación: ¿hasta cuándo se puede cancelar y qué pasa si no avisan? | CI-12 | WU-08 |
| 21 | Cuando alguien reserva, ¿le mandamos solo mail o mail y WhatsApp? | CI-11 | nothing (default ships) |
| 22 | ¿El paciente firma algo al reservar, o firma en la clínica el día del tratamiento? | CI-02 | WU-08 signature step, WU-19 |
| 23 | Los pasos del tratamiento, numerados, del primero al último (el manual arranca con "Paso 01 · El escaneo inicial"; ¿cuáles siguen?). | CI-03 | Home, Tratamientos (no launch) |
| 24 | ¿En qué paso elige el Drip? | CI-03 | Home, Tratamientos |
| 25 | ¿Con quién revisamos las 8 dudas del sistema viejo? (lista en `docs/08-REGLAS-SISTEMA.md` §0, to be sent in plain words when WU-14 starts) | CI-01 | **WU-14 to WU-21** |
| 26 | Cierre de sesión por inactividad: ¿30 minutos o desactivado? | OQ-13 (a) | WU-12 |
| 27 | ¿Para cuándo tendrías fotos reales de la clínica y del equipo? | CR-01 | Home and Nosotros launch |
| 28 | Texto de "cómo nació Sanalys" y una historia corta de cada integrante. | CR-03 | Nosotros |
| 29 | Novedades: ¿quién las escribe, cada cuánto, y con qué matrícula se firman? | CR-04 | WU-10 |
| 30 | ¿Quién va a mirar el número de turnos por mes que cuenta la web? | CI-13 | nothing (written `NONE`) |
| 31 | ¿Tenés abogado para revisar la firma digital, los datos de salud y el texto de privacidad? Sin esto no se lanza. | CI-07, CR-05 | **Launch** |
| 32 | Comprar la licencia web de Borna en atipofoundry.com (familia completa, "pay what you want", que incluya uso web) y guardar el comprobante. | CI-08 | Borna in `packages/brand` (D-016) |

Hard blocks that cannot wait for the batch: 17–19 before WU-08, 25 before WU-14, 31 before WU-25.
