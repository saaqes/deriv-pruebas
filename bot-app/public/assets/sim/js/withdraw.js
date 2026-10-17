/* ================================================================
 * withdraw.js — flujo "Retirar" (SIMULACIÓN, sin dinero ni códigos reales):
 *   Portfolio -> modal "Retirar" -> /dashboard/withdraw/verify (código de 6 dígitos)
 *   -> /dashboard/withdraw/currency/USD (cashier "Retirar USD").
 * Cualquier código de 6 dígitos se acepta: no se envía nada a ningún servicio.
 * ================================================================ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  // Ruta "bonita" de la escena en la barra de direcciones (solo el path del propio sitio).
  try {
    var scene = document.body.getAttribute('data-scene');
    if (scene && location.pathname !== scene && location.protocol !== 'file:') {
      history.replaceState(null, '', scene + location.search + location.hash);
    }
  } catch (_) {}

  function money(n) { return window.TradeLabSim ? TradeLabSim.formatMoney(n) : Number(n).toFixed(2); }
  function realBalance() { try { return TradeLabSim.loadWallet().USD; } catch (_) { return 0; } }

  /* ---------- Modal "Retirar" (se monta en cualquier página que tenga el botón Retirar) ---------- */
  function mountModal() {
    var trigger = Array.prototype.filter.call(document.querySelectorAll('.dd-action'), function (el) {
      return /^\s*Retirar\s*$/.test(el.textContent);
    })[0];
    if (!trigger) return;
    var ov = document.createElement('div');
    ov.className = 'wd-overlay'; ov.id = 'wdOverlay';
    ov.innerHTML =
      '<div class="wd-modal" role="dialog" aria-modal="true" aria-label="Retirar">' +
        '<div class="wd-mhead"><h2>Retirar</h2><button class="wd-mx" aria-label="Cerrar"><svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m2.500 2.500 7 7M9.500 2.500l-7 7"/></svg></button></div>' +
        '<button class="wd-cur" data-go="usd"><img src="assets/sim/img/v/flag_us.png" alt=""><span class="tag">Sugerido</span><b>US Dollar</b></button>' +
        '<button class="wd-opt" data-go="usd"><i class="ic ic-pm_usd"></i><div><b>USD</b><span>Retiro a través de banco, tarjeta, billetera electrónica y criptografía.</span></div></button>' +
        '<button class="wd-opt"><i class="ic ic-pm_p2p"></i><div><b>P2P</b><span>Compra y vende USD con otros traders. Deposita y retira en tu moneda local.</span></div></button>' +
        '<button class="wd-opt" hidden data-extra><i class="ic ic-pm_agent"></i><div><b>Agente de pago</b><span>Retira en tu moneda local a través de un agente local verificado.</span></div></button>' +
        '<button class="wd-opt" hidden data-extra><i class="ic ic-pm_crypto"></i><div><b>Cripto</b><span>Retira rápidamente a tu cuenta con USDT, USDC y más.</span></div></button>' +
        '<button class="wd-more" type="button">Ver más <i class="ic ic-ex_chev"></i></button>' +
      '</div>';
    document.body.appendChild(ov);
    function open() { ov.classList.add('open'); document.body.classList.add('wd-open'); }
    function close() { ov.classList.remove('open'); document.body.classList.remove('wd-open'); }
    trigger.addEventListener('click', open);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('.wd-mx').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    ov.querySelectorAll('[data-go=usd]').forEach(function (b) {
      b.addEventListener('click', function () { window.location.href = 'withdraw-verify.html?currency=USD&from=portfolio&openWithdraw=1'; });
    });
    var more = ov.querySelector('.wd-more');
    more.addEventListener('click', function () {
      var show = !more.classList.contains('open');
      more.classList.toggle('open', show);
      ov.querySelectorAll('[data-extra]').forEach(function (b) { b.hidden = !show; });
    });
  }

  /* ---------- Verificación por código ---------- */
  function initVerify() {
    var wrap = $('wdOtp'); if (!wrap) return;
    var inputs = Array.prototype.slice.call(wrap.querySelectorAll('input'));
    var phone = ''; try { phone = localStorage.getItem('tl_user_phone') || ''; } catch (_) {}
    $('wdPhone').textContent = phone || '+573166219962';
    $('wdBack').addEventListener('click', function () { window.location.href = 'portfolio.html'; });
    var loader = $('wdLoader'), msg = $('wdMsg');

    function value() { return inputs.map(function (i) { return i.value; }).join(''); }
    function submit() {
      wrap.classList.add('busy'); $('wdEmail').disabled = true;
      setTimeout(function () {
        loader.classList.add('show');
        setTimeout(function () { window.location.href = 'withdraw-currency.html?from=portfolio'; }, 1300);
      }, 1100);
    }
    inputs.forEach(function (inp, i) {
      inp.addEventListener('input', function () {
        inp.value = inp.value.replace(/\D/g, '').slice(-1);
        if (inp.value && i < inputs.length - 1) inputs[i + 1].focus();
        if (value().length === 6) submit();
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !inp.value && i > 0) { inputs[i - 1].focus(); inputs[i - 1].value = ''; }
        if (e.key === 'ArrowLeft' && i > 0) inputs[i - 1].focus();
        if (e.key === 'ArrowRight' && i < inputs.length - 1) inputs[i + 1].focus();
      });
      inp.addEventListener('paste', function (e) {
        var t = ((e.clipboardData || window.clipboardData).getData('text') || '').replace(/\D/g, '').slice(0, 6);
        if (!t) return; e.preventDefault();
        inputs.forEach(function (x, k) { x.value = t[k] || ''; });
        (inputs[Math.min(t.length, 5)]).focus();
        if (t.length === 6) submit();
      });
    });
    inputs[0].focus();

    // "reenvía el código" -> cuenta regresiva de 60 s
    var resend = $('wdResend'), timer = null;
    function startCountdown() {
      var left = 60;
      function paint() { resend.innerHTML = '¿No recibiste el código? Revisa tus SMS o reenvía el código (' + left + 's).'; }
      paint(); clearInterval(timer);
      timer = setInterval(function () {
        left -= 1;
        if (left <= 0) {
          clearInterval(timer);
          resend.innerHTML = '¿No recibiste el código? Revisa tus SMS o <button type="button" id="wdResendBtn">reenvía el código</button>.';
          $('wdResendBtn').addEventListener('click', startCountdown);
        } else paint();
      }, 1000);
    }
    $('wdResendBtn').addEventListener('click', startCountdown);
    $('wdEmail').addEventListener('click', function () {
      msg.textContent = 'Código enviado a tu correo electrónico (simulado).'; msg.className = 'wd-msg';
      setTimeout(function () { msg.textContent = ''; }, 2600);
    });
  }

  /* ---------- Cashier "Retirar USD" ---------- */
  function initCashier() {
    var sc = $('wdScroll'); if (!sc) return;
    $('wdClose').addEventListener('click', function () { window.location.href = 'portfolio.html'; });
    var bal = realBalance();
    $('wdBal').textContent = '$ ' + money(bal);
    $('wdAvail').textContent = '$ ' + money(bal);
    $('wdAlertAmt').textContent = money(bal);
    $('wdAlert').style.display = bal > 0 ? 'none' : '';
    var up = $('wdUp');
    sc.addEventListener('scroll', function () { up.classList.toggle('show', sc.scrollTop > 120); });
    up.addEventListener('click', function () { sc.scrollTo({ top: 0, behavior: 'smooth' }); });
    // carga inicial con el logo girando, como en el video
    var loader = $('wdLoader');
    setTimeout(function () { loader.classList.remove('show'); }, 1500);
  }

  mountModal(); initVerify(); initCashier();
})();
