// js/charts/overviewDistributionSnapshot.js
(function () {
  function buildOption() {
    const C = {
      axis: "rgba(255,255,255,.60)",
      grid: "rgba(255,255,255,.10)",
      tooltipBg: "rgba(10,16,32,.92)"
    };

    const cats = ["Awareness", "Interest", "Engagement", "Intent", "Action"];

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: C.tooltipBg,
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" }
      },

      // ✅ more bottom space so the legend never collides/overlaps
      grid: { left: 34, right: 16, top: 10, bottom: 44, containLabel: true },

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
        axisLabel: { color: C.axis }
      },

      // ✅ legend fix: scroll + spacing + alignment
      legend: {
        type: "scroll",
        orient: "horizontal",
        bottom: 6,
        left: "center",
        itemWidth: 12,
        itemHeight: 8,
        itemGap: 14,
        textStyle: {
          color: "rgba(255,255,255,.60)",
          fontSize: 11,
          padding: [0, 0, 0, 4]
        },
        pageIconColor: "rgba(233,197,106,.85)",
        pageIconInactiveColor: "rgba(255,255,255,.25)",
        pageTextStyle: { color: "rgba(255,255,255,.45)" }
      },

      series: [
        { name: "Exposed", type: "bar", stack: "d", barWidth: 18, data: [120,160,210,180,140], itemStyle: { color: "rgba(97,198,166,.45)" } },
        { name: "Signal-Bearing", type: "bar", stack: "d", data: [55,78,110,132,98], itemStyle: { color: "rgba(233,197,106,.70)" } },
        { name: "High-Intent", type: "bar", stack: "d", data: [12,20,32,48,61], itemStyle: { color: "rgba(240,138,75,.75)" } }
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
  window.signalChartModules["signals/Overview:distribution"] = init;
})();
