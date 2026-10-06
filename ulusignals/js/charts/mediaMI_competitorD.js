// js/charts/mediaMI_competitorD.js
(function(){
  window.signalChartModules = window.signalChartModules || {};

  function initMiniBars(ctx) {
    if (!window.echarts) {
      console.warn('[signalOS] ECharts not found (window.echarts).');
      return;
    }

    const el = document.getElementById('chart-media-mi-d');
    if (!el) return;

    const chart = window.echarts.getInstanceByDom(el) || window.echarts.init(el, null, { renderer: 'canvas' });

    const categories = ["Signal Decline", "Falling Recall"];
    const data = [48, 42];

    chart.setOption({
      animation: false,
      grid: {
        left: 16,
        right: 18,
        top: 6,
        bottom: 6,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'category',
        data: categories,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,.70)',
          fontSize: 11,
          margin: 12
        }
      },
      series: [
        {
          type: 'bar',
          data: data,
          barWidth: 10,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(255,255,255,.07)',
            borderRadius: 6
          },
          itemStyle: {
            borderRadius: 6,
            color: new window.echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: 'rgba(255,170,170,.92)' },
              { offset: 1, color: 'rgba(255,110,110,.92)' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            color: 'rgba(255,255,255,.80)',
            fontSize: 11,
            formatter: function(p) { return p.value + '%'; }
          }
        }
      ]
    }, true);

    if (ctx && ctx.registry) {
      try { ctx.registry.set('chart-media-mi-d', chart); } catch(e) {}
    }
  }

  window.signalChartModules['media/Market Intelligence/competitorD'] = async function(ctx) {
    initMiniBars(ctx || {});
  };
})();
