/**
 * Public-site queries. `turnos.ts` (availability and booking) arrives with WU-08 and
 * `novedades.ts` with WU-10; nothing else is ever added here without checking that the
 * `sanalys_web` grants allow it.
 */
export { crearDbWeb, esquemaWeb } from "./db.ts"
export type { DbWeb } from "./db.ts"
