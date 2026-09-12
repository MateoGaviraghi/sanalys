"use client"

import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

/**
 * Punto unico de registro de GSAP para web/.
 *
 * Los plugins se registran en el scope del modulo, no adentro de un componente: registerPlugin
 * es idempotente pero tiene que correr en el cliente, y este archivo lleva "use client".
 * Todo componente con motion importa desde aca y nunca hace su propio registerPlugin.
 *
 * useGSAP se registra tambien: es lo que hace que GSAP reconozca las animaciones creadas por
 * el hook y las meta en el gsap.context() que se revierte solo al desmontar y en el doble
 * montaje de StrictMode en dev (motion-web-senior/nextjs-react-integration section 3).
 *
 * GSAP 3.15.0 incluye SplitText y ScrollTrigger sin costo desde que Webflow compro GreenSock
 * (abril 2025). No hay paquete gsap-trial ni Club GSAP.
 */
// Flip (D-034): agranda la tarjeta de servicio en su lugar sin salto. Viene en el mismo paquete
// gsap, sin dependencia nueva.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip)

/**
 * En telefono, mostrar y ocultar la barra del navegador cuenta como resize y dispara un
 * refresh de ScrollTrigger en cada scroll, con salto visible. Esto lo apaga: sigue
 * refrescando en rotaciones y cambios reales de ancho, no en el chrome del navegador.
 * La mayoria del trafico de este sitio es telefono (docs/00-BRIEF.md section 2).
 */
ScrollTrigger.config({ ignoreMobileResize: true })

export { Flip, gsap, ScrollTrigger, SplitText, useGSAP }
