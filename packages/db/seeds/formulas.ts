/**
 * The eight Drips of the identity material (KICKOFF.md section 2), seeded as `formulas`
 * so the agenda, nursing and cash screens have the catalogue the clinic sells.
 *
 * Price and volume are NOT seeded: no source states them, and a price is never invented
 * (CR-02 covers the copy, the price itself is a client input). Composition rows in
 * `formula_componentes` are loaded from Sueros once the clinic dictates each formula.
 */
export const DRIPS_SEED = [
  "Detox Vital",
  "Escudo Antioxidante",
  "Recuperación Deportiva",
  "Impulso Celular",
  "Equilibrio Mental",
  "Anti-Estrés Plus",
  "Renovación Celular",
  "Juventud Activa",
] as const
