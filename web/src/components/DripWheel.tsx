"use client"

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react"

import { suero, type Drip } from "@/content/drips"
import { gsap, useGSAP } from "@/lib/gsap"

/**
 * La rueda de sueros del hero (D-025; performance revisada en D-026).
 *
 * Una rueda cuyo centro queda debajo de la bolsa activa. Los sueros van FIJOS al borde, como
 * rayos: giran con la rueda y se inclinan con ella. Cada paso la rueda gira 90 grados en
 * sentido ANTIHORARIO: el entrante sube desde abajo a la derecha enderezandose hasta quedar
 * vertical en el apice, y el saliente baja por la izquierda hasta quedar acostado. Es el
 * movimiento del video de referencia y del dibujo de Mateo del 2026-09-11. Sin contrarrotacion.
 *
 * Lo que la hacia trabarse y como quedo (motion-web-senior/performance):
 *   - La bolsa entrante se decodificaba recien al aparecer, en pleno giro: tiron visible.
 *     Ahora las seis se decodifican apenas carga la pagina, con img.decode().
 *   - Se reescribian las seis bolsas en cada cuadro, tambien las invisibles. Ahora solo las
 *     que se ven; una bolsa con opacidad cero no se toca.
 *   - El radio era calc(var(...)) adentro de cada transform, resuelto seis veces por cuadro.
 *     Ahora es un numero en px, medido una vez y otra vez solo si cambia el tamano.
 *   - will-change estaba fijo en las seis capas. Ahora se prende al empezar el paso y se
 *     apaga al terminar, solo en las bolsas que se mueven.
 *
 * Reposo sin JavaScript: el primer render escribe los transforms con la variable CSS del radio,
 * asi que el suero activo ya esta en el apice en el HTML del servidor. El JS toma el relevo.
 */

/**
 * Grados por paso. 90 y no 60: a 60 el vecino en reposo queda a media altura del hero, casi
 * derecho y a la vista. A 90 queda acostado a la altura del centro de la rueda, que es donde
 * la opacidad ya llego a cero. En reposo se ve una sola bolsa.
 */
const PASO = 90

/**
 * Duracion de un paso. La usa tambien el hero para sincronizar el cambio de paleta.
 * 1,6 s y no 1,1 (D-027): a 1,1 la bolsa cruzaba la pantalla demasiado rapido para que se
 * leyera el arco. Pedido por Mateo: "mas lento, para que se vea la fluidez".
 */
export const DURACION_PASO = 1.6

/**
 * power2.inOut y no power3: a esta duracion power3 junta casi todo el recorrido en el medio y
 * la bolsa pega un latigazo. power2 reparte la velocidad y se lee continuo. El hero usa la
 * misma curva para la inundacion de color.
 */
export const CURVA_PASO = "power2.inOut"

/**
 * Radio, en alturas de bolsa. Con un radio mas grande (1,15 alturas, o 42vw) a mitad del paso
 * las DOS bolsas quedaban fuera de la pantalla y en un telefono el hero se quedaba vacio medio
 * segundo. Con 0,8 el cruce pasa adentro. El hero lo lee para saber de donde sale la paleta.
 */
export const RADIO_EN_ALTURAS = 0.8

/** Relacion de aspecto del asset. Fija la caja antes de que baje la imagen: CLS cero. */
const RELACION = "692 / 1476"

const distancia = (activo: number, hasta: number, n: number) => {
  const d = (((hasta - activo) % n) + n) % n
  return d > n / 2 ? d - n : d
}

/** Un poco mas chica cuanto mas lejos del apice. Pista de profundidad, sutil a proposito. */
const escala = (angulo: number) => 1 - 0.12 * Math.min(Math.abs(angulo) / PASO, 1)

/**
 * Se lee de derecha a izquierda, que es el orden en que se aplica a la caja: centrarla,
 * escalarla, empujarla hasta el borde y girar todo alrededor del centro de la rueda.
 */
const transform = (angulo: number, radio: string) =>
  `rotate(${angulo}deg) translateY(-${radio}) scale(${escala(angulo)}) translate(-50%, -50%)`

/**
 * Asimetrica a proposito (D-029).
 *
 * Lado derecho (angulos positivos, por donde entra la bolsa nueva): 100 % hasta los 50 grados
 * y cero a los 85. La entrante se ve llegar entera.
 *
 * Lado izquierdo (negativos, por donde se va): 100 % hasta los 10 grados y cero a los 40. Con
 * el mismo criterio que la derecha, la saliente seguia a la vista hasta quedar casi acostada
 * abajo a la izquierda, justo en la zona del texto y los botones: ahi "aparecia" por un
 * instante y se leia como un error. Ahora se apaga mientras se inclina, antes de llegar a esa
 * zona, y lo que queda en foco es la que entra.
 */
const opacidad = (angulo: number) =>
  angulo < 0 ? Math.max(0, Math.min(1, (40 + angulo) / 30)) : Math.max(0, Math.min(1, (85 - angulo) / 35))

const RADIO_CSS = `calc(var(--suero-h) * ${RADIO_EN_ALTURAS})`

interface DripWheelProps {
  drips: readonly Drip[]
  /** Indice del suero al frente. Cambiarlo es lo que gira la rueda un paso. */
  indice: number
  className?: string
}

export function DripWheel({ drips, indice, className = "" }: DripWheelProps) {
  const cuna = useRef<HTMLDivElement>(null)
  const rueda = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLDivElement | null)[]>([])
  const angulos = useRef<number[]>([])
  const opacidades = useRef<number[]>([])
  const radio = useRef(0)
  /**
   * El indice del primer render, congelado. El style de cada bolsa se escribe con ESTE indice y
   * nunca con el actual (D-029). Si el JSX usara el indice actual, en cada cambio React volveria
   * a escribir el transform y la opacidad FINALES de cada bolsa por encima de los que maneja el
   * tween: la saliente quedaba en opacidad 0 desde el primer cuadro y, como pintar() saltea las
   * opacidades que no cambiaron, no se corregia hasta mitad de camino, donde reaparecia de golpe
   * abajo a la izquierda. Ese era el "suero que aparece por una fraccion". Despues del montaje,
   * transform y opacidad son solo de pintar().
   */
  const [inicial] = useState(indice)

  const medir = useCallback(() => {
    radio.current = (cuna.current?.offsetHeight ?? 0) * RADIO_EN_ALTURAS
  }, [])

  const pintar = useCallback((todo = false) => {
    const R = radio.current
    if (!R) return
    if (todo && rueda.current) rueda.current.style.translate = `0 ${R}px`
    for (let k = 0; k < angulos.current.length; k++) {
      const el = items.current[k]
      const a = angulos.current[k]
      if (!el || a === undefined) continue
      const op = opacidad(a)
      const antes = opacidades.current[k]
      // Invisible antes y ahora: no hay nada que pintar.
      if (!todo && op === 0 && antes === 0) continue
      el.style.transform = transform(a, `${R}px`)
      // En una pasada completa la opacidad se escribe siempre: la cache solo sirve adentro del
      // tween, donde nadie mas toca el DOM.
      if (todo || op !== antes) {
        el.style.opacity = String(op)
        opacidades.current[k] = op
      }
    }
  }, [])

  // El radio sigue al tamano de la bolsa: rotar el telefono o cambiar el ancho la cambia.
  useEffect(() => {
    const el = cuna.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      medir()
      pintar(true)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [medir, pintar])

  // Las seis bolsas decodificadas antes del primer giro. Sin esto la entrante se decodifica en
  // el cuadro en que aparece, en medio del movimiento, y ese es el tiron que se veia.
  useEffect(() => {
    const id = window.setTimeout(() => {
      cuna.current?.querySelectorAll("img").forEach((img) => {
        img.decode?.().catch(() => {})
      })
    }, 250)
    return () => window.clearTimeout(id)
  }, [])

  useGSAP(
    () => {
      const objetivo = drips.map((_, k) => distancia(indice, k, drips.length) * PASO)

      // Orden de pintado, una vez por paso: el activo arriba, el resto segun se aleje.
      for (let k = 0; k < objetivo.length; k++) {
        const el = items.current[k]
        if (el) el.style.zIndex = String(50 - Math.abs(distancia(indice, k, drips.length)))
      }

      const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (!angulos.current.length || quieto) {
        angulos.current = objetivo
        opacidades.current = objetivo.map(opacidad)
        medir()
        pintar(true)
        return
      }

      const desde = angulos.current.slice()
      // React ya re-renderizo con los estilos del estado FINAL: repintar devuelve la rueda a
      // donde estaba antes del toque, si no hay un cuadro de salto antes del tween.
      pintar(true)

      // El que da la vuelta larga pasa del otro lado de golpe: esta con opacidad cero.
      for (let k = 0; k < objetivo.length; k++) {
        if (Math.abs(objetivo[k]! - desde[k]!) > PASO * 1.5) desde[k] = objetivo[k]!
      }

      // will-change solo en las que se mueven a la vista, y solo mientras dura el paso.
      const moviles = items.current.filter(
        (el, k) => el && (opacidad(desde[k]!) > 0 || opacidad(objetivo[k]!) > 0),
      ) as HTMLDivElement[]
      moviles.forEach((el) => (el.style.willChange = "transform, opacity"))

      const p = { t: 0 }
      const tw = gsap.to(p, {
        t: 1,
        duration: DURACION_PASO,
        ease: CURVA_PASO,
        onUpdate: () => {
          for (let k = 0; k < objetivo.length; k++) {
            angulos.current[k] = desde[k]! + (objetivo[k]! - desde[k]!) * p.t
          }
          pintar()
        },
        // Red de seguridad: al terminar se clavan los angulos exactos, asi ninguna bolsa queda
        // estacionada a mitad del arco si el tween se quedo sin cuadros.
        onComplete: () => {
          angulos.current = objetivo
          pintar(true)
          moviles.forEach((el) => (el.style.willChange = "auto"))
        },
      })

      return () => {
        tw.kill()
        moviles.forEach((el) => (el.style.willChange = "auto"))
      }
    },
    { scope: cuna, dependencies: [indice, drips] },
  )

  return (
    <div ref={cuna} className={`relative ${className}`} style={{ "--suero-ar": RELACION } as CSSProperties}>
      {/* El centro de la rueda: un nodo de tamano cero, un radio por debajo de la bolsa activa. */}
      <div
        ref={rueda}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-0"
        style={{ translate: `0 ${RADIO_CSS}` }}
      >
        {drips.map((d, k) => {
          const activo = k === indice
          // Con el indice INICIAL: ver el comentario de `inicial` arriba.
          const a = distancia(inicial, k, drips.length) * PASO
          return (
            <div
              key={d.slug}
              ref={(el) => {
                items.current[k] = el
              }}
              className="absolute top-0 left-0 h-(--suero-h) aspect-(--suero-ar)"
              style={{
                transform: transform(a, RADIO_CSS),
                opacity: opacidad(a),
                zIndex: 50 - Math.abs(distancia(inicial, k, drips.length)),
              }}
            >
              <picture>
                <source type="image/avif" srcSet={suero(d.slug)} />
                <img
                  src={suero(d.slug, "webp")}
                  alt={activo ? `Suero ${d.n} ${d.nombre.join(" ")}` : ""}
                  width={692}
                  height={1476}
                  // La activa es el LCP del hero: se pinta junto con el primer cuadro. Las otras
                  // cinco se decodifican en segundo plano con img.decode() (efecto de arriba).
                  decoding={activo ? "sync" : "async"}
                  fetchPriority={activo ? "high" : "low"}
                  className="block h-full w-full object-contain"
                  draggable={false}
                />
              </picture>
            </div>
          )
        })}
      </div>
    </div>
  )
}
