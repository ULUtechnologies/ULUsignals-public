// js/charts/brandPatternsMessageLength.js
(function(){
  window.brandPatternsCharts = window.brandPatternsCharts || {};

  window.brandPatternsCharts.initMessageLength = function(registry){
    const el = document.getElementById("chart-brand-patterns-messageLength");
    if (!el) return;

    let chart = window.echarts.getInstanceByDom(el);
    if (!chart) chart = window.echarts.init(el);

    const option = {
      grid: { left: 90, right: 16, top: 18, bottom: 26 },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      xAxis: { type: "value" },
      yAxis: { type: "category", data: ["Formal", "Casual", "Conversational"] },
      series: [
        { name: "Words", type: "bar", data: [72, 58, 64] }
      ]
    };

    chart.setOption(option);
    registry.set("chart-brand-patterns-messageLength", chart);
    return chart;
  };
})();
