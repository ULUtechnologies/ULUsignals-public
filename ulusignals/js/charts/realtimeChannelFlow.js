// js/charts/realtimeChannelFlow.js
(function () {
  function buildOption() {
    const axis = "rgba(255,255,255,.60)";
    const grid = "rgba(255,255,255,.10)";
    const cats = ["Video", "Social", "Display", "CTV", "Other"];

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },
      grid: { left: 34, right: 16, top: 38, bottom: 30, containLabel: true },
      xAxis: {
        type: "category",
        data: cats,
        axisLine: { lineStyle: { color: grid } },
        axisLabel: { color: axis },
        axisTick: { show: false }
      },
      yAxis: {
        type: "value",
        splitLine: { lineStyle: { color: grid } },
        axisLabel: { color: axis },
        axisLine: { show: false }
      },
   legend: {
  top: 6,              // a little padding from the top
  left: 0,
  itemWidth: 10,
  itemHeight: 8,
  itemGap: 12,         // helps readability if you add more legend items later
  textStyle: { color: "rgba(255,255,255,.60)", fontSize: 11 }
},
      series: [
        { name: "Exposure", type: "bar", stack: "t", barWidth: 18, data: [240, 320, 280, 210, 140], itemStyle: { opacity: 0.8 } },
        { name: "Signal",   type: "bar", stack: "t", data: [90, 180, 110, 95, 55], itemStyle: { opacity: 0.85 } },
        { name: "Momentum", type: "bar", stack: "t", data: [20, 45, 32, 25, 18], itemStyle: { opacity: 0.9 } }
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
  window.signalChartModules["signals/Real-Time:flow"] = init;
})();
