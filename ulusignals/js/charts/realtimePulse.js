// js/charts/realtimePulse.js
(function () {
  function buildOption() {
    const axis = "rgba(255,255,255,.60)";
    const grid = "rgba(255,255,255,.10)";

    // demo last 60 min labels
    const labels = ["10:10", "10:15", "10:20", "10:25", "10:30", "10:35", "10:40", "10:45", "10:50", "10:55", "11:00", "11:05", "11:10"];
    const signalBearing = [210, 260, 280, 310, 330, 360, 420, 480, 520, 510, 545, 560, 585];
    const activeExposure = [980, 1020, 1060, 1105, 1160, 1210, 1280, 1330, 1385, 1410, 1460, 1490, 1520];

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },
      grid: { left: 36, right: 16, top: 12, bottom: 28, containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: labels,
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
        bottom: 2,
        left: "center",
        itemWidth: 12,
        itemHeight: 8,
        textStyle: { color: "rgba(255,255,255,.60)", fontSize: 11 }
      },
      series: [
        {
          name: "Signal-Bearing",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: signalBearing,
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.12 }
        },
        {
          name: "Active Exposure",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: activeExposure,
          lineStyle: { width: 1.6, opacity: 0.65 },
          areaStyle: { opacity: 0.06 }
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
  window.signalChartModules["signals/Real-Time:pulse"] = init;
})();
