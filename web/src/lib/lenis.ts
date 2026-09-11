"use client"

import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { gsap, ScrollTrigger } from "./gsap"

/**
 * Scroll suave. Se monta una sola vez en el layout raiz y no envuelve nada: devuelve null
 * y vive como hermano de {children}. Un provider que envuelve el arbol obligaria a este
 * archivo a ser .tsx sin ganar nada — Lenis opera sobre el scroll real del documento.
 *
 * Reglas que esto respeta (motion-web-senior/lenis, docs/05-DISENO.md section 5):
 *
 *  - Un solo bucle de animacion. autoRaf en false y lenis.raf() lo llama el ticker de GSAP.
 *    Dejar el bucle propio de Lenis andando mientras GSAP tambien lo empuja es la causa
 *    numero uno de micro-jitter con ScrollTrigger.
 *  - ScrollTrigger.update se suscribe al evento scroll de Lenis, para que los dos lean la
 *    misma posicion en el mismo frame.
 *  - lagSmoothing(0): sin esto GSAP "recupera" el tiempo perdido cuando la pestana estuvo
 *    en segundo plano y pelea con el suavizado de Lenis.
 *  - prefers-reduced-motion: no se monta Lenis. No se monta y se apaga: se deja el scroll
 *    nativo entero. El inertia entre input y respuesta visual es exactamente lo que esa
 *    preferencia pide evitar, aunque Lenis no secuestre la posicion de scroll.
 *  - lerp 0.1: el rango util con contenido para leer es 0.08-0.12. Mas abajo es el scroll
 *    pesadamente suavizado que se lee como plantilla.
 *  - syncTouch en false: el telefono ya tiene inercia del sistema operativo; re-simularla
 *    pelea contra el gesto nativo y se siente peor, no mejor.
 */
export function SmoothScroll() {
  const pathname = usePathname()
  const [enabled, setEnabled] = useState(false)

  // El servidor no tiene matchMedia, asi que arranca apagado en las dos pasadas y se
  // enciende despues del montaje. Sin esto hay desajuste de hidratacion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setEnabled(!mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, syncTouch: false })
    const update = (time: number) => lenis.raf(time * 1000) // el ticker da segundos, Lenis quiere ms

    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.off("scroll", ScrollTrigger.update)
      lenis.destroy()
      gsap.ticker.lagSmoothing(500, 33) // valor por defecto de GSAP
    }
  }, [enabled])

  // Al cambiar de ruta: recalcular posiciones contra el DOM nuevo y matar los triggers que
  // eran de la pagina que se fue. Las navegaciones del App Router no recargan, asi que lo
  // que no se mata a mano se acumula por el resto de la sesion.
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(raf)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [pathname])

  return null
}
