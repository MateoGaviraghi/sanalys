import Image from "next/image"

import isotipo from "@sanalys/brand/assets/isotype-fluo.svg"
import logoApilado from "@sanalys/brand/assets/logo-stacked-fluo.svg"
import logoHorizontal from "@sanalys/brand/assets/logo-horizontal-fluo.svg"
import patron from "@sanalys/brand/assets/pattern-tile.svg"

/**
 * Muestra de WU-03: comprueba que los tokens de @sanalys/brand (docs/05-DISENO.md section 2)
 * compilan y se ven en esta app. No es la Home: la Home real se construye en WU-06 sobre la
 * secuencia de bloques de docs/04-INTERFAZ.md section 1.1 y reemplaza este archivo entero.
 */

const pasos = [
  { paso: "−1", clase: "text-step--1" },
  { paso: "0", clase: "text-step-0" },
  { paso: "1", clase: "text-step-1" },
  { paso: "2", clase: "text-step-2" },
  { paso: "3", clase: "text-step-3" },
  { paso: "4", clase: "text-step-4" },
  { paso: "5", clase: "text-step-5" },
] as const

const colores = [
  { nombre: "verde", hex: "#0A3D33", oklch: "oklch(0.325 0.055 176)", clase: "bg-verde text-blanco" },
  { nombre: "verde-deep", hex: "#071F1A", oklch: "oklch(0.218 0.032 177)", clase: "bg-verde-deep text-fluo" },
  { nombre: "fluo", hex: "#D0FF4E", oklch: "oklch(0.936 0.202 123)", clase: "bg-fluo text-verde" },
  { nombre: "negro", hex: "#000000", oklch: "oklch(0 0 0)", clase: "bg-negro text-fluo" },
  { nombre: "gris", hex: "#9A9B9D", oklch: "oklch(0.689 0.003 265)", clase: "bg-gris text-verde" },
  { nombre: "blanco", hex: "#FFFFFF", oklch: "oklch(1 0 90)", clase: "bg-blanco text-verde border border-gris" },
] as const

export default function Page() {
  return (
    <main className="font-body text-step-0 leading-(--leading-body)">
      <header className="ground-verde px-(--space-5) py-(--space-section)">
        <p className="text-step--1 font-semibold uppercase tracking-[0.12em] text-fluo">
          Sanalys · paquete de marca · WU-03
        </p>
        <h1 className="type-display text-step-5 mt-(--space-5) max-w-[14ch]">
          La ciencia de <mark className="highlight">estar bien.</mark>
        </h1>
        <p className="mt-(--space-6) max-w-(--measure) text-blanco/80">
          Muestra de tokens: tres fondos, un acento, el resaltador. Esta página se reemplaza en
          WU-06.
        </p>
      </header>

      <section className="ground-fluo px-(--space-5) py-(--space-section)">
        <h2 className="type-display text-step-4 max-w-[16ch]">
          Tres fondos, <mark className="highlight">un acento.</mark>
        </h2>
        <p className="mt-(--space-5) max-w-(--measure)">
          Verde, fluo y blanco alternan por sección; gris queda para etiquetas y tarjetas. El
          resaltador toma el par de colores del fondo en el que está.
        </p>
      </section>

      <section className="ground-blanco px-(--space-5) py-(--space-section)">
        <h2 className="type-display text-step-3">Escala tipográfica</h2>
        <ol className="mt-(--space-6) grid gap-(--space-4)">
          {pasos.map(({ paso, clase }) => (
            <li key={paso} className="grid grid-cols-[6ch_1fr] items-baseline gap-(--space-4)">
              <span className="text-step--1 font-semibold tabular-nums text-verde-ink-soft">
                Paso {paso}
              </span>
              <span className={`type-display ${clase}`}>
                La ciencia de <strong className="font-bold">estar bien.</strong>
              </span>
            </li>
          ))}
        </ol>

        <h2 className="type-display text-step-3 mt-(--space-8)">Color</h2>
        <ul className="mt-(--space-6) grid grid-cols-2 gap-(--space-4) md:grid-cols-3">
          {colores.map(({ nombre, hex, oklch, clase }) => (
            <li key={nombre} className={`${clase} rounded-2 p-(--space-5)`}>
              <p className="text-step-1 font-semibold">{nombre}</p>
              <p className="mt-(--space-2) text-step--1 tabular-nums">{hex}</p>
              <p className="text-step--1 tabular-nums opacity-80">{oklch}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-(--space-8) grid gap-(--space-3) text-step--1 md:grid-cols-3">
          <div>
            <dt className="font-semibold">Radios</dt>
            <dd className="tabular-nums text-verde-ink-soft">0 · 4 px · 12 px</dd>
          </div>
          <div>
            <dt className="font-semibold">Duraciones</dt>
            <dd className="tabular-nums text-verde-ink-soft">140 · 240 · 440 ms</dd>
          </div>
          <div>
            <dt className="font-semibold">Fuente</dt>
            <dd className="text-verde-ink-soft">Roboto Flex (Borna cuando llegue la licencia, CI-08)</dd>
          </div>
        </dl>
      </section>

      <section className="ground-gris px-(--space-5) py-(--space-section)">
        <h2 className="type-display text-step-3">Logo</h2>
        <div className="mt-(--space-6) flex flex-wrap items-end gap-(--space-7)">
          <Image src={logoHorizontal} alt="sanalys" className="h-16 w-auto" priority />
          <Image src={logoApilado} alt="sanalys" className="h-28 w-auto" />
          <Image src={isotipo} alt="sanalys" className="h-16 w-auto" />
        </div>
      </section>

      <section className="ground-verde relative overflow-hidden px-(--space-5) py-(--space-section)">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-8"
          style={{
            backgroundImage: `url(${patron.src})`,
            backgroundRepeat: "repeat",
            backgroundSize: "191px 304px",
          }}
        />
        <p className="relative max-w-(--measure) text-step--1 text-blanco/80">
          Patrón al 8 % sobre verde, nunca detrás de texto. Placeholder: nada de esta página se
          publica.
        </p>
      </section>
    </main>
  )
}
