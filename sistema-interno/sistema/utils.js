// ═══════════════════════════════════════════════════════════════
// SANALYS SMS — Utilidades Compartidas
// Funciones comunes usadas en múltiples módulos
// ═══════════════════════════════════════════════════════════════

// ── FECHAS ───────────────────────────────────────────────────────

/**
 * Parsea una fecha en formato dd/mm/yyyy o yyyy-mm-dd → Date | null
 */
window.parseFecha = (str) => {
    if (!str) return null;
    // Formato dd/mm/yyyy
    if (str.includes('/')) {
        const p = str.split('/');
        if (p.length < 3) return null;
        const d = new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0]));
        return isNaN(d) ? null : d;
    }
    // Formato yyyy-mm-dd
    if (str.includes('-')) {
        const d = new Date(str);
        return isNaN(d) ? null : d;
    }
    return null;
};

/**
 * Formatea un Date → string dd/mm/yyyy
 */
window.formatFecha = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

/**
 * Retorna cuántos días han pasado desde una fecha
 */
window.diasDesde = (fecha) => {
    const d = window.parseFecha(fecha);
    if (!d) return null;
    return Math.floor((new Date() - d) / 86400000);
};

// ── DNI ─────────────────────────────────────────────────────────

/**
 * Normaliza un DNI eliminando puntos, guiones y espacios
 */
window.normalizarDNI = (dni) => {
    if (!dni) return '';
    return String(dni).replace(/\D/g, '');
};

// ── TELÉFONO ─────────────────────────────────────────────────────

/**
 * Convierte un teléfono local al formato internacional de WhatsApp para Argentina
 * Ej: "3424597639" → "5493424597639"
 */
window.waNumero = (tel) => {
    if (!tel) return '';
    let n = String(tel).replace(/\D/g, '');
    if (!n.startsWith('54')) n = '549' + n.replace(/^0/, '');
    return n;
};

/**
 * Abre WhatsApp con un número y mensaje
 */
window.abrirWhatsApp = (tel, mensaje) => {
    const n = window.waNumero(tel);
    if (!n) return;
    window.open(`https://wa.me/${n}?text=${encodeURIComponent(mensaje)}`, '_blank');
};

// ── DINERO ───────────────────────────────────────────────────────

/**
 * Formatea un número como moneda argentina
 * Ej: 1234567.8 → "$ 1.234.567,80"
 */
window.formatMoney = (n) => {
    if (n === undefined || n === null) return '$ 0';
    return '$ ' + Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

// ── SEGURIDAD / XSS ──────────────────────────────────────────────

/**
 * Escapa caracteres HTML peligrosos para prevenir XSS (Cross-Site Scripting).
 * SIEMPRE usar al insertar texto del usuario en innerHTML.
 *
 * Convierte:  <script>  →  &lt;script&gt;
 * De modo que el navegador lo muestra como texto, no lo ejecuta.
 *
 * Uso:  elemento.innerHTML = `<p>${esc(paciente.nombre)}</p>`;
 *
 * @param {*} str - valor a escapar (se convierte a string)
 * @returns {string} texto seguro para insertar en HTML
 */
window.escapeHtml = (str) => {
    if (str === undefined || str === null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// Alias corto para usar cómodamente en templates: esc(...)
window.esc = window.escapeHtml;

// ── CAJA / MONTOS ────────────────────────────────────────────────

/**
 * M4: Aviso anti-error de tipeo. Si el monto supera el umbral configurado
 * en Admin, pide confirmación al usuario. NO bloquea: solo verifica.
 * @param {number} monto - monto ingresado
 * @param {number} umbral - tope configurado (config/reparto → montoMaxOperacion)
 * @returns {boolean} true si se puede continuar, false si el usuario canceló
 */
window.confirmarMontoAlto = (monto, umbral) => {
    const tope = (umbral && umbral > 0) ? umbral : 1000000;
    if (monto <= tope) return true;
    return confirm(
        `⚠️ El monto ingresado es $${Number(monto).toLocaleString('es-AR')}.\n\n` +
        `Es más alto que el máximo configurado ($${Number(tope).toLocaleString('es-AR')}).\n\n` +
        `¿Es correcto? Verificá que no haya un cero de más o el punto mal puesto.`
    );
};

// ── ARCHIVOS / UPLOADS ───────────────────────────────────────────

/**
 * M2: valida un archivo antes de subirlo (tamaño y extensión).
 * @param {File} file - archivo del input
 * @param {object} opts - { maxMB:5, extensiones:['pdf'], etiqueta:'PDF' }
 * @returns {string|null} mensaje de error, o null si está OK
 */
window.validarArchivo = (file, opts = {}) => {
    const maxMB = opts.maxMB || 5;
    const extensiones = opts.extensiones || [];
    const etiqueta = opts.etiqueta || extensiones.join(', ').toUpperCase();
    if (!file) return 'No se seleccionó ningún archivo.';
    if (file.size > maxMB * 1024 * 1024) {
        const mb = (file.size / 1024 / 1024).toFixed(1);
        return `El archivo pesa ${mb} MB y el máximo es ${maxMB} MB. Si es una imagen o escaneo pesado, reducilo o convertilo a ${etiqueta}.`;
    }
    if (extensiones.length) {
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        if (!extensiones.includes(ext)) {
            return `Solo se permiten archivos ${etiqueta}. Convertí el archivo a ${etiqueta} antes de subirlo.`;
        }
    }
    return null; // OK
};

// ── STRINGS ──────────────────────────────────────────────────────

/**
 * Convierte un string a slug para usar como key en Firestore
 * Ej: "Terapia Inyectable / Sueros IV" → "terapia_inyectable_sueros_iv"
 */
window.toSlug = (str) => {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/ \/ /g, '_')
        .replace(/\s+/g, '_')
        .replace(/[áéíóú]/g, m => ({ á:'a', é:'e', í:'i', ó:'o', ú:'u' }[m] || m))
        .replace(/[^a-z0-9_]/g, '');
};

// ── SESIÓN ───────────────────────────────────────────────────────

/**
 * Devuelve la sesión actual del usuario
 */
window.getSesion = () => {
    try {
        return JSON.parse(sessionStorage.getItem('usuario_sanalys') || '{}');
    } catch { return {}; }
};

/**
 * Verifica si el usuario actual tiene un permiso específico
 */
window.tienePermiso = (permiso) => {
    const s = window.getSesion();
    if (s.rol === 'admin') return true;
    return (s.permisos || []).includes(permiso) || (s.permisos || []).includes('admin');
};

console.log('[Sanalys Utils] Cargado v1.3');
