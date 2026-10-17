/* ================================================================
 * nequi-sim.js — retiros SIMULADOS a "Nequi" (solo registro local).
 * No hay integración con Nequi, Deriv ni ningún banco: no se transfiere dinero,
 * no se genera ninguna autorización oficial y el saldo de Nequi no cambia.
 * Los registros viven en localStorage y se crean una sola vez por retiro.
 *
 * Fórmula (valores de PRUEBA, configurables; no son una cotización):
 *   brutoCOP    = round(usd × tasa)
 *   comisionCOP = round(brutoCOP × %comisión / 100)
 *   netoCOP     = brutoCOP − comisionCOP
 * ================================================================ */
(function (root, factory) {
  var api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NequiSim = api;
})(typeof window !== 'undefined' ? window : this, function (root) {
  'use strict';
  var REC_KEY = 'tradelab-nequi-sim-v1', CFG_KEY = 'tradelab-nequi-sim-cfg-v1';
  // Valores de ejemplo para pruebas (10 USD → 34.684 bruto → 29.481 neto). NO son una tasa real.
  var DEFAULT_CFG = { rate: 3468.4, feePct: 15 };
  var CONCEPT = 'TRANSF DE COLPROCESA S.A.S.';
  var store = (function () { try { return root.localStorage || null; } catch (_) { return null; } })();

  function num(v) { var n = Number(v); return isFinite(n) ? n : NaN; }

  function getConfig() {
    var c = {};
    try { c = JSON.parse(store.getItem(CFG_KEY) || '{}') || {}; } catch (_) {}
    var rate = num(c.rate), fee = num(c.feePct);
    return { rate: rate > 0 ? rate : DEFAULT_CFG.rate, feePct: fee >= 0 && fee < 100 ? fee : DEFAULT_CFG.feePct };
  }
  function setConfig(cfg) {
    var rate = num(cfg && cfg.rate), fee = num(cfg && cfg.feePct);
    if (!(rate > 0) || !(fee >= 0 && fee < 100)) return false;
    try { store.setItem(CFG_KEY, JSON.stringify({ rate: rate, feePct: fee })); return true; } catch (_) { return false; }
  }

  /** Calcula bruto / comisión / neto en COP. Devuelve null si el importe o la configuración no son válidos. */
  function calc(usd, cfg) {
    cfg = cfg || getConfig();
    var amt = num(usd), rate = num(cfg.rate), pct = num(cfg.feePct);
    if (!(amt > 0) || !(rate > 0) || !(pct >= 0 && pct < 100)) return null;
    var gross = Math.round(amt * rate);
    var fee = Math.round(gross * pct / 100);
    return { usd: amt, rate: rate, feePct: pct, grossCOP: gross, feeCOP: fee, netCOP: gross - fee };
  }

  function list() {
    try { var l = JSON.parse(store.getItem(REC_KEY) || '[]'); return Array.isArray(l) ? l : []; } catch (_) { return []; }
  }
  function save(l) { try { store.setItem(REC_KEY, JSON.stringify(l)); return true; } catch (_) { return false; } }
  function get(id) { var l = list(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }

  /**
   * Crea (una sola vez) el registro de un retiro de prueba hecho con Nequi.
   * w = registro del retiro del simulador ({ id, amount, ts }). Devuelve { ok, record, created } o { ok:false, reason }.
   */
  function register(w) {
    if (!w || w.id == null) return { ok: false, reason: 'sin-retiro' };
    var c = calc(w.amount);
    if (!c) return { ok: false, reason: 'importe-invalido' };
    var id = 'SIM-NQ-' + w.id, prev = get(id);
    if (prev) return { ok: true, record: prev, created: false };
    var rec = {
      id: id, withdrawalId: String(w.id), ts: Number(w.ts) || Date.now(), method: 'Nequi', concept: CONCEPT,
      usd: c.usd, rate: c.rate, grossCOP: c.grossCOP, feePct: c.feePct, feeCOP: c.feeCOP, netCOP: c.netCOP,
      status: 'Simulación', ref: 'REF-INT-' + w.id
    };
    var l = list(); l.unshift(rec);
    if (!save(l)) return { ok: false, reason: 'storage' };
    return { ok: true, record: rec, created: true };
  }

  /** Alinea el estado con el retiro del simulador (si se canceló allí, aquí también). No crea registros nuevos. */
  function reconcile(withdrawals) {
    var l = list(), changed = false, ws = withdrawals || [];
    l.forEach(function (r) {
      var w = null; ws.forEach(function (x) { if (String(x.id) === r.withdrawalId) w = x; });
      if (w && w.status === 'Cancelado' && r.status !== 'Cancelado') { r.status = 'Cancelado'; changed = true; }
    });
    if (changed) save(l);
    return l;
  }

  return { CONCEPT: CONCEPT, DEFAULT_CFG: DEFAULT_CFG, getConfig: getConfig, setConfig: setConfig, calc: calc, list: list, get: get, register: register, reconcile: reconcile };
});
