// js/charts/brandPatternsStyleBreakdown.js
(function(){
  window.brandPatternsCharts = window.brandPatternsCharts || {};

  // Initializes the "Message Style Breakdown" chart (Brand / Patterns)
  // Adds platform logos above the x-axis labels.
  window.brandPatternsCharts.initStyleBreakdown = function(registry){
    const el = document.getElementById("chart-brand-patterns-styleBreakdown");
    if (!el || !window.echarts) return;

    // Reuse existing instance if present
    let chart = window.echarts.getInstanceByDom(el);
    if (!chart) chart = window.echarts.init(el);

    const cats = ["TikTok", "YouTube", "LinkedIn", "Website", "Landing Page"];

    // Logo asset paths (relative to the HTML file)
    const LOGO_BASE = "logos/";
    const logos = {
      tiktok: LOGO_BASE + "tiktok-logo.png",
      youtube: LOGO_BASE + "YouTube-logo.png",
      linkedin: LOGO_BASE + "linkedin-logo.png",
      website: LOGO_BASE + "website-logo.png",
      landing_page: LOGO_BASE + "landing-page-logo.png"
    };

    const option = {
      grid: { left: 40, right: 16, top: 24, bottom: 70 },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: cats,
        axisTick: { alignWithLabel: true },
        axisLabel: {
          interval: 0,
          margin: 16,
          formatter: function(value){
            const key = value
              .toLowerCase()
              .replace(/\s+/g, "_")   // "Landing Page" -> "landing_page"
              .replace(/[^\w_]/g, "");
            return `{logo_${key}|}\n{name|${value}}`;
          },
          rich: {
            // label text
            name: {
              fontSize: 12,
              lineHeight: 16,
              align: "center"
            },

            // logo blocks (one per category)
            logo_tiktok: {
              height: 32,
              width: 32,
              align: "center",
              backgroundColor: { image: logos.tiktok }
            },
            logo_youtube: {
              height: 32,
              width: 32,
              align: "center",
              backgroundColor: { image: logos.youtube }
            },
            logo_linkedin: {
              height: 32,
              width: 32,
              align: "center",
              backgroundColor: { image: logos.linkedin }
            },
            logo_website: {
              height: 32,
              width: 32,
              align: "center",
              backgroundColor: { image: logos.website }
            },
            logo_landing_page: {
              height: 32,
              width: 32,
              align: "center",
              backgroundColor: { image: logos.landing_page }
            }
          }
        }
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: "{value}%" }
      },
      series: [
        { name: "Formal", type: "bar", data: [320, 345, 230, 260, 210] },
        { name: "Casual", type: "bar", data: [330, 310, 190, 240, 280] },
        { name: "Conversational", type: "bar", data: [280, 300, 210, 290, 260] }
      ]
    };

    chart.setOption(option, true);

    // Keep a reference in registry (your existing pattern)
    if (registry && typeof registry.set === "function") {
      registry.set("chart-brand-patterns-styleBreakdown", chart);
    }

    // Resize handler (safe to call multiple times; we namespace on the element id)
    const resizeKey = "__bp_styleBreakdown_resizeBound__";
    if (!chart[resizeKey]) {
      const onResize = () => {
        try { chart.resize(); } catch (e) {}
      };
      chart[resizeKey] = onResize;
      window.addEventListener("resize", onResize);
    }

    return chart;
  };
})();
