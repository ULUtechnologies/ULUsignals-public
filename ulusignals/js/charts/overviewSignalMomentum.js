// js/charts/overviewSignalMomentum.js
(function () {
  function buildOption() {
    const C = {
      axis: "rgba(255,255,255,.60)",
      grid: "rgba(255,255,255,.10)",
      tooltipBg: "rgba(10,16,32,.92)"
    };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const volume = [220, 310, 295, 340, 385, 420, 470];
    const signals = [60, 72, 80, 88, 96, 112, 128];

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: C.tooltipBg,
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },
      grid: { left: 34, right: 16, top: 10, bottom: 26, containLabel: true },
      xAxis: {
        type: "category",
        data: days,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: C.grid } },
        axisLabel: { color: C.axis }
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { color: C.grid } },
        axisLabel: { color: C.axis }
      },
      legend: { bottom: 2, textStyle: { color: "rgba(255,255,255,.60)" } },
      series: [
        { name: "Volume", type: "bar", data: volume, barWidth: 18, itemStyle: { color: "rgba(255,255,255,.10)" } },
        {
          name: "Signal-Bearing",
          type: "line",
          data: signals,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: { width: 2, color: "rgba(233,197,106,.85)" },
          itemStyle: { color: "rgba(233,197,106,.90)" }
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
  window.signalChartModules["signals/Overview:momentum"] = init;
})();
