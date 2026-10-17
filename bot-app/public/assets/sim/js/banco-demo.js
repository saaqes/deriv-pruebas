/* banco-demo.js — interfaz de "Aurora Demo" (app bancaria FICTICIA de demostración). */
(function () {
  'use strict';
  var D = window.AuroraData, S = D.get();
  var app = document.getElementById('app');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------- Iconos (SVG de trazo) ----------
  var P = {
    home: 'M3 11l9-8 9 8M5 10v10h14V10', card: 'M3 6h18v12H3zM3 10h18M7 15h4', grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', doc: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6', gear: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-2-4-2 1-2-1-1-2h-4l-1 2-2 1-2-1-2 4 2 1v2l-2 1 2 4 2-1 2 1 1 2h4l1-2 2-1 2 1 2-4-2-1z',
    bell: 'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 21h4', help: 'M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9.5a2.5 2.5 0 115 .5c0 1.5-2.5 2-2.5 3.5M12 17v.5', head: 'M4 14v-2a8 8 0 0116 0v2M4 14h3v5H4zM17 14h3v5h-3zM17 19c0 1.5-2 2-5 2',
    out: 'M9 4H5v16h4M16 8l4 4-4 4M20 12H9', user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6', chev: 'M9 5l7 7-7 7', chevD: 'M5 9l7 7 7-7', chevU: 'M5 15l7-7 7 7', back: 'M15 5l-7 7 7 7', x: 'M5 5l14 14M19 5L5 19',
    qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v6h-6v-2M14 18h2', eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z', eyeoff: 'M3 3l18 18M10 6a9 9 0 0112 6 13 13 0 01-3 4M6 8a13 13 0 00-4 4s4 7 10 7a9 9 0 004-1',
    send: 'M21 3L3 11l7 3 3 7zM10 14l4-4', key: 'M14 10a4 4 0 11-3 3l-7 7v-3h3v-3h3l1-1', phone: 'M8 3h8v18H8zM11 18h2', cart: 'M3 4h3l2 11h10l2-8H7M10 20h.01M17 20h.01', plane: 'M3 13l18-9-5 17-4-7zM12 14l-3 5',
    bus: 'M5 4h14v13H5zM5 11h14M8 20v-3M16 20v-3', gift: 'M4 9h16v4H4zM6 13v7h12v-7M12 9v11M12 9c-3 0-4-4-1-4s1 4 1 4zM12 9c3 0 4-4 1-4', plus: 'M12 5v14M5 12h14', lock: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3', shield: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z', star: 'M12 3l2.7 5.8 6.3.7-4.7 4.2 1.3 6.3L12 17l-5.6 3 1.3-6.3L3 9.5l6.3-.7z',
    list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01', finger: 'M7 11a5 5 0 0110 0v2M5 15V11a7 7 0 0114 0v3M9 20c0-3 1-5 3-5v5M15 18c0-2 0-4-3-4M12 11v3', face: 'M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3M9 10v1.5M15 10v1.5M9 15c1.7 1.5 4.3 1.5 6 0M12 10v3',
    info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5v.01', check: 'M5 13l4 4L19 7', bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z', wallet: 'M4 7h15a1 1 0 011 1v11H5a1 1 0 01-1-1zM4 7l12-3v3M16 13h2', store: 'M4 9l1-5h14l1 5M4 9v11h16V9M4 9c0 2 3 2 4 0 1 2 3 2 4 0 1 2 3 2 4 0 1 2 4 2 4 0',
    cash: 'M3 7h18v10H3zM12 14a2 2 0 100-4 2 2 0 000 4z', target: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12h.01', receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6', car: 'M4 14l2-6h12l2 6v4H4zM7 18v2M17 18v2M7 14h.01M17 14h.01', tag: 'M3 12V4h8l10 10-8 8zM7 8h.01', repeat: 'M17 2l3 3-3 3M4 11V9a4 4 0 014-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 01-4 4H4', cal: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', mail: 'M3 6h18v12H3zM3 7l9 7 9-7', trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13', edit: 'M4 20h4L19 9l-4-4L4 16z', copy: 'M8 8h12v12H8zM4 16V4h12'
  };
  function ic(n, s, c, w) { return '<svg width="' + (s || 24) + '" height="' + (s || 24) + '" viewBox="0 0 24 24" fill="none" stroke="' + (c || 'currentColor') + '" stroke-width="' + (w || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + P[n] + '"/></svg>'; }
  var LOGO = function (s) { s = s || 22; return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke-linecap="round" aria-hidden="true"><path d="M3 18a9 9 0 0118 0" stroke="#ffd23f" stroke-width="3"/><path d="M7 18a5 5 0 0110 0" stroke="#ff9f43" stroke-width="3"/><path d="M11 18a1 1 0 012 0" stroke="#fff" stroke-width="3"/></svg>'; };
  var BRAND = '<span class="brand">' + LOGO(24) + 'Aurora<span style="font-weight:500;opacity:.8"> Demo</span></span>';

  // ---------- Estado de interfaz ----------
  var view = null, stack = [], cur = null, logged = false, navEl = null, fabEl = null, hdrShown = 0;
  function saveS() { D.save(); }
  function greet() { var h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; }
  function firstName() { return (S.name || 'Usuario').split(/\s+/)[0]; }

  // ---------- Enrutador ----------
  var R = {};
  function go(name, args, opt) {
    opt = opt || {};
    if (cur && !opt.replace && !opt.tab) stack.push(cur);
    if (opt.tab) stack = [];
    cur = { name: name, args: args || {} };
    paint(opt.dir || (opt.tab ? 'fade' : 'in'));
  }
  function back() { if (!stack.length) return go('home', {}, { tab: true }); cur = stack.pop(); paint('back'); }
  function paint(dir) {
    var def = R[cur.name], old = view;
    var el = document.createElement('div');
    el.className = 'scr ' + (dir === 'up' ? 'enter-up' : dir === 'fade' ? 'fade' : 'enter');
    el.innerHTML = def.render(cur.args);
    app.insertBefore(el, navEl);
    if (old) { old.classList.add('leave'); setTimeout(function () { old.remove(); }, 260); }
    view = el;
    var showNav = !!def.nav && logged;
    navEl.style.display = showNav ? 'flex' : 'none';
    fabEl.style.display = def.fab && logged ? 'grid' : 'none';
    if (showNav) [].forEach.call(navEl.children, function (b) { b.classList.toggle('on', b.dataset.tab === def.nav); });
    var body = $('.body', el); if (body && def.nav === undefined) body.classList.add('nonav'); else if (body && !showNav) body.classList.add('nonav');
    if (def.after) def.after(el, cur.args);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go],[data-act],[data-back]'); if (!t || !app.contains(t)) return;
    if (t.dataset.back != null) return back();
    if (t.dataset.go) { var a = {}; try { a = t.dataset.args ? JSON.parse(t.dataset.args) : {}; } catch (_) { /* sin args */ } return go(t.dataset.go, a, { tab: t.dataset.tab != null, dir: t.dataset.dir }); }
    if (t.dataset.act && ACT[t.dataset.act]) ACT[t.dataset.act](t, e);
  });
  function G(name, args, extra) { return 'data-go="' + name + '"' + (args ? " data-args='" + esc(JSON.stringify(args)).replace(/'/g, '&#39;') + "'" : '') + (extra || ''); }

  // ---------- Helpers de UI ----------
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; app.appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
  function modal(html) { var o = document.createElement('div'); o.className = 'ovl'; o.innerHTML = '<div class="dlg">' + html + '</div>'; app.appendChild(o); o.addEventListener('click', function (e) { if (e.target === o) o.remove(); }); return o; }
  function loading(ms, fn) { var l = document.createElement('div'); l.className = 'loading'; l.innerHTML = '<div class="bx"><div class="spin" style="width:34px;height:34px"></div>Cargando</div>'; app.appendChild(l); setTimeout(function () { l.remove(); fn && fn(); }, ms); }
  function arc(small) {
    return '<div class="arc' + (small ? ' small' : '') + '"><svg viewBox="0 0 430 130" preserveAspectRatio="none"><path d="M-10 20 Q215 160 440 10" stroke="#ffd23f"/><path d="M-10 40 Q215 170 440 28" stroke="#4cc9f0" transform="translate(0,6)"/><path d="M20 70 Q230 190 440 50" stroke="#ff9f43" transform="translate(30,0)"/><path d="M-10 60 Q215 150 440 70" stroke="#b66dff" opacity=".8"/><path d="M60 100 Q240 170 440 30" stroke="#4fe0a0" opacity=".7"/></svg></div>';
  }
  function head(opts) {
    opts = opts || {};
    return '<div class="hdr">' + BRAND +
      '<button class="ib" ' + G('notifs') + ' aria-label="Notificaciones">' + ic('bell', 26) + (unread() ? '<span class="dot">' + unread() + '</span>' : '') + '</button>' +
      '<button class="ib" ' + G('feat', { t: 'Ayuda', i: 'help' }) + ' aria-label="Ayuda">' + ic('help', 26) + '</button>' +
      '<button class="ib" ' + G('feat', { t: 'Asesor', i: 'head' }) + ' aria-label="Asesor">' + ic('head', 26) + '</button>' +
      (logged ? '<button class="ib" data-act="logout" aria-label="Cerrar sesión">' + ic('out', 26) + '</button>' : '') + '</div>';
  }
  function sub(left, right, extra) {
    return '<div class="sub"><button class="l" data-back>' + ic(left === 'Cerrar' ? 'x' : 'back', 20) + left + '</button><div class="mid">' + LOGO(30) + '</div>' + (right || '<span class="r"></span>') + '</div>' + (extra || '');
  }
  function unread() { return S.notifications.filter(function (n) { return !n.read; }).length; }
  var money = function (n) { return D.money(n); };
  function balTxt() { return S.hide ? '$ ••••••' : money(S.balance); }

  // ---------- Pantallas: arranque ----------
  R.splash = {
    nav: null, render: function () {
      return '<div class="splash" id="spl" style="position:absolute;inset:0;display:flex;z-index:100"><svg class="arcs" viewBox="0 0 430 900" preserveAspectRatio="none"><path d="M-20 90 Q80 120 70 20" stroke="#ff9f43"/><path d="M-20 140 Q70 150 150 90" stroke="#4cc9f0"/><path d="M450 520 Q380 640 440 780" stroke="#ffd23f"/></svg><div class="logo">' + LOGO(34) + '<span>Aurora<span style="font-weight:500;opacity:.8"> Demo</span></span></div><div class="pct" id="spct">0%</div></div>';
    },
    after: function (el) {
      var s = $('#spl', el), p = $('#spct', el); s.classList.remove('dark'); s.style.background = '#fff';
      setTimeout(function () {
        s.classList.add('dark'); s.style.background = '';
        var t0 = performance.now(), dur = 2300;
        (function tick(t) { var k = Math.min(1, (t - t0) / dur); p.textContent = Math.round(100 * (1 - Math.pow(1 - k, 2.2))) + '%'; if (k < 1) requestAnimationFrame(tick); else setTimeout(function () { go('home', { boot: true }, { tab: true }); }, 250); })(t0);
      }, 650);
    }
  };

  R.home = {
    nav: 'home', fab: true, render: function (a) {
      if (!logged) {
        return head() + '<div class="body nonav"><div class="hello" style="font-size:24px">' + greet() + '</div>' +
          (a.boot ? '<div class="skel" style="margin:14px 18px;height:40px;width:130px" id="sk1"></div><div class="skel" style="margin:20px 18px;height:56px"></div><div class="skel" style="margin:20px 18px;height:110px"></div>' : '') +
          '<button class="guest-pill" ' + G('login', null, ' id="gp"') + (a.boot ? ' style="display:none"' : '') + '>Iniciar sesión ' + ic('chev', 14) + '</button>' + arc(true) +
          '<button class="key" data-act="keyinfo"><span class="ring" id="kring"><i>' + ic('lock', 14) + '</i></span><span><small>Clave demo</small><b id="kcode">------</b></span>' + ic('chev', 16) + '</button>' +
          '<div class="sec"><h3>Transacciones principales</h3>' + tiles() + '</div><div class="sec"><h3>Más opciones</h3>' + circles() + '</div></div>';
      }
      return head() + arc() + '<div class="body" id="hb"><button class="hello" ' + G('ajustes', null, ' data-tab') + '>Hola, ' + esc(firstName()) + ' ' + ic('chev', 18) + '</button>' +
        '<button class="key" data-act="keyinfo"><span class="ring" id="kring"><i>' + ic('lock', 14) + '</i></span><span><small>Clave demo</small><b id="kcode">------</b></span>' + ic('chev', 16) + '</button>' +
        '<div class="sec" style="margin-top:56px"><h3>Tus cuentas<a data-act="hide">' + ic(S.hide ? 'eyeoff' : 'eye', 15) + (S.hide ? 'Mostrar saldos' : 'Ocultar saldos') + '</a></h3>' +
        '<div class="hscroll" id="accs"><div class="acc-card" ' + G('cuenta') + '><span class="chev">' + ic('chev', 18) + '</span><h4>Cuenta de Ahorros</h4><small>Ahorros 000 - 000000 - 00 (demo)</small><div class="bal">Saldo disponible<b id="hbal">' + balTxt() + '</b></div><button class="btn-acc" ' + G('cuenta', { tab: 'Detalles' }) + '>Conoce más de tu cuenta</button></div>' +
        '<div class="acc-card slim" ' + G('saldos') + '>' + ic('card', 26) + '<span>Ir a todos tus productos</span></div></div><div class="dots" id="dots"><i class="on"></i><i></i></div></div>' +
        '<div class="sec"><h3>Transacciones principales</h3>' + tiles() + '</div>' +
        '<div class="sec"><h3>Más opciones</h3>' + circles() + '</div>' +
        '<div class="sec"><h3>Ofertas para ti</h3><div class="hscroll">' + offers() + '</div></div>' +
        '<div class="sec"><h3>Te recomendamos</h3><div class="hscroll">' + recos() + '</div></div>' +
        '<div class="note w" style="margin-top:28px">' + ic('info', 20) + '<span>Aurora Demo es una aplicación ficticia de demostración. Los saldos, movimientos y comprobantes no son reales ni verificados por ningún banco.</span></div></div>';
    },
    after: function (el, a) {
      if (!logged) {
        keyTick(el);
        if (a.boot) setTimeout(function () { var g = $('#gp', el); if (!g) return; el.querySelectorAll('.skel').forEach(function (k) { k.style.transition = 'opacity .4s'; k.style.opacity = 0; setTimeout(function () { k.remove(); }, 400); }); g.style.display = 'block'; g.classList.add('fade'); }, 1100);
        return;
      }
      var acc = $('#accs', el), dots = $('#dots', el).children;
      acc.addEventListener('scroll', function () { var i = acc.scrollLeft > 40 ? 1 : 0; dots[0].classList.toggle('on', !i); dots[1].classList.toggle('on', !!i); });
      keyTick(el);
      if (!S.keyShown) setTimeout(function () { if (cur.name !== 'home') return; S.keyShown = true; saveS(); var m = modal('<div style="font-size:34px;letter-spacing:4px;color:var(--acc)">***</div><h4>¡Pilas! La clave dinámica es solo tuya</h4><p>Nunca la compartas con nadie. En esta app de demostración es solo un ejemplo visual.</p><button class="btn p" data-act="close">Entendido</button>'); }, 900);
    }
  };
  var keyTimer = null;
  function keyTick(el) {
    clearInterval(keyTimer);
    function f() {
      var c = $('#kcode', el); if (!c || !document.body.contains(c)) return clearInterval(keyTimer);
      var w = Math.floor(Date.now() / 30000), x = (w * 2654435761) % 1000000; var s = String(Math.abs(x)).padStart(6, '0'); c.textContent = s.slice(0, 3) + ' ' + s.slice(3);
      $('#kring', el).style.setProperty('--p', (100 - ((Date.now() % 30000) / 300)) + '%');
    }
    f(); keyTimer = setInterval(f, 500);
  }
  function tiles() {
    var t = [['Ver saldos y movimientos', 'list', G('saldos')], ['Tus llaves', 'key', G('feat', { t: 'Tus llaves', i: 'key' })], ['Transferir plata', 'send', G('transfer')], ['Pagar tarjetas y créditos', 'card', G('feat', { t: 'Pagar tarjetas y créditos', i: 'card' })], ['Pagar facturas', 'receipt', G('feat', { t: 'Pagar facturas', i: 'receipt' })], ['Ver todas', 'grid', G('trans', null, ' data-tab')]];
    return '<div class="tiles">' + t.map(function (x) { return '<button class="tile" ' + x[2] + '>' + ic(x[1], 28) + x[0] + '</button>'; }).join('') + '</div>';
  }
  var CIRC = [['Sucursal virtual', 'phone', '#f3c5e9', '#6a2a5e'], ['Organiza tu plata', 'target', '#c9a8ff', '#3a1d6e'], ['Hogar y servicios', 'home', '#7fe3c0', '#0e4a37'], ['Transporte', 'bus', '#ffd23f', '#5a4300'], ['Beneficios y compras', 'gift', '#ff9f8a', '#611b0c'], ['Trámites y solicitudes', 'doc', '#9fd8ff', '#0e3a5e']];
  function circles() { return '<div class="circles">' + CIRC.map(function (c) { return '<button class="circ" ' + (c[0].indexOf('Trámites') === 0 ? G('tram', null, ' data-tab') : c[0].indexOf('Organiza') === 0 || c[0].indexOf('Hogar') === 0 || c[0].indexOf('Transporte') === 0 || c[0].indexOf('Benef') === 0 ? G('explore', null, ' data-tab') : G('feat', { t: c[0], i: c[1] })) + '><i style="background:' + c[2] + ';color:' + c[3] + '">' + ic(c[1], 28) + '</i>' + c[0] + '</button>'; }).join('') + '</div>'; }
  function offers() {
    var o = [['linear-gradient(135deg,#ffb36b,#ff6f91 55%,#6a82fb)', 'Viajes y hospedaje', '¡Viaja en Hot Days!', 'Descuentos en vuelos y hoteles al pagar con tus tarjetas (oferta ficticia).', 'Válido hasta: 31 Oct 2026'], ['linear-gradient(135deg,#4cc9f0,#4fe0a0)', 'Compras', 'Viaja y paga con 0% de interés', 'Paga hasta en 4 cuotas con tu cuenta (oferta ficticia).', 'Válido hasta: 30 Nov 2026'], ['linear-gradient(135deg,#7f5af0,#2cb67d)', 'Seguridad', 'Alarma para tu hogar', '15% de descuento en la mensualidad (oferta ficticia).', 'Válido hasta: 30 Dic 2026']];
    return o.map(function (x) { return '<button class="ofr" ' + G('feat', { t: x[2], i: 'tag', d: x[3] }) + '><div class="img" style="background:' + x[0] + '"></div><div class="tx"><small>' + x[1] + '</small><b>' + x[2] + '</b>' + x[3] + '<br><small>' + ic('cal', 12) + ' ' + x[4] + '</small></div></button>'; }).join('');
  }
  function recos() {
    return [['#c9a8ff', '15% de descuento en tu primera compra', 'Descubre más'], ['#ffd23f', '¿Quieres que tu plata rinda más?', 'Publicidad'], ['#7fe3d0', 'Mueve tu plata entre bolsillos', 'Hazlo ahora']].map(function (r) { return '<button class="reco" style="background:' + r[0] + '" ' + G('feat', { t: r[1], i: 'star' }) + '><b>' + r[1] + '</b><span>' + r[2] + ' ' + ic('chev', 11) + '</span></button>'; }).join('');
  }

  // ---------- Login ----------
  function bioMeta() { return S.face === 'finger' ? { i: 'finger', t: 'Ingresa con huella' } : { i: 'face', t: 'Ingresa con detector facial' }; }
  R.login = {
    nav: null, render: function () {
      var b = bioMeta();
      return sub('Cerrar', '<button class="r" id="lcont" disabled style="opacity:.5">Continuar ' + ic('chev', 16) + '</button>') +
        '<div class="body nonav"><div class="ttlc" style="font-size:24px;padding-top:6px">¡Hola!</div>' +
        '<div class="field" style="margin-top:18px"><label class="inp">' + ic('user', 22) + '<input id="lusr" autocomplete="off" autocapitalize="off" placeholder="Ingresa tu usuario" maxlength="30" value="' + esc(S.user) + '"></label></div>' +
        '<button class="btn p" id="lbtn" disabled>Continuar</button>' +
        '<a class="linkc" data-act="forgot">¿Olvidaste tu usuario o clave?</a>' +
        '<div class="valley"><svg viewBox="0 0 430 300" preserveAspectRatio="none" aria-hidden="true"><path class="v1" d="M-20 40 Q110 60 205 160" stroke="#ffd23f" stroke-width="13"/><path class="v2" d="M-10 78 Q100 150 205 178" stroke="#b66dff" stroke-width="22"/><path class="v3" d="M205 178 Q310 160 372 62" stroke="#ff9f43" stroke-width="22"/><path class="v4" d="M262 150 Q350 118 450 6" stroke="#ffd23f" stroke-width="13"/></svg>' + '<button class="bio" data-act="bio">' + ic(b.i, 36, '#fff', 1.4) + '<span>' + b.t + '</span></button>' + '</div>' +
        '<a class="linkc" style="margin-top:34px" data-act="noacct">¿Aún no tienes usuario o cuenta?</a>' +
        '<div class="note w">' + ic('info', 20) + '<span>Modo demostración: escribe cualquier alias. <b>No ingreses usuarios ni claves reales</b>; no se envía ni se guarda ninguna clave.</span></div></div>';
    },
    after: function (el) {
      var i = $('#lusr', el), b = $('#lbtn', el), c = $('#lcont', el);
      function chk() { var ok = i.value.trim().length >= 2; b.disabled = !ok; c.disabled = !ok; c.style.opacity = ok ? 1 : .5; }
      i.addEventListener('input', chk); chk();
      function ok() { S.user = i.value.trim(); enter(); }
      b.addEventListener('click', ok); c.addEventListener('click', function () { if (!c.disabled) ok(); });
      i.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !b.disabled) ok(); });
      if (S.credId) setTimeout(function () { if (cur.name === 'login') bioLogin(true); }, 500);
    }
  };
  function enter() {
    loading(1500, function () { logged = true; S.lastLogin = Date.now(); saveS(); stack = []; go('home', {}, { tab: true }); });
  }
  // ---- Biometría real (WebAuthn): solo comprobación local en el dispositivo ----
  var b64 = function (buf) { return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))); };
  var unb64 = function (s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); };
  function wa() { return !!(window.PublicKeyCredential && navigator.credentials && window.isSecureContext); }
  function bioLogin(auto) {
    if (!S.credId) { if (!auto) toast('Aún no activaste este método. Entra con tu alias y actívalo en Ajustes > Aspecto.'); return; }
    if (!wa()) { toast('Este navegador o dispositivo no admite biometría web. Usa tu alias.'); return; }
    navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), allowCredentials: [{ type: 'public-key', id: unb64(S.credId) }], userVerification: 'required', timeout: 60000 } })
      .then(function () { D.log('auth', 'Verificación del dispositivo correcta'); S.user = S.user || 'demo'; enter(); })
      .catch(function (e) { D.log('auth-error', e && e.name); if (!auto) toast('No se pudo verificar en el dispositivo. Usa tu alias.'); });
  }
  function bioRegister() {
    var box = $('#bmsg'); function say(t) { if (box) box.textContent = t; }
    if (!wa()) { say('Tu navegador o dispositivo no admite WebAuthn/passkeys (se requiere HTTPS). Puedes seguir usando tu alias.'); return; }
    navigator.credentials.create({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), rp: { name: 'Aurora Demo' }, user: { id: crypto.getRandomValues(new Uint8Array(16)), name: 'demo', displayName: 'Usuario Demo' }, pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }], authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' }, timeout: 60000 } })
      .then(function (c) { S.credId = b64(c.rawId); saveS(); D.log('auth', 'Passkey local registrada'); say('Activado: se pedirá la verificación de tu dispositivo (rostro, huella o PIN, según tu equipo).'); toast('Acceso con el dispositivo activado'); })
      .catch(function (e) { D.log('auth-error', e && e.name); say('No se pudo activar (' + (e && e.name || 'error') + '). Puedes intentarlo de nuevo o usar tu alias.'); });
  }

  // ---------- Pestañas principales ----------
  function gridScr(title, sections, tab, hdr) {
    return sub('', '') .replace('<button class="l" data-back>' + ic('back', 20) + '</button>', '<span class="l"></span>') + '<div class="ttlc">' + title + '</div><div class="body">' + sections + '</div>';
  }
  function gi(t, i, bg, fg, args, round, nw) { return '<button class="gi' + (round ? ' round' : '') + '" ' + (args || G('feat', { t: t, i: i })) + '>' + (nw ? '<span class="new">Nuevo</span>' : '') + '<i style="background:' + bg + ';color:' + fg + '">' + ic(i, 26) + '</i>' + t + '</button>'; }
  var N = ['var(--card)', '#fff'];
  R.trans = {
    nav: 'trans', render: function () {
      var a = [['Ver saldos y movimientos', 'list', G('saldos')], ['Tus llaves', 'key'], ['Transferir plata', 'send', G('transfer')], ['Enviar regalo', 'gift'], ['Inscribir productos', 'plus'], ['Recibir plata', 'cash'], ['Pagar facturas', 'receipt'], ['Pagar tarjetas y créditos', 'card'], ['Recargar', 'phone'], ['Avances y desembolsos', 'wallet'], ['Enviar plata al exterior', 'plane'], ['Agregar tarjeta a billetera', 'card']];
      return gridScr('Transacciones', '<div class="grid3" style="padding-top:12px">' + a.map(function (x) { return gi(x[0], x[1], N[0], N[1], x[2]); }).join('') + '</div>');
    }
  };
  R.explore = {
    nav: 'explore', render: function () {
      return gridScr('Explorar', '<div class="subt b">Organiza tu plata</div><div class="grid3" style="padding-top:6px">' + gi('Día a Día', 'cal', '#c9a8ff', '#3a1d6e', 0, 1) + gi('Bolsillos', 'wallet', '#c9a8ff', '#3a1d6e', 0, 1) + '</div><div class="hr"></div><div class="subt b">Hogar y servicios</div><div class="grid3" style="padding-top:6px">' + gi('Recargar celular', 'phone', '#7fe3c0', '#0e4a37', 0, 1) + gi('Tu inmobiliaria', 'home', '#7fe3c0', '#0e4a37', 0, 1) + '</div><div class="hr"></div><div class="subt b">Transporte</div><div class="grid3" style="padding-top:6px">' + gi('Recargar transporte', 'bus', '#ffd23f', '#5a4300', 0, 1) + gi('Movilidad', 'car', '#ffd23f', '#5a4300', 0, 1) + gi('Servicios del vehículo', 'car', '#ffd23f', '#5a4300', 0, 1) + '</div><div class="hr"></div><div class="subt b">Beneficios y compras</div><div class="grid3" style="padding-top:6px">' + gi('Puntos', 'star', '#ff9f8a', '#611b0c', 0, 1) + gi('Ofertas', 'tag', '#ff9f8a', '#611b0c', 0, 1) + gi('Viajes', 'plane', '#ff9f8a', '#611b0c', 0, 1) + '</div>');
    }
  };
  R.tram = {
    nav: 'tram', render: function () {
      var a = ['Trámites', ['Notificaciones', 'bell', G('notifs')], ['Agendar turno', 'cal'], ['Solicitar documentos', 'doc'], ['Seguimiento y estado', 'list']];
      var b = [['Abrir cuentas', 'wallet'], ['Tarjetas de crédito', 'card'], ['Créditos', 'cash'], ['Inversiones', 'target'], ['Comprar seguros', 'shield'], ['Seguros', 'lock']];
      return gridScr('Trámites y solicitudes', '<div class="subt b">Trámites</div><div class="grid3">' + a.slice(1).map(function (x) { return gi(x[0], x[1], N[0], N[1], x[2]); }).join('') + '</div><div class="hr"></div><div class="subt b">Solicitud de productos</div><div class="grid3">' + b.map(function (x) { return gi(x[0], x[1], N[0], N[1]); }).join('') + '</div>');
    }
  };
  R.ajustes = {
    nav: 'aj', render: function () {
      var t = [['Tu usuario', 'user', G('usuario')], ['Seguridad', 'shield', G('seguridad')], ['Productos y servicios', 'card', 0, 1], ['Preferencias de pantalla', 'gear', G('aspecto')], ['Protección de datos', 'lock'], ['Términos y condiciones', 'doc'], ['Califica nuestra app', 'star'], ['Editar saldo (demo)', 'edit', G('admin')]];
      return gridScr('Ajustes', '<div style="text-align:center;padding:0 20px 14px"><b style="font-size:17px">' + esc(S.name) + '</b><div style="font-size:12px;color:var(--mut);margin-top:4px">' + (S.lastLogin ? 'Último ingreso: ' + D.fdate(S.lastLogin) + ', ' + D.ftime(S.lastLogin) : 'Primer ingreso') + '</div></div><div class="grid3">' + t.map(function (x) { return gi(x[0], x[1], N[0], N[1], x[2], 0, x[3]); }).join('') + '</div><button class="btn o" style="margin-top:34px" data-act="logout">Cerrar sesión</button>');
    }
  };
  R.feat = {
    nav: undefined, render: function (a) {
      return sub('Volver', '') + '<div class="body nonav"><div class="ttl">' + esc(a.t || 'Función') + '</div><div style="display:grid;place-items:center;margin:30px 0 14px"><i style="width:84px;height:84px;border-radius:50%;background:var(--card);display:grid;place-items:center">' + ic(a.i || 'info', 38) + '</i></div><div class="note">' + ic('info', 20) + '<span>' + esc(a.d || 'Esta función no está disponible en la versión de demostración. Aquí solo funcionan: cuenta, movimientos, comprobantes de prueba, notificaciones, transferencia demo y ajustes.') + '</span></div><button class="btn p" data-back>Volver</button></div>';
    }
  };

  // ---------- Saldos, cuenta y movimientos ----------
  R.saldos = {
    nav: 'home', render: function () {
      return sub('Volver', '') + '<div class="ttl"><small>Transacciones</small>Saldos y movimientos</div><div class="body"><button class="row hd" data-act="tg" data-t="s1">' + ic('wallet', 20) + '<span class="g">Cuentas</span>' + ic('chevU', 18) + '</button><div id="s1" style="margin:0 18px"><div class="acc-card" style="width:100%"><h4 style="font-size:15px">Cuenta de Ahorros</h4><small>Ahorros 000 - 000000 - 00 (demo)</small><div style="margin-top:8px;font-size:12px;color:var(--mut)">Saldo disponible<b style="display:block;color:#fff;font-size:20px" class="bv">' + balTxt() + '</b></div><button class="btn" style="margin:12px 0 0;width:100%;background:var(--card2);padding:9px;font-size:13px" ' + G('cuenta') + '>Detalles y movimientos ' + ic('chev', 12) + '</button></div></div><button class="row hd" ' + G('feat', { t: 'Tarjeta Débito Virtual', i: 'card' }) + '>' + ic('card', 20) + '<span class="g">Tarjeta Débito Virtual</span>' + ic('chevD', 18) + '</button></div>';
    }
  };
  var tabSel = 'Movimientos', filt = 'Todos';
  R.cuenta = {
    nav: 'home', render: function (a) {
      if (a && a.tab) { tabSel = a.tab; a.tab = null; }
      var h = sub('Volver', '') + '<div class="ttl" style="padding-bottom:0">Cuenta de Ahorros</div><div style="display:flex;justify-content:space-between;padding:4px 20px 12px;font-size:12px;color:var(--mut)"><span>Número de cuenta<br><b style="color:#fff;font-size:13px">000 - 000000 - 00 (demo)</b></span><span style="text-align:right">Saldo disponible<br><b style="color:#fff;font-size:15px">' + balTxt() + '</b> <a data-act="hide" style="cursor:pointer">' + ic(S.hide ? 'eyeoff' : 'eye', 14) + '</a></span></div>' +
        '<div class="tabs"><button data-act="tab" data-t="Detalles" class="' + (tabSel === 'Detalles' ? 'on' : '') + '">Detalles</button><button data-act="tab" data-t="Movimientos" class="' + (tabSel === 'Movimientos' ? 'on' : '') + '">Movimientos</button></div><div class="body">';
      if (tabSel === 'Detalles') {
        var tot = S.balance + S.pockets;
        return h + '<div class="plan"><i>' + ic('star', 22) + '</i><span class="g"><small>Este es tu plan</small><b>Plan Demo</b><small>$ 0 /mes</small></span>' + ic('chev', 16) + '</div><div class="sumbox"><div class="kv2"><span>Saldo en bolsillos ' + ic('info', 14) + '</span><b>' + mhtml(S.pockets) + '</b></div><div class="kv2"><span>Cobros en proceso ' + ic('info', 14) + '</span><b>' + mhtml(S.processing) + '</b></div><div class="kv2"><span>Saldo en canje ' + ic('info', 14) + '</span><b>' + mhtml(S.onhold) + '</b></div><div class="kv2 tot"><span>Saldo total</span><b>' + mhtml(tot) + '</b></div></div><div class="subt">Tarjetas que tienes con esta cuenta</div><div class="note w" style="margin-top:20px">' + ic('info', 20) + '<span>Datos de demostración editables por un administrador. No son un saldo verificado de ningún banco.</span></div></div>' + actbar();
      }
      var list = allMov().filter(function (m) { return filt === 'Todos' || (filt === 'Ingresos' && (m.amount || 0) >= 0 && m.status !== 'Pendiente') || (filt === 'Egresos' && m.amount < 0) || (filt === 'Pendientes' && m.status === 'Pendiente'); });
      return h + '<button class="row" ' + G('comprob') + '>' + ic('receipt', 20) + '<span class="g" style="font-size:13px">Consultar comprobantes (demo)</span>' + ic('chev', 16) + '</button><div class="filters">' + ['Todos', 'Ingresos', 'Egresos', 'Pendientes'].map(function (f) { return '<button data-act="filt" data-t="' + f + '" class="' + (filt === f ? 'on' : '') + '">' + f + '</button>'; }).join('') + '</div>' + (list.length ? list.map(mvRow).join('') : '<div style="text-align:center;color:var(--mut);padding:40px">Sin movimientos para este filtro.</div>') + '</div>' + actbar();
    }
  };
  function actbar() { return '<div class="actbar"><button ' + G('transfer') + '>' + ic('send', 26) + 'Transferir plata</button><button ' + G('feat', { t: 'Ir a Día a Día', i: 'cash' }) + '>' + ic('cash', 26) + 'Ir a Día a Día</button><button ' + G('feat', { t: 'Bolsillos', i: 'wallet' }) + '>' + ic('wallet', 26) + 'Bolsillos</button></div>'; }
  function allMov() { return S.movements.slice().sort(function (a, b) { return b.date - a.date; }); }
  function mhtml(n) { var neg = n < 0, p = Math.abs(n).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(','); return (neg ? '-' : '') + '$ ' + p[0] + '<small>,' + p[1] + '</small>'; }
  function amtTxt(m) { return m.amount == null ? (m.usd != null ? '<span class="cop">USD</span> ' + D.money(m.usd).replace('$ ', '').replace('USD ', '') + '<small> · COP pendiente</small>' : '—') : '<span class="cop">COP</span> <span class="' + (m.amount < 0 ? 'neg' : 'pos') + '">' + mhtml(m.amount) + '</span>'; }
  function chip(s) { return '<span class="chip ' + (s === 'Completado' ? 'ok' : s === 'Pendiente' ? 'pend' : 'fail') + '">' + esc(s) + '</span>'; }
  function mvRow(m) { return '<button class="mv" ' + G('mov', { id: m.id }) + '><div class="dt">' + D.fdate(m.date) + (m.status !== 'Completado' ? chip(m.status) : '') + '</div><div class="ds">' + esc(m.desc) + '</div><div class="am">' + amtTxt(m) + '</div></button>'; }
  function findMov(id) { return S.movements.filter(function (m) { return m.id === id; })[0]; }
  R.mov = {
    nav: undefined, render: function (a) {
      var m = findMov(a.id); if (!m) return sub('Volver', '') + '<div class="body nonav"><div class="ttl">Movimiento no encontrado</div></div>';
      var kv = function (k, v) { return v ? '<div class="kv"><span>' + k + '</span><span>' + v + '</span></div>' : ''; };
      return sub('Volver', '') + '<div class="ttl"><small>Detalle del movimiento</small>' + esc(m.desc) + '</div><div class="body nonav"><div style="padding:6px 20px 14px;font-size:26px;font-weight:700">' + (m.amount == null ? D.money(m.usd, 'USD') : '<span class="' + (m.amount < 0 ? 'neg' : 'pos') + '">' + mhtml(m.amount) + '</span>') + '</div>' +
        kv('Estado', chip(m.status)) + kv('Tipo de operación', esc(m.type)) + kv('Moneda', m.amount == null ? 'USD → COP' : 'COP') +
        (m.usd != null ? kv('Importe original (USD)', D.money(m.usd, 'USD')) : '') + kv('Importe abonado (COP)', m.amount == null ? 'Pendiente de confirmación' : money(m.amount)) +
        kv('Tipo de cambio aplicado', m.fx ? esc(m.fx) : (m.usd != null ? 'No disponible' : '')) + kv('Comisiones', m.fee != null ? money(m.fee) : (m.usd != null ? 'No disponible' : '')) +
        kv('Fecha y hora', D.fdate(m.date) + ', ' + D.ftime(m.date)) + kv('Fecha de solicitud', m.requestedAt ? D.fdate(m.requestedAt) + ', ' + D.ftime(m.requestedAt) : '') + kv('Fecha de procesamiento', m.processedAt ? D.fdate(m.processedAt) + ', ' + D.ftime(m.processedAt) : (m.requestedAt ? 'Pendiente' : '')) + kv('Fecha de confirmación del abono', m.requestedAt ? (m.confirmedAt ? D.fdate(m.confirmedAt) : 'Sin confirmación verificable') : '') +
        kv('Origen / destino', esc(m.counter)) + kv('Identificador', esc(m.ref)) + kv('Fuente', m.source === 'deriv-sim' ? 'Simulador de retiros (no es la API de Deriv)' : m.source === 'user-demo' ? 'Transferencia de demostración' : 'Dato de demostración') + (m.stateText ? kv('Estado reportado', esc(m.stateText)) : '') +
        '<div class="note w">' + ic('info', 20) + '<span>Movimiento de demostración. Un movimiento solo se consideraría confirmado con evidencia de una fuente autorizada; aquí no existe esa conexión.</span></div><button class="btn p" ' + G('recibo', { id: m.id }) + '>Ver comprobante de prueba</button></div>';
    }
  };
  R.comprob = {
    nav: undefined, render: function () {
      return sub('Volver', '') + '<div class="ttl"><small>Cuenta de Ahorros</small>Comprobantes (demo)</div><div class="body nonav">' + allMov().map(function (m) { return '<button class="row" ' + G('recibo', { id: m.id }) + '>' + ic('receipt', 20) + '<span class="g">' + esc(m.desc) + '<small>' + D.fdate(m.date) + ' · ' + (m.amount == null ? 'COP pendiente' : money(m.amount)) + '</small></span>' + ic('chev', 16) + '</button>'; }).join('') + '</div>';
    }
  };
  R.recibo = {
    nav: undefined, render: function (a) {
      var m = findMov(a.id); if (!m) return sub('Volver', '') + '<div class="body"></div>';
      var k = function (x, y) { return '<div class="kv"><span>' + x + '</span><span>' + y + '</span></div>'; };
      return sub('Volver', '') + '<div class="body nonav"><div class="rcpt"><h4>Comprobante de PRUEBA</h4><div class="warn">DEMOSTRACIÓN — sin validez bancaria ni legal</div>' + k('Descripción', esc(m.desc)) + k('Importe', m.amount == null ? (m.usd != null ? D.money(m.usd, 'USD') + ' (COP pendiente)' : '—') : money(m.amount) + ' COP') + k('Estado', esc(m.status)) + k('Fecha', D.fdate(m.date) + ' ' + D.ftime(m.date)) + k('Tipo', esc(m.type)) + k('Origen/destino', esc(m.counter || '—')) + k('Id. de prueba', esc(m.ref)) + '</div><div class="note w">' + ic('info', 20) + '<span>Este documento lo genera la app de demostración y no corresponde a ninguna operación bancaria real. No debe presentarse como prueba de pago.</span></div><button class="btn o" data-back>Cerrar</button></div>';
    }
  };

  // ---------- Transferencia demo ----------
  R.transfer = {
    nav: undefined, render: function () {
      return sub('Cerrar', '') + '<div class="ttl">Transferir plata <span class="chip">DEMO</span></div><div class="body nonav"><div class="field"><p class="lbl">Destino (alias de prueba)</p><label class="inp"><input id="td" placeholder="Ej. Cuenta de prueba" maxlength="40"></label><p class="lbl" style="margin-top:14px">Valor en COP</p><label class="inp"><input id="tv" inputmode="decimal" placeholder="0,00"></label><div class="err" id="te"></div></div><div class="note w">' + ic('info', 20) + '<span>Solo registra un movimiento de demostración y descuenta el saldo de demostración. No mueve dinero real.</span></div><button class="btn p" id="tb">Confirmar transferencia demo</button></div>';
    },
    after: function (el) {
      $('#tb', el).addEventListener('click', function () {
        var d = $('#td', el).value.trim(), v = parseFloat(($('#tv', el).value || '').replace(/\./g, '').replace(',', '.')), e = $('#te', el);
        if (d.length < 2) return e.textContent = 'Escribe un destino de prueba.';
        if (!(v > 0)) return e.textContent = 'Ingresa un valor válido.';
        if (v > S.balance) return e.textContent = 'El valor supera el saldo de demostración.';
        var now = Date.now(); S.balance = Math.round((S.balance - v) * 100) / 100;
        S.movements.unshift({ id: D.uid('t'), desc: 'TRANSFERENCIA DEMO A ' + d.toUpperCase(), amount: -v, date: now, type: 'Transferencia enviada', status: 'Completado', counter: d, ref: 'DEMO-' + now.toString(16).slice(-6).toUpperCase(), source: 'user-demo' });
        S.notifications.unshift({ id: D.uid('n'), title: 'Transferencia de demostración', body: 'Enviaste ' + money(v) + ' a ' + d + ' (simulado).', ts: now, read: false });
        D.log('demo', 'Transferencia demo'); saveS(); toast('Transferencia demo registrada'); back();
      });
    }
  };

  // ---------- Notificaciones ----------
  R.notifs = {
    nav: undefined, render: function () {
      var n = S.notifications.slice().sort(function (a, b) { return b.ts - a.ts; });
      return sub('Volver', '<button class="r on" data-act="readall">Leer todo</button>') + '<div class="ttl">Notificaciones</div><div class="body nonav">' + (n.length ? n.map(function (x) { return '<button class="nt ' + (x.read ? '' : 'unread') + '" data-act="notif" data-id="' + x.id + '"><span class="ic">' + ic('bell', 18) + '</span><span><b>' + esc(x.title) + '</b><p>' + esc(x.body) + '</p><small>' + D.fdate(x.ts) + ' · ' + D.ftime(x.ts) + '</small></span></button>'; }).join('') : '<div style="text-align:center;color:var(--mut);padding:50px">Sin notificaciones.</div>') + '</div>';
    }
  };

  // ---------- Usuario, nombre, aspecto ----------
  R.usuario = {
    nav: undefined, render: function () {
      return sub('Volver', '') + '<div class="ttl"><small>Ajustes</small>Tu usuario</div><div class="body nonav"><button class="row hd" ' + G('nombre') + '><span class="g"><b>Personalizar nombre</b><small>Tu nombre favorito o apodo: ' + esc(S.name) + '</small></span>' + ic('chev', 16) + '</button><button class="row hd" ' + G('feat', { t: 'Actualizar datos', i: 'edit', d: 'Los datos personales no se editan en la demostración.' }) + '><span class="g"><b>Actualizar datos</b><small>Datos personales (no disponible en demo)</small></span>' + ic('chev', 16) + '</button><button class="row hd" data-act="deluser"><span class="g"><b>Eliminar usuario</b><small>Restablece los datos de demostración</small></span>' + ic('chev', 16) + '</button></div>';
    }
  };
  R.nombre = {
    nav: undefined, render: function () {
      return '<div class="sub"><button class="l" id="ncan">' + ic('x', 20) + 'Cancelar</button><div class="mid">' + LOGO(30) + '</div><button class="r on" id="nsav" style="opacity:.5" disabled>Guardar</button></div><div class="ttl"><small>Tu usuario</small>Personalizar nombre</div><div class="body nonav"><div class="note">' + ic('info', 20) + '<span><b>Usa tu nombre favorito o apodo</b><br>El cambio solo será en la app de demostración, en tus saludos y perfil.</span></div><div class="field"><p class="lbl">¿Cómo quieres llamarte?</p><label class="inp"><input id="nin" maxlength="30" value="' + esc(S.name) + '" autocomplete="off"><span id="ncnt" style="font-size:11px;color:var(--mut)"></span></label><div class="err" id="nerr"></div></div><button class="btn p" id="nsav2" disabled>Guardar nombre</button><button class="btn o" id="ncan2">Cancelar</button></div>';
    },
    after: function (el) {
      var i = $('#nin', el), b1 = $('#nsav', el), b2 = $('#nsav2', el), er = $('#nerr', el);
      function val() { var v = i.value.trim().replace(/\s+/g, ' '); if (v.length < 2) return 'Escribe al menos 2 caracteres.'; if (!/^[\p{L}][\p{L}\p{M}' .-]*$/u.test(v)) return 'Usa solo letras, espacios, punto, guion o apóstrofo.'; return ''; }
      function chk() { var dirty = i.value.trim() !== S.name, e = val(); $('#ncnt', el).textContent = i.value.length + '/30'; er.textContent = dirty ? e : ''; var ok = dirty && !e; [b1, b2].forEach(function (b) { b.disabled = !ok; }); b1.style.opacity = ok ? 1 : .5; }
      i.addEventListener('input', chk); chk();
      function sv() { if (val()) return; S.name = i.value.trim().replace(/\s+/g, ' '); saveS(); toast('Nombre actualizado'); back(); }
      b1.addEventListener('click', sv); b2.addEventListener('click', sv);
      function cn() { if (i.value.trim() === S.name) return back(); modal('<h4>¿Quieres cancelar el cambio de tu nombre?</h4><p>Se perderán los cambios.</p><button class="btn p" data-act="cancelname">Sí</button><button class="btn o" data-act="close">No</button>'); }
      $('#ncan', el).addEventListener('click', cn); $('#ncan2', el).addEventListener('click', cn);
    }
  };
  R.seguridad = {
    nav: undefined, render: function () {
      return sub('Volver', '') + '<div class="ttl"><small>Ajustes</small>Seguridad</div><div class="body nonav"><button class="row hd" ' + G('aspecto') + '><span class="g"><b>Aspecto</b><small>Detector facial o huella · ' + (S.credId ? 'Activado' : 'No activado') + '</small></span>' + ic('chev', 16) + '</button><button class="row hd" data-act="notifsw"><span class="g"><b>Notificaciones</b><small>Avisos dentro de la app</small></span><span class="sw ' + (S.notifOn ? 'on' : '') + '" id="nsw"></span></button></div>';
    }
  };
  R.aspecto = {
    nav: undefined, render: function () {
      return sub('Volver', '') + '<div class="ttl"><small>Ajustes</small>Aspecto</div><div class="body nonav"><div class="note">' + ic('info', 20) + '<span>Elige cómo prefieres ingresar. La verificación la hace tu dispositivo con WebAuthn/passkeys; la app no recibe ni guarda tu rostro ni tu huella.</span></div>' +
        ['face', 'finger'].map(function (k) { return '<button class="opt ' + (S.face === k ? 'on' : '') + '" data-act="pref" data-k="' + k + '">' + ic(k, 28) + '<span class="g">' + (k === 'face' ? 'Detector facial' : 'Huella') + '<small>' + (k === 'face' ? 'Face ID u otro reconocimiento facial del equipo' : 'Sensor de huella del equipo') + '</small></span><span class="radio"></span></button>'; }).join('') +
        '<button class="btn p" data-act="bioreg">' + (S.credId ? 'Volver a activar en este dispositivo' : 'Activar en este dispositivo') + '</button>' + (S.credId ? '<button class="btn o" data-act="biooff">Desactivar</button>' : '') + '<p id="bmsg" style="margin:6px 22px;font-size:12.5px;color:var(--mut);line-height:1.4">' + (wa() ? '' : 'Este navegador o contexto no admite WebAuthn (requiere HTTPS). Seguirás ingresando con tu alias.') + '</p></div>';
    }
  };

  // ---------- Panel demo (solo administrador) ----------
  var isAdmin = null;
  function checkAdmin() { return fetch('/api/admin/session', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : { admin: false }; }).then(function (j) { isAdmin = !!j.admin; return isAdmin; }).catch(function () { isAdmin = false; return false; }); }
  var editing = null;
  R.admin = {
    nav: undefined, render: function () { return sub('Volver', '') + '<div class="ttl">Panel demo</div><div class="body nonav" id="adm"><div style="text-align:center;padding:40px 20px"><div class="spin"></div>Verificando permisos…</div></div>'; },
    after: function (el) { checkAdmin().then(function (ok) { drawAdmin(el, ok); }); }
  };
  function tl(ts) { var d = new Date(ts - new Date().getTimezoneOffset() * 60000); return d.toISOString().slice(0, 16); }
  function drawAdmin(el, ok) {
    var box = $('#adm', el); if (!box) return;
    if (!ok) { box.innerHTML = '<div class="note w" style="margin-top:20px">' + ic('lock', 20) + '<span>Solo un administrador con sesión activa en <b>/admin</b> puede editar los datos de demostración.</span></div><button class="btn o" data-back>Volver</button>'; return; }
    var m = editing && findMov(editing) || null;
    box.innerHTML = '<div class="note">' + ic('info', 20) + '<span>Modo de prueba: lo que edites aquí es ficticio y se refleja en todas las pantallas.</span></div>' +
      '<div class="card adm"><b>Saldos (COP)</b><div class="sm">Saldo disponible</div><input id="a1" inputmode="decimal" value="' + S.balance + '"><div class="sm">Saldo en bolsillos (ahorro demo)</div><input id="a2" inputmode="decimal" value="' + S.pockets + '"><div class="sm">Cobros en proceso</div><input id="a3" inputmode="decimal" value="' + S.processing + '"><div class="sm">Saldo en canje</div><input id="a4" inputmode="decimal" value="' + S.onhold + '"><button class="btn p" style="margin:6px 0;width:100%" data-act="asave">Guardar saldos</button></div>' +
      '<div class="card adm"><b>' + (m ? 'Editar movimiento' : 'Nuevo movimiento de prueba') + '</b><div class="sm">Descripción</div><input id="m1" maxlength="60" value="' + esc(m ? m.desc : '') + '"><div class="sm">Importe COP (negativo = egreso; vacío = pendiente)</div><input id="m2" inputmode="decimal" value="' + (m && m.amount != null ? m.amount : '') + '"><div class="sm">Importe original USD (opcional)</div><input id="m3" inputmode="decimal" value="' + (m && m.usd != null ? m.usd : '') + '"><div class="sm">Fecha y hora</div><input id="m4" type="datetime-local" value="' + tl(m ? m.date : Date.now()) + '"><div class="sm">Tipo</div><input id="m5" maxlength="40" value="' + esc(m ? m.type : 'Transferencia recibida') + '"><div class="sm">Estado</div><select id="m6">' + ['Completado', 'Pendiente', 'Rechazado'].map(function (s) { return '<option' + (m && m.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select><button class="btn p" style="margin:6px 0;width:100%" data-act="msave">' + (m ? 'Actualizar' : 'Agregar') + '</button>' + (m ? '<button class="btn o" style="margin:6px 0;width:100%" data-act="mcancel">Cancelar edición</button>' : '') + '</div>' +
      '<div class="card adm"><b>Movimientos</b>' + allMov().map(function (x) { return '<div class="kv" style="padding:8px 0"><span style="flex:1;color:#fff">' + esc(x.desc) + '<br><small style="color:var(--mut)">' + D.fdate(x.date) + ' · ' + esc(x.status) + '</small></span><span><button data-act="medit" data-id="' + x.id + '">' + ic('edit', 18) + '</button> <button data-act="mdel" data-id="' + x.id + '">' + ic('trash', 18) + '</button></span></div>'; }).join('') + '</div>' +
      '<div class="card adm"><b>Notificación de prueba</b><div class="sm">Título</div><input id="n1" maxlength="60"><div class="sm">Contenido</div><input id="n2" maxlength="140"><div class="sm">Fecha y hora</div><input id="n3" type="datetime-local" value="' + tl(Date.now()) + '"><button class="btn p" style="margin:6px 0;width:100%" data-act="nsave">Agregar notificación</button></div>' +
      '<div class="card"><b>Registro de eventos</b>' + (D.getLog().slice(0, 12).map(function (l) { return '<div style="font-size:11.5px;color:var(--mut);margin-top:6px">' + D.ftime(l.ts) + ' · ' + esc(l.kind) + ' · ' + esc(l.msg) + '</div>'; }).join('') || '<div style="font-size:12px;color:var(--mut)">Sin eventos.</div>') + '</div>' +
      '<div class="card"><b>Adaptadores</b><div style="font-size:12px;color:var(--mut);margin-top:6px;line-height:1.5">Demo: activo · Deriv: lee el simulador local (no la API real) · Banco: no conectado (' + esc(D.adapters.bank.reason) + ')</div></div>' +
      '<button class="btn o" data-act="reconc">Reconciliar ahora</button>';
  }
  function num(id, el) { var v = $(id, el).value.trim().replace(',', '.'); if (v === '') return null; var n = parseFloat(v); return isNaN(n) ? NaN : n; }

  // ---------- Acciones ----------
  var ACT = {
    close: function (t) { t.closest('.ovl').remove(); },
    hide: function () { S.hide = !S.hide; saveS(); paint('fade'); },
    tab: function (t) { tabSel = t.dataset.t; paint('fade'); },
    filt: function (t) { filt = t.dataset.t; paint('fade'); },
    tg: function (t) { var e = document.getElementById(t.dataset.t); e.style.display = e.style.display === 'none' ? '' : 'none'; },
    logout: function () { modal('<h4>¿Cerrar sesión?</h4><p>Volverás a la pantalla de inicio.</p><button class="btn p" data-act="dologout">Cerrar sesión</button><button class="btn o" data-act="close">Cancelar</button>'); },
    dologout: function (t) { t.closest('.ovl').remove(); logged = false; stack = []; go('home', {}, { tab: true }); },
    keyinfo: function () { modal('<h4>Clave dinámica de demostración</h4><p>Es un número de ejemplo que cambia cada 30 segundos. No sirve para ninguna operación real.</p><button class="btn p" data-act="close">Entendido</button>'); },
    forgot: function () { modal('<h4>Modo demostración</h4><p>No hay claves que recuperar: escribe cualquier alias para entrar.</p><button class="btn p" data-act="close">Entendido</button>'); },
    noacct: function () { modal('<h4>Modo demostración</h4><p>No se crean cuentas reales. Usa un alias cualquiera.</p><button class="btn p" data-act="close">Entendido</button>'); },
    bio: function () { bioLogin(false); },
    bioreg: function () { bioRegister(); },
    biooff: function () { S.credId = ''; saveS(); D.log('auth', 'Passkey local eliminada'); paint('fade'); toast('Acceso con el dispositivo desactivado'); },
    pref: function (t) { S.face = t.dataset.k; saveS(); paint('fade'); },
    notifsw: function () { S.notifOn = !S.notifOn; saveS(); $('#nsw').classList.toggle('on', S.notifOn); },
    readall: function () { S.notifications.forEach(function (n) { n.read = true; }); saveS(); paint('fade'); },
    notif: function (t) { var n = S.notifications.filter(function (x) { return x.id === t.dataset.id; })[0]; if (!n) return; n.read = true; saveS(); modal('<h4>' + esc(n.title) + '</h4><p>' + esc(n.body) + '</p><p style="font-size:11px">' + D.fdate(n.ts) + ' · ' + D.ftime(n.ts) + '</p><button class="btn p" data-act="closeNotif">Cerrar</button>'); },
    closeNotif: function (t) { t.closest('.ovl').remove(); paint('fade'); },
    cancelname: function (t) { t.closest('.ovl').remove(); back(); },
    deluser: function () { modal('<h4>¿Restablecer datos de demostración?</h4><p>Se borrarán tu nombre, preferencias y movimientos de prueba de este navegador.</p><button class="btn p" data-act="doreset">Restablecer</button><button class="btn o" data-act="close">Cancelar</button>'); },
    doreset: function (t) { t.closest('.ovl').remove(); D.reset(); S = D.get(); logged = false; stack = []; go('home', {}, { tab: true }); toast('Datos de demostración restablecidos'); },
    asave: function () { var el = view, v = ['#a1', '#a2', '#a3', '#a4'].map(function (i) { return num(i, el); }); if (v.some(function (x) { return x == null || isNaN(x) || x < 0; })) return toast('Revisa los importes (números ≥ 0)'); S.balance = v[0]; S.pockets = v[1]; S.processing = v[2]; S.onhold = v[3]; D.log('admin', 'Saldos de demo editados'); saveS(); toast('Saldos de demostración guardados'); },
    msave: function () {
      var el = view, d = $('#m1', el).value.trim(), a = num('#m2', el), u = num('#m3', el), ts = new Date($('#m4', el).value).getTime(), ty = $('#m5', el).value.trim(), st = $('#m6', el).value;
      if (d.length < 2 || isNaN(a) || isNaN(u) || isNaN(ts) || !ty) return toast('Completa los campos con valores válidos');
      if (a == null && u == null) return toast('Indica un importe COP o USD');
      var m = editing && findMov(editing);
      if (m) Object.assign(m, { desc: d, amount: a, usd: u, date: ts, type: ty, status: st }); else S.movements.unshift({ id: D.uid('a'), desc: d, amount: a, usd: u, date: ts, type: ty, status: st, counter: '', ref: 'DEMO-' + D.uid('').slice(-6).toUpperCase(), source: 'demo' });
      D.log('admin', (m ? 'Movimiento editado' : 'Movimiento agregado')); editing = null; saveS(); drawAdmin(el, true); toast('Movimiento guardado');
    },
    medit: function (t) { editing = t.dataset.id; drawAdmin(view, true); view.scrollTo && $('#adm', view).scrollTo(0, 0); },
    mcancel: function () { editing = null; drawAdmin(view, true); },
    mdel: function (t) { S.movements = S.movements.filter(function (x) { return x.id !== t.dataset.id; }); D.log('admin', 'Movimiento eliminado'); saveS(); drawAdmin(view, true); },
    nsave: function () { var el = view, a = $('#n1', el).value.trim(), b = $('#n2', el).value.trim(), ts = new Date($('#n3', el).value).getTime(); if (!a || !b || isNaN(ts)) return toast('Completa título, contenido y fecha'); S.notifications.unshift({ id: D.uid('n'), title: a, body: b, ts: ts, read: false }); D.log('admin', 'Notificación agregada'); saveS(); drawAdmin(el, true); toast('Notificación agregada'); },
    reconc: function () { var c = D.reconcile(); toast(c ? 'Reconciliación: hubo cambios' : 'Reconciliación: sin novedades'); drawAdmin(view, true); }
  };
  ACT.qr = function () { go('qr', {}, { dir: 'up' }); };
  R.qr = {
    nav: undefined, render: function () {
      var c = '', s = 7;
      for (var y = 0; y < 21; y++) for (var x = 0; x < 21; x++) { var f = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13); var on = f ? (x % 6 === 0 || y % 6 === 0 || (x % 14 > 1 && x % 14 < 5 && y % 14 > 1 && y % 14 < 5) || (x > 13 && (x - 14) % 6 === 0)) : ((x * 7 + y * 13 + x * y) % 5 < 2); if (f && !on) continue; if (on) c += '<rect x="' + x * 10 + '" y="' + y * 10 + '" width="10" height="10"/>'; }
      return sub('Cerrar', '') + '<div class="ttl" style="text-align:center">Pagar con QR <span class="chip">DEMO</span></div><div class="body nonav"><div class="qr"><svg viewBox="0 0 210 210" fill="#1c1822">' + c + '</svg></div><div class="note w">' + ic('info', 20) + '<span>Código de demostración, no es válido para pagos ni lecturas reales.</span></div><button class="btn p" data-back>Cerrar</button></div>';
    }
  };

  // ---------- Barra inferior y botón flotante ----------
  var NAVD = [['home', 'Inicio', 'home', 'home'], ['trans', 'Transacciones', 'card', 'trans'], ['explore', 'Explorar', 'grid', 'explore'], ['tram', 'Trámites y solicitudes', 'doc', 'tram'], ['aj', 'Ajustes', 'gear', 'ajustes']];
  function boot() {
    app.insertAdjacentHTML('beforeend', '<div class="demo-tag">MODO DEMO · APP FICTICIA</div>');
    navEl = document.createElement('nav'); navEl.className = 'nav'; navEl.style.display = 'none';
    navEl.innerHTML = NAVD.map(function (n) { return '<button data-tab="' + n[0] + '" data-go="' + n[3] + '" data-tab-reset>' + ic(n[2], 22) + n[1] + '</button>'; }).join('');
    navEl.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { e.stopPropagation(); go(b.dataset.go, {}, { tab: true }); } }, true);
    app.appendChild(navEl);
    fabEl = document.createElement('button'); fabEl.className = 'fab'; fabEl.style.display = 'none'; fabEl.setAttribute('aria-label', 'Pagar con QR (demo)'); fabEl.dataset.act = 'qr'; fabEl.innerHTML = ic('qr', 24); app.appendChild(fabEl);
    document.addEventListener('aurora:data', function () { S = D.get(); });
    D.startPolling();
    go('splash', {}, { tab: true });
  }
  window.AuroraApp = { go: go, back: back };
  boot();
})();
