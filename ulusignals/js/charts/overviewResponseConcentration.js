// js/charts/overviewResponseConcentration.js
(function () {
  function buildOption() {
    const C = {
      axis: "rgba(255,255,255,.60)",
      grid: "rgba(255,255,255,.10)",
      tooltipBg: "rgba(10,16,32,.92)"
    };

    const cats = ["Views", "Engagement", "Visits", "Actions"];
    const exposed = [12, 18, 26, 33];
    const signal = [6, 9, 14, 18];

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: C.tooltipBg,
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },
      grid: { left: 34, right: 16, top: 18, bottom: 28, containLabel: true },
      xAxis: {
        type: "category",
        data: cats,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: C.grid } },
        axisLabel: { color: C.axis }
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { color: C.grid } },
        axisLabel: { color: C.axis, formatter: v => `${v}%` }
      },
      legend: {
        bottom: 2,
        textStyle: { color: "rgba(255,255,255,.60)" },
        itemWidth: 10,
        itemHeight: 10
      },
      series: [
        { name: "Exposed Entities", type: "bar", stack: "t", data: exposed, barWidth: 20, itemStyle: { color: "rgba(97,198,166,.55)" } },
        { name: "Signal-Bearing Entities", type: "bar", stack: "t", data: signal, itemStyle: { color: "rgba(233,197,106,.75)" } }
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
  window.signalChartModules["signals/Overview:concentration"] = init;
})();
