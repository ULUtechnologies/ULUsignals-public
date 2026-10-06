// js/charts/signalsTrends.js
// Orchestrator for the Signals / Trends sub-tab.
// Registers: signals/Trends
(function () {
  const ORCH_KEY = 'signals/Trends';

  function warnMissing(key) {
    console.warn('[signalOS][Trends] Missing chart module: ' + key);
  }

  function safeInit(modKey, elementId, registry) {
    const mods = window.signalChartModules || {};
    const fn = mods[modKey];
    if (!fn) {
      warnMissing(modKey);
      return;
    }
    try {
      fn({ elementId, registry });
    } catch (e) {
      console.error('[signalOS][Trends] Error init ' + modKey, e);
    }
  }

  async function init({ registry } = {}) {
    console.log('[signalOS] Trends orchestrator LOADED: ' + ORCH_KEY);

    // These MUST match:
    // 1) keys used by the 3 chart modules
    // 2) the element IDs in your Trends panel markup
    safeInit('signals/Trends:engagedStrength', 'chart-signals-trends-engagedStrength', registry);
    safeInit('signals/Trends:responseMix', 'chart-signals-trends-responseMix', registry);
    safeInit('signals/Trends:byChannel', 'chart-signals-trends-byChannel', registry);

    // When the tab becomes visible, ECharts often needs a resize to render correctly.
    requestAnimationFrame(() => {
      try {
        registry?.resizeAll?.();
      } catch (_) {}
    });
  }

  window.signalChartModules = window.signalChartModules || {};
  window.signalChartModules[ORCH_KEY] = init;
})();
