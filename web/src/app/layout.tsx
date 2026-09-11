import type { Metadata } from "next"
import type { ReactNode } from "react"

import fuenteCuerpo from "@sanalys/brand/fonts/roboto-flex-latin-opsz.woff2"

import { SmoothScroll } from "@/lib/lenis"

import "./globals.css"

export const metadata: Metadata = {
  title: "Sanalys",
}

/**
 * Layout raiz de web/.
 *
 * Agregado a la lista declarada de WU-04 por Mateo (2026-09-10): el provider de scroll y el
 * preload de la fuente van en la raiz desde el principio. El resto del shell — nav, footer,
 * cabeceras, sitemap, SEO — es de WU-05 y no se toca aca.
 *
 * <html> no lleva data-scroll-behavior="smooth" a proposito: Next 16 dejo de aplicar
 * scroll-behavior: smooth solo y hay que optar por el. Con Lenis andando, optar seria poner
 * dos sistemas de suavizado a pelear (motion-web-senior/lenis, pitfall 9).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        {/*
          La fuente se importa como asset para que el preload apunte exactamente al mismo
          archivo que pide el @font-face de @sanalys/brand. Escribir la ruta a mano daria
          una URL distinta a la que el bundler genera y el navegador bajaria la fuente dos
          veces. Presupuesto: dos archivos variables, subset latin, precargados
          (docs/05-DISENO.md section 6).
        */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={fuenteCuerpo}
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/*
          Duotono verde/fluo de toda foto del sitio (docs/05 section 4 y 10). Se monta una
          sola vez y lo consume la utilidad `duotone` de globals.css.

          No se hace con mix-blend-mode: los blend modes entregan el resultado al rango tonal
          nativo de cada foto, asi que una foto clara sale inundada de fluo — y el fluo es el
          unico acento de la marca, nunca un ground (docs/05 section 1.2). El filtro define la
          curva de salida y cualquier foto entra al mismo duotono:

            luminancia -> gamma (hunde los medios tonos al verde) -> tabla de 2 paradas

          Un solo numero lo ajusta: el exponent del gamma. Mas alto = mas verde, menos fluo.
          Las dos paradas son verde #0A3D33 y fluo #D0FF4E normalizados a 0-1; van escritos
          porque un filtro SVG toma numeros, no custom properties.
        */}
        <svg
          aria-hidden="true"
          focusable="false"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        >
          <filter id="duo" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
            />
            <feComponentTransfer>
              <feFuncR type="gamma" exponent="3.2" />
              <feFuncG type="gamma" exponent="3.2" />
              <feFuncB type="gamma" exponent="3.2" />
            </feComponentTransfer>
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.039 0.816" />
              <feFuncG type="table" tableValues="0.239 1" />
              <feFuncB type="table" tableValues="0.200 0.306" />
            </feComponentTransfer>
          </filter>
        </svg>

        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}
