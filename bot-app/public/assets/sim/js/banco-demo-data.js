/*
 * banco-demo-data.js — datos, adaptadores y reconciliación de "Aurora Demo".
 *
 * AVISO: Aurora Demo es una app FICTICIA. Nada de lo que muestra es un saldo,
 * movimiento o comprobante bancario real. No se guardan contraseñas ni datos
 * bancarios: solo preferencias y datos de demostración en localStorage.
 *
 * Adaptadores (todos devuelven movimientos normalizados con un externalId):
 *   - demoAdapter : movimientos de prueba editables (panel demo, solo admin).
 *   - derivAdapter: lee los retiros del SIMULADOR local (TradeLabSim). No consulta
 *                   la API real de Deriv; para eso haría falta un backend con
 *                   token propio y el método de pago correspondiente.
 *   - bankAdapter : NO conectado. Ningún banco permite crear movimientos mediante
 *                   una API pública; requeriría un convenio/API oficial.
 * La reconciliación es idempotente: un mismo externalId nunca se registra dos veces.
 */
(function (g) {
  'use strict';
  var KEY = 'aurora-demo-v1';
  var LOGKEY = 'aurora-demo-log';
  var DAY = 86400000;

  function seed() {
    var now = new Date(); now.setHours(9, 12, 0, 0);
    var t = now.getTime();
    return {
      v: 1,
      name: 'Usuario Demo', user: '', hide: false, face: 'face', credId: '', lastLogin: 0,
      keyShown: false, notifOn: true,
      balance: 1250000, pockets: 0, processing: 0, onhold: 0,
      movements: [
        { id: 'm1', desc: 'TRANSFERENCIA RECIBIDA (DEMO)', amount: 143000, date: t - 12 * DAY, type: 'Transferencia recibida', status: 'Completado', counter: 'Cuenta demo origen', ref: 'DEMO-A1F3C2', source: 'demo' },
        { id: 'm2', desc: 'IMPUESTO 4X1000 (DEMO)', amount: -572, date: t - 12 * DAY, type: 'Impuesto', status: 'Completado', counter: '', ref: 'DEMO-B7D410', source: 'demo' },
        { id: 'm3', desc: 'PAGO PSE COMERCIO DEMO', amount: -89900, date: t - 9 * DAY, type: 'Pago PSE', status: 'Completado', counter: 'Comercio demo', ref: 'DEMO-C90E55', source: 'demo' }
      ],
      notifications: [
        { id: 'n1', title: 'Bienvenido a Aurora Demo', body: 'Esta es una aplicación de demostración. Los saldos y movimientos no son reales.', ts: t - 2 * DAY, read: false },
        { id: 'n2', title: 'Clave dinámica de prueba', body: 'Tu clave dinámica de demostración cambia cada 30 segundos.', ts: t - DAY, read: true }
      ],
      recon: {}
    };
  }

  var S;
  function load() {
    try { var p = JSON.parse(localStorage.getItem(KEY) || 'null'); if (p && p.v === 1) { S = Object.assign(seed(), p); return S; } } catch (e) { /* storage */ }
    S = seed(); return S;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* solo memoria */ } document.dispatchEvent(new CustomEvent('aurora:data')); }
  function reset() { S = seed(); try { localStorage.removeItem(LOGKEY); } catch (e) { /* ok */ } save(); }

  // ---- Registro de eventos/errores (sin datos sensibles) ----
  function log(kind, msg) {
    var l = []; try { l = JSON.parse(localStorage.getItem(LOGKEY) || '[]'); } catch (e) { l = []; }
    l.unshift({ ts: Date.now(), kind: kind, msg: String(msg).slice(0, 160) });
    try { localStorage.setItem(LOGKEY, JSON.stringify(l.slice(0, 60))); } catch (e) { /* ok */ }
  }
  function getLog() { try { return JSON.parse(localStorage.getItem(LOGKEY) || '[]'); } catch (e) { return []; } }

  // ---- Utilidades ----
  function money(n, cur) {
    if (n == null || isNaN(n)) return '—';
    var neg = n < 0, s = Math.abs(n).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (neg ? '-' : '') + (cur === 'USD' ? 'USD ' : '$ ') + s;
  }
  function fdate(ts) { return new Date(ts).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '').toUpperCase(); }
  function ftime(ts) { return new Date(ts).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }); }
  function uid(p) { return (p || 'x') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  // ---- Adaptadores ----
  var demoAdapter = { id: 'demo', real: false, list: function () { return S.movements.filter(function (m) { return m.source !== 'deriv-sim'; }); } };

  var derivAdapter = {
    id: 'deriv-sim', real: false,
    list: function () {
      var sim = g.TradeLabSim;
      if (!sim || !sim.loadWithdrawals) return [];
      return sim.loadWithdrawals().map(function (w) {
        var done = w.status === 'Completado';
        return {
          externalId: 'deriv-wd-' + w.id, desc: 'RETIRO DERIV (SIMULADO)', usd: w.amount, amount: null,
          date: w.ts, type: 'Retiro desde Deriv', counter: (w.method || 'PSE') + (w.acct ? ' ' + w.acct : ''),
          status: done ? 'Completado' : 'Pendiente', stateText: done ? 'Completado según el simulador' : 'Pendiente de procesamiento',
          requestedAt: w.ts, processedAt: done ? w.ts + 180000 : null, confirmedAt: null, source: 'deriv-sim'
        };
      });
    }
  };

  var bankAdapter = { id: 'bank', real: false, available: false, reason: 'No hay API bancaria oficial conectada. Se requiere convenio/credenciales del banco.', list: function () { return []; } };

  // ---- Reconciliación idempotente ----
  function reconcile() {
    var changed = false, now = Date.now();
    derivAdapter.list().forEach(function (e) {
      var ref = S.recon[e.externalId];
      var m = ref && S.movements.filter(function (x) { return x.id === ref; })[0];
      if (!m) {
        m = Object.assign({ id: uid('d'), ref: 'SIM-' + e.externalId.slice(-8).toUpperCase() }, e);
        delete m.externalId; m.ext = e.externalId;
        S.movements.unshift(m); S.recon[e.externalId] = m.id; changed = true;
        log('reconcile', 'Nuevo movimiento simulado ' + e.externalId);
        S.notifications.unshift({ id: uid('n'), title: 'Retiro desde Deriv (simulado)', body: 'Solicitud ' + e.externalId.slice(-8) + ': ' + e.stateText + '. El importe en COP está pendiente de confirmación.', ts: now, read: false });
      } else if (m.status !== e.status) {
        m.status = e.status; m.stateText = e.stateText; m.processedAt = e.processedAt; changed = true;
        log('reconcile', 'Estado actualizado ' + e.externalId + ' → ' + e.status);
        S.notifications.unshift({ id: uid('n'), title: 'Retiro desde Deriv (simulado)', body: e.stateText + '. No se abona ningún saldo automáticamente en modo demo.', ts: now, read: false });
      }
      if (!m.checked3 && now - e.requestedAt >= 180000) { m.checked3 = true; changed = true; log('check3min', 'Comprobación a los 3 min de ' + e.externalId + ': ' + e.status); }
    });
    if (changed) save();
    return changed;
  }
  var timer = null;
  function startPolling() { if (timer) return; reconcile(); timer = setInterval(reconcile, 30000); }

  load();
  g.AuroraData = {
    get: function () { return S; }, save: save, reset: reset, log: log, getLog: getLog,
    money: money, fdate: fdate, ftime: ftime, uid: uid,
    adapters: { demo: demoAdapter, deriv: derivAdapter, bank: bankAdapter },
    reconcile: reconcile, startPolling: startPolling
  };
})(window);
