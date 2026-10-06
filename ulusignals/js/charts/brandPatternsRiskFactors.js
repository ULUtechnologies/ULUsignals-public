// js/charts/brandPatternsRiskFactors.js
// Engagement Risk Factors by Platform (Brand / Patterns)
// Updated to show platform logos above x-axis labels using ECharts rich axisLabel.
//
// Logos path (as provided): ../js/logos/
// Expected filenames:
//   tiktok-logo.png
//   YouTube-logo.png
//   linkedin-logo.png
//   website-logo.png
(function(){
  window.brandPatternsCharts = window.brandPatternsCharts || {};

  window.brandPatternsCharts.initRiskFactors = function(registry){
    const el = document.getElementById("chart-brand-patterns-riskFactors");
    if (!el) return;

    let chart = window.echarts.getInstanceByDom(el);
    if (!chart) chart = window.echarts.init(el);

    const cats = ["TikTok", "YouTube", "LinkedIn", "Website"];

    const option = {
      grid: { left: 44, right: 16, top: 24, bottom: 64 },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },

      xAxis: {
        type: "category",
        data: cats,
        axisTick: { alignWithLabel: true },
        axisLabel: {
          interval: 0,
          margin: 16,
          formatter: function (value) {
            const key = value.toLowerCase().replace(/\s+/g, "_").replace(/[^\w_]/g, "");
            return `{logo_${key}|}\n{name|${value}}`;
          },
          rich: {
            name: { fontSize: 12, lineHeight: 16, align: "center" },

            logo_tiktok:   { height: 32, width: 32, align: "center", backgroundColor: { image: "logos/tiktok-logo.png" } },
            logo_youtube:  { height: 32, width: 32, align: "center", backgroundColor: { image: "logos/YouTube-logo.png" } },
            logo_linkedin: { height: 32, width: 32, align: "center", backgroundColor: { image: "logos/linkedin-logo.png" } },
            logo_website:  { height: 32, width: 32, align: "center", backgroundColor: { image: "logos/website-logo.png" } }
          }
        }
      },

      yAxis: { type: "value", axisLabel: { formatter: "{value}%" } },
      series: [
        { name: "Neg Sentiment", type: "bar", stack: "risk", data: [6, 5, 7, 6] },
        { name: "Reply Volatility", type: "bar", stack: "risk", data: [8, 7, 9, 7] },
        { name: "Drop-off Risk", type: "bar", stack: "risk", data: [5, 6, 7, 6] }
      ]
    };

    chart.setOption(option);
    registry.set("chart-brand-patterns-riskFactors", chart);
    return chart;
  };
})();
