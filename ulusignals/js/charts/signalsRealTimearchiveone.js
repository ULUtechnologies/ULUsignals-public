// js/charts/signalsRealtime.js
(function () {
  function buildBaseOption(labels, values) {
    const muted = "rgba(255,255,255,.55)";
    const grid = "rgba(255,255,255,.10)";
    const axis = "rgba(255,255,255,.22)";

    return {
      backgroundColor: "transparent",
      title: {
        text: "Live Signal Rate (Demo)",
        left: 8,
        top: 6,
        textStyle: { color: "rgba(255,255,255,.92)", fontSize: 14, fontWeight: 650 }
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" },
        axisPointer: { type: "line", lineStyle: { color: "rgba(233,197,106,.55)", width: 1 } }
      },
      grid: { left: 52, right: 18, top: 56, bottom: 40 },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: labels,
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: axis } },
        axisTick: { show: false },
        splitLine: { show: false }
      },
      yAxis: {
        type: "value",
        name: "Signals/min",
        nameTextStyle: { color: muted, padding: [0,0,0,6] },
        axisLabel: { color: muted },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: true, lineStyle: { color: grid } }
      },
      series: [
        {
          name: "Signals/min",
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.10 },
          data: values
        }
      ]
    };
  }

  function nowLabel() {
    const d = new Date();
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function init({ elementId, registry }) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // If already created, just resize (panel re-shown)
    const existing = registry.get(elementId);
    if (existing) {
      existing.resize();
      return;
    }

    // Seed 30 points
    const labels = [];
    const values = [];
    let v = 80;

    for (let i = 0; i < 30; i++) {
      labels.push(nowLabel());
      // gentle random walk
      v = Math.max(10, Math.min(160, v + Math.round((Math.random() - 0.5) * 12)));
      values.push(v);
    }

    const chart = echarts.init(el);
    registry.set(elementId, chart);

    // attach per-chart runtime state
    chart.__signalOS = { labels, values, timer: null };

    chart.setOption(buildBaseOption(labels, values), true);
    setTimeout(() => chart.resize(), 0);

    // Start "live" updates
    chart.__signalOS.timer = setInterval(() => {
      // If container removed (tab changed / re-render), stop timer safely
      if (!document.getElementById(elementId) || chart.isDisposed?.()) {
        clearInterval(chart.__signalOS.timer);
        chart.__signalOS.timer = null;
        return;
      }

      labels.shift();
      values.shift();

      labels.push(nowLabel());
      v = Math.max(10, Math.min(160, v + Math.round((Math.random() - 0.5) * 14)));
      values.push(v);

      chart.setOption({
        xAxis: { data: labels },
        series: [{ data: values }]
      }, false);
    }, 1000);
  }

  // Optional: called by manager before dispose (lets us stop timers cleanly)
  function dispose({ elementId, registry }) {
    const chart = registry.get(elementId);
    if (!chart) return;

    if (chart.__signalOS?.timer) {
      clearInterval(chart.__signalOS.timer);
      chart.__signalOS.timer = null;
    }
    chart.dispose();
    registry.delete(elementId);
  }

  window.signalChartModules = window.signalChartModules || {};
  window.signalChartModules["signals/Real-Time"] = init;

  // expose optional disposer for the manager
  window.signalChartDisposers = window.signalChartDisposers || {};
  window.signalChartDisposers["signals/Real-Time"] = dispose;
})();
