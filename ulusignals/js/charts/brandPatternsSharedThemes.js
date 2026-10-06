// js/charts/brandPatternsSharedThemes.js
// Shared Themes Performance Across Platforms (Brand / Patterns)
// Adds platform logos above x-axis labels using ECharts rich axisLabel.
//
// Logos path: ../js/logos/
// Expected filenames:
//   tiktok-logo.png
//   YouTube-logo.png
//   linkedin-logo.png
//   website-logo.png
(function () {
  window.brandPatternsCharts = window.brandPatternsCharts || {};

  window.brandPatternsCharts.initSharedThemes = function (registry) {
    const el = document.getElementById("chart-brand-patterns-sharedThemes");
    if (!el) return;

    let chart = window.echarts.getInstanceByDom(el);
    if (!chart) chart = window.echarts.init(el);

    // Platform categories (match the desired labels shown under the bars)
    const cats = ["TikTok", "YouTube", "LinkedIn", "Website"];

    const option = {
      // More bottom space to fit logo + label
      grid: { left: 40, right: 16, top: 24, bottom: 64 },
      tooltip: { trigger: "axis" },

      xAxis: {
        type: "category",
        data: cats,
        axisTick: { alignWithLabel: true },
        axisLabel: {
          interval: 0,
          margin: 16,
          formatter: function (value) {
            const key = value
              .toLowerCase()
              .replace(/\s+/g, "_")
              .replace(/[^\w_]/g, "");
            return `{logo_${key}|}\n{name|${value}}`;
          },
          rich: {
            name: { fontSize: 12, lineHeight: 16, align: "center" },

            // One logo style per category
            logo_tiktok: {
              height: 32,
              width: 32,
              align: "center",
              backgroundColor: { image: "logos/tiktok-logo.png" }
            },
            logo_youtube: {
              height: 32,
              width: 32,
              align: "center",
              backgroundColor: { image: "logos/YouTube-logo.png" }
            },
            logo_linkedin: {
              height: 32,
              width: 32,
              align: "center",
              backgroundColor: { image: "logos/linkedin-logo.png" }
            },
            logo_website: {
              height: 32,
              width: 32,
              align: "center",
              backgroundColor: { image: "logos/website-logo.png" }
            }
          }
        }
      },

      yAxis: { type: "value", axisLabel: { formatter: "{value}%" } },

      // Same data as your current chart; only the x-axis labels are adjusted
      series: [
        { name: "Theme A", type: "bar", data: [210, 195, 170, 85] },
        { name: "Theme B", type: "bar", data: [180, 210, 175, 160] },
        { name: "Theme C", type: "bar", data: [90, 165, 220, 195] }
      ]
    };

    chart.setOption(option);
    registry.set("chart-brand-patterns-sharedThemes", chart);
    return chart;
  };
})();
