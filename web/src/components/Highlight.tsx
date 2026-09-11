import type { ReactNode } from "react"

interface HighlightProps {
  children: ReactNode
  className?: string
}

/**
 * El resaltador: el dispositivo de firma de la marca (docs/05-DISENO.md section 1.1).
 *
 * La caja y sus colores salen de la utilidad `highlight` de @sanalys/brand: caja anclada al
 * fondo del area de contenido, esquina 0, peso bold, y box-decoration-break: clone para que un
 * resaltado partido en dos lineas pinte dos cajas y no una estirada.
 *
 * SIN ANIMACION, a proposito, y no es una omision:
 *
 * 1. La tinta del resaltado es --hl-fg, pensada para leerse SOBRE la caja: verde sobre fluo.
 *    Si la caja no esta pintada, el texto queda verde sobre verde e ilegible. Entonces animar
 *    el ancho de la caja NO cumple docs/05 section 10 "Entrance animation": el estado
 *    interrumpido no es "sin caja", es "sin texto". Y esa animacion se interrumpe de verdad —
 *    SplitText con autoSplit re-divide al cargar la fuente y mueve este nodo de lugar; medido
 *    en la pagina corriendo, --hl-w quedaba clavado en 0% y el segundo renglon del H1 no se
 *    veia (G-040).
 * 2. En el titular del hero la clienta pidio el resaltador tal como lo trae el manual (D-028):
 *    caja solida y negrita, sin efecto. Ahi entra con su linea, desde la mascara de SplitText,
 *    con caja y texto juntos, que es la unica entrada que no puede dejar un cuadro ilegible.
 *
 * Los colores salen de --hl-bg / --hl-fg del ground. En el hero se pisan con las variables de
 * la paleta del suero al frente (--p-hl-*), para que la caja rote con el resto.
 */
export function Highlight({ children, className = "" }: HighlightProps) {
  return <mark className={`highlight ${className}`}>{children}</mark>
}
