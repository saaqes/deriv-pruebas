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

  var I = {
    home: '<svg viewBox="0 0 16 16"><path d="M8 1.6 1.4 7.3a.6.6 0 0 0 .4 1.05H3V13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8.35h1.2a.6.6 0 0 0 .4-1.05z"/></svg>',
    cfds: '<svg viewBox="0 0 16 16"><path d="M2 2.2c.3 0 .6.3.6.6v9.4c0 .4.3.7.7.7H14c.3 0 .6.3.6.6s-.3.6-.6.6H3.3A1.9 1.9 0 0 1 1.4 12.2V2.8c0-.3.3-.6.6-.6m6.2 1.3v1c.4.1.7.5.7.9v1.6c0 .4-.3.8-.7.9v1.3c0 .3-.3.6-.6.6s-.6-.3-.6-.6V7.9c-.4-.1-.7-.5-.7-.9V5.4c0-.4.3-.8.7-.9v-1c0-.3.3-.6.6-.6s.6.3.6.6M5 4.8c.3 0 .6.3.6.6v1c.4.1.7.5.7.9v2.4c0 .4-.3.8-.7.9v1.3c0 .3-.3.6-.6.6s-.6-.3-.6-.6V10.6c-.4-.1-.7-.5-.7-.9V7.3c0-.4.3-.8.7-.9v-1c0-.3.3-.6.6-.6m6.6 1.4c.3 0 .6.3.6.6v1c.4.1.7.5.7.9v1c0 .4-.3.8-.7.9v1.3c0 .3-.3.6-.6.6s-.6-.3-.6-.6v-1.3c-.4-.1-.7-.5-.7-.9v-1c0-.4.3-.8.7-.9v-1c0-.3.3-.6.6-.6"/></svg>',
    exchange: '<svg viewBox="0 0 16 16"><path d="M3 2.6h10A2.4 2.4 0 0 1 15.4 5v6A2.4 2.4 0 0 1 13 13.4H3A2.4 2.4 0 0 1 .6 11V5A2.4 2.4 0 0 1 3 2.6m0 1.2c-.7 0-1.2.5-1.2 1.2v1h12.4V5c0-.7-.5-1.2-1.2-1.2zm11.2 3.4H1.8V11c0 .7.5 1.2 1.2 1.2h10c.7 0 1.2-.5 1.2-1.2zM4 9.2h2.4a.6.6 0 0 1 0 1.2H4a.6.6 0 0 1 0-1.2"/></svg>',
    options: '<svg viewBox="0 0 16 16"><path d="M3.4 13.2c-.7 0-1.2-.5-1.2-1.2V9.4c0-.4.3-.7.7-.7h.5c.4 0 .7.3.7.7v.7l.6-.6c.4-.4.8-.5 1.3-.5h1.4c.4 0 .7.3.7.7v.4c0 .4-.3.7-.7.7H7.1c-.2 0-.4.1-.5.2l-.4.4h.7c.4 0 .7.3.7.7v.5c0 .4-.3.7-.7.7zm8-5.6H10.5c-.4 0-.7-.3-.7-.7v-.7l-.6.6c-.4.4-.8.5-1.3.5H6.5a.7.7 0 0 1-.7-.7v-.4c0-.4.3-.7.7-.7h1c.2 0 .4-.1.6-.2l.4-.4h-.7a.7.7 0 0 1-.7-.7v-.5c0-.4.3-.7.7-.7h2.8c.6 0 1.1.5 1.1 1.1v2.8c0 .4-.3.6-.7.6"/></svg>',
    portfolio: '<svg viewBox="0 0 16 16"><path d="M4.4 2.4h7.5c.2 0 .3.2.3.3s-.1.3-.3.3H4.4c-.6 0-1.1.5-1.1 1.1v5.6c0 .5.4.9.9.9h6.9c.5 0 .9-.4.9-.9V6.8c0-.5-.4-.9-.9-.9H5.8a.3.3 0 0 1 0-.6h6.3c.9 0 1.6.7 1.6 1.6v4.4c0 .9-.7 1.6-1.6 1.6H4.4c-.9 0-1.6-.7-1.6-1.6V4c0-.9.7-1.6 1.6-1.6m6.4 6.4a.47.47 0 1 1 0-.94.47.47 0 0 1 0 .94"/></svg>'
  };
  var NAV = [
    { id: 'home', label: 'Home', href: 'home.html' },
    { id: 'cfds', label: 'CFDs', href: 'cfds.html' },
    { id: 'exchange', label: 'Exchange', href: 'exchange.html' },
    { id: 'options', label: 'Options', href: 'options.html' },
    { id: 'portfolio', label: 'Portfolio', href: 'portfolio.html' }
  ];
  var LOGO = '<svg viewBox="0 0 64 24" aria-label="deriv"><text x="0" y="19" fill="#ff444f" font-family="Inter,Arial Black,Arial,sans-serif" font-weight="900" font-size="25" letter-spacing="-1.2" font-style="italic">deriv</text></svg>';
  var BELL = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.6a.6.6 0 0 1 .6.6v.35A4 4 0 0 1 12 6.5v2.2c0 .5.2 1 .6 1.4l.6.6c.3.3.1.9-.4.9H3.2c-.5 0-.7-.6-.4-.9l.6-.6c.4-.4.6-.9.6-1.4V6.5a4 4 0 0 1 3.4-3.95V2.2A.6.6 0 0 1 8 1.6m0 1.9A3 3 0 0 0 5 6.5v2.2c0 .6-.2 1.1-.5 1.5h7c-.3-.4-.5-.9-.5-1.5V6.5a3 3 0 0 0-3-3M6.4 12.4h3.2a1.6 1.6 0 0 1-3.2 0"/></svg>';
  var SPARK = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="m3.2 1.6.5 1.3 1.3.5a.3.3 0 0 1 0 .6l-1.3.5-.5 1.3a.3.3 0 0 1-.6 0L2.2 4.5.9 4a.3.3 0 0 1 0-.6l1.3-.5.4-1.3a.3.3 0 0 1 .6 0M7 4l1.2 2.8L11 8l-2.8 1.2L7 12l-1.2-2.8L3 8l2.8-1.2zm5.3 5.4.5 1.3 1.3.5a.3.3 0 0 1 0 .6l-1.3.5-.5 1.3a.3.3 0 0 1-.6 0l-.5-1.3-1.3-.5a.3.3 0 0 1 0-.6l1.3-.5.5-1.3a.3.3 0 0 1 .6 0"/></svg>';
  var SEARCH = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="m3.2 1.6.5 1.3 1.3.5a.3.3 0 0 1 0 .6l-1.3.5-.5 1.3a.3.3 0 0 1-.6 0L2.2 4.5.9 4a.3.3 0 0 1 0-.6l1.3-.5.4-1.3a.3.3 0 0 1 .6 0M8.2 3 9.4 6l3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z"/></svg>';
  var PERSON = '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="5.2" r="2.8"/><path d="M2.6 14c0-2.9 2.4-4.6 5.4-4.6s5.4 1.7 5.4 4.6z"/></svg>';
  var CHEV = '<svg class="dd-user-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 2.5 3.5 3.5-3.5 3.5"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function buildSidebar(active) {
    var nav = NAV.map(function (n) {
      return '<a class="dd-nav-item' + (n.id === active ? ' active' : '') + '" href="' + n.href + '">' + I[n.id] + '<span>' + n.label + '</span></a>';
    }).join('');
    return '' +
      '<aside class="dd-sidebar">' +
        '<div class="dd-sb-top">' +
          '<a class="dd-logo" href="home.html" aria-label="Deriv">' + LOGO + '</a>' +
          '<div class="dd-bell" id="bellToggle" role="button" aria-label="Notificaciones">' + BELL + '<span class="badge">5</span></div>' +
        '</div>' +
        '<label class="dd-search">' + SEARCH + '<input type="text" placeholder="¿Qué tienes en mente?" aria-label="Buscar"></label>' +
        '<nav class="dd-nav">' + nav + '</nav>' +
        '<div class="dd-amy" role="button">' + SPARK + 'Ask Amy</div>' +
        '<div class="dd-spacer"></div>' +
        '<a class="dd-user" id="ddUser" href="profile.html">' +
          '<div class="dd-avatar" id="userAvatar" title="">' + PERSON + '</div>' +
          '<div class="dd-user-info"><div class="dd-user-name" id="ddUserName">&nbsp;</div><div class="dd-user-mail" id="ddUserMail">&nbsp;</div></div>' +
          CHEV +
        '</a>' +
      '</aside>';
  }

  function buildBottomNav(active) {
    return NAV.map(function (n) {
      return '<a class="dd-bn-item' + (n.id === active ? ' active' : '') + '" href="' + n.href + '">' + I[n.id] + n.label + '</a>';
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
        var sl = eye.querySelector('.slash');
        if (sl) sl.style.display = hidden ? '' : 'none';
      });
    }
  }

  window.DerivShell = { icons: I, init: init };
  // Se incluye al final del <body>, después de los marcadores #ddSidebar /
  // #ddBottomNav y antes del script propio de cada página, así #bellToggle y
  // #eyeToggle ya existen cuando ese script los busca.
  init();
})();
