"use client"

import { useEffect, useRef } from "react"

import { BotonReserva } from "@/components/BotonReserva"
import { Highlight } from "@/components/Highlight"
import { foto, SERVICIOS, type Foto, type Servicio } from "@/content/servicios"
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"

/**
 * SERVICIOS de la Home (D-034): tarjetas grandes que se apilan con el scroll y se abren.
 *
 * Referencia de Mateo: Skiper UI "StickyCard_001" (Framer Motion). Rehecha con GSAP, porque
 * Framer Motion esta prohibido en el proyecto (docs/02 section 6) y GSAP es el motor de todo el
 * sitio. Lo que se tomo: cada tarjeta es sticky, la siguiente sube y la tapa, y la de atras se
 * achica desde arriba. Lo que se agrego para este sitio:
 *
 *   cerrada  foto a toda la tarjeta, que se acerca mientras la tarjeta sube (atada al scroll), y
 *            una banda de color solido con numero, nombre, una linea y "Abrir +".
 *   abierta  la tarjeta crece EN SU LUGAR (Flip, 1,1 s). La foto pasa a un lado y se vuelve un
 *            carrusel que va cambiando lento, con un leve acercamiento; la banda se vuelve un
 *            panel con la descripcion, lo que incluye y "Reservar este servicio". Se cierra con
 *            la X, con Escape, o sola cuando la tarjeta siguiente empieza a taparla.
 *
 * Todo lo que se mueve con el scroll esta atado al scroll (scrub): va al ritmo de la persona.
 * Movimiento reducido: sin achicado, sin acercamiento, sin carrusel, y abre sin animacion.
 *
 * El estado abierta/cerrada NO es estado de React: vive en data-abierta y aria-expanded, que
 * escribe el codigo de GSAP. React no vuelve a renderizar esta seccion, asi que nunca pisa lo
 * que la animacion maneja (G-055).
 */

/**
 * Colores de cada tarjeta segun su banda (D-035: la seccion va sobre blanco, las bandas son fluo
 * o verde). El boton de reserva, el "+" y la X van siempre en el color opuesto a la banda.
 * Van como variables en el <article> para que la X, que no vive en la banda, tambien las lea.
 */
const BANDA: Record<Servicio["banda"], string> = {
  fluo: "[--banda-fondo:#D0FF4E] [--banda-texto:#0A3D33] [--control-fondo:#0A3D33] [--control-texto:#D0FF4E] [--p-cta-fondo:#0A3D33] [--p-cta-texto:#D0FF4E] [--p-cta-canto:#03201A] [--p-texto:#0A3D33]",
  verde: "[--banda-fondo:#0A3D33] [--banda-texto:#FFFFFF] [--control-fondo:#D0FF4E] [--control-texto:#0A3D33] [--p-cta-fondo:#D0FF4E] [--p-cta-texto:#0A3D33] [--p-cta-canto:#91B237] [--p-texto:#FFFFFF]",
}

const REDUCIDO = "(prefers-reduced-motion: reduce)"
const dos = (k: number) => String(k).padStart(2, "0")

/** Portada de la tarjeta cerrada: apaisada en escritorio, vertical en telefono. */
function Portada({ f }: { f: Foto }) {
  return (
    <picture>
      <source media="(min-width: 64rem)" type="image/avif" srcSet={foto(f.set, f.apaisada)} />
      <source media="(min-width: 64rem)" type="image/webp" srcSet={foto(f.set, f.apaisada, "webp")} />
      <source type="image/avif" srcSet={foto(f.set, "mobile")} />
      <img
        src={foto(f.set, "mobile", "webp")}
        alt={f.alt}
        loading="lazy"
        decoding="async"
        className="card-portada absolute inset-0 size-full object-cover"
      />
    </picture>
  )
}

/**
 * Una foto del carrusel de la tarjeta abierta. Al reves que la portada: en escritorio la foto
 * ocupa media tarjeta, un area casi cuadrada, y va el recorte vertical; en telefono ocupa la
 * franja de arriba, apaisada, y va el 4:3.
 */
function Diapositiva({ f }: { f: Foto }) {
  return (
    <div className="diapositiva absolute inset-0 opacity-0">
      <picture>
        <source media="(min-width: 64rem)" type="image/avif" srcSet={foto(f.set, "mobile")} />
        <source media="(min-width: 64rem)" type="image/webp" srcSet={foto(f.set, "mobile", "webp")} />
        <source type="image/avif" srcSet={foto(f.set, "tablet")} />
        <img
          src={foto(f.set, "tablet", "webp")}
          alt=""
          loading="lazy"
          decoding="async"
          className="diapositiva-img absolute inset-0 size-full object-cover"
        />
      </picture>
    </div>
  )
}

interface TarjetaProps {
  s: Servicio
  total: number
  onAbrir: (card: HTMLElement | null) => void
  onCerrar: (card: HTMLElement | null) => void
}

function Tarjeta({ s, total, onAbrir, onCerrar }: TarjetaProps) {
  const detalle = `servicio-${s.id}-detalle`
  return (
    <article
      data-abierta="false"
      aria-labelledby={`servicio-${s.id}-nombre`}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("a, button")) onAbrir(e.currentTarget)
      }}
      // Tamanos: cerrada, casi toda la pantalla; abierta, un poco mas. Los altos dejan lugar al
      // desfase de la pila (hasta 42 px) debajo del header en una pantalla de 812 de alto.
      className={`servicio-card group relative h-[70svh] w-[92vw] overflow-hidden bg-verde data-[abierta=false]:cursor-pointer data-[abierta=true]:h-[82svh] data-[abierta=true]:w-screen lg:h-[74svh] lg:w-[88vw] lg:max-w-[90rem] lg:data-[abierta=true]:h-[80svh] lg:data-[abierta=true]:w-[94vw] lg:data-[abierta=true]:max-w-[100rem] ${BANDA[s.banda]}`}
    >
      {/* La foto. Cerrada: toda la tarjeta. Abierta: arriba en telefono, a la izquierda en escritorio. */}
      <div className="card-media absolute inset-0 overflow-hidden group-data-[abierta=true]:bottom-[64%] lg:group-data-[abierta=true]:right-1/2 lg:group-data-[abierta=true]:bottom-0">
        <Portada f={s.fotos[0]!} />
        <div className="card-carrusel absolute inset-0 opacity-0">
          {s.fotos.map((f, k) => (
            <Diapositiva key={`${f.set}-${k}`} f={f} />
          ))}
        </div>
        {/* Oscurece la tarjeta de atras mientras la siguiente la tapa (atado al scroll). */}
        <div aria-hidden="true" className="card-sombra pointer-events-none absolute inset-0 bg-verde opacity-0" />
        <p
          aria-hidden="true"
          className="carrusel-contador absolute bottom-(--space-4) left-(--space-4) hidden bg-verde/85 px-(--space-3) py-1 text-step--1 tabular-nums text-blanco group-data-[abierta=true]:block"
        >
          {dos(1)} / {dos(s.fotos.length)}
        </p>
      </div>

      {/* La banda. Cerrada: franja de abajo. Abierta: panel abajo en telefono, a la derecha en escritorio. */}
      <div
        className={`card-banda absolute inset-x-0 bottom-0 flex flex-col group-data-[abierta=true]:top-[36%] lg:group-data-[abierta=true]:top-0 lg:group-data-[abierta=true]:left-1/2 bg-(--banda-fondo) text-(--banda-texto)`}
      >
        <div className="flex items-end justify-between gap-(--space-4) p-(--space-5) lg:p-(--space-7)">
          <div className="min-w-0">
            <p className="text-step--1 tracking-[0.14em] tabular-nums opacity-70">
              {s.n} / {dos(total)}
            </p>
            <h3
              id={`servicio-${s.id}-nombre`}
              className="type-display mt-1 text-step-2 text-balance lg:text-step-4 lg:group-data-[abierta=true]:text-step-3"
            >
              {s.nombre}
            </h3>
            <p className="mt-(--space-2) max-w-[48ch] text-step-0 opacity-80 group-data-[abierta=true]:hidden">{s.linea}</p>
          </div>
          <button
            type="button"
            onClick={(e) => onAbrir(e.currentTarget.closest("article"))}
            aria-expanded="false"
            aria-controls={detalle}
            className="servicio-abrir flex min-h-11 shrink-0 items-center gap-(--space-3) text-step--1 font-semibold tracking-[0.08em] uppercase group-data-[abierta=true]:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <span className="hidden sm:inline">Abrir</span>
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center bg-(--control-fondo) text-step-1 text-(--control-texto) transition-transform duration-[600ms] ease-brand group-hover:rotate-90"
            >
              +
            </span>
            <span className="sr-only">{s.nombre}</span>
          </button>
        </div>

        {/* El detalle: solo con la tarjeta abierta. El texto tiene scroll propio si no entra
            (data-lenis-prevent), sin barra: en Windows la barra gris aparecia en cuanto se abria
            la tarjeta, mientras el panel crecia. Lo que avisa que hay mas es el borde de abajo
            esfumado; cuando todo entra, lo esfumado cae sobre el padding y no se ve. El boton
            de reserva queda afuera de ese scroll, siempre a la vista. */}
        <div id={detalle} className="hidden min-h-0 flex-1 flex-col group-data-[abierta=true]:flex">
          <div
            data-lenis-prevent=""
            className="banda-detalle flex min-h-0 flex-1 flex-col gap-(--space-5) overflow-y-auto overscroll-contain [scrollbar-width:none] px-(--space-5) pb-(--space-5) [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_var(--space-5)),transparent)] lg:px-(--space-7) [&::-webkit-scrollbar]:hidden"
          >
            <p className="detalle-item max-w-[52ch] text-step-0 text-pretty lg:text-step-1">{s.descripcion}</p>
            <ul className="flex flex-col gap-(--space-2)">
              {s.incluye.map((t) => (
                <li key={t} className="detalle-item flex items-start gap-(--space-3) text-step-0">
                  {/* Arriba y no centrado: con un punto en dos lineas, el cuadrado va con la primera. */}
                  <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 bg-current" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="detalle-item shrink-0 px-(--space-5) pt-(--space-2) pb-(--space-5) lg:px-(--space-7) lg:pb-(--space-7)">
            <BotonReserva href="/turnos/" tamano="md">
              Reservar este servicio
            </BotonReserva>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => onCerrar(e.currentTarget.closest("article"))}
        aria-label={`Cerrar ${s.nombre}`}
        className="servicio-cerrar absolute top-(--space-4) right-(--space-4) z-20 hidden size-11 items-center justify-center bg-(--control-fondo) text-(--control-texto) group-data-[abierta=true]:flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--control-fondo)"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 fill-none stroke-current stroke-[1.5]">
          <path d="M3 3l10 10M13 3 3 13" strokeLinecap="round" />
        </svg>
      </button>
    </article>
  )
}

export function Servicios() {
  const raiz = useRef<HTMLElement>(null)
  const acciones = useRef<{
    abrir: (c: HTMLElement | null) => void
    cerrar: (c: HTMLElement | null, rapido?: boolean, devolverFoco?: boolean) => void
  }>({
    abrir: () => {},
    cerrar: () => {},
  })

  useGSAP(
    (_ctx, contextSafe) => {
      const sec = raiz.current
      if (!sec || !contextSafe) return
      const carruseles = new Map<HTMLElement, gsap.core.Timeline>()
      const quieto = () => window.matchMedia(REDUCIDO).matches

      const iniciarCarrusel = contextSafe((card: HTMLElement) => {
        const capa = card.querySelector<HTMLElement>(".card-carrusel")
        const diapos = Array.from(card.querySelectorAll<HTMLElement>(".diapositiva"))
        const imgs = Array.from(card.querySelectorAll<HTMLElement>(".diapositiva-img"))
        const contador = card.querySelector<HTMLElement>(".carrusel-contador")
        if (!capa || !diapos.length) return
        gsap.set(diapos, { autoAlpha: (j: number) => (j === 0 ? 1 : 0) })
        gsap.to(capa, { autoAlpha: 1, duration: quieto() ? 0 : 0.8, ease: "power2.out" })
        if (quieto() || diapos.length < 2) return
        // Cada foto: aparece en 1,2 s y se acerca durante 4,6 s; recien ahi entra la siguiente.
        const tl = gsap.timeline({ repeat: -1 })
        diapos.forEach((_, k) => {
          tl.call(() => {
            if (contador) contador.textContent = `${dos(k + 1)} / ${dos(diapos.length)}`
          })
            .to(diapos, { autoAlpha: (j: number) => (j === k ? 1 : 0), duration: 1.2, ease: "power2.inOut" })
            .fromTo(imgs[k]!, { scale: 1.12 }, { scale: 1, duration: 4.6, ease: "power1.out" }, "<")
        })
        carruseles.set(card, tl)
      })

      const detenerCarrusel = contextSafe((card: HTMLElement) => {
        carruseles.get(card)?.kill()
        carruseles.delete(card)
        const capa = card.querySelector<HTMLElement>(".card-carrusel")
        if (capa) gsap.to(capa, { autoAlpha: 0, duration: quieto() ? 0 : 0.4 })
      })

      const partes = (card: HTMLElement) =>
        [card, card.querySelector(".card-media"), card.querySelector(".card-banda")].filter(Boolean) as HTMLElement[]

      // devolverFoco: al cerrar con la X o con Escape el foco vuelve a "Abrir". Recien se puede
      // cuando data-abierta ya cambio: antes, el boton sigue oculto y focus() no hace nada.
      const cerrar = contextSafe((card: HTMLElement | null, rapido = false, devolverFoco = false) => {
        if (!card || card.dataset.abierta !== "true") return
        detenerCarrusel(card)
        const items = card.querySelectorAll(".detalle-item")
        const sin = rapido || quieto()
        gsap.to(items, {
          autoAlpha: 0,
          duration: sin ? 0 : 0.25,
          onComplete: () => {
            const estado = Flip.getState(partes(card))
            const abrirBtn = card.querySelector<HTMLElement>(".servicio-abrir")
            card.dataset.abierta = "false"
            abrirBtn?.setAttribute("aria-expanded", "false")
            if (devolverFoco) abrirBtn?.focus({ preventScroll: true })
            Flip.from(estado, { duration: sin ? 0 : 0.85, ease: "expo.inOut", nested: true })
          },
        })
      })

      const abrir = contextSafe((card: HTMLElement | null) => {
        if (!card || card.dataset.abierta === "true") return
        sec.querySelectorAll<HTMLElement>('.servicio-card[data-abierta="true"]').forEach((c) => cerrar(c, true))
        const items = card.querySelectorAll(".detalle-item")
        const estado = Flip.getState(partes(card))
        card.dataset.abierta = "true"
        card.querySelector(".servicio-abrir")?.setAttribute("aria-expanded", "true")
        gsap.set(items, { autoAlpha: 0, y: 24 })
        const sin = quieto()
        Flip.from(estado, {
          duration: sin ? 0 : 1.1,
          ease: "expo.inOut",
          nested: true,
          onComplete: () => {
            gsap.to(items, { autoAlpha: 1, y: 0, duration: sin ? 0 : 0.9, stagger: 0.08, ease: "expo.out" })
            iniciarCarrusel(card)
            card.querySelector<HTMLElement>(".servicio-cerrar")?.focus({ preventScroll: true })
          },
        })
      })

      acciones.current = { abrir, cerrar }

      const envolturas = Array.from(sec.querySelectorAll<HTMLElement>(".servicio-envoltura"))
      const pila = sec.querySelector<HTMLElement>(".servicios-pila")

      // Se cierra sola cuando la siguiente empieza a taparla, o si se vuelve hacia arriba.
      envolturas.forEach((w, i) => {
        const card = w.querySelector<HTMLElement>(".servicio-card")
        const siguiente = envolturas[i + 1]
        if (siguiente) ScrollTrigger.create({ trigger: siguiente, start: "top 65%", onEnter: () => cerrar(card) })
        ScrollTrigger.create({ trigger: w, start: "top bottom", onLeaveBack: () => cerrar(card, true) })
      })

      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Titulo: palabra por palabra desde su mascara; la bajada despues.
        const disparo = { trigger: ".servicios-cabecera", start: "top 80%", once: true }
        gsap.from(".servicios-palabra", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.1, scrollTrigger: disparo })
        gsap.from(".servicios-bajada", { y: 18, autoAlpha: 0, duration: 1.1, ease: "expo.out", delay: 0.4, scrollTrigger: disparo })

        envolturas.forEach((w, i) => {
          const escala = w.querySelector<HTMLElement>(".servicio-escala")
          const portada = w.querySelector<HTMLElement>(".card-portada")
          const sombra = w.querySelector<HTMLElement>(".card-sombra")
          const siguiente = envolturas[i + 1]

          // La foto se acerca mientras la tarjeta sube hasta su lugar.
          if (portada) {
            gsap.fromTo(portada, { scale: 1.18 }, { scale: 1, ease: "none", scrollTrigger: { trigger: w, start: "top bottom", end: "top top", scrub: true } })
          }
          // La de atras se achica desde arriba y se oscurece mientras la siguiente la tapa. Cuanto
          // mas al fondo de la pila, mas chica: la primera termina en 0,85 y la tercera en 0,95.
          if (siguiente && escala) {
            gsap.to(escala, {
              scale: 1 - (envolturas.length - 1 - i) * 0.05,
              ease: "none",
              scrollTrigger: { trigger: siguiente, start: "top bottom", endTrigger: pila, end: "bottom bottom", scrub: true },
            })
          }
          if (siguiente && sombra) {
            gsap.to(sombra, { opacity: 0.45, ease: "none", scrollTrigger: { trigger: siguiente, start: "top bottom", end: "top top", scrub: true } })
          }
        })
      })

      return () => {
        carruseles.forEach((tl) => tl.kill())
        mm.revert()
      }
    },
    { scope: raiz },
  )

  // Escape cierra la tarjeta abierta.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      const abierta = raiz.current?.querySelector<HTMLElement>('.servicio-card[data-abierta="true"]') ?? null
      if (abierta) acciones.current.cerrar(abierta, false, true)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    // Fondo blanco (D-035): las secciones de la Home alternan blanco y verde desde aca. data-tema
    // le dice al header que color tomar mientras esta seccion pasa por debajo.
    <section ref={raiz} id="servicios" data-tema="blanco" aria-labelledby="servicios-titulo" className="relative bg-blanco">
      <div className="servicios-cabecera page-grid pt-(--space-8) pb-(--space-6) lg:pb-(--space-7)">
        <div className="page-content">
          {/* Dice lo que es la seccion: servicios. "servicios" en el resaltador de la marca, como
              "estar bien." en el hero: sobre blanco, el fluo como tinta no se lee. Cada palabra
              sube desde su mascara; el padding de 0.22em le da lugar a la caja del resaltador,
              que sobresale del texto, y el margen negativo devuelve el ritmo (como [data-split]). */}
          <h2 id="servicios-titulo" className="type-display text-[clamp(2.75rem,11vw,6rem)] leading-[0.9] text-verde">
            {["Nuestros", "servicios"].map((palabra, k) => (
              <span key={palabra} className="-my-[0.22em] mr-[0.25em] inline-block overflow-hidden py-[0.22em] align-bottom">
                <span className="servicios-palabra inline-block">{k === 1 ? <Highlight>{palabra}</Highlight> : palabra}</span>
              </span>
            ))}
          </h2>
          <p className="servicios-bajada mt-(--space-4) max-w-[40ch] text-step-1 text-verde/75">
            Para conocer, prevenir y optimizar tu salud.
          </p>
        </div>
      </div>

      {/* La pila. Cada envoltura mide una pantalla y es sticky: la siguiente sube y tapa a la
          anterior. El desfase de 14 px por tarjeta deja ver el borde de las de atras. */}
      <div className="servicios-pila relative pb-[30svh]">
        {SERVICIOS.map((s, i) => (
          <div
            key={s.id}
            className="servicio-envoltura sticky flex h-[100svh] justify-center"
            style={{ top: `calc(var(--head-h) + var(--space-4) + ${i * 14}px)` }}
          >
            <div className="servicio-escala origin-top">
              <Tarjeta s={s} total={SERVICIOS.length} onAbrir={(c) => acciones.current.abrir(c)} onCerrar={(c) => acciones.current.cerrar(c, false, true)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
