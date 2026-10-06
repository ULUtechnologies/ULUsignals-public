// js/charts/alertsConfidenceTrend.js
(function () {
  function buildOption() {
    const muted = "rgba(255,255,255,.55)";
    const grid = "rgba(255,255,255,.10)";
    const axis = "rgba(255,255,255,.22)";

    const x = ["Mar 19","Mar 21","Mar 24","Mar 23","Mar 25"];
    const y = [55, 62, 71, 78, 84];

    return {
      backgroundColor: "transparent",
      grid: { left: 44, right: 16, top: 22, bottom: 34 },

      xAxis: {
        type: "category",
        data: x,
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: axis } },
        axisTick: { show: false }
      },
      yAxis: {
        type: "value",
        min: 50,
        max: 90,
        axisLabel: { color: muted, formatter: "{value}%" },
        splitLine: { show: true, lineStyle: { color: grid } }
      },

      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },

      series: [
        {
          name: "Confidence",
          type: "line",
          data: y,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.12 }
        }
      ]
    };
  }

  function init({ elementId, registry }) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (registry && registry.has(elementId)) {
      try { registry.get(elementId).resize(); } catch (_) {}
      return;
    }

    const chart = echarts.init(el);
    if (registry) registry.set(elementId, chart);
    chart.setOption(buildOption(), true);
    setTimeout(() => chart.resize(), 0);
  }

  window.signalChartModules = window.signalChartModules || {};
  window.signalChartModules["signals/Alerts:confidenceTrend"] = init;
})();
