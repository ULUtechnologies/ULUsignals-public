// js/charts/signalsRealTime.js
(function () {
  async function init({ registry }) {
    const modules = window.signalChartModules || {};

    if (modules["signals/Real-Time:pulse"]) {
      await modules["signals/Real-Time:pulse"]({ elementId: "chart-signals-realtime-pulse", registry });
    }
    if (modules["signals/Real-Time:flow"]) {
      await modules["signals/Real-Time:flow"]({ elementId: "chart-signals-realtime-flow", registry });
    }
    if (modules["signals/Real-Time:volatility"]) {
      await modules["signals/Real-Time:volatility"]({ elementId: "chart-signals-realtime-volatility", registry });
    }
  }

  window.signalChartModules = window.signalChartModules || {};
  window.signalChartModules["signals/Real-Time"] = init;
})();