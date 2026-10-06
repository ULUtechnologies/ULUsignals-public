// js/charts/signalsUnified.js
(function () {
  window.signalChartModules = window.signalChartModules || {};

  function initChart(registry, id, option) {
    const el = document.getElementById(id);
    if (!el || !window.echarts) return null;
    let chart = registry.get(id) || echarts.getInstanceByDom(el);
    if (!chart) chart = echarts.init(el, null, { renderer: 'canvas' });
    chart.setOption(option, true);
    registry.set(id, chart);
    return chart;
  }

  const text = 'rgba(255,255,255,.78)';
  const gridLine = 'rgba(255,255,255,.10)';
  const tooltip = {
    trigger: 'item',
    backgroundColor: 'rgba(8,18,38,.96)',
    borderColor: 'rgba(255,255,255,.12)',
    textStyle: { color: '#fff' }
  };

  function gaugeOption(value, colors) {
    return {
      animationDuration: 650,
      series: [{
        type: 'gauge',
        startAngle: 205,
        endAngle: -25,
        min: 0,
        max: 100,
        radius: '92%',
        center: ['50%', '58%'],
        axisLine: { lineStyle: { width: 12, color: [[0.18, colors[0]], [0.72, colors[1]], [1, colors[2]]] } },
        progress: { show: true, width: 12, roundCap: true, itemStyle: { color: colors[1] } },
        pointer: { show: false },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        detail: {
          valueAnimation: true,
          formatter: function (v) { return '{value|' + Math.round(v) + '}\n{unit|/100}'; },
          rich: {
            value: { color: '#fff', fontSize: 34, fontWeight: 800, lineHeight: 42 },
            unit: { color: 'rgba(255,255,255,.86)', fontSize: 15, lineHeight: 20 }
          },
          offsetCenter: [0, '14%']
        },
        data: [{ value: value }]
      }]
    };
  }

  window.signalChartModules['signals/Dashboard'] = async function ({ registry }) {
    initChart(registry, 'chart-signals-human-connection', gaugeOption(82, ['#ff4f35', '#ffd84c', '#68d65b']));
    initChart(registry, 'chart-signals-trust-score', gaugeOption(76, ['#5857f2', '#5b88ff', '#4aa7ff']));
    initChart(registry, 'chart-signals-action-likelihood', gaugeOption(88, ['#8b42e8', '#e955ba', 'rgba(255,255,255,.28)']));

    initChart(registry, 'chart-signals-momentum-spark', {
      animationDuration: 650,
      grid: { left: 4, right: 6, top: 8, bottom: 6 },
      xAxis: { type: 'category', show: false, data: ['1','2','3','4','5','6','7','8','9','10'] },
      yAxis: { type: 'value', show: false, min: 55, max: 95 },
      series: [{
        type: 'line',
        data: [61, 72, 72, 69, 78, 84, 81, 79, 86, 94],
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { width: 3, color: '#6bd05a' },
        itemStyle: { color: '#6bd05a' },
        areaStyle: { color: 'rgba(107,208,90,.10)' }
      }]
    });

    initChart(registry, 'chart-signals-behavior-profile', {
      tooltip,
      radar: {
        center: ['50%', '45%'],
        radius: '58%',
        splitNumber: 5,
        axisName: { color: '#fff', fontSize: 12, padding: [2, 2, 2, 2] },
        splitLine: { lineStyle: { color: 'rgba(170,120,255,.20)' } },
        splitArea: { areaStyle: { color: ['rgba(145,62,231,.08)', 'rgba(145,62,231,.03)'] } },
        axisLine: { lineStyle: { color: 'rgba(170,120,255,.20)' } },
        indicator: [
          { name: 'Attention\n82', max: 100 },
          { name: 'Trust\n76', max: 100 },
          { name: 'Relatability\n84', max: 100 },
          { name: 'Action\n78', max: 100 },
          { name: 'Loyalty\n77', max: 100 },
          { name: 'Curiosity\n81', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: [
          { value: [82, 76, 84, 78, 77, 81], name: 'Your Score', areaStyle: { color: 'rgba(145,62,231,.50)' }, lineStyle: { color: '#9a50f2', width: 3 }, itemStyle: { color: '#c576ff' } },
          { value: [66, 63, 68, 62, 64, 67], name: 'Platform Avg.', lineStyle: { color: 'rgba(255,255,255,.45)', width: 2, type: 'dashed' }, itemStyle: { opacity: 0 }, areaStyle: { opacity: 0 } }
        ]
      }]
    });

    initChart(registry, 'chart-signals-response-breakdown', {
      tooltip,
      legend: { orient: 'vertical', right: 4, top: 'middle', itemWidth: 12, itemHeight: 12, textStyle: { color: text, fontSize: 12 }, formatter: function (name) {
        const map = { Saves: 'Saves     31% (38.8K)', Likes: 'Likes     26% (32.6K)', Comments: 'Comments  18% (22.6K)', Shares: 'Shares    13% (16.3K)', Clicks: 'Clicks     8% (10.1K)', Purchases: 'Purchases  4% (5.0K)' };
        return map[name] || name;
      } },
      series: [{
        type: 'pie',
        radius: ['50%', '83%'],
        center: ['32%', '52%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'center',
          formatter: '{title|Total}\n{title|Responses}\n{value|125.4K}',
          rich: {
            title: { color: '#fff', fontSize: 14, fontWeight: 800, lineHeight: 20, align: 'center' },
            value: { color: '#fff', fontSize: 17, fontWeight: 900, lineHeight: 23, align: 'center' }
          }
        },
        emphasis: { label: { show: true } },
        labelLine: { show: false },
        data: [
          { value: 31, name: 'Saves', itemStyle: { color: '#4da3ff' } },
          { value: 26, name: 'Likes', itemStyle: { color: '#ffc72f' } },
          { value: 18, name: 'Comments', itemStyle: { color: '#8f4be8' } },
          { value: 13, name: 'Shares', itemStyle: { color: '#e95d7c' } },
          { value: 8, name: 'Clicks', itemStyle: { color: '#9aa99c' } },
          { value: 4, name: 'Purchases', itemStyle: { color: '#9bc5d8' } }
        ]
      }]
    });

    initChart(registry, 'chart-signals-audience-momentum', {
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(8,18,38,.96)', borderColor: 'rgba(255,255,255,.12)', textStyle: { color: '#fff' } },
      legend: { bottom: 0, textStyle: { color: text }, data: ['Volume', 'Connection Score'] },
      grid: { left: 46, right: 42, top: 24, bottom: 42 },
      xAxis: { type: 'category', data: ['Mon','Tue','Wed','Thu','Sat','Sun'], axisLine: { lineStyle: { color: gridLine } }, axisLabel: { color: text } },
      yAxis: [
        { type: 'value', min: 0, max: 1000, axisLabel: { color: text, formatter: function (v) { return v === 1000 ? '1K' : v; } }, splitLine: { lineStyle: { color: gridLine } } },
        { type: 'value', min: 0, max: 100, axisLabel: { color: text }, splitLine: { show: false } }
      ],
      series: [
        { name: 'Volume', type: 'bar', barWidth: 36, data: [560, 640, 590, 810, 765, 720], itemStyle: { color: 'rgba(84,116,152,.55)' } },
        { name: 'Connection Score', type: 'line', yAxisIndex: 1, smooth: true, symbolSize: 8, data: [68, 76, 64, 74, 88, 89], lineStyle: { color: '#ffc626', width: 3 }, itemStyle: { color: '#ffc626' } }
      ]
    });
  };
})();
