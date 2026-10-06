(function () {
  function buildOption() {
    const muted = "rgba(255,255,255,.65)";
    const gridLine = "rgba(255,255,255,.08)";

    const days = ["W1","W2","W3","W4"];
    const views = [120, 150, 170, 190];
    const interactions = [55, 70, 85, 95];
    const visits = [35, 42, 55, 62];

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
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
        data: days,
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
        { name: "Views", type: "line", smooth: true, areaStyle: { opacity: 0.18 }, data: views, symbolSize: 5 },
        { name: "Interactions", type: "line", smooth: true, areaStyle: { opacity: 0.18 }, data: interactions, symbolSize: 5 },
        { name: "Visits", type: "line", smooth: true, areaStyle: { opacity: 0.18 }, data: visits, symbolSize: 5 }
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
  window.signalChartModules["signals/Trends:responseMix"] = init;
})();
