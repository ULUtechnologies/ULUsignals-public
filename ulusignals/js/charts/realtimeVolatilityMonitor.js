// js/charts/realtimeVolatilityMonitor.js
(function () {
  function buildOption() {
    const axis = "rgba(255,255,255,.60)";
    const grid = "rgba(255,255,255,.10)";

    const labels = ["Week/Base 7", "", "", "Last 3", "", "", "Last 2", "", "Now"];
    const values = [38, 39, 41, 40, 42, 39, 41, 43, 42];

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },
      grid: { left: 34, right: 16, top: 14, bottom: 28, containLabel: true },
      xAxis: {
        type: "category",
        data: labels,
        axisLine: { lineStyle: { color: grid } },
        axisLabel: { color: axis },
        axisTick: { show: false }
      },
      yAxis: {
        type: "value",
        min: 30,
        max: 50,
        splitLine: { lineStyle: { color: grid } },
        axisLabel: { color: axis },
        axisLine: { show: false }
      },
      series: [
        {
          name: "Volatility",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: values,
          lineStyle: { width: 1.8, opacity: 0.8 },
          areaStyle: { opacity: 0.08 },
          markLine: {
            silent: true,
            symbol: "none",
            lineStyle: { opacity: 0.35, width: 1 },
            data: [{ yAxis: 46, name: "Anomaly" }]
          }
        }
      ]
    };
  }

  async function init({ elementId, registry }) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (registry.has(elementId)) {
      registry.get(elementId).resize();
      return;
    }

    const chart = echarts.init(el);
    registry.set(elementId, chart);
    chart.setOption(buildOption(), true);
    setTimeout(() => chart.resize(), 0);
  }

  window.signalChartModules = window.signalChartModules || {};
  window.signalChartModules["signals/Real-Time:volatility"] = init;
})();
