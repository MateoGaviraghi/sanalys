"use client"

import { useRef, type ElementType, type ReactNode } from "react"

import { gsap, SplitText, useGSAP } from "@/lib/gsap"

interface SplitRevealProps {
  children: ReactNode
  /** Etiqueta a renderizar. El hero usa h1; los titulos de seccion, h2. */
  as?: ElementType
  /** Segundos desde el montaje hasta que empieza a subir la primera linea. */
  delay?: number
  /** Segundos que tarda cada linea en subir. */
  duration?: number
  className?: string
  /** Se pasa tal cual al elemento: el hero lo usa para marcar [data-intro]. */
  "data-intro"?: string
}

/**
 * Revelado de titulares por lineas (docs/05-DISENO.md section 5 y 10).
 *
 * Divide por LINEAS, no por caracteres: partir un titular en caracteres es la senal mas
 * reconocible de motion generado por IA, y ademas es caro. Cada linea sube desde su mascara.
 *
 * Espera a document.fonts.ready antes de dividir (D-027). Antes dividia al montar y autoSplit
 * volvia a dividir cuando entraba la fuente real: la animacion arrancaba de nuevo a mitad de
 * camino y el titular pegaba un salto. Mientras espera, el titular queda con visibility hidden;
 * la fuente esta precargada, asi que la espera es de un par de cuadros. La demora pedida se
 * descuenta de lo que tardo la fuente, para que la coreografia del hero no se corra.
 *
 * Accesibilidad: el texto original va como aria-label antes de dividir y los fragmentos quedan
 * ocultos al lector. Con movimiento reducido no se divide nada.
 */
export function SplitReveal({
  children,
  as: Tag = "h2",
  delay = 0,
  duration = 0.9,
  className = "",
  "data-intro": dataIntro,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      el.setAttribute("aria-label", (el.textContent ?? "").trim())

      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
        // Deja las lineas sin transform. El guard es porque con autoSplit el onComplete de un
        // tween viejo puede llegar cuando esas lineas ya fueron revertidas.
        const soltar = (lineas: Element[]) => {
          if (lineas.length) gsap.set(lineas, { clearProps: "transform" })
        }

        let split: SplitText | null = null
        let vivo = true
        const inicio = performance.now()
        el.style.visibility = "hidden"

        document.fonts.ready.then(() => {
          if (!vivo) return
          const espera = Math.max(0, delay - (performance.now() - inicio) / 1000)
          // ctx.add: lo que se crea despues del montaje queda igual adentro del contexto, asi
          // se revierte solo al desmontar.
          ctx.add(() => {
            split = SplitText.create(el, {
              type: "lines",
              mask: "lines",
              linesClass: "line",
              autoSplit: true,
              aria: "none",
              onSplit(self) {
                self.lines.forEach((line) => line.setAttribute("aria-hidden", "true"))
                return gsap.from(self.lines, {
                  yPercent: 100,
                  duration,
                  delay: espera,
                  stagger: 0.08,
                  ease: "expo.out",
                  onComplete: () => soltar(self.lines),
                })
              },
            })
          })
          el.style.visibility = ""
        })

        return () => {
          vivo = false
          el.style.visibility = ""
          // ORDEN IMPORTANTE: soltar los transforms ANTES de revertir, si no la linea puede
          // quedar estacionada en yPercent 100 adentro de su mascara (G-040).
          if (split) {
            soltar(split.lines)
            split.revert()
          }
        }
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {})

      return () => mm.revert()
    },
    { scope: ref, dependencies: [delay, duration] },
  )

  // data-split acota la regla de globals.css que le da aire al clip de la mascara.
  return (
    <Tag ref={ref} data-split="" data-intro={dataIntro} className={className}>
      {children}
    </Tag>
  )
}
