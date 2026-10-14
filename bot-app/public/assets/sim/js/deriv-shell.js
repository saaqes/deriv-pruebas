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
      var cn = localStorage.getItem('tl_user_name');
      var cm = localStorage.getItem('tl_user_email');
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
        if (me.name) nameEl.textContent = me.name;
        if (me.email) mailEl.textContent = me.email;
        else if (!mailEl.textContent.trim()) mailEl.textContent = '';
        av.title = me.name || '';
        try {
          localStorage.setItem('tl_user_initials', me.initials || '');
          if (me.name) localStorage.setItem('tl_user_name', me.name);
          if (me.email) localStorage.setItem('tl_user_email', me.email);
        } catch (_) {}
        document.dispatchEvent(new CustomEvent('dd:user', { detail: me }));
      })
      .catch(function () {});
  }

  function init() {
    document.body.classList.add('dd-loading');
    setTimeout(function () { document.body.classList.remove('dd-loading'); }, 750);
    var active = document.body.getAttribute('data-page') || 'home';
    var sb = document.getElementById('ddSidebar');
    if (sb) sb.outerHTML = buildSidebar(active);
    var bn = document.getElementById('ddBottomNav');
    if (bn) { bn.className = 'dd-bottom-nav'; bn.innerHTML = buildBottomNav(active); }

    loadUser();

    // Campana: en home abre el panel de ajustes (lo maneja home.html);
    // en las demás páginas lleva a home.html, como antes.
    var bell = document.getElementById('bellToggle');
    if (bell && !document.getElementById('notifPanel')) {
      bell.addEventListener('click', function () { window.location.href = 'home.html'; });
    }

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
