/**
 * Muestra de WU-03: comprueba que los tokens heredados (`--sys-*` en @sanalys/brand, copiados de
 * sistema-interno/sistema/theme.css) compilan y se ven en esta app. No es el dashboard: el shell,
 * Clerk y el guard se construyen en WU-12 sobre docs/06-SEGURIDAD.md y docs/08-REGLAS-SISTEMA.md
 * y reemplazan este archivo entero.
 */

const filas = [
  { hora: "09:00", paciente: "Ejemplo", tratamiento: "Detox Vital" },
  { hora: "10:00", paciente: "Ejemplo", tratamiento: "Escudo Antioxidante" },
  { hora: "11:00", paciente: "Ejemplo", tratamiento: "Recuperación Deportiva" },
] as const

const estados = [
  { nombre: "PENDIENTE", color: "var(--sys-turno-pendiente)" },
  { nombre: "CONFIRMADO", color: "var(--sys-turno-confirmado)" },
  { nombre: "ESPERA", color: "var(--sys-turno-espera)" },
  { nombre: "TRATAMIENTO", color: "var(--sys-turno-tratamiento)" },
  { nombre: "FINALIZADO", color: "var(--sys-turno-finalizado)" },
] as const

const badges = [
  { texto: "OK", clase: "bg-(--sys-ok-bg) text-(--sys-ok) border-(--sys-ok-border)" },
  { texto: "Atención", clase: "bg-(--sys-warn-bg) text-(--sys-warn) border-(--sys-warn-border)" },
  { texto: "Error", clase: "bg-(--sys-danger-bg) text-(--sys-danger) border-(--sys-danger-border)" },
] as const

export default function Page() {
  return (
    <main className="min-h-dvh bg-(--sys-ground) p-(--space-5) font-body text-step-0 leading-(--leading-body) text-blanco md:p-(--space-7)">
      <p className="text-step--1 font-semibold uppercase tracking-[0.12em] text-fluo">
        Sanalys · sistema · WU-03
      </p>
      <h1 className="type-display text-step-3 mt-(--space-3)">
        Tokens del sistema <mark className="highlight">heredado</mark>
      </h1>
      <p className="mt-(--space-3) max-w-(--measure) text-blanco/70">
        Fondo, tarjeta, botón, tabla, badges y colores de estado tal como los define el tema
        heredado. Esta página se reemplaza en WU-12.
      </p>

      <section className="mt-(--space-7) grid gap-(--space-5) md:grid-cols-2">
        <article className="rounded-(--sys-r-card) border border-(--sys-border) bg-(--sys-glass) p-(--space-5)">
          <h2 className="text-step-1 font-semibold">Tarjeta heredada</h2>
          <p className="mt-(--space-2) text-blanco/70">
            Vidrio al 3 %, borde al 6 %, radio 18 px. Los modales usan 20 px.
          </p>
          <button
            type="button"
            className="mt-(--space-5) rounded-(--sys-r-control) bg-fluo px-(--space-5) py-(--space-3) font-black text-(--sys-ground)"
          >
            Guardar
          </button>
        </article>

        <article className="overflow-hidden rounded-(--sys-r-card) border border-(--sys-border) bg-(--sys-glass)">
          <table className="w-full border-collapse text-step--1">
            <thead>
              <tr>
                {["Hora", "Paciente", "Tratamiento"].map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="bg-(--sys-th-bg) px-[14px] py-[12px] text-left text-[9px] font-extrabold uppercase tracking-[0.12em] text-fluo"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila) => (
                <tr key={fila.hora} className="border-t border-(--sys-border)">
                  <td className="px-[14px] py-[12px] tabular-nums">{fila.hora}</td>
                  <td className="px-[14px] py-[12px]">{fila.paciente}</td>
                  <td className="px-[14px] py-[12px]">{fila.tratamiento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>

      <section className="mt-(--space-7)">
        <h2 className="text-step-1 font-semibold">Badges</h2>
        <ul className="mt-(--space-3) flex flex-wrap gap-(--space-3)">
          {badges.map(({ texto, clase }) => (
            <li key={texto} className={`${clase} rounded-(--sys-r-badge) border px-(--space-3) py-(--space-1) text-step--1 font-semibold`}>
              {texto}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-(--space-7)">
        <h2 className="text-step-1 font-semibold">Estados de turno</h2>
        <ul className="mt-(--space-3) grid gap-(--space-3) sm:grid-cols-2 lg:grid-cols-5">
          {estados.map(({ nombre, color }) => (
            <li
              key={nombre}
              className="rounded-(--sys-r-control) border border-(--sys-border) bg-(--sys-glass) px-(--space-4) py-(--space-3) text-step--1 font-semibold"
              style={{ borderLeft: `4px solid ${color}` }}
            >
              {nombre}
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-(--space-8) text-step--1 text-blanco/50">Placeholder · se reemplaza en WU-12.</p>
    </main>
  )
}
