import type { CSSProperties } from "react"

interface DuotoneImageProps {
  /**
   * Nombre base del set, sin recorte ni extension. Los archivos viven en
   * web/public/img/brand/ y se llaman <name>-mobile|tablet|desktop.avif|webp.
   * Origen y recorte de cada uno en web/public/img/brand/SOURCES.md.
   */
  name: string
  /**
   * Vacio solo si la imagen es decorativa y el bloque ya dice lo que hay que decir.
   * En los renders del espacio el alt DICE que es un render: la clinica todavia no abrio y
   * presentarlos como fotografia seria un dato inventado (docs/00-BRIEF.md section 6).
   */
  alt: string
  /**
   * Duotono verde/fluo. Apagado por defecto: los renders propios de la marca ya traen la
   * paleta y se muestran en color natural. Se enciende para FOTOGRAFIAS DE PERSONAS — como el
   * post del runner — y para las fotos reales cuando lleguen, de modo que el cambio de archivo
   * no rompa el diseno (docs/05-DISENO.md section 4).
   */
  duotone?: boolean
  /** Solo el hero. Una sola imagen por pagina puede ser prioritaria; el resto compite con ella. */
  priority?: boolean
  /** Clases del contenedor. Ahi va el aspect-ratio por breakpoint, que es lo que sostiene CLS 0. */
  className?: string
  style?: CSSProperties
}

const BASE = "/img/brand"

/**
 * Imagen propia de la marca, con recortes por breakpoint.
 *
 * Es <picture> y no next/image a proposito: next/image sirve tamanos distintos de la MISMA
 * imagen, y lo que pide docs/05 section 4 es direccion de arte — recortes distintos por
 * breakpoint (3:4 telefono, 4:3 tablet, 21:9 desktop), que es una decision de encuadre y no de
 * peso. Eso solo lo expresa <picture> con media.
 *
 * Los sets drip-01 y drip-02 son verticales en los tres recortes porque son una bolsa colgando
 * y un 21:9 le corta el gancho y la tubuladura. Los nombres de archivo no cambian, asi que este
 * componente no necesita saberlo.
 *
 * CLS: el contenedor reserva la caja con aspect-ratio por breakpoint y la imagen la rellena con
 * object-cover. width/height cubren el caso de que el CSS no haya llegado todavia.
 *
 * Nunca stock, ni siquiera provisorio (D-018).
 */
export function DuotoneImage({
  name,
  alt,
  duotone = false,
  priority = false,
  className = "",
  style,
}: DuotoneImageProps) {
  const src = (crop: string, ext: string) => `${BASE}/${name}-${crop}.${ext}`

  return (
    <picture className={className} style={style}>
      <source media="(min-width: 1024px)" type="image/avif" srcSet={src("desktop", "avif")} />
      <source media="(min-width: 1024px)" type="image/webp" srcSet={src("desktop", "webp")} />
      <source media="(min-width: 768px)" type="image/avif" srcSet={src("tablet", "avif")} />
      <source media="(min-width: 768px)" type="image/webp" srcSet={src("tablet", "webp")} />
      <source type="image/avif" srcSet={src("mobile", "avif")} />
      <img
        src={src("mobile", "webp")}
        alt={alt}
        width={1080}
        height={1440}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={`h-full w-full object-cover${duotone ? " duotone" : ""}`}
      />
    </picture>
  )
}
