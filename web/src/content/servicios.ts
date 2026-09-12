/**
 * Los servicios de la Home (D-034, reemplaza al bento de D-033).
 *
 * Todo el texto sale del posicionamiento que mando la clienta (docs/14-MARCA section 9): la
 * lista de servicios y las bajadas de los tres fundadores, recortadas y unidas. Nada inventado.
 *
 * Las fotos son PROVISORIAS: renders de marca que ya estan en web/public/img/brand/. Se
 * reemplazan con la sesion de fotos (CR-01) sin tocar el codigo, mismo nombre de archivo. Como
 * son renders, el texto alternativo lo dice (web/public/img/brand/SOURCES.md).
 */

/** Un set de web/public/img/brand/: cada uno tiene recorte mobile (3:4), tablet (4:3) y desktop. */
export type SetFoto =
  | "bata-blanca"
  | "bata-gris"
  | "recepcion"
  | "interior"
  | "salon"
  | "hero-drips"
  | "hero-drips-b"
  | "drip-01"
  | "drip-02"
  | "drips-grid"

export interface Foto {
  set: SetFoto
  alt: string
  /**
   * Que recorte usar de portada en escritorio, donde la tarjeta es apaisada. Los sets de
   * ambiente tienen un 21:9 ("desktop"); las bolsas no (su "desktop" es 4:5 o 3:4, vertical),
   * asi que van con el 4:3 de tablet.
   */
  apaisada: "desktop" | "tablet"
}

/** La seccion va sobre blanco (D-035): una banda blanca se perdia contra el fondo. */
export type Banda = "fluo" | "verde"

export interface Servicio {
  id: "evaluacion" | "protocolos" | "prp" | "seguimiento"
  n: string
  nombre: string
  /** Lo que se lee con la tarjeta cerrada. */
  linea: string
  /** Lo que se lee al abrirla. */
  descripcion: string
  incluye: string[]
  banda: Banda
  /** La primera es la portada; todas pasan en el carrusel al abrir. */
  fotos: Foto[]
}

export const SERVICIOS: readonly Servicio[] = [
  {
    id: "evaluacion",
    n: "01",
    nombre: "Evaluación médica completa",
    linea: "Entrevista, examen físico, biomarcadores y estudios dirigidos.",
    descripcion:
      "Todo empieza por conocer tu organismo. Una entrevista detallada, un examen físico minucioso y los estudios complementarios precisos para leer tus biomarcadores. Con esa información armamos un plan de abordaje a tu medida.",
    incluye: ["Entrevista detallada", "Examen físico minucioso", "Biomarcadores y estudios dirigidos", "Plan de abordaje personalizado"],
    banda: "fluo",
    fotos: [
      { set: "bata-blanca", alt: "Render de marca: bata médica de Sanalys", apaisada: "desktop" },
      { set: "recepcion", alt: "Render del espacio: recepción", apaisada: "desktop" },
      { set: "bata-gris", alt: "Render de marca: bata médica gris", apaisada: "desktop" },
    ],
  },
  {
    id: "protocolos",
    n: "02",
    nombre: "Protocolos individuales",
    linea: "Suplementación oral y sueroterapia endovenosa.",
    descripcion:
      "Cada protocolo se diseña para tu organismo, a partir de tus biomarcadores. Suplementación vía oral y sueros endovenosos con fórmulas específicas según tu objetivo: energía, recuperación o inmunidad. Los sueros se aplican en salas pensadas para que la espera se disfrute.",
    incluye: ["Protocolos por biomarcadores, no genéricos", "Suplementación oral", "Sueroterapia endovenosa", "Sala de aplicación con sillones de masaje"],
    banda: "verde",
    fotos: [
      { set: "hero-drips", alt: "Render de marca: tres sueros Sanalys", apaisada: "tablet" },
      { set: "salon", alt: "Render del espacio: sala de aplicación con sillones", apaisada: "desktop" },
      { set: "hero-drips-b", alt: "Render de marca: sueros Sanalys", apaisada: "tablet" },
      { set: "drip-01", alt: "Render de marca: suero Detox Vital", apaisada: "tablet" },
    ],
  },
  {
    id: "prp",
    n: "03",
    nombre: "PRP",
    linea: "Plasma rico en plaquetas: facial, corporal y capilar.",
    descripcion:
      "Un tratamiento regenerativo con tu propio plasma. El plasma rico en plaquetas se aplica en rostro, cuerpo o cuero cabelludo, para la regeneración cutánea y el bienestar exterior.",
    incluye: ["Aplicación facial", "Aplicación corporal", "Aplicación capilar", "También mesoterapia y peelings médicos"],
    banda: "fluo",
    fotos: [
      { set: "bata-gris", alt: "Render de marca: bata médica gris", apaisada: "desktop" },
      { set: "interior", alt: "Render del espacio: consultorio", apaisada: "desktop" },
      { set: "bata-blanca", alt: "Render de marca: bata médica de Sanalys", apaisada: "desktop" },
    ],
  },
  {
    id: "seguimiento",
    n: "04",
    nombre: "Seguimiento de hábitos",
    linea: "Estilo de vida orientado a longevidad y rendimiento.",
    descripcion:
      "La salud como un proceso, no como una consulta. Acompañamos tus hábitos y tu estilo de vida con un seguimiento médico personalizado, orientado a longevidad y rendimiento.",
    incluye: ["Mayor energía y vitalidad", "Mejor descanso y recuperación", "Acompañamiento en etapas de alta exigencia", "Prevención y envejecimiento saludable"],
    banda: "verde",
    fotos: [
      { set: "interior", alt: "Render del espacio: consultorio", apaisada: "desktop" },
      { set: "recepcion", alt: "Render del espacio: recepción", apaisada: "desktop" },
      { set: "drips-grid", alt: "Render de marca: los sueros Sanalys", apaisada: "desktop" },
    ],
  },
] as const

/** Ruta de un recorte. Un solo lugar: ningun componente arma rutas de imagen por su cuenta. */
export const foto = (set: SetFoto, recorte: "mobile" | "tablet" | "desktop", ext: "avif" | "webp" = "avif") =>
  `/img/brand/${set}-${recorte}.${ext}`
