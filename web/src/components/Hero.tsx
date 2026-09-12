"use client"

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"

import { BotonReserva } from "@/components/BotonReserva"
import { Highlight } from "@/components/Highlight"
import { CURVA_PASO, DripWheel, DURACION_PASO, RADIO_EN_ALTURAS } from "@/components/DripWheel"
import { SplitReveal } from "@/components/SplitReveal"
import { DRIPS, PALETAS, type Paleta } from "@/content/drips"
import { gsap, useGSAP } from "@/lib/gsap"

/**
 * HERO de la Home.
 *
 * ENTRADA (D-027). Una sola coreografia sobre los elementos reales, sin pantalla de bienvenida:
 * la bienvenida anterior mostraba el titular en otro lugar, se iba de golpe y dejaba ver una
 * pagina ya quieta, y eso se leia como un corte. Ahora, en 2,9 s y siempre con salida suave:
 *   0,15  header: logo, links y boton bajan uno tras otro
 *   0,30  "Ciencia + Bienestar"
 *   0,45  el titular sube linea por linea (SplitReveal)
 *   0,50  la bolsa entra por la rueda: llega girando desde la derecha, inclinada, y se endereza
 *   0,50  el halo crece detras de la bolsa, con ella, en 1,8 s (D-037: arrancaba en 0,00 y
 *         rapido, y se veia solo; D-041: 2,6 s era demasiado lento para Mateo)
 *   1,00  nombre y bajada del suero
 *   1,10  el nombre gigante sube por su columna
 *   1,25  los dos botones
 *   1,60  las flechas
 * Todo arranca oculto desde el primer cuadro (regla [data-hero] [data-intro] de globals.css),
 * asi que no hay parpadeo del HTML completo antes de que corra GSAP.
 *
 * PASO. La rueda NO gira sola (D-025). Cada paso gira la rueda y, a la vez, el color de la
 * etiqueta nueva inunda hero y header como un circulo que se abre desde donde llega la bolsa
 * (D-026). 1,6 s, power2.inOut (D-027).
 *
 * Reposo sin JavaScript: todo visible, suero 01 en el apice, paleta verde de globals.css.
 */

/**
 * Los tres puntos de la propuesta: los diferenciales que la clienta numera (filosofia, metodo,
 * espacio), en sus palabras y recortados para entrar en una linea a 375 (docs/14-MARCA
 * section 9). "Medicina preventiva y optimizadora, no reactiva" / "Protocolos personalizados
 * por biomarcadores" / "nada que se lea como clinica".
 */
const PUNTOS = ["Medicina preventiva, no reactiva", "Protocolos por biomarcadores", "Un espacio nada clínico"]

/** La curva de la inundacion en la sintaxis de WAAPI. Tiene que ser la misma que CURVA_PASO. */
const CURVA_CSS = "cubic-bezier(0.45, 0, 0.55, 1)"

const VARS_TEXTO = (p: Paleta) => ({
  "--p-texto": p.texto,
  "--p-acento": p.acento,
  "--p-cta-fondo": p.ctaFondo,
  "--p-cta-texto": p.ctaTexto,
  "--p-cta-canto": p.ctaCanto,
  "--p-hl-fondo": p.hlFondo,
  "--p-hl-texto": p.hlTexto,
})
const VARS_FONDO = (p: Paleta) => ({ "--p-fondo": p.fondo, "--p-halo": p.halo })
const TODAS = [
  "--p-fondo",
  "--p-halo",
  "--p-texto",
  "--p-acento",
  "--p-cta-fondo",
  "--p-cta-texto",
  "--p-cta-canto",
  "--p-hl-fondo",
  "--p-hl-texto",
]

/**
 * El halo, centrado en la bolsa. La posicion la escribe el hero en --bolsa-x / --bolsa-y leyendo
 * la caja real de la rueda, asi sigue a la bolsa aunque cambie la grilla. Los valores por
 * defecto son los del HTML del servidor. El tamano se topa por alto: a 1920 el 56vw daba un
 * circulo mas alto que la pantalla que se metia detras del titular.
 */
const HALO =
  "absolute left-[var(--bolsa-x,50%)] top-[var(--bolsa-y,calc(var(--space-6)+20svh))] size-[min(92vw,62svh,var(--halo-max,100vmax))] -translate-x-1/2 -translate-y-1/2 rounded-full lg:left-[var(--bolsa-x,66vw)] lg:top-[var(--bolsa-y,50%)] lg:size-[min(52vw,92svh,var(--halo-max,100vmax))]"

/**
 * Movimiento reducido, leido del sistema con useSyncExternalStore y no con un setState adentro
 * de un efecto: en el servidor devuelve false, en el cliente el valor real desde el primer
 * render, y si la persona lo cambia en el sistema el hero se entera sin recargar.
 */
const MQ_REDUCIDO = "(prefers-reduced-motion: reduce)"
const suscribirReducido = (avisar: () => void) => {
  const mq = window.matchMedia(MQ_REDUCIDO)
  mq.addEventListener("change", avisar)
  return () => mq.removeEventListener("change", avisar)
}
const leerReducido = () => window.matchMedia(MQ_REDUCIDO).matches
const leerReducidoServidor = () => false

/** Momento (0 a 1) en que la curva del paso llega a una fraccion dada del recorrido. */
const curva = gsap.parseEase(CURVA_PASO)
const tiempoPara = (fraccion: number) => {
  const f = Math.min(Math.max(fraccion, 0), 1)
  let lo = 0
  let hi = 1
  for (let k = 0; k < 20; k++) {
    const m = (lo + hi) / 2
    if (curva(m) < f) lo = m
    else hi = m
  }
  return (lo + hi) / 2
}

export function Hero() {
  const raiz = useRef<HTMLElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const ruedaCaja = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  /** El Drip cuyos textos se ven. Cambia a mitad del paso, cuando la inundacion pasa por ahi. */
  const [texto, setTexto] = useState(0)
  const reducido = useSyncExternalStore(suscribirReducido, leerReducido, leerReducidoServidor)
  const previo = useRef(0)
  const cambioTexto = useRef(false)
  const conIntro = useRef<boolean | null>(null)
  const inundaciones = useRef<Animation[]>([])
  const desvanecidas = useRef<Animation[]>([])
  const pendiente = useRef<Paleta | null>(null)
  const linea = useRef<gsap.core.Timeline | null>(null)
  const drip = DRIPS[i]!
  const visible = DRIPS[texto]!

  // Otra pagina no hereda la paleta del ultimo suero mirado.
  useEffect(
    () => () => {
      TODAS.forEach((v) => document.documentElement.style.removeProperty(v))
    },
    [],
  )

  // El halo sigue a la bolsa. offsetLeft/offsetTop y no getBoundingClientRect: ignoran los
  // transforms, y durante la entrada la caja de la rueda esta girada.
  useEffect(() => {
    const sec = raiz.current
    const col = media.current
    const caja = ruedaCaja.current
    if (!sec || !col || !caja) return
    const ubicar = () => {
      const y = col.offsetTop + caja.offsetTop + caja.offsetHeight / 2
      sec.style.setProperty("--bolsa-x", `${col.offsetLeft + caja.offsetLeft + caja.offsetWidth / 2}px`)
      sec.style.setProperty("--bolsa-y", `${y}px`)
      // El circulo nunca toca el header ni el borde de abajo (D-036): el diametro se topa por la
      // distancia de la bolsa al borde mas cercano del hero, con 24 px de aire. Antes el hero lo
      // recortaba con una linea recta justo debajo del header.
      sec.style.setProperty("--halo-max", `${Math.max(0, 2 * (Math.min(y, sec.clientHeight - y) - 24))}px`)
    }
    ubicar()
    const ro = new ResizeObserver(ubicar)
    ro.observe(sec)
    ro.observe(caja)
    return () => ro.disconnect()
  }, [])

  // ENTRADA. Se fijan los estados iniciales, se saca .intro en el mismo cuadro y corre la
  // coreografia. conIntro es un ref para que el doble montaje de StrictMode la vuelva a armar.
  useGSAP(
    () => {
      const html = document.documentElement
      // Primera visita de la sesion y movimiento permitido. Si ya hubo entrada (volver a la Home
      // navegando), no se repite: una entrada de casi 3 s en cada visita cansa.
      if (conIntro.current === null) {
        conIntro.current =
          !html.classList.contains("intro-listo") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      }
      if (!conIntro.current) {
        html.classList.add("intro-listo")
        return
      }
      const sec = raiz.current
      const caja = ruedaCaja.current
      if (!sec || !caja) return

      const q = (s: string) => Array.from(sec.querySelectorAll<HTMLElement>(s))
      const cabecera = Array.from(document.querySelectorAll<HTMLElement>('[data-intro="cabecera"]'))
      const halo = q(".hero-halo")
      const ceja = q(".hero-ceja")
      const sueroLineas = q(".hero-suero .linea")
      const giganteLineas = q(".hero-gigante .linea")
      const propuesta = q(".hero-propuesta .punto")
      const acciones = q(".hero-accion")
      const controles = q(".hero-controles")
      const h = caja.offsetHeight
      const R = h * RADIO_EN_ALTURAS

      gsap.set(cabecera, { autoAlpha: 0, y: -12 })
      // El circulo arranca como un punto detras de la bolsa, no como un disco grande a media
      // opacidad (D-042): subir la opacidad de un disco de 650 px se ve como una mancha, no como
      // luz que se abre. Chiquito y opaco, y lo que se anima es el tamano.
      gsap.set(halo, { autoAlpha: 0, scale: 0.2 })
      // La bolsa entra por la rueda: la caja gira alrededor del centro de la rueda, que queda
      // un radio por debajo del centro de la bolsa. Llega inclinada desde la derecha.
      gsap.set(caja, { autoAlpha: 0, rotate: 34, transformOrigin: `50% ${h / 2 + R}px` })
      gsap.set(ceja, { autoAlpha: 0, y: 14 })
      gsap.set(propuesta, { autoAlpha: 0, y: 16 })
      // Abajo de su mascara Y transparentes (G-061): type-display recorta la caja de la linea a
      // la altura de mayuscula, y las astas y los acentos, que salen de esa caja, quedaban
      // asomando por el borde de la mascara durante el primer segundo, como un destello fluo.
      gsap.set([...sueroLineas, ...giganteLineas], { yPercent: 105, autoAlpha: 0 })
      gsap.set(acciones, { autoAlpha: 0, y: 22 })
      gsap.set(controles, { autoAlpha: 0, y: 10 })
      html.classList.add("intro-listo")

      const todos = [
        ...cabecera,
        ...halo,
        caja,
        ...ceja,
        ...propuesta,
        ...sueroLineas,
        ...giganteLineas,
        ...acciones,
        ...controles,
      ]
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => gsap.set(todos, { clearProps: "all" }),
      })
      // El circulo SE ABRE (D-042): la opacidad se resuelve en 0,3 s mientras todavia es un punto,
      // y despues lo unico que se mueve es el tamano, con power2.out, que arranca decidido y
      // frena suave. Antes crecia de 0,72 a 1 subiendo la opacidad en 1,8 s: a mitad de camino
      // era un disco enorme translucido. Mateo: "no parece nada fluido, es super feo".
      tl.to(halo, { autoAlpha: 1, duration: 0.3, ease: "none" }, 0.2)
        .to(halo, { scale: 1, duration: 1.7, ease: "power2.out" }, 0.3)
        .to(cabecera, { autoAlpha: 1, y: 0, duration: 1.3, stagger: 0.09 }, 0.15)
        .to(ceja, { autoAlpha: 1, y: 0, duration: 1.2 }, 0.3)
        // El gancho y los tres puntos, uno tras otro. Cada uno entra entero: es texto para
        // leer, no un titular, y no se divide en lineas ni en letras.
        .to(propuesta, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.85)
        .to(caja, { autoAlpha: 1, rotate: 0, duration: 2.0, ease: "power3.out" }, 0.5)
        .to(sueroLineas, { yPercent: 0, autoAlpha: 1, duration: 1.3, stagger: 0.1 }, 1.0)
        .to(giganteLineas, { yPercent: 0, autoAlpha: 1, duration: 1.8 }, 1.1)
        .to(acciones, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 }, 1.25)
        .to(controles, { autoAlpha: 1, y: 0, duration: 1.1 }, 1.6)
    },
    { scope: raiz, dependencies: [] },
  )

  /**
   * Cierra la inundacion: deja la paleta nueva escrita y retira las capas.
   *
   * suave = el circulo termino solo. Las capas se desvanecen en 450 ms (opacidad, en el
   * compositor): el circulo es un color plano, y al irse deja ver el halo nuevo, que ya quedo
   * pintado debajo con las variables. Sin el desvanecido el halo aparecia de golpe.
   * suave = false: lo interrumpe otro paso; se retira en el acto porque viene otro circulo.
   */
  const terminarInundacion = useCallback((suave: boolean) => {
    const p = pendiente.current
    if (!p) return
    pendiente.current = null
    gsap.set(document.documentElement, { ...VARS_FONDO(p), ...VARS_TEXTO(p), overwrite: "auto" })
    const capas = Array.from(document.querySelectorAll<HTMLElement>("[data-inundacion]"))
    const halo = raiz.current?.querySelector<HTMLElement>(".hero-halo")
    const propias = inundaciones.current
    inundaciones.current = []
    const retirar = () => {
      propias.forEach((a) => a.cancel())
      capas.forEach((c) => (c.style.visibility = "hidden"))
    }
    if (!suave) {
      retirar()
      if (halo) gsap.set(halo, { clearProps: "transform,opacity,visibility" })
      return
    }
    const fundidos = capas.map((c) =>
      c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }),
    )
    desvanecidas.current = fundidos
    // Si otro paso cancela el desvanecido, finished se rechaza y el paso nuevo se hace cargo.
    fundidos[0]?.finished
      .then(() => {
        retirar()
        fundidos.forEach((f) => f.cancel())
        desvanecidas.current = []
      })
      .catch(() => {})
  }, [])

  // PASO: inundacion de color + salida de los textos del suero anterior.
  useGSAP(
    () => {
      const desde = previo.current
      previo.current = i
      if (desde === i) return

      const p = PALETAS[DRIPS[i]!.ground]
      const html = document.documentElement
      // Lo que haya quedado del paso anterior se cierra en el acto: el circulo en vuelo, el
      // desvanecido del final y cualquier animacion de circulo con fill.
      terminarInundacion(false)
      desvanecidas.current.forEach((a) => a.cancel())
      desvanecidas.current = []
      inundaciones.current.forEach((a) => a.cancel())
      inundaciones.current = []
      linea.current?.kill()
      // El halo arranca limpio: si el paso anterior dejo su crecimiento a mitad, se descarta.
      const halo = raiz.current?.querySelector<HTMLElement>(".hero-halo")
      if (halo) gsap.set(halo, { clearProps: "transform,opacity,visibility" })

      if (reducido) {
        gsap.set(html, { ...VARS_FONDO(p), ...VARS_TEXTO(p) })
        cambioTexto.current = true
        setTexto(i)
        return
      }

      // Origen: el punto de la rueda por donde asoma la bolsa entrante, 60 grados a la derecha.
      const c = ruedaCaja.current?.getBoundingClientRect()
      if (!c) return
      const R = c.height * RADIO_EN_ALTURAS
      const ox = c.left + c.width / 2 + R * Math.sin(Math.PI / 3)
      const oy = c.top + c.height / 2 + R - R * Math.cos(Math.PI / 3)

      // UN solo circulo para todas las capas (D-029): mismo centro en la pantalla y mismo radio,
      // y ese radio es el que llega a la esquina mas lejana de la PANTALLA, no de cada capa.
      // Antes cada capa calculaba su propio radio: el header crecia a otra velocidad que el
      // hero (el borde del circulo se cortaba en la union), y en telefono, con el hero mas alto
      // que la pantalla, la mitad del recorrido pasaba debajo de lo visible: el color llegaba
      // hasta una parte, parecia trabarse, y el resto aparecia de golpe al final. Con el radio
      // de la pantalla, lo visible se cubre justo en el ultimo cuadro del paso.
      const vw = window.innerWidth
      const vh = window.innerHeight
      const radio = Math.max(
        Math.hypot(ox, oy),
        Math.hypot(vw - ox, oy),
        Math.hypot(ox, vh - oy),
        Math.hypot(vw - ox, vh - oy),
      )
      // El circulo es un DISCO que se escala, no un clip-path que se abre (D-030). clip-path
      // animado lo calcula el hilo principal; en un telefono ese hilo esta ocupado justo cuando
      // cambian los textos, el recorte se congelaba a mitad de camino y al final el color
      // aparecia de golpe. transform: scale() lo anima el compositor, que sigue aunque el hilo
      // principal este ocupado. Cada capa recorta su disco con overflow: hidden.
      const anims: Animation[] = []
      document.querySelectorAll<HTMLElement>("[data-inundacion]").forEach((capa) => {
        const disco = capa.firstElementChild as HTMLElement | null
        if (!disco) return
        const b = capa.getBoundingClientRect()
        const x = ox - b.left
        const y = oy - b.top
        capa.style.setProperty("--inundacion-fondo", p.fondo)
        disco.style.left = `${x - radio}px`
        disco.style.top = `${y - radio}px`
        disco.style.width = `${radio * 2}px`
        disco.style.height = `${radio * 2}px`
        capa.style.visibility = "visible"
        anims.push(
          disco.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
            duration: DURACION_PASO * 1000,
            easing: CURVA_CSS,
            fill: "forwards",
          }),
        )
      })
      inundaciones.current = anims
      pendiente.current = p
      anims[0]?.finished.then(() => terminarInundacion(true)).catch(() => {})

      // Los textos cambian cuando el circulo llega al titular, no antes.
      const h1 = raiz.current?.querySelector("h1")?.getBoundingClientRect()
      const distancia = h1 ? Math.hypot(h1.left + h1.width / 2 - ox, h1.top + h1.height / 2 - oy) : radio / 2
      const tCambio = tiempoPara(distancia / radio) * DURACION_PASO

      // El nombre del suero y el nombre gigante se van CON la bolsa, al arrancar el paso (D-031).
      // El nombre ahora vive al lado de la bolsa, que es justo de donde sale el circulo: si se
      // quedara hasta tCambio, se veria unos cuadros con los colores viejos sobre el fondo nuevo.
      // Vuelven en tCambio, ya con la paleta nueva, mientras la bolsa nueva se asienta.
      const salen = raiz.current?.querySelectorAll(".hero-suero .linea, .hero-gigante .linea") ?? []
      const tl = gsap.timeline()
      tl.to(salen, { yPercent: -105, autoAlpha: 0, duration: 0.45, ease: "power2.in", stagger: 0.04 }, 0)
        .add(() => {
          cambioTexto.current = true
          setTexto(i)
        }, tCambio)
        .to(html, { ...VARS_TEXTO(p), duration: 0.45, ease: "power1.out" }, Math.max(0, tCambio - 0.2))
      // El halo del color nuevo crece DEBAJO del circulo (D-039), arrancando poco antes de que el
      // circulo termine: cuando la capa se desvanece ya viene a mitad de camino y termina junto
      // con el nombre nuevo y el color, no un segundo despues. Antes quedaba pintado debajo y se
      // descubria entero, que es lo que Mateo vio como "aparece de la nada"; y creciendo recien
      // al final del paso, llegaba tarde respecto de todo lo demas.
      if (halo) {
        tl.fromTo(
          halo,
          { scale: 0.84, autoAlpha: 0 },
          // 0,9 s: los pedidos de "mas rapido" eran por el circulo de la ENTRADA, no por este
          // (D-041). Aca manda la fluidez, sincronizado con el color y el nombre nuevo.
          { scale: 1, autoAlpha: 1, duration: 0.9, ease: "sine.out", clearProps: "transform,opacity,visibility" },
          Math.max(0, DURACION_PASO - 0.3),
        )
      }
      linea.current = tl
    },
    { dependencies: [i, reducido] },
  )

  // Entrada de los textos del suero nuevo, linea por linea desde su mascara.
  useGSAP(
    () => {
      if (!cambioTexto.current || reducido) return
      gsap.fromTo(
        ".hero-suero .linea, .hero-gigante .linea",
        { yPercent: 105, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          clearProps: "transform,opacity,visibility",
          overwrite: "auto",
        },
      )
    },
    { scope: raiz, dependencies: [texto, reducido] },
  )

  // El numero del contador rueda con el toque, sin esperar a la paleta: es la respuesta al clic.
  useGSAP(
    () => {
      if (previo.current === 0 && i === 0) return
      if (reducido) return
      gsap.fromTo(".contador-num", { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "expo.out", clearProps: "transform" })
    },
    { scope: raiz, dependencies: [i] },
  )

  const cambiar = useCallback((siguiente: number) => {
    setI((actual) => {
      const destino = (siguiente + DRIPS.length) % DRIPS.length
      return destino === actual ? actual : destino
    })
  }, [])

  // Flechas del teclado, salvo que la persona este escribiendo en un campo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      if (e.key === "ArrowRight") cambiar(i + 1)
      if (e.key === "ArrowLeft") cambiar(i - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [cambiar, i])

  /** Flecha: trazo fino, sin fondo y sin borde; el chevron se corre hacia donde apunta. */
  const flecha =
    "group flex size-11 items-center justify-center text-[var(--p-acento)] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--p-acento)]"
  const chevron = "size-5 fill-none stroke-current stroke-1 transition-[translate] duration-(--dur-3) ease-brand"

  return (
    <section
      ref={raiz}
      data-hero=""
      data-tema="hero"
      className="page-grid relative isolate min-h-[calc(100svh-var(--head-h))] items-center overflow-hidden bg-[var(--p-fondo)]"
    >
      <div data-intro="" aria-hidden="true" className={`hero-halo pointer-events-none z-0 bg-[var(--p-halo)] ${HALO}`} />

      {/* Inundacion de la PAGINA: lo que se ve de la pantalla fuera del hero y del header (en
          telefono, la franja de abajo cuando la barra del navegador se esconde). Fixed y con
          z negativo: queda por encima del fondo del body y por debajo de todo lo demas. Sin esta
          capa esa franja cambiaba de color de golpe al final del paso (D-029). */}
      <div
        data-inundacion="pagina"
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute rounded-full bg-(--inundacion-fondo)" />
      </div>

      {/* La inundacion del hero: un disco del color nuevo que crece desde donde llega la bolsa,
          recortado por la seccion. Va por encima del halo viejo; el halo nuevo aparece cuando la
          capa se desvanece al final. Escondida en reposo. */}
      <div
        data-inundacion="hero"
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute rounded-full bg-(--inundacion-fondo)" />
      </div>

      {/* El nombre del suero en grande, vertical, en UNA columna, detras de la bolsa (D-027).
          El tamano sale del alto disponible y no del ancho: el nombre mas largo, "Recuperación
          Deportiva", mide 8,0 veces el tamano de letra, y dividir el alto por 8,3 garantiza que
          entra entero en cualquier pantalla sin partirlo en dos columnas. */}
      <p
        data-intro=""
        aria-hidden="true"
        className="hero-gigante type-display pointer-events-none absolute top-(--space-5) right-0 z-[1] text-[min(12vw,calc(44svh/8.3))] leading-none whitespace-nowrap text-[var(--p-acento)] opacity-[0.14] [writing-mode:vertical-rl] lg:text-[calc((100svh-var(--head-h)-2*var(--space-5))/8.3)]"
      >
        <span className="block overflow-hidden">
          <span className="linea block">{visible.nombre.join(" ")}</span>
        </span>
      </p>

      {/* La bolsa y sus controles. En telefono arriba; en desktop, columnas 7 a 11: a la derecha
          del titular, que no se tapa, y con lugar para que se vea el cruce de las dos bolsas.
          z-[2] crea el contexto de apilado de la rueda y la pone delante de las letras gigantes. */}
      <div
        ref={media}
        className="page-full relative order-first z-[2] flex flex-col items-center py-(--space-6) lg:col-[col-start_7/col-end_11] lg:row-start-1 lg:py-(--space-7)"
      >
        <div ref={ruedaCaja} data-intro="" className="w-full">
          {/* 56svh en desktop y no 62: debajo de la bolsa ahora va tambien su nombre, y bolsa +
              nombre + flechas tienen que entrar en el alto del hero. */}
          <DripWheel drips={DRIPS} indice={i} className="h-[40svh] w-full [--suero-h:40svh] lg:h-[56svh] lg:[--suero-h:56svh]" />
        </div>

        {/* El tratamiento, JUNTO a la bolsa (D-031): nombre y bajada del suero que esta al
            frente. Es lo unico de texto que cambia con la rueda; la columna izquierda queda fija. */}
        <div data-intro="" className="hero-suero relative z-[60] mt-(--space-4) text-center">
          <p className="type-display text-step-2 text-[var(--p-acento)]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="linea block">{visible.nombre.join(" ")}</span>
            </span>
          </p>
          <p className="mt-1 text-step--1 text-[var(--p-texto)]/85">
            <span className="block overflow-hidden">
              <span className="linea block">{visible.bajada}</span>
            </span>
          </p>
        </div>

        {/* Debajo de la bolsa, y nada mas: anterior, posicion, siguiente. */}
        <div data-intro="" className="hero-controles relative z-[60] mt-(--space-3) flex items-center gap-(--space-3)">
          <button type="button" onClick={() => cambiar(i - 1)} aria-label="Suero anterior" className={flecha}>
            <svg viewBox="0 0 16 16" aria-hidden="true" className={`${chevron} group-hover:-translate-x-0.5`}>
              <path d="M10 2.5 4.5 8l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {/* Sin transparencia: sobre el gris, el texto chico al 70 % baja de 4,5:1. */}
          <p className="min-w-10 text-center text-step--1 font-light tracking-[0.08em] tabular-nums text-[var(--p-texto)]">
            <span className="inline-block overflow-hidden align-bottom">
              <span key={i} className="contador-num inline-block">
                {i + 1}
              </span>
            </span>
            /{DRIPS.length}
          </p>
          <button type="button" onClick={() => cambiar(i + 1)} aria-label="Suero siguiente" className={flecha}>
            <svg viewBox="0 0 16 16" aria-hidden="true" className={`${chevron} group-hover:translate-x-0.5`}>
              <path d="M6 2.5 11.5 8 6 13.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="page-content relative z-10 pb-(--space-8) lg:page-copy lg:row-start-1 lg:pb-0">
        <p data-intro="" className="hero-ceja text-step--1 tracking-[0.14em] text-[var(--p-acento)] uppercase">
          Ciencia + Bienestar
        </p>

        {/* UNA linea, sin corte, con "estar bien." en negrita sobre el resaltador, como lo pidio
            la clienta (D-028, vuelve el dispositivo del manual p.12-14). La caja toma los colores
            de la paleta del suero al frente y rota con ella.
            Con la negrita y el aire de la caja la frase mide 9,22 veces el tamano de letra (antes
            7,87). Columnas medidas en el navegador: 314 px a 375, 430 a 1024, 620 a 1440, 648 a
            1920. 8,6vw da 297 px a 375; 4,4vw da 415 a 1024 y 585 a 1440; el tope de 4,25rem da
            627 a 1920. nowrap es la garantia; el tamano es lo que hace que no desborde.
            La caja no se anima sola: sube con su linea adentro de la mascara, caja y texto juntos,
            asi que ningun cuadro deja texto verde sobre verde (G-040). */}
        <SplitReveal
          as="h1"
          delay={0.45}
          duration={1.3}
          data-intro=""
          className="type-display mt-(--space-5) text-[clamp(1.625rem,8.6vw,3rem)] leading-[0.9]! whitespace-nowrap text-[var(--p-texto)] lg:text-[clamp(2.75rem,4.4vw,4.25rem)]"
        >
          La ciencia de <Highlight className="[--hl-bg:var(--p-hl-fondo)] [--hl-fg:var(--p-hl-texto)]">estar bien.</Highlight>
        </SplitReveal>

        {/* La propuesta de valor, FIJA (D-031): quienes son y que vienen a resolver. No cambia
            con la rueda. Forma de D-032: un gancho de una linea y tres puntos cortos, cada uno en
            UNA linea tambien en telefono. El parrafo anterior partia en seis renglones y el
            gancho en tipografia display se leia como otro titulo. Todo sale de la bajada de los
            fundadores (docs/14-MARCA section 9); nada inventado. */}
        <div data-intro="" className="hero-propuesta mt-(--space-6)">
          {/* text-balance: en telefono el gancho va en dos lineas, y sin esto quedaba
              "intervenir." sola abajo. */}
          <p className="punto text-step-1 leading-snug font-medium text-balance text-[var(--p-texto)]">
            No esperamos que algo falle para intervenir.
          </p>
          <ul className="mt-(--space-4) flex flex-col gap-(--space-2)">
            {PUNTOS.map((t) => (
              <li key={t} className="punto flex items-center gap-(--space-3) text-step-0 text-[var(--p-texto)]/85">
                {/* El marcador es un cuadrado del acento, radio 0: el mismo lenguaje que la caja
                    del resaltador. Rota con la paleta. */}
                <span aria-hidden="true" className="size-2 shrink-0 bg-[var(--p-acento)]" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p aria-live="polite" className="sr-only">
          Suero {drip.n} de {DRIPS.length}: {drip.nombre.join(" ")}
        </p>

        <div className="mt-(--space-7) flex flex-wrap items-center gap-(--space-6)">
          <span data-intro="" className="hero-accion inline-flex">
            <BotonReserva href="/turnos/" tamano="md">
              Reservar turno
            </BotonReserva>
          </span>
          <span data-intro="" className="hero-accion inline-flex">
            <a
              href={`/tratamientos/${drip.slug}/`}
              className="link-linea link-linea-base text-step-0 text-[var(--p-texto)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--p-acento)]"
            >
              Ver este tratamiento
              <svg viewBox="0 0 16 16" aria-hidden="true" className="link-flecha size-4 fill-none stroke-current stroke-[1.4]">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </span>
        </div>
      </div>
    </section>
  )
}
