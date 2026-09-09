/**
 * WhatsApp templates, copied verbatim from docs/08-REGLAS-SISTEMA.md section 12 —
 * emoji, line breaks, asterisks and voseo included. Placeholders: {nombre} {fecha}
 * {hora} {servicio} {tratamiento} {clinica}.
 *
 * Section 0.9: the consent template exists twice with different wording; admin's version
 * is the one the client configures, so admin's version is the seed.
 */
export const MENSAJES_SEED = {
  confirmacion_turno:
    "Hola {nombre}! 👋\n\nTe confirmamos tu turno en *Sanalys*:\n\n📅 *{fecha}*\n🕐 *{hora} hs*\n💉 {servicio}\n\nSi necesitás cancelar o reprogramar avisanos con anticipación. ¡Te esperamos!\n\n_Sanalys — La ciencia de estar bien_ 🌿",
  recordatorio_turno:
    "Hola {nombre}! 👋\n\nTe recordamos tu turno *mañana* en *Sanalys*:\n\n📅 *{fecha}*\n🕐 *{hora} hs*\n💉 {servicio}\n\n¿Confirmás asistencia? Cualquier cambio avisanos. ✅\n\n_Sanalys — La ciencia de estar bien_ 🌿",
  inactivo:
    "Hola {nombre}! 💚\n\nHace un tiempo que no te vemos por *Sanalys* y nos preguntamos cómo estás.\n\nSi querés retomar tu tratamiento o tenés alguna consulta, estamos disponibles para vos.\n\n¡Te esperamos! 🌿\n\n_Sanalys — La ciencia de estar bien_",
  cumpleanos:
    "¡Hola {nombre}! 🎉🎂\n\nTodo el equipo de *Sanalys* te desea un muy feliz cumpleaños.\n\nQue este año que comienza esté lleno de salud, bienestar y momentos hermosos. ✨\n\n_Con cariño — Sanalys_",
  consentimiento:
    "Hola {nombre}! 📋\n\nAdjuntamos tu *Consentimiento Informado* para el tratamiento de *{tratamiento}* firmado hoy en *Sanalys*.\n\nGuardá este mensaje como respaldo. Ante cualquier duda estamos a disposición.\n\n_Sanalys — La ciencia de estar bien_ 🌿",
  gift_card:
    "Hola {nombre}! 🎁\n\nTu cumpleaños se acerca y queremos celebrarlo con vos.\n\nEn *Sanalys* tenemos *Gift Cards* especiales para regalar salud y bienestar. ¿Se lo hacemos saber a alguien especial?\n\n¡Escribinos y lo coordinamos! ✨\n\n_Sanalys — La ciencia de estar bien_",
} as const
