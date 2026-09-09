(function () {
    'use strict';

    const page = window.location.pathname.split('/').pop().toLowerCase();
    if (page === 'login.html' || page === '') return;

    const SESION  = JSON.parse(sessionStorage.getItem('usuario_sanalys') || '{}');
    const perms   = SESION?.permisos || [];
    const rol     = SESION?.rol || '';

    const ok = p => !p || rol === 'admin' || perms.includes(p);

    // ── SVG icons (Heroicons-style, stroke, 20×20 viewBox) ──────────────
    const ICONS = {
        dashboard: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
        agenda:    `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>`,
        crm:       `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M17 20H2v-2a3 3 0 013-3h2"/><path d="M9 11a4 4 0 100-8 4 4 0 000 8z"/><path d="M22 20v-2a3 3 0 00-2.5-2.96M16 3.13a4 4 0 010 7.75"/></svg>`,
        pacientes: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        enfermeria:`<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
        sueros:    `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 3v11.5a3.5 3.5 0 007 0V3M9 3h7"/><path d="M6 3h3M16 3h3"/></svg>`,
        caja:      `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h2m4 0h2"/></svg>`,
        balance:   `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
        legal:     `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
        admin:     `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M2 12h2M20 12h2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 20v2"/></svg>`,
    };

    // Accent colors per module (for active state)
    const COLORS = {
        'index.html':          '#D0FF4E',
        'agenda.html':         '#D0FF4E',
        'crm.html':            '#fbbf24',
        'pacientes.html':      '#60a5fa',
        'enfermeria.html':     '#2dd4bf',
        'sueros.html':         '#a78bfa',
        'caja.html':           '#4ade80',
        'balance.html':        '#818cf8',
        'consentimiento.html': '#f472b6',
        'admin.html':          '#94a3b8',
    };

    const routes = [
        { path:'index.html',          icon:'dashboard',  name:'Dashboard',   perm:null },
        { path:'agenda.html',         icon:'agenda',     name:'Agenda',      perm:'agenda' },
        { path:'caja.html',           icon:'caja',       name:'Caja',        perm:'caja' },
        { path:'pacientes.html',      icon:'pacientes',  name:'Pacientes',   perm:'pacientes' },
        { path:'enfermeria.html',     icon:'enfermeria', name:'Enfermería',  perm:'enfermeria' },
        { path:'sueros.html',         icon:'sueros',     name:'Laboratorio', perm:'sueros' },
        { path:'balance.html',        icon:'balance',    name:'Balance',     perm:'balance' },
        { path:'crm.html',            icon:'crm',        name:'CRM',         perm:null  },
        { path:'consentimiento.html', icon:'legal',      name:'Legal',       perm:'legal' },
        { path:'admin.html',          icon:'admin',      name:'Config',      perm:'admin' },
    ];

    const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    const activeColor = COLORS[currentPath] || '#D0FF4E';

    // ── Styles ──────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        @font-face{font-family:'Borna';src:url('fonts/Borna-Bold.woff2') format('woff2');font-weight:700;font-display:swap;}
        :root{--sb-w:72px;--sb-exp:220px;--sb-font:'Roboto Flex',sans-serif;}
        #snav{
            position:fixed;top:0;left:0;height:100vh;width:var(--sb-w);
            background:#061a16;border-right:1px solid rgba(255,255,255,.04);
            display:flex;flex-direction:column;align-items:stretch;
            padding:0;z-index:9999;
            transition:width .28s cubic-bezier(.16,1,.3,1);
            overflow:hidden;
        }
        #snav:hover{width:var(--sb-exp);box-shadow:8px 0 40px rgba(0,0,0,.6);}
        #snav-logo{
            display:flex;align-items:center;gap:12px;
            padding:22px 0 18px 0;margin:0 14px;
            border-bottom:1px solid rgba(255,255,255,.05);
            flex-shrink:0;overflow:hidden;
            text-decoration:none;
        }
        #snav-logo-mark{
            width:36px;height:36px;border-radius:10px;
            background:rgba(208,255,78,.1);border:1px solid rgba(208,255,78,.2);
            display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }
        #snav-logo-text{
            font-size:15px;font-weight:900;letter-spacing:-.03em;
            color:#fff;white-space:nowrap;opacity:0;
            transition:opacity .15s;font-family:var(--sb-font);
        }
        #snav-logo-text span{color:#D0FF4E;}
        #snav:hover #snav-logo-text{opacity:1;}
        #snav-links{
            flex:1;overflow-y:auto;overflow-x:hidden;
            padding:12px 0;
            scrollbar-width:none;
        }
        #snav-links::-webkit-scrollbar{display:none;}
        .snav-link{
            display:flex;align-items:center;gap:13px;
            padding:11px 14px;margin:2px 8px;border-radius:12px;
            color:rgba(255,255,255,.4);text-decoration:none;
            transition:color .2s,background .2s;
            white-space:nowrap;overflow:hidden;
            position:relative;
        }
        .snav-link:hover{color:rgba(255,255,255,.85);background:rgba(255,255,255,.05);}
        .snav-link.active{color:${activeColor};background:rgba(208,255,78,.06);}
        .snav-link.active svg{stroke:${activeColor};}
        .snav-link.active::before{
            content:'';position:absolute;left:0;top:6px;bottom:6px;
            width:3px;background:${activeColor};border-radius:0 3px 3px 0;
        }
        .snav-icon{width:20px;height:20px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
        .snav-text{
            font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
            font-family:var(--sb-font);opacity:0;transition:opacity .15s .05s;
        }
        #snav:hover .snav-text{opacity:1;}
        #snav-divider{height:1px;background:rgba(255,255,255,.04);margin:6px 18px;}
        body{margin-left:var(--sb-w)!important;padding-left:0!important;transition:margin-left .28s;}
        @media(max-width:768px){
            :root{--sb-w:60px;}
            #snav{width:60px;}
        }
    `;
    document.head.appendChild(style);

    // ── Build sidebar ────────────────────────────────────────────────────
    const nav = document.createElement('nav');
    nav.id = 'snav';

    // Logo mark
    nav.innerHTML = `
        <a id="snav-logo" href="index.html">
            <div id="snav-logo-mark">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <polyline points="12 3 22 19 2 19" stroke="#D0FF4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <line x1="6" y1="13" x2="18" y2="13" stroke="#D0FF4E" stroke-width="2" stroke-linecap="round"/>
                    <path d="M7 16 Q12 20 17 16" stroke="#D0FF4E" stroke-width="2" stroke-linecap="round" fill="none"/>
                </svg>
            </div>
            <span id="snav-logo-text">sanalys<span>.</span></span>
        </a>
        <div id="snav-links"></div>
    `;
    document.body.prepend(nav);

    const linksContainer = nav.querySelector('#snav-links');
    let lastGroup = null;

    routes.forEach((r, i) => {
        if (!ok(r.perm)) return;

        // Divider before admin
        if (r.perm === 'admin' && lastGroup !== 'admin') {
            const div = document.createElement('div');
            div.id = 'snav-divider';
            linksContainer.appendChild(div);
            lastGroup = 'admin';
        }

        const isActive = currentPath === r.path.toLowerCase();
        const a = document.createElement('a');
        a.href = r.path;
        a.className = `snav-link${isActive ? ' active' : ''}`;
        a.innerHTML = `<span class="snav-icon">${ICONS[r.icon] || ''}</span><span class="snav-text">${r.name}</span>`;
        linksContainer.appendChild(a);
    });

    console.log('[Sidebar] Loaded');

    (function(){
        let lastActivity = Date.now();
        // H14: timeout configurable desde Admin (leído de sessionStorage).
        // Si timeoutMin es 0 = "sin timeout" → no activar. Fallback: 30 min.
        const tMin = (SESION && SESION.timeoutMin !== undefined) ? Number(SESION.timeoutMin) : 30;
        if (tMin > 0) {
            const TIMEOUT = tMin * 60 * 1000;
            // M14: avisar antes de expirar. Si el timeout es >= 5 min, avisamos
            // 2 min antes; si es más corto, avisamos cuando queda ~1/3 del tiempo.
            const AVISO_ANTES = TIMEOUT >= 5 * 60 * 1000 ? 2 * 60 * 1000 : Math.floor(TIMEOUT / 3);
            let avisado = false;
            const marcarActividad = () => { lastActivity = Date.now(); avisado = false; };
            // Eventos discretos: actualizan directo (baratos, ocurren poco).
            ['click','keydown','scroll','touchstart'].forEach(evt =>
                document.addEventListener(evt, marcarActividad)
            );
            // mousemove dispara muy seguido → throttle a 1 vez cada 5s para no
            // afectar performance (solo nos importa "hubo movimiento", no cuánto).
            let ultMove = 0;
            document.addEventListener('mousemove', () => {
                const ahora = Date.now();
                if (ahora - ultMove > 5000) { ultMove = ahora; marcarActividad(); }
            });
            setInterval(() => {
                const inactivo = Date.now() - lastActivity;
                // Aviso previo (una sola vez por ciclo de inactividad)
                if (!avisado && inactivo > TIMEOUT - AVISO_ANTES && inactivo < TIMEOUT) {
                    avisado = true;
                    const mins = Math.ceil(AVISO_ANTES / 60000);
                    if (window.toast) {
                        window.toast(`⏰ Tu sesión expira en ${mins} min. Movés el mouse para seguir.`, 'warn');
                    }
                }
                if(inactivo > TIMEOUT) {
                    sessionStorage.removeItem('usuario_sanalys');
                    // ?expired=1 hace que login.html cierre la sesión real de Firebase.
                    window.location.href = 'login.html?expired=1';
                }
            }, 20000);
        }
    })();

})();
// ── TOAST SYSTEM ─────────────────────────────────────────────────────────────
(function() {
    const style = document.createElement('style');
    style.textContent = `
        #toast-container { position:fixed; bottom:24px; right:24px; z-index:99999; display:flex; flex-direction:column-reverse; gap:8px; pointer-events:none; }
        .toast { display:flex; align-items:center; gap:10px; padding:12px 18px; border-radius:12px; font-family:'Roboto Flex',sans-serif; font-size:10px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; pointer-events:all; min-width:220px; max-width:360px; box-shadow:0 8px 32px rgba(0,0,0,.5); animation:toastIn .25s cubic-bezier(.34,1.56,.64,1); }
        .toast.out { animation:toastOut .2s ease forwards; }
        .toast-ok    { background:#D0FF4E; color:#071f1a; }
        .toast-error { background:#ef4444; color:#fff; }
        .toast-warn  { background:#f59e0b; color:#071f1a; }
        .toast-info  { background:rgba(255,255,255,.1); color:#fff; border:1px solid rgba(255,255,255,.2); backdrop-filter:blur(10px); }
        .toast-icon  { font-size:14px; flex-shrink:0; }
        @keyframes toastIn  { from { opacity:0; transform:translateY(12px) scale(.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes toastOut { to   { opacity:0; transform:translateY(8px) scale(.95); } }
    `;
    document.head.appendChild(style);
    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    const icons = { ok:'✓', error:'✕', warn:'⚠', info:'ℹ' };
    window.toast = (msg, tipo = 'ok', duracion = 3000) => {
        const t = document.createElement('div');
        t.className = `toast toast-${tipo}`;
        t.innerHTML = `<span class="toast-icon">${icons[tipo]||'✓'}</span><span>${msg}</span>`;
        container.appendChild(t);
        setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 200); }, duracion);
    };
})();
