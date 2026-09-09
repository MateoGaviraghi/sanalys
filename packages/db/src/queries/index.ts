/**
 * Query modules for the internal system, one file per table group, added by the unit that
 * needs them: `turnos` in WU-14, `pacientes` in WU-15, `caja` in WU-16, and so on
 * (docs/11-ROADMAP.md). Authorization is never here — it lives in `sistema/src/dal/guard.ts`
 * and runs before any of these are called (docs/06-SEGURIDAD.md section 4).
 */
export { crearDb } from "./db.ts"
export type { DbSistema } from "./db.ts"
