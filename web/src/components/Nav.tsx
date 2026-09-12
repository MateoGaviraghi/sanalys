"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import logoHorizontal from "@sanalys/brand/assets/logo-horizontal-fluo.svg"

import { BotonReserva } from "@/components/BotonReserva"
import { PALETAS, type Paleta } from "@/content/drips"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"

const LINKS = [
  { href: "/tratamientos/", label: "Tratamientos" },
  { href: "/turnos/", label: "Turnos" },
  { href: "/nosotros/", label: "Nosotros" },
  { href: "/novedades/", label: "Novedades" },
  { href: "/contacto/", label: "Contacto" },
]

type ColoresHeader = Pick<Paleta, "fondo" | "texto" | "acento" | "ctaFondo" | "ctaTexto" | "ctaCanto">

/**
 * Colores del header sobre cada seccion (D-035). Las secciones de la Home alternan blanco y
 * verde; "hero" no esta aca porque ahi el header lee la paleta del suero al frente (--p-*).
 * Verde es la paleta de la etiqueta verde; blanco invierte: tinta y logo verdes, boton verde.
 */
const TEMAS: Record<"verde" | "blanco", ColoresHeader> = {
  verde: PALETAS.verde,
  blanco: { fondo: "#FFFFFF", texto: "#0A3D33", acento: "#0A3D33", ctaFondo: "#0A3D33", ctaTexto: "#D0FF4E", ctaCanto: "#03201A" },
}
type Tema = keyof typeof TEMAS | "hero"

const VARS_H = ["--h-fondo", "--h-texto", "--h-acento", "--h-cta-fondo", "--h-cta-texto", "--h-cta-canto"] as const
const aVars = (c: ColoresHeader) => ({
  "--h-fondo": c.fondo,
  "--h-texto": c.texto,
  "--h-acento": c.acento,
  "--h-cta-fondo": c.ctaFondo,
  "--h-cta-texto": c.ctaTexto,
  "--h-cta-canto": c.ctaCanto,
})

/** En el <header>: por defecto, --h-* es la paleta del suero. */
const DEL_SUERO =
  "[--h-fondo:var(--p-fondo)] [--h-texto:var(--p-texto)] [--h-acento:var(--p-acento)] [--h-cta-fondo:var(--p-cta-fondo)] [--h-cta-texto:var(--p-cta-texto)] [--h-cta-canto:var(--p-cta-canto)]"
/** Adentro: --p-* vuelve a ser --h-*, asi logo, links, boton y menu siguen leyendo --p-*. */
const AL_CONTENIDO =
  "[--p-fondo:var(--h-fondo)] [--p-texto:var(--h-texto)] [--p-acento:var(--h-acento)] [--p-cta-fondo:var(--h-cta-fondo)] [--p-cta-texto:var(--h-cta-texto)] [--p-cta-canto:var(--h-cta-canto)]"

/**
 * Header del sitio publico (docs/05-DISENO.md section 10 "Header", D-021, D-025, D-026).
 *
 * Logo a la IZQUIERDA, links CENTRADOS, "Reservar turno" a la DERECHA. Grid de tres columnas y
 * no flex con justify-between: con flex el bloque del medio se centra entre sus vecinos y los
 * links se corren cada vez que el logo o el boton cambian de ancho.
 *
 * COLOR (D-035). El header toma el color de la seccion que tiene debajo, asi se lee como si
 * fuera transparente sin serlo: sigue solido, porque por debajo pasan fotos y tarjetas y el
 * logo tiene que leerse siempre. Cada seccion lo declara con data-tema. Sobre el hero lee la
 * paleta del suero al frente (--p-*), y el cambio de suero entra como la misma inundacion que
 * el hero: la capa [data-inundacion] de aca la anima el hero, con el mismo origen y la misma
 * curva. Sobre las demas secciones toma TEMAS, en 0,6 s, al cruzar el borde de la seccion.
 * Todo pasa por las variables --h-* del <header>; adentro se reescriben como --p-*.
 *
 * Compacta de 72 a 64 px pasados 80 px de scroll animando solo el padding, sin reflow por frame.
 * Nunca menos de 8 px de aire arriba y abajo del boton de reserva (D-036): a 52 px la cara del
 * boton, que flota 4 px sobre su canto, tocaba el borde de la pantalla.
 *
 * El menu de telefono (D-026) se abre como un circulo que nace en la hamburguesa, los links
 * suben uno por uno desde su mascara y la hamburguesa se vuelve X. Cierra mas rapido de lo que
 * abre. Mientras esta abierto: sin scroll de fondo, foco atrapado entre la X y el panel,
 * Escape cierra. El contenido del header va por encima del panel (z-50 contra z-40), por eso
 * la X y el logo siguen a la vista con el menu abierto.
 */
export function Nav() {
  const [abierto, setAbierto] = useState(false)
  const raiz = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const boton = useRef<HTMLButtonElement>(null)
  const primerLink = useRef<HTMLAnchorElement>(null)
  const montado = useRef(false)
  const linea = useRef<gsap.core.Timeline | null>(null)

  const cerrar = () => setAbierto(false)

  // Compactar en scroll: un listener pasivo que solo escribe una clase.
  useGSAP(
    () => {
      const el = raiz.current
      if (!el) return
      const onScroll = () => el.classList.toggle("is-compact", window.scrollY > 80)
      onScroll()
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    },
    { scope: raiz },
  )

  // Color segun la seccion que pasa por debajo del header (D-035). El borde se mide a 32 px, la
  // mitad del header compacto: el cambio llega cuando la seccion ya ocupa medio header.
  useGSAP(
    () => {
      const el = raiz.current
      if (!el) return
      let actual: Tema = "hero"
      const aplicar = (tema: Tema, inmediato = false) => {
        if (tema === actual) return
        actual = tema
        const duration = inmediato || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.6
        if (tema !== "hero") {
          gsap.to(el, { ...aVars(TEMAS[tema]), duration, ease: "power2.inOut", overwrite: true })
          return
        }
        // De vuelta al hero: se va hasta la paleta del suero de ahora y despues se sueltan las
        // variables, para que el proximo cambio de suero vuelva a mover el header.
        const html = getComputedStyle(document.documentElement)
        const destino = Object.fromEntries(VARS_H.map((v) => [v, html.getPropertyValue(v.replace("--h-", "--p-")).trim()]))
        gsap.to(el, {
          ...destino,
          duration,
          ease: "power2.inOut",
          overwrite: true,
          onComplete: () => VARS_H.forEach((v) => el.style.removeProperty(v)),
        })
      }
      // Un disparo por seccion solo para saber en que scroll su borde llega al header, y uno solo
      // de pagina que elige el color. No se usa el onToggle de cada seccion: arriba de todo, con
      // el header en el flujo, ninguna seccion esta debajo todavia, y al saltar de servicios a
      // scroll 0 el hero nunca quedaba activo y el header se quedaba blanco (G-059).
      const secciones = Array.from(document.querySelectorAll<HTMLElement>("[data-tema]"))
      const temaDe = (sec: HTMLElement | undefined) => (sec?.dataset.tema ?? "hero") as Tema
      const bordes = secciones.map((sec) => ScrollTrigger.create({ trigger: sec, start: "top 32px" }))
      const temaEn = (y: number) => {
        let tema = temaDe(secciones[0])
        bordes.forEach((b, k) => {
          if (y >= b.start) tema = temaDe(secciones[k])
        })
        return tema
      }
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (st) => aplicar(temaEn(st.scroll())),
        // Tambien al cargar ya scrolleado y al cambiar el tamano: sin animacion.
        onRefresh: (st) => aplicar(temaEn(st.scroll()), true),
      })
    },
    { scope: raiz },
  )

  // El menu de telefono.
  useGSAP(
    () => {
      const el = panel.current
      const btn = boton.current
      if (!el || !btn) return
      // El primer paso es con el menu cerrado, que ya es su estado en el HTML.
      if (!montado.current) {
        montado.current = true
        return
      }

      const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const b = btn.getBoundingClientRect()
      const x = b.left + b.width / 2
      const y = b.top + b.height / 2
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      const lineas = el.querySelectorAll(".menu-linea")
      const pie = el.querySelector(".menu-pie")
      linea.current?.kill()

      if (abierto) {
        document.documentElement.style.overflow = "hidden"
        gsap.set(el, { visibility: "visible" })
        const tl = gsap.timeline()
        if (quieto) {
          tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15 })
        } else {
          // Mas lento que la primera version (D-027): 1,1 s el circulo, 1,1 s cada link.
          tl.fromTo(
            el,
            { clipPath: `circle(0px at ${x}px ${y}px)` },
            { clipPath: `circle(${r}px at ${x}px ${y}px)`, duration: 1.1, ease: "expo.inOut" },
          )
            .fromTo(lineas, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 }, 0.4)
            .fromTo(pie, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.0, ease: "expo.out" }, 0.7)
        }
        linea.current = tl
      } else {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(el, { visibility: "hidden", clearProps: "clipPath,opacity" })
            document.documentElement.style.overflow = ""
          },
        })
        if (quieto) {
          tl.to(el, { opacity: 0, duration: 0.15 })
        } else {
          tl.to(lineas, { yPercent: -110, duration: 0.45, ease: "power2.in", stagger: 0.04 })
            .to(pie, { autoAlpha: 0, y: 12, duration: 0.4, ease: "power2.in" }, 0)
            .to(el, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: 0.75, ease: "expo.in" }, 0.2)
        }
        linea.current = tl
      }
    },
    { dependencies: [abierto] },
  )

  // Foco: entra al panel al abrir y vuelve a la X al cerrar.
  useEffect(() => {
    if (abierto) primerLink.current?.focus()
    else if (document.activeElement && document.activeElement !== document.body) boton.current?.focus()
  }, [abierto])

  // Escape cierra; Tab queda atrapado entre la X y los elementos del panel.
  useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false)
      if (e.key !== "Tab") return
      const internos = panel.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []
      const focusables = [boton.current, ...internos].filter(Boolean) as HTMLElement[]
      if (!focusables.length) return
      const primero = focusables[0]!
      const ultimo = focusables[focusables.length - 1]!
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [abierto])

  // Si la ventana pasa a desktop con el menu abierto, se cierra: si no, la pagina queda sin scroll.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)")
    const onCambio = () => mq.matches && setAbierto(false)
    mq.addEventListener("change", onCambio)
    return () => mq.removeEventListener("change", onCambio)
  }, [])

  return (
    <header
      ref={raiz}
      /* 72 px que compactan a 64: una fila de 48 px (el boton con su canto) + el padding, que es
         lo unico que se anima, para no animar el height del elemento. El logo nunca baja de
         30 px de alto (D-015). Fondo solido siempre (--h-fondo), nunca transparente. */
      className={`page-grid sticky top-0 z-50 bg-(--h-fondo) py-(--head-pad) [--head-pad:12px] [--logo-h:30px] lg:[--logo-h:34px] transition-[padding] duration-(--dur-2) ease-brand [&.is-compact]:[--head-pad:8px] [&.is-compact]:[--logo-h:30px] ${DEL_SUERO}`}
    >
      {/* Inundacion del header: el mismo disco que el hero, recortado por el header. */}
      <div
        data-inundacion="header"
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0 overflow-hidden"
      >
        <div className="absolute rounded-full bg-(--inundacion-fondo)" />
      </div>

      <div className={`page-content relative z-50 grid min-h-12 grid-cols-[auto_1fr_auto] items-center gap-(--space-5) ${AL_CONTENIDO}`}>
        {/* Link y no <a>: el logo apunta a una pagina del sitio y Next quiere su navegacion. */}
        <Link href="/" data-intro="cabecera" className="shrink-0" aria-label="Sanalys, inicio">
          {/* El logo va como MASCARA: el color lo pone --p-acento y cambia con la paleta. Solo
              importa el alfa del SVG, por eso sirve el archivo fluo tal cual. */}
          <span
            aria-hidden="true"
            className="block h-(--logo-h) bg-[var(--p-acento)] transition-[height] duration-(--dur-2) ease-brand"
            style={{
              aspectRatio: `${logoHorizontal.width} / ${logoHorizontal.height}`,
              maskImage: `url(${logoHorizontal.src})`,
              WebkitMaskImage: `url(${logoHorizontal.src})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
        </Link>

        <nav aria-label="Principal" data-intro="cabecera" className="hidden justify-self-center lg:block">
          <ul className="flex items-center gap-(--space-6)">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="link-linea text-step--1 tracking-[0.04em] text-[var(--p-texto)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--p-acento)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* La columna derecha existe en los dos anchos: en desktop el boton, en telefono el menu. */}
        <div data-intro="cabecera" className="flex justify-self-end">
          {/* pt-1: la cara del boton flota 4 px sobre el canto. Con eso la fila mide el bloque
              entero (48 px) y el aire queda parejo arriba y abajo. */}
          <div className="hidden pt-1 lg:block">
            <BotonReserva href="/turnos/" tamano="sm">
              Reservar turno
            </BotonReserva>
          </div>

          <button
            ref={boton}
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="group relative -mr-2 flex size-11 items-center justify-center lg:hidden"
          >
            {/* Dos trazos que se cruzan en X. Se anima translate y rotate, nunca el alto. */}
            <span
              aria-hidden="true"
              className="absolute h-0.5 w-6 -translate-y-1 bg-[var(--p-acento)] transition-[translate,rotate] duration-[600ms] ease-brand group-aria-expanded:translate-y-0 group-aria-expanded:rotate-45"
            />
            <span
              aria-hidden="true"
              className="absolute h-0.5 w-6 translate-y-1 bg-[var(--p-acento)] transition-[translate,rotate] duration-[600ms] ease-brand group-aria-expanded:translate-y-0 group-aria-expanded:-rotate-45"
            />
          </button>
        </div>
      </div>

      <div
        ref={panel}
        id="menu-movil"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        data-lenis-prevent=""
        className={`invisible fixed inset-0 z-40 flex flex-col bg-[var(--p-fondo)] px-(--page-gutter) pt-[calc(var(--head-h)+var(--space-7))] pb-[calc(var(--space-7)+env(safe-area-inset-bottom))] lg:hidden ${AL_CONTENIDO}`}
      >
        <nav aria-label="Principal, móvil" className="flex flex-1 flex-col justify-center">
          <ul>
            {LINKS.map((l, k) => (
              <li key={l.href} className="overflow-hidden">
                <a
                  href={l.href}
                  ref={k === 0 ? primerLink : undefined}
                  onClick={cerrar}
                  className="type-display flex min-h-14 items-center text-[clamp(2.25rem,11vw,3.5rem)] leading-[1.05] text-[var(--p-texto)] transition-colors duration-(--dur-1) active:text-[var(--p-acento)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--p-acento)]"
                >
                  <span className="menu-linea block">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-pie">
          <BotonReserva href="/turnos/" tamano="lg" className="w-full" onClick={cerrar}>
            Reservar turno
          </BotonReserva>
        </div>
      </div>
    </header>
  )
}
