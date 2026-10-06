// js/charts/signalsOverview.js
(function () {
  async function init({ registry }) {
    const modules = window.signalChartModules || {};

    // Call each Overview chart module (safe if missing)
    if (modules["signals/Overview:world"]) {
      await modules["signals/Overview:world"]({ elementId: "chart-signals-overview-world", registry });
    }
    if (modules["signals/Overview:distribution"]) {
      await modules["signals/Overview:distribution"]({ elementId: "chart-signals-overview-distribution", registry });
    }
    if (modules["signals/Overview:momentum"]) {
      await modules["signals/Overview:momentum"]({ elementId: "chart-signals-overview-momentum", registry });
    }
  }

  window.signalChartModules = window.signalChartModules || {};
  // chartManager still triggers this ONE key when the panel is opened:
  window.signalChartModules["signals/Overview"] = init;
})();
