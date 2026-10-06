// js/charts/signalsAlerts.js
// Orchestrator for the Signals / Alerts sub-tab.
// Registers: signals/Alerts
(function () {
  const ORCH_KEY = "signals/Alerts";

  function warnMissing(key) {
    console.warn("[signalOS][Alerts] Missing chart module: " + key);
  }

  function safeInit(modKey, elementId, registry) {
    const mods = window.signalChartModules || {};
    const fn = mods[modKey];
    if (!fn) return warnMissing(modKey);
    try { fn({ elementId, registry }); }
    catch (e) { console.error("[signalOS][Alerts] Error init " + modKey, e); }
  }

  function init({ registry } = {}) {
    console.log("[signalOS] Alerts orchestrator LOADED:", ORCH_KEY);

    safeInit("signals/Alerts:volumeOverTime", "chart-signals-alerts-volume", registry);
    safeInit("signals/Alerts:bySeverity", "chart-signals-alerts-severity", registry);
    safeInit("signals/Alerts:confidenceTrend", "chart-signals-alerts-confidence", registry);

    // When panel becomes visible, ECharts often needs a resize
    requestAnimationFrame(() => {
      try { window.signalCharts?.resizeVisible?.(); } catch (_) {}
    });
  }

  window.signalChartModules = window.signalChartModules || {};
  window.signalChartModules[ORCH_KEY] = init;
})();