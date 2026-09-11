import { Hero } from "@/components/Hero"
import { Nav } from "@/components/Nav"
import { Servicios } from "@/components/Servicios"

/**
 * Home. Mateo la define seccion por seccion sobre la pagina que corre (D-017, D-033): primero el
 * hero, despues los servicios, y asi. Cada seccion nueva se suma aca en el orden en que va.
 *
 * Server Component: los componentes con motion llevan su propio "use client" y son hojas.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Servicios />
      </main>
    </>
  )
}
