/**
 * Presentation only (docs/03-DATOS.md section 1). The database stores `timestamptz` in UTC
 * and money as `numeric(12,2)`; the inherited strings — `dd/mm/yyyy`, `HH:MM`, `YYYY-MM`,
 * `$ 1.234,5` — are produced here and never stored.
 *
 * Every date is rendered in America/Argentina/Buenos_Aires. G-014: the inherited system
 * stored locale strings in three different shapes and had to patch a UTC-3 bug in caja;
 * that class of bug disappears by formatting in one place, from UTC.
 */
import Decimal from "decimal.js"

export const ZONA_HORARIA = "America/Argentina/Buenos_Aires"

const fecha = new Intl.DateTimeFormat("es-AR", {
  timeZone: ZONA_HORARIA,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const hora = new Intl.DateTimeFormat("es-AR", {
  timeZone: ZONA_HORARIA,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

const fechaLarga = new Intl.DateTimeFormat("es-AR", {
  timeZone: ZONA_HORARIA,
  weekday: "long",
  day: "numeric",
  month: "long",
})

const periodoFmt = new Intl.DateTimeFormat("es-AR", {
  timeZone: ZONA_HORARIA,
  year: "numeric",
  month: "2-digit",
})

/** `dd/mm/yyyy`. The inherited `toLocaleDateString('es-AR')` dropped leading zeros; the doc's format keeps them. */
export const formatFecha = (d: Date): string => fecha.format(d)

/** `HH:MM`, 24 h. */
export const formatHora = (d: Date): string => hora.format(d)

/** `dd/mm/yyyy HH:MM`. */
export const formatFechaHora = (d: Date): string => `${formatFecha(d)} ${formatHora(d)}`

/** Weekday and month in full, as the inherited WhatsApp reminder prints them (rules section 4). */
export const formatFechaLarga = (d: Date): string => fechaLarga.format(d)

/** `YYYY-MM` — the period key of caja and balance. */
export const formatPeriodo = (d: Date): string => {
  const partes = periodoFmt.formatToParts(d)
  const anio = partes.find((p) => p.type === "year")?.value ?? ""
  // es-AR resolves a year+month format to a numeric month, so the padding is done here.
  const mes = (partes.find((p) => p.type === "month")?.value ?? "").padStart(2, "0")
  return `${anio}-${mes}`
}

/**
 * Money, reproducing `utils.js` `formatMoney` exactly: `'$ ' + toLocaleString('es-AR',
 * { minimumFractionDigits: 0, maximumFractionDigits: 2 })`. So 1234567.8 prints as
 * `$ 1.234.567,8` — the inherited comment claiming `$ 1.234.567,80` is wrong about its own
 * code, and parity follows the code. Null and undefined print `$ 0`, as they did.
 *
 * The value travels as a string (`numeric(12,2)`); it becomes a number only here, to be
 * printed. Arithmetic uses Decimal, never a JS number.
 */
export const formatMoneda = (valor: string | number | Decimal | null | undefined): string => {
  if (valor === null || valor === undefined || valor === "") return "$ 0"
  const n = valor instanceof Decimal ? valor.toNumber() : Number(valor)
  if (Number.isNaN(n)) return "$ 0"
  return `$ ${n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

/** Money as a Decimal, for arithmetic. Never use a JS number for an amount. */
export const aDecimal = (valor: string | number | Decimal): Decimal => new Decimal(valor)

/** `numeric(12,2)` on the wire: a string with exactly two decimals. */
export const aMonto = (valor: string | number | Decimal): string => new Decimal(valor).toFixed(2)

/**
 * The single phone normaliser (G-012: the inherited system had three). The rule is
 * `utils.js` `waNumero` verbatim — strip non-digits, and if it does not already start with
 * 54, prefix 549 after removing one leading zero. `wa.me` wants those digits bare.
 */
export const telefonoWa = (tel: string | null | undefined): string => {
  if (!tel) return ""
  const digitos = String(tel).replace(/\D/g, "")
  if (digitos === "") return ""
  return digitos.startsWith("54") ? digitos : `549${digitos.replace(/^0/, "")}`
}

/** The same number in E.164, which is how it is stored and validated (docs/06-SEGURIDAD.md section 5). */
export const telefonoE164 = (tel: string | null | undefined): string => {
  const digitos = telefonoWa(tel)
  return digitos === "" ? "" : `+${digitos}`
}
