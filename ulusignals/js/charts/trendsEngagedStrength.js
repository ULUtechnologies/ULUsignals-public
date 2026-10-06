// js/charts/trendsEngagedStrength.js
// Registers: signals/Trends:engagedStrength
(function () {
  const KEY = 'signals/Trends:engagedStrength';

  function buildOption() {
    const muted = 'rgba(255,255,255,.55)';
    const gridLine = 'rgba(255,255,255,.10)';

    const x = ['Mar 1','Mar 3','Mar 5','Mar 7','Mar 9','Mar 11','Mar 13','Mar 15','Mar 17','Mar 19','Mar 21','Mar 23'];
    const audience = [32000, 36000, 38500, 41000, 45500, 47000, 49500, 52000, 56500, 61000, 66500, 72000];
    const strengthPct = [0.34, 0.38, 0.40, 0.42, 0.44, 0.43, 0.45, 0.48, 0.50, 0.53, 0.55, 0.57];

    return {
      grid: { left: 56, right: 56, top: 40, bottom: 38 },
      tooltip: { trigger: 'axis' },
      legend: {
        top: 8,
        textStyle: { color: muted },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 16
      },
      xAxis: {
        type: 'category',
        data: x,
        axisLine: { lineStyle: { color: gridLine } },
        axisTick: { show: false },
        axisLabel: { color: muted, margin: 10 }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Audience',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: gridLine } },
          axisLabel: { color: muted, formatter: (v) => (v / 1000) + 'k' }
        },
        {
          type: 'value',
          name: 'Engagement',
          min: 0.2,
          max: 0.6,
          axisLine: { show: false },
          splitLine: { show: false },
          axisLabel: { color: muted, formatter: (v) => Math.round(v * 100) + '%' }
        }
      ],
      series: [
        {
          name: 'Engaged Audience',
          type: 'bar',
          barWidth: 16,
          data: audience,
          emphasis: { focus: 'series' }
        },
        {
          name: 'Engagement Strength',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2 },
          data: strengthPct
        }
      ]
    };
  }

  function init({ elementId, registry } = {}) {
    if (!window.echarts) {
      console.warn('[signalOS][Trends] echarts not loaded for', KEY);
      return;
    }
    const el = document.getElementById(elementId);
    if (!el) {
      console.warn('[signalOS][Trends] Missing element for', KEY, elementId);
      return;
    }

    const chart = window.echarts.init(el);
    chart.setOption(buildOption(), true);

    if (registry && registry.charts) {
      registry.charts[elementId] = chart;
    }

    return {
      resize: () => chart.resize(),
      dispose: () => chart.dispose()
    };
  }

  window.signalChartModules = window.signalChartModules || {};
  window.signalChartModules[KEY] = init;
  console.log('[signalOS] Chart module LOADED:', KEY);
})();
