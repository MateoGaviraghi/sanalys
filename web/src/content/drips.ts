/**
 * Los 6 Drips.
 *
 * Nombre, bajada y ground de etiqueta salen del manual de identidad p.28, leidos del PDF.
 * Son seis y no ocho: 01 a 06 son los que existen en la marca. Los dos que este proyecto
 * habia agregado (Renovacion Celular y Juventud Activa) no tienen nombre, color ni imagen en
 * ninguna fuente, asi que salen del hero hasta que la clinica los defina.
 */

export type GroundEtiqueta = "verde" | "gris" | "fluo"

export interface Drip {
  /** "01" a "06". Va impreso en la etiqueta. */
  n: string
  /** Slug de la URL y prefijo del archivo de imagen. Nunca se renombra (docs/04 section 3). */
  slug: string
  /** El nombre en dos lineas, como lo compone el manual. */
  nombre: [string, string]
  bajada: string
  /** Ground de la etiqueta impresa, del manual p.28. Cicla verde, gris, fluo. Manda la paleta. */
  ground: GroundEtiqueta
  /** Color del suero, muestreado de los renders del manual (p.26-27). */
  liquido: string
}

export const DRIPS: readonly Drip[] = [
  { n: "01", slug: "detox-vital", nombre: ["Detox", "Vital"], bajada: "Limpieza profunda y depuración", ground: "verde", liquido: "#E6EA86" },
  { n: "02", slug: "escudo-antioxidante", nombre: ["Escudo", "Antioxidante"], bajada: "Protección celular e inmunidad", ground: "gris", liquido: "#C9C4E4" },
  { n: "03", slug: "recuperacion-deportiva", nombre: ["Recuperación", "Deportiva"], bajada: "Energía y regeneración muscular", ground: "fluo", liquido: "#A8E6D2" },
  { n: "04", slug: "impulso-celular", nombre: ["Impulso", "Celular"], bajada: "Vitalidad y metabolismo", ground: "verde", liquido: "#F0B8A0" },
  { n: "05", slug: "equilibrio-mental", nombre: ["Equilibrio", "Mental"], bajada: "Regulación del ánimo y descanso", ground: "gris", liquido: "#CFE3A8" },
  { n: "06", slug: "anti-estres-plus", nombre: ["Anti-Estrés", "Plus"], bajada: "Relajación y alivio del dolor", ground: "fluo", liquido: "#A9D68C" },
] as const

/**
 * La paleta del header y el hero cuando un Drip esta al frente (D-025).
 *
 * Sale de la ETIQUETA de la bolsa: el ground es el fondo de la etiqueta, y el acento es la
 * tinta con la que la etiqueta imprime el logo y el nombre del tratamiento. Verde lleva logo
 * y nombre en fluo con texto blanco; fluo lleva todo en verde.
 *
 * Gris no es el gris de la etiqueta. La etiqueta imprime fluo y blanco sobre un gris medio
 * (#8A9096 muestreado del render) y en pantalla eso no se lee: blanco da 2,8:1 y fluo 2,4:1.
 * Se mantuvo la PAREJA de tintas de la etiqueta —fluo y blanco— y se bajo el gris hasta que
 * las dos pasan AA a cualquier tamano, con el mismo tinte azulado del render. Medido: blanco
 * 5,64:1, fluo 4,86:1. Verde y fluo dan 10,5:1 o mas en todas sus combinaciones.
 *
 * `halo` es la forma grande de atras: un escalon del propio fondo, apenas separado. Si fuera
 * un color contrastante le compite a la bolsa.
 */
export interface Paleta {
  fondo: string
  texto: string
  acento: string
  halo: string
  ctaFondo: string
  ctaTexto: string
  /** El canto del boton 3D (D-026): la cara del boton oscurecida un 30 %, solida, sin sombra. */
  ctaCanto: string
  /**
   * El resaltador de "estar bien." (D-028): caja y tinta. Son los pares del manual para cada
   * ground (tokens --hl-bg / --hl-fg): sobre verde y gris, caja fluo con texto verde; sobre
   * fluo, caja verde con texto fluo. 10,5:1 en los tres.
   */
  hlFondo: string
  hlTexto: string
}

export const PALETAS: Record<GroundEtiqueta, Paleta> = {
  verde: { fondo: "#0A3D33", texto: "#FFFFFF", acento: "#D0FF4E", halo: "#0F4A3E", ctaFondo: "#D0FF4E", ctaTexto: "#0A3D33", ctaCanto: "#91B237", hlFondo: "#D0FF4E", hlTexto: "#0A3D33" },
  gris: { fondo: "#62686E", texto: "#FFFFFF", acento: "#D0FF4E", halo: "#6B7177", ctaFondo: "#D0FF4E", ctaTexto: "#0A3D33", ctaCanto: "#91B237", hlFondo: "#D0FF4E", hlTexto: "#0A3D33" },
  fluo: { fondo: "#D0FF4E", texto: "#0A3D33", acento: "#0A3D33", halo: "#C5F540", ctaFondo: "#0A3D33", ctaTexto: "#D0FF4E", ctaCanto: "#03201A", hlFondo: "#0A3D33", hlTexto: "#D0FF4E" },
}

/**
 * El asset plano del suero: recortado, sin fondo, de frente y vertical. Se trata como una
 * imagen mas del DOM — se posiciona, se escala y se anima por transform.
 *
 * Es la ilustracion de marca que entrego Mateo, no un render nuestro. Venia como SVG, pero
 * esos SVG eran un PNG en base64 adentro de un envoltorio vectorial: 945 KB por suero, 5,9 MB
 * los seis. Se decodificaron y se volvieron a codificar a 35 KB cada uno, misma imagen, y se
 * les borro el nombre de paciente que traia impreso la etiqueta. El detalle esta en
 * web/public/img/drips/SOURCES.md.
 *
 * UN SOLO LUGAR PARA CAMBIARLO: ningun componente arma rutas por su cuenta.
 */
export const suero = (slug: string, ext: "avif" | "webp" = "avif") => `/img/drips/${slug}.${ext}`
