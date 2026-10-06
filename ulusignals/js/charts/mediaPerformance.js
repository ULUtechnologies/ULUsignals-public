// js/charts/mediaPerformance.js
(function () {
  function buildOption() {
    const muted = "rgba(255,255,255,.55)";
    const grid = "rgba(255,255,255,.10)";
    const axis = "rgba(255,255,255,.22)";

    return {
      backgroundColor: "transparent",
      title: {
        text: "CTR & ROAS Trend (Demo)",
        left: 8,
        top: 6,
        textStyle: { color: "rgba(255,255,255,.92)", fontSize: 14, fontWeight: 650 }
      },
      legend: {
        top: 8,
        right: 10,
        textStyle: { color: muted }
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },
      grid: { left: 52, right: 18, top: 56, bottom: 40 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Wk 1","Wk 2","Wk 3","Wk 4","Wk 5","Wk 6"],
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: axis } },
        axisTick: { show: false }
      },
      yAxis: [
        {
          type: "value",
          name: "CTR (%)",
          axisLabel: { color: muted },
          splitLine: { show: true, lineStyle: { color: grid } }
        },
        {
          type: "value",
          name: "ROAS",
          axisLabel: { color: muted },
          splitLine: { show: false }
        }
      ],
      series: [
        { name: "CTR (%)", type: "line", smooth: true, showSymbol: false, data: [1.1, 1.4, 1.3, 1.7, 1.6, 1.9] },
        { name: "ROAS", type: "line", smooth: true, showSymbol: false, yAxisIndex: 1, data: [2.8, 3.0, 3.1, 3.4, 3.3, 3.7] }
      ]
    };
  }

  function init({ elementId, registry }) {
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
  window.signalChartModules["media/Performance"] = init;
})();
