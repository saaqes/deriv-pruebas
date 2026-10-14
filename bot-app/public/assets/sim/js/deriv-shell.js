/* ================================================================
 * deriv-shell.js — barra lateral (desktop) / navegación inferior
 * (móvil), campana, ojo y datos del usuario, compartidos por todas
 * las páginas estáticas. Es solo presentación: los saldos y el resto
 * de la lógica siguen en sim-shared.js y en cada página.
 *
 * Uso: <body data-page="home|cfds|exchange|options|portfolio|profile">
 *      <div id="ddSidebar"></div> ... <div id="ddBottomNav"></div>
 * ================================================================ */
(function () {
  'use strict';

  // Iconos recortados del video de referencia (ver css/deriv-icons.css).
  function ic(name) { return '<i class="ic ic-' + name + '"></i>'; }
  var I = {
    home: ic('nav_home'), cfds: ic('nav_cfds'), exchange: ic('nav_exchange'),
    options: ic('nav_options'), portfolio: ic('nav_portfolio')
  };
  var IA = {
    home: ic('nav_home_on'), cfds: ic('nav_cfds_on'), exchange: ic('nav_exchange_on'),
    options: ic('nav_options_on'), portfolio: ic('nav_portfolio_on')
  };
  var NAV = [
    { id: 'home', label: 'Home', href: 'home.html' },
    { id: 'cfds', label: 'CFDs', href: 'cfds.html' },
    { id: 'exchange', label: 'Exchange', href: 'exchange.html' },
    { id: 'options', label: 'Options', href: 'options.html' },
    { id: 'portfolio', label: 'Portfolio', href: 'portfolio.html' }
  ];
  var LOGO = ic('logo');
  var BELL = ic('bell');
  var SPARK = ic('amy');
  var SEARCH = ic('search_amy');
  var CHEV = ic('chev_user');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function buildSidebar(active) {
    var nav = NAV.map(function (n) {
      return '<a class="dd-nav-item' + (n.id === active ? ' active' : '') + '" href="' + n.href + '">' + (n.id === active ? IA[n.id] : I[n.id]) + '<span>' + n.label + '</span></a>';
    }).join('');
    return '' +
      '<aside class="dd-sidebar">' +
        '<div class="dd-sb-top">' +
          '<a class="dd-logo" href="home.html" aria-label="Deriv">' + LOGO + '</a>' +
          '<div class="dd-bell" id="bellToggle" role="button" aria-label="Notificaciones">' + BELL + '<span class="badge">5</span></div>' +
        '</div>' +
        '<label class="dd-search">' + SEARCH + '<input type="text" placeholder="¿Qué tienes en mente?" aria-label="Buscar"></label>' +
        '<nav class="dd-nav">' + nav + '</nav>' +
        '<div class="dd-amy" role="button">' + SPARK + '<span>Ask Amy</span></div>' +
        '<div class="dd-spacer"></div>' +
        '<a class="dd-user" id="ddUser" href="profile.html">' +
          '<div class="dd-avatar" id="userAvatar" title=""><img src="assets/sim/img/v/avatar_side.png" alt=""></div>' +
          '<div class="dd-user-info"><div class="dd-user-name" id="ddUserName">&nbsp;</div><div class="dd-user-mail" id="ddUserMail">&nbsp;</div></div>' +
          CHEV +
        '</a>' +
      '</aside>';
  }

  function buildBottomNav(active) {
    // En teléfono la barra inferior no incluye Exchange.
    return NAV.filter(function (n) { return n.id !== 'exchange'; }).map(function (n) {
      return '<a class="dd-bn-item' + (n.id === active ? ' active' : '') + '" href="' + n.href + '">' + (n.id === active ? IA[n.id] : I[n.id]) + n.label + '</a>';
    }).join('');
  }

  function loadUser() {
    var nameEl = document.getElementById('ddUserName');
    var mailEl = document.getElementById('ddUserMail');
    var av = document.getElementById('userAvatar');
    try {
      var cn = localStorage.getItem('tl_user_name_custom') || localStorage.getItem('tl_user_name');
      var cm = localStorage.getItem('tl_user_email_custom') || localStorage.getItem('tl_user_email');
      if (cn) nameEl.textContent = cn;
      if (cm) mailEl.textContent = cm;
    } catch (_) {}
    fetch('/api/me', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) {
        if (r.status === 401) { window.location.replace('/login'); return null; }
        return r.ok ? r.json() : null;
      })
      .then(function (me) {
        if (!me) return;
        var custom = ''; try { custom = localStorage.getItem('tl_user_name_custom') || ''; } catch (_) {}
        if (custom) nameEl.textContent = custom; else if (me.name) nameEl.textContent = me.name;
        var savedMail = ''; try { savedMail = localStorage.getItem('tl_user_email_custom') || ''; } catch (_) {}
        if (savedMail) mailEl.textContent = savedMail; else if (me.email) mailEl.textContent = me.email;
        av.title = me.name || '';
        try {
          localStorage.setItem('tl_user_initials', me.initials || '');
          if (me.name) localStorage.setItem('tl_user_name', me.name);
          if (me.email) localStorage.setItem('tl_user_email', me.email);
        } catch (_) {}
        document.querySelectorAll('.dd-m-av').forEach(function (e) { e.textContent = me.initials || ''; });
        document.dispatchEvent(new CustomEvent('dd:user', { detail: me }));
      })
      .catch(function () {});
  }

  // Contenido del menú de notificaciones: ajustes del simulador (aspecto, % de ganancia y saldos).
  function settingsHTML() {
    var row = function (id, title, cur, label) {
      return '<div class="balance-manager-card"><div class="balance-manager-header"><span class="balance-manager-name">' + title +
        '</span><span class="balance-manager-current"><span id="pp' + id + 'Bal">0.00</span> <small>' + cur + '</small></span></div>' +
        '<input type="number" inputmode="decimal" min="0" step="0.01" class="balance-input" id="pp' + id + 'Input" placeholder="' + label + '">' +
        '<div class="balance-manager-actions">' +
          '<button class="bal-btn bal-btn-sub" data-account="' + id.toLowerCase() + '" data-action="restar">− Restar</button>' +
          '<button class="bal-btn bal-btn-add" data-account="' + id.toLowerCase() + '" data-action="sumar">+ Sumar</button>' +
          '<button class="bal-btn bal-btn-set" data-account="' + id.toLowerCase() + '" data-action="fijar">Fijar</button></div>' +
        '<div class="balance-manager-feedback" id="pp' + id + 'Fb"></div></div>';
    };
    return '<div class="balance-manager-card" id="ppAspecto" style="cursor:pointer;display:flex;align-items:center;justify-content:space-between;">' +
        '<span class="balance-manager-name">Aspecto</span><i class="ic ic-pr_chev"></i></div>' +
      '<div class="balance-manager-card"><div class="balance-manager-header"><span class="balance-manager-name">Porcentaje de ganancia</span></div>' +
        '<label class="pp-radio"><input type="radio" name="ppWinMode" id="ppWinDefault"><span>Predeterminado de Deriv — <span id="ppWinDefaultLabel">51.8%</span></span></label>' +
        '<label class="pp-radio"><input type="radio" name="ppWinMode" id="ppWinCustom"><span>Personalizada</span></label>' +
        '<input type="number" inputmode="decimal" min="0" max="100" step="0.1" class="balance-input" id="ppWinInput" placeholder="Porcentaje (0-100)" style="display:none;margin-top:0.625rem;">' +
        '<div class="balance-manager-feedback" id="ppWinFb"></div></div>' +
      row('Demo', 'Cuenta Demo', 'USD', 'Monto en USD') + row('Virtual', 'Cuenta Real', 'USD (sim)', 'Monto virtual');
  }

  function wireSettings(root) {
    var T = window.TradeLabSim; if (!T) return function () {};
    var $ = function (id) { return root.querySelector('#' + id); };
    function fb(id, msg, err) {
      var el = $(id); if (!el) return;
      el.textContent = msg; el.classList.toggle('error', !!err); el.classList.add('show');
      clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
    }
    function render() {
      var d = T.loadBalances();
      $('ppDemoBal').textContent = T.formatMoney(d.demo);
      $('ppVirtualBal').textContent = T.formatMoney(d.virtual);
      var cur = T.loadWinPercent(), def = cur === T.DEFAULT_WIN_PERCENT;
      $('ppWinDefault').checked = def; $('ppWinCustom').checked = !def;
      if (!def) $('ppWinInput').value = cur;
      $('ppWinInput').style.display = def ? 'none' : 'block';
    }
    $('ppWinDefaultLabel').textContent = T.DEFAULT_WIN_PERCENT + '%';
    root.querySelectorAll('.bal-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var acc = btn.dataset.account, input = $('pp' + (acc === 'demo' ? 'Demo' : 'Virtual') + 'Input');
        var r = T.applyAction(acc, btn.dataset.action, input.value), id = acc === 'demo' ? 'ppDemoFb' : 'ppVirtualFb';
        if (r.ok) { render(); fb(id, 'Guardado ✓ (simulado)', false); input.value = ''; }
        else if (r.reason === 'insufficient') fb(id, 'Saldo virtual insuficiente', true);
        else fb(id, 'Ingresa un monto válido', true);
      });
    });
    $('ppWinDefault').addEventListener('change', function () { $('ppWinInput').style.display = 'none'; T.saveWinPercent(T.DEFAULT_WIN_PERCENT); fb('ppWinFb', 'Guardado ✓', false); });
    $('ppWinCustom').addEventListener('change', function () { $('ppWinInput').style.display = 'block'; $('ppWinInput').focus(); });
    $('ppWinInput').addEventListener('change', function () {
      if (T.saveWinPercent($('ppWinInput').value)) fb('ppWinFb', 'Guardado ✓', false); else fb('ppWinFb', 'Ingresa un valor entre 0 y 100', true);
    });
    $('ppAspecto').addEventListener('click', function () { if (window.BrowserFrame && BrowserFrame.openSelector) BrowserFrame.openSelector(); });
    window.addEventListener('tradelab-sim:balances-updated', render);
    window.addEventListener('tradelab-sim:win-percent-updated', render);
    window.addEventListener('storage', render);
    render();
    return render;
  }

  function buildNotif() {
    var d = document.createElement('div');
    d.className = 'dd-notif'; d.id = 'ddNotif'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Notificaciones');
    d.innerHTML =
      '<div class="dd-nt-head"><div class="dd-nt-title">Notificaciones <svg viewBox="0 0 8 5" width="8" height="5"><path d="M0 0h8L4 5z" fill="currentColor"/></svg></div>' +
        '<button class="dd-nt-more" aria-label="Más opciones"><svg viewBox="0 0 16 4" width="14" height="4" fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="14" cy="2" r="1.5"/></svg></button>' +
        '<div class="dd-nt-menu" hidden><button data-nt="read">Marcar todo como leído</button></div></div>' +
      '<div class="dd-nt-body dd-nt-settings">' + settingsHTML() + '</div>' +
      '<div class="dd-nt-foot">Inbox by <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor"><path d="M6 0l1.6 4.4L12 6 7.600 7.600 6 12 4.400 7.600 0 6l4.400-1.600z"/></svg> Novu</div>';
    d._render = wireSettings(d);
    return d;
  }

  // Barra superior de la versión móvil (se oculta en escritorio por CSS): iniciales + buscar,
  // "Ask Amy" y campana dentro del banner oscuro, como en la app móvil de referencia.
  var MSEARCH = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>';
  var AMY_STAR = '<svg class="dd-m-star" viewBox="0 0 26 24" width="26" height="24" aria-hidden="true"><defs><linearGradient id="ddAmyG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffa6c8"/><stop offset="1" stop-color="#8fa8ff"/></linearGradient></defs><path fill="url(#ddAmyG)" d="M8.5 4.5Q9.6 10.4 15 12 9.6 13.6 8.5 19.5 7.4 13.6 2 12 7.4 10.4 8.5 4.5Z"/><path fill="#f1c56b" d="M19.5 3.5Q20.2 6.5 23 7.2 20.2 7.9 19.5 11 18.8 7.9 16 7.2 18.8 6.5 19.5 3.5Z"/><path fill="#f1c56b" d="M19.5 14Q20.1 16.7 22.5 17.3 20.1 17.9 19.5 20.6 18.9 17.9 16.5 17.3 18.9 16.7 19.5 14Z"/></svg>';
  function mobileBar(opts) {
    var d = document.createElement('div');
    d.className = 'dd-m-bar';
    var ini = ''; try { ini = localStorage.getItem('tl_user_initials') || ''; } catch (_) {}
    d.innerHTML =
      '<div class="dd-m-left">' + (opts.avatar ? '<span class="dd-m-av">' + esc(ini) + '</span>' : '') +
        '<span class="dd-m-search" role="button" aria-label="Buscar">' + MSEARCH + '</span></div>' +
      (opts.amy ? '<div class="dd-m-amy">' + AMY_STAR + '<span>Ask Amy</span></div>' : '') +
      '<div class="dd-m-bell" role="button" aria-label="Notificaciones">' + BELL + '<span class="badge">5</span></div>';
    d.querySelector('.dd-m-bell').addEventListener('click', function () {
      if (window.DD_openSettings) window.DD_openSettings(); else window.location.href = 'home.html#ajustes';
    });
    return d;
  }

  function init() {
    var heroes = document.querySelectorAll('.dd-hero, .pr-hero');
    heroes.forEach(function (hero) {
      var page = document.body.getAttribute('data-page');
      var isPr = hero.classList.contains('pr-hero');
      var amy = !isPr && (page === 'home' || !hero.querySelector('.dd-toggle'));
      hero.insertBefore(mobileBar({ avatar: page === 'home', amy: amy }), hero.firstChild);
    });

    document.body.classList.add('dd-loading');
    setTimeout(function () { document.body.classList.remove('dd-loading'); }, 750);
    var active = document.body.getAttribute('data-page') || 'home';
    var sb = document.getElementById('ddSidebar');
    if (sb) sb.outerHTML = buildSidebar(active);
    var bn = document.getElementById('ddBottomNav');
    if (bn) { bn.className = 'dd-bottom-nav'; bn.innerHTML = buildBottomNav(active); }

    loadUser();

    // Campana. Escritorio: menú de notificaciones desplegable bajo la campana (con acceso
    // a los ajustes del simulador). Móvil: se mantiene el comportamiento anterior
    // (en home abre el panel de ajustes; en las demás páginas lleva a home.html).
    var bell = document.getElementById('bellToggle');
    var desktop = function () { return window.matchMedia('(min-width: 861px)').matches; };
    var pop = buildNotif();
    document.body.appendChild(pop);
    function placeNotif() {
      var sb = document.querySelector('.dd-sidebar');
      var r = sb ? sb.getBoundingClientRect() : { left: 16 };
      pop.style.left = Math.max(8, r.left) + 'px';
    }
    function closeNotif() { pop.classList.remove('open'); pop.querySelector('.dd-nt-menu').hidden = true; }
    function toggleNotif() { placeNotif(); pop.classList.toggle('open'); if (pop._render) pop._render(); }
    if (bell) {
      bell.addEventListener('click', function (ev) {
        if (desktop()) { ev.stopImmediatePropagation(); ev.stopPropagation(); toggleNotif(); }
        else if (!document.getElementById('notifPanel')) { window.location.href = 'home.html#ajustes'; }
      }, true);
    }
    document.addEventListener('click', function (ev) {
      if (!pop.classList.contains('open')) return;
      if (pop.contains(ev.target) || (bell && bell.contains(ev.target))) return;
      closeNotif();
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeNotif(); });
    window.addEventListener('resize', function () { if (pop.classList.contains('open')) placeNotif(); });
    pop.querySelector('.dd-nt-more').addEventListener('click', function (ev) {
      ev.stopPropagation(); var m = pop.querySelector('.dd-nt-menu'); m.hidden = !m.hidden;
    });
    pop.querySelector('[data-nt=read]').addEventListener('click', function () {
      var b = document.querySelector('.dd-bell .badge'); if (b) b.remove(); closeNotif();
    });

    // Saldo del banner (cfds / exchange / options / portfolio): lee los mismos
    // saldos virtuales de sim-shared.js. Real = saldo virtual, Demo = saldo demo.
    var amt = document.querySelector('[data-hero-amount]');
    if (amt && window.TradeLabSim && !window.TL_CUSTOM_EYE) {
      var acct = 'real';
      var paint = function () {
        var d = TradeLabSim.loadBalances();
        var v = TradeLabSim.formatMoney(acct === 'demo' ? d.demo : d.virtual);
        amt.dataset.value = v;
        if (!window.__ddHidden) amt.textContent = v;
      };
      document.querySelectorAll('#acctToggle button').forEach(function (b) {
        b.addEventListener('click', function () {
          acct = b.dataset.acct;
          document.querySelectorAll('#acctToggle button').forEach(function (x) { x.classList.toggle('active', x === b); });
          paint();
        });
      });
      window.addEventListener('tradelab-sim:balances-updated', paint);
      window.addEventListener('storage', function (e) { if (e.key === TradeLabSim.STORAGE_KEY) paint(); });
      paint();
    }

    // Ojo genérico (home.html maneja el suyo con window.TL_CUSTOM_EYE).
    var eye = document.getElementById('eyeToggle');
    if (eye && !window.TL_CUSTOM_EYE) {
      var hidden = false;
      eye.addEventListener('click', function () {
        hidden = !hidden;
        window.__ddHidden = hidden;
        document.querySelectorAll('[data-hideable]').forEach(function (el) {
          if (el.dataset.value === undefined) el.dataset.value = el.textContent.trim();
          el.textContent = hidden ? '******' : el.dataset.value;
        });
        var ico = eye.querySelector('.ic');
        if (ico) ico.style.opacity = hidden ? '.45' : '1';
      });
    }
  }

  window.DerivShell = { icons: I, init: init };
  // Se incluye al final del <body>, después de los marcadores #ddSidebar /
  // #ddBottomNav y antes del script propio de cada página, así #bellToggle y
  // #eyeToggle ya existen cuando ese script los busca.
  init();
})();
