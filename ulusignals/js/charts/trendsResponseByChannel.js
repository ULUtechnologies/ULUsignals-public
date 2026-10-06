(function () {
  function buildOption() {
    const muted = "rgba(255,255,255,.65)";
    const gridLine = "rgba(255,255,255,.08)";

    const weeks = ["W1","W2","W3","W4"];
    const video = [80, 95, 110, 130];
    const social = [65, 78, 92, 105];
    const display = [38, 44, 48, 52];
    const ctv = [28, 30, 34, 36];

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
      legend: {
        bottom: 2,
        left: 8,
        textStyle: { color: muted },
        itemWidth: 10,
        itemHeight: 10
      },
      grid: { left: 34, right: 14, top: 12, bottom: 32, containLabel: true },
      xAxis: {
        type: "category",
        data: weeks,
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: gridLine } },
        axisTick: { show: false }
      },
      yAxis: {
        type: "value",
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: gridLine } },
        axisLine: { show: false }
      },
      series: [
        { name: "Video", type: "bar", stack: "total", data: video, barWidth: "55%", itemStyle: { opacity: 0.92 } },
        { name: "Social", type: "bar", stack: "total", data: social, itemStyle: { opacity: 0.92 } },
        { name: "Display", type: "bar", stack: "total", data: display, itemStyle: { opacity: 0.92 } },
        { name: "CTV", type: "bar", stack: "total", data: ctv, itemStyle: { opacity: 0.92 } }
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
  window.signalChartModules["signals/Trends:byChannel"] = init;
})();
