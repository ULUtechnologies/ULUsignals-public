// js/charts/brandAnalysis.js
(function () {
  function buildOption() {
    const muted = "rgba(255,255,255,.55)";

    return {
      backgroundColor: "transparent",
      title: {
        text: "Sentiment Mix (Demo)",
        left: 8,
        top: 6,
        textStyle: { color: "rgba(255,255,255,.92)", fontSize: 14, fontWeight: 650 }
      },
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },
      legend: {
        bottom: 8,
        left: "center",
        textStyle: { color: muted }
      },
      series: [
        {
          name: "Sentiment",
          type: "pie",
          radius: ["50%", "72%"],
          center: ["50%", "48%"],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: "rgba(17,23,41,1)",
            borderWidth: 2
          },
          label: { color: muted },
          labelLine: { lineStyle: { color: "rgba(255,255,255,.20)" } },
          data: [
            { value: 52, name: "Positive" },
            { value: 33, name: "Neutral" },
            { value: 15, name: "Negative" }
          ]
        }
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
  window.signalChartModules["brand/Analysis"] = init;
})();
