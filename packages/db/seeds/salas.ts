/**
 * No sala is seeded, on purpose.
 *
 * The inherited system starts with `config/agenda.salas = []` and the clinic creates its
 * own rooms from Admin > Agenda y Espacios: name, tipo (consulta | sueros), number of
 * chairs, the professional for a consulting room, and the weekly schedule. Every one of
 * those is a fact about the real clinic — how many chairs, which hours — and none of them
 * is written down anywhere yet (OQ-13). Seeding an invented room would put fake capacity
 * behind the chair constraint and fake hours behind the public booking calendar.
 *
 * The rooms are loaded once the client answers; nothing else in the build depends on them.
 */
export const SALAS_SEED: never[] = []
