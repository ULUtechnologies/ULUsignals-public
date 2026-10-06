// js/charts/alertsVolumeOverTime.js
(function () {
  function buildOption() {
    const muted = "rgba(255,255,255,.55)";
    const grid = "rgba(255,255,255,.10)";
    const axis = "rgba(255,255,255,.22)";

    const labels = ["Mar 19","Mar 19","Mar 21","Mar 23","Mar 24","Mar 25","Mar 28","Mar 25"];

    return {
      backgroundColor: "transparent",
      grid: { left: 44, right: 16, top: 36, bottom: 34 },

      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: axis } },
        axisTick: { show: false }
      },
      yAxis: {
        type: "value",
        axisLabel: { color: muted },
        splitLine: { show: true, lineStyle: { color: grid } }
      },

      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" },
        axisPointer: { type: "line" }
      },

      series: [
        // Bars (volume)
        {
          name: "Alert Volume",
          type: "bar",
          data: [3,4,4,5,7,9,10,11],
          barWidth: "52%",
          itemStyle: { opacity: 0.95 }
        },
        // Line (trend)
        {
          name: "Trend",
          type: "line",
          data: [6.0,6.6,6.9,7.0,8.8,10.4,10.7,11.6],
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 2 },
          itemStyle: { opacity: 0.95 }
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
  window.signalChartModules["signals/Alerts:volumeOverTime"] = init;
})();
