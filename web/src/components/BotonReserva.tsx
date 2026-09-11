"use client"

import { type ReactNode, useRef } from "react"

import { gsap, useGSAP } from "@/lib/gsap"

type Tamano = "sm" | "md" | "lg"

const TAMANOS: Record<Tamano, string> = {
  sm: "min-h-11 px-(--space-5) text-step--1 tracking-[0.04em]",
  md: "min-h-12 px-(--space-6) text-step-0",
  lg: "min-h-14 px-(--space-6) text-step-1",
}

interface BotonReservaProps {
  href: string
  children: ReactNode
  tamano?: Tamano
  className?: string
  onClick?: () => void
}

/**
 * El boton primario del sitio, en bloque 3D (D-026). Header, hero y menu usan este y ningun otro.
 *
 * Es un bloque con canto, no un boton con sombra: dos capas solidas, la CARA al frente y el
 * CANTO detras, corrido 4 px abajo a la derecha. Asi el volumen se lee con el radio 0 de la
 * marca y sin ninguna sombra difusa (impeccable prohibe el borde + sombra ancha de boton de
 * plantilla).
 *
 *   reposo  -> la cara flota 4 px sobre el canto
 *   hover   -> sube a 6 px y el texto rueda: se va por arriba y entra la misma palabra desde abajo
 *   press   -> la cara baja hasta tocar el canto, en 75 ms; es la confirmacion fisica del toque
 *
 * Con mouse, ademas, el boton se corre un poco hacia el cursor (magnetic button, ui-ideas).
 * quickTo y no un tween por evento, y nunca estado de React por pointermove: cero re-renders.
 * Solo con puntero fino, hover real y sin movimiento reducido; en un telefono no existe.
 *
 * Los colores salen de la paleta del suero al frente (--p-cta-*), asi que el boton cambia con
 * el hero. El hover de Tailwind 4 ya viene envuelto en @media (hover: hover): tocar la pantalla
 * no deja el texto rodado.
 */
export function BotonReserva({ href, children, tamano = "md", className = "", onClick }: BotonReservaProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" })
        const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" })
        const mover = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * 0.16)
          yTo((e.clientY - (r.top + r.height / 2)) * 0.26)
        }
        const soltar = () => {
          xTo(0)
          yTo(0)
        }
        el.addEventListener("pointermove", mover)
        el.addEventListener("pointerleave", soltar)
        return () => {
          el.removeEventListener("pointermove", mover)
          el.removeEventListener("pointerleave", soltar)
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      className={`group relative inline-flex font-semibold focus-visible:outline-3 focus-visible:outline-offset-6 focus-visible:outline-[var(--p-texto)] ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-0 bg-[var(--p-cta-canto)]" />
      <span
        className={`relative flex w-full -translate-x-1 -translate-y-1 items-center justify-center bg-[var(--p-cta-fondo)] text-[var(--p-cta-texto)] transition-[translate] duration-(--dur-2) ease-brand group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-active:translate-x-0 group-active:translate-y-0 group-active:duration-75 ${TAMANOS[tamano]}`}
      >
        <span className="relative block overflow-hidden">
          <span className="block transition-[translate] duration-(--dur-3) ease-brand group-hover:-translate-y-full">
            {children}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-0 block translate-y-full transition-[translate] duration-(--dur-3) ease-brand group-hover:translate-y-0"
          >
            {children}
          </span>
        </span>
      </span>
    </a>
  )
}
