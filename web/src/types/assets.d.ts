/**
 * Next declara los tipos de los assets de imagen (next-env.d.ts -> next/image-types/global)
 * pero no los de fuente. Sin esto, importar el .woff2 de @sanalys/brand para que el preload
 * apunte al mismo archivo que pide el @font-face falla el typecheck con TS2307.
 *
 * Archivo fuera de la lista declarada de WU-04: es una declaracion de tipo, no codigo.
 */
declare module "*.woff2" {
  const src: string
  export default src
}
