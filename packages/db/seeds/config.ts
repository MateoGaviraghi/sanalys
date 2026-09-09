/**
 * The inherited configuration documents with their exact defaults
 * (docs/08-REGLAS-SISTEMA.md section 12). Where the doc and the inherited code disagree,
 * the resolution written in section 0 is applied and noted on the line.
 *
 * These are the clinic's own parameters: the seed only inserts a key that does not exist
 * yet, so re-running it never overwrites what the client changed from Admin.
 */
import { MENSAJES_SEED } from "./mensajes.ts"

export const CONFIG_SEED: { clave: string; valor: unknown }[] = [
  {
    clave: "reparto",
    valor: {
      porcentajeMedica: 60,
      // Section 0.4: admin initialises 0, caja and balance default to 60. 60 wins,
      // because it is what cash actually applies when the value is unset.
      porcentajeSueros: 60,
      porcentajeReserva: 5,
      modoDistribucion: "proporcional",
      montoMaxOperacion: 1000000,
      // balance.html carries this fourth value in the same document.
      divisionSociedad: 3,
    },
  },
  {
    // The chart of accounts starts empty in the inherited system; the clinic fills it
    // from Admin > Plan de Cuentas. Inventing accounts here would be inventing data.
    clave: "maestros",
    valor: { ingresos: [], egresos: [], egresosVariables: [], centrosCosto: [] },
  },
  {
    clave: "agenda",
    valor: { hInicioM: 8, hFinM: 13, hInicioT: 16, hFinT: 20, duracion: 30, dias: [1, 2, 3, 4, 5] },
  },
  {
    // CI-09: the identity PDF and the inherited code carry different addresses and phones.
    // Nothing is chosen here; the clinic's real data is entered from Admin.
    clave: "datosClinica",
    valor: {
      nombre: "Sanalys",
      direccion: "{{CONFIRMAR}}",
      telefono: "{{CONFIRMAR}}",
      email: "{{CONFIRMAR}}",
      instagram: "{{CONFIRMAR}}",
      web: "{{CONFIRMAR}}",
      facebook: "{{CONFIRMAR}}",
      tiktok: "{{CONFIRMAR}}",
      slogan: "La ciencia de estar bien",
    },
  },
  { clave: "alertas", valor: { diasInactividad: 30, stockMinimo: 5 } },
  {
    // Section 0.9: where admin and a screen disagree, admin's version wins. Caja's
    // fallback list has three media; admin's has four.
    clave: "mediosPago",
    valor: { lista: ["Efectivo", "Banco", "Billetera Virtual", "Inversiones"] },
  },
  { clave: "funcionalidades", valor: { consentimientosDigitales: false, trazabilidadLotes: false } },
  {
    clave: "tiposTratamiento",
    valor: {
      lista: [
        "Terapia Inyectable / Sueros IV",
        "Mesoterapia",
        "Pellets Hormonales",
        "Terapia Hormonal",
        "Medicina Ortomolecular",
        "Tratamiento Estetico",
        "Plasma Rico en Plaquetas",
      ],
    },
  },
  { clave: "textosConsentimiento", valor: {} },
  {
    // 30 is the fallback in the inherited login.html and the value in section 12.
    // D-005 records "client default 0 = off"; that mismatch is OQ-13.
    clave: "seguridad",
    valor: { timeoutMinutos: 30 },
  },
  { clave: "archivado", valor: { mesesInactividad: 0 } },
  { clave: "recordatorios", valor: { textoPlantilla: "", horaEnvio: 18, horasAnticipacion: 24 } },
  { clave: "mensajes", valor: MENSAJES_SEED },
]

/**
 * The fourteenth inherited document is `config/disp_{profesionalId}`, one per professional.
 * Nothing implements it (G-006, OQ-07), so it is not seeded: the client decides whether
 * per-professional availability is built or the setting is removed.
 */
