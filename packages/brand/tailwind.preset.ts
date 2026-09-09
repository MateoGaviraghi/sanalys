/**
 * @sanalys/brand — tailwind.preset.ts
 *
 * Tailwind 4 is CSS-first, so this file is not a Tailwind 3 preset: it is the same token set as
 * tokens.css written for JavaScript consumers that never see CSS — jsPDF templates (sistema/src/pdf),
 * Chart.js palettes, `themeColor` metadata, e-mail HTML. Values are copied, not derived: when
 * tokens.css changes, this file changes in the same commit (docs/05-DISENO.md §2 is the source of both).
 *
 * The apps consume it as TypeScript source (`import { brand } from "@sanalys/brand/tailwind.preset"`),
 * which needs `transpilePackages: ["@sanalys/brand"]` in the consuming next.config.ts (WU-15, WU-21).
 */

export const brand = {
  color: {
    verde: { hex: "#0A3D33", rgb: [10, 61, 51], oklch: "oklch(0.325 0.055 176)", pantone: "560 C" },
    verdeDeep: { hex: "#071F1A", rgb: [7, 31, 26], oklch: "oklch(0.218 0.032 177)", pantone: null },
    fluo: { hex: "#D0FF4E", rgb: [208, 255, 78], oklch: "oklch(0.936 0.202 123)", pantone: "374 C" },
    negro: { hex: "#000000", rgb: [0, 0, 0], oklch: "oklch(0 0 0)", pantone: "Black C" },
    gris: { hex: "#9A9B9D", rgb: [154, 155, 157], oklch: "oklch(0.689 0.003 265)", pantone: "Cool Gray 7 C" },
    blanco: { hex: "#FFFFFF", rgb: [255, 255, 255], oklch: "oklch(1 0 90)", pantone: null },
  },
  /** WCAG contrast ratios verified on 2026-09-09 from the hex values (docs/05 §2.1) */
  contrast: {
    fluoOnVerde: 10.5,
    blancoOnVerde: 12.2,
    negroOnFluo: 18.1,
    verdeOnBlanco: 12.2,
    grisOnVerde: 4.4, // large text only
    grisOnBlanco: 2.8, // decorative only
    fluoOnGris: 2.4, // logo only, never text
  },
  font: {
    display: '"Roboto Flex Variable", "Roboto Flex Fallback", Arial, sans-serif', // Borna when CI-08 arrives (D-016)
    body: '"Roboto Flex Variable", "Roboto Flex Fallback", Arial, sans-serif',
    weight: { displayRegular: 400, displayBold: 700, body: 400, bodyMedium: 500, bodySemibold: 600 },
    opszDisplay: 144,
    leading: { display: 0.95, body: 1.5 },
    trackingDisplay: "-0.02em",
    measure: "65ch",
  },
  /** Fluid type scale endpoints in rem: [at 375 px, at 1440 px] */
  step: {
    "-1": [0.83, 0.9],
    "0": [1, 1.125],
    "1": [1.25, 1.5],
    "2": [1.56, 2.1],
    "3": [1.95, 2.95],
    "4": [2.44, 4.1],
    "5": [3.05, 5.8],
  },
  /** Space scale in rem, --space-1 … --space-9 */
  space: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 8],
  radius: { r0: 0, r1: 4, r2: 12 }, // px
  shadow: "0 16px 40px oklch(0 0 0 / 0.25)",
  /** Durations in ms */
  duration: { dur1: 140, dur2: 240, dur3: 440 },
  ease: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Inherited internal-system theme (sistema-interno/sistema/theme.css) — respected as-is, docs/05 §8 */
  sys: {
    ground: "#071F1A",
    modalBg: "#0F2D27",
    thBg: "#0A3D33",
    radius: { card: 18, modal: 20, control: 10, badge: 6 }, // px
    sidebarWidth: 72, // px
    shadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
    ok: "#4ADE80",
    warn: "#FBBF24",
    danger: "#F87171",
    turno: {
      PENDIENTE: "#9CA3AF",
      CONFIRMADO: "#3B82F6",
      ESPERA: "#F97316",
      TRATAMIENTO: "#22C55E",
      FINALIZADO: "#8B5CF6",
    },
  },
} as const

export type Brand = typeof brand
export type BrandColor = keyof Brand["color"]
export type TurnoEstadoConColor = keyof Brand["sys"]["turno"]
