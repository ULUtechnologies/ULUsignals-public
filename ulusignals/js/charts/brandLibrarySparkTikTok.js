// js/charts/brandLibrarySparkTikTok.js
(function () {
  window.signalLibrarySparks = window.signalLibrarySparks || {};

  window.signalLibrarySparks["tiktok"] = function ({ registry, ensureChart }) {
    const elementId = "chart-brandlib-spark-tiktok";
    const chart = ensureChart(registry, elementId);
    if (!chart) return;

    const option = {
      animation: false,
      grid: { left: 2, right: 2, top: 2, bottom: 2 },
      xAxis: {
        type: "category",
        show: false,
        data: [1, 2, 3, 4, 5, 6, 7]
      },
      yAxis: {
        type: "value",
        show: false
      },
      series: [{
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 2, opacity: 0.9 },
        areaStyle: { opacity: 0.08 },
        data: [12, 18, 14, 22, 19, 26, 21]
      }]
    };

    chart.setOption(option, true);
  };
})();