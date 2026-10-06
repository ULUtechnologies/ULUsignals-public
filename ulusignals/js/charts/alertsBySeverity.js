// js/charts/alertsBySeverity.js
(function () {
  function buildOption() {
    const muted = "rgba(255,255,255,.55)";

    const data = [
      { value: 20, name: "High" },
      { value: 45, name: "Medium" },
      { value: 35, name: "Low" }
    ];

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },
      series: [
        {
          type: "pie",
          radius: ["52%", "78%"],
          center: ["38%", "50%"],
          avoidLabelOverlap: true,
          label: { show: false },
          labelLine: { show: false },
          data
        }
      ],
      graphic: [
        {
          type: "text",
          left: "70%",
          top: "30%",
          style: { text: "High", fill: muted, fontSize: 12 }
        },
        {
          type: "text",
          left: "70%",
          top: "40%",
          style: { text: "20%", fill: "rgba(255,255,255,.92)", fontSize: 16, fontWeight: 750 }
        },
        {
          type: "text",
          left: "70%",
          top: "52%",
          style: { text: "Medium", fill: muted, fontSize: 12 }
        },
        {
          type: "text",
          left: "70%",
          top: "62%",
          style: { text: "45%", fill: "rgba(255,255,255,.92)", fontSize: 16, fontWeight: 750 }
        },
        {
          type: "text",
          left: "70%",
          top: "74%",
          style: { text: "Low", fill: muted, fontSize: 12 }
        },
        {
          type: "text",
          left: "70%",
          top: "84%",
          style: { text: "35%", fill: "rgba(255,255,255,.92)", fontSize: 16, fontWeight: 750 }
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
  window.signalChartModules["signals/Alerts:bySeverity"] = init;
})();
