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
    return NAV.map(function (n) {
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

  function buildNotif() {
    var d = document.createElement('div');
    d.className = 'dd-notif'; d.id = 'ddNotif'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Notificaciones');
    var rows = ''; for (var i = 0; i < 5; i++) rows += '<div class="dd-nt-row"><i></i><span><b></b><b></b></span></div>';
    d.innerHTML =
      '<div class="dd-nt-head"><div class="dd-nt-title">Notificaciones <svg viewBox="0 0 8 5" width="8" height="5"><path d="M0 0h8L4 5z" fill="currentColor"/></svg></div>' +
        '<button class="dd-nt-more" aria-label="Más opciones"><svg viewBox="0 0 16 4" width="14" height="4" fill="currentColor"><circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="14" cy="2" r="1.5"/></svg></button>' +
        '<div class="dd-nt-menu" hidden><button data-nt="read">Marcar todo como leído</button><button data-nt="settings">Ajustes del simulador</button></div></div>' +
      '<div class="dd-nt-body"><div class="dd-nt-list">' + rows + '</div><div class="dd-nt-empty">Estás al día</div></div>' +
      '<div class="dd-nt-foot">Inbox by <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor"><path d="M6 0l1.6 4.4L12 6 7.600 7.600 6 12 4.400 7.600 0 6l4.400-1.600z"/></svg> Novu</div>';
    return d;
  }

  // Barra superior de la versión móvil (se oculta en escritorio por CSS): iniciales + buscar,
  // "Ask Amy" y campana dentro del banner oscuro, como en la app móvil de referencia.
  var MSEARCH = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>';
  function mobileBar(opts) {
    var d = document.createElement('div');
    d.className = 'dd-m-bar';
    var ini = ''; try { ini = localStorage.getItem('tl_user_initials') || ''; } catch (_) {}
    d.innerHTML =
      '<div class="dd-m-left">' + (opts.avatar ? '<span class="dd-m-av">' + esc(ini) + '</span>' : '') +
        '<span class="dd-m-search" role="button" aria-label="Buscar">' + MSEARCH + '</span></div>' +
      (opts.amy ? '<div class="dd-m-amy">' + SPARK + '<span>Ask Amy</span></div>' : '') +
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
      var amy = !isPr && !hero.querySelector('.dd-toggle');
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
    function toggleNotif() { placeNotif(); pop.classList.toggle('open'); }
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
    pop.querySelector('[data-nt=settings]').addEventListener('click', function () {
      closeNotif();
      if (window.DD_openSettings) window.DD_openSettings(); else window.location.href = 'home.html#ajustes';
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
