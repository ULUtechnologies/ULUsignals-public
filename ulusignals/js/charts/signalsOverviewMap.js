// js/charts/signalsOverviewMap.js
(function () {
  const MAP_NAME = "USA";

  // Demo "responses" (lng, lat, value) near major metros
  const POINTS = [
    [-122.4194, 37.7749, 120], // SF
    [-118.2437, 34.0522, 180], // LA
    [-122.3321, 47.6062, 90],  // Seattle
    [-112.0740, 33.4484, 70],  // Phoenix
    [-104.9903, 39.7392, 85],  // Denver
    [-97.7431, 30.2672, 95],   // Austin
    [-96.7970, 32.7767, 110],  // Dallas
    [-87.6298, 41.8781, 130],  // Chicago
    [-84.3880, 33.7490, 105],  // Atlanta
    [-80.1918, 25.7617, 115],  // Miami
    [-77.0369, 38.9072, 140],  // DC
    [-74.0060, 40.7128, 200],  // NYC
    [-71.0589, 42.3601, 125]   // Boston
  ];

  function buildOption() {
    const muted = "rgba(255,255,255,.55)";
    const axis = "rgba(255,255,255,.18)";

    return {
      backgroundColor: "transparent",
      title: {
        text: "Ad Response Hotspots (Demo)",
        left: 8,
        top: 6,
        textStyle: { color: "rgba(255,255,255,.92)", fontSize: 14, fontWeight: 650 }
      },

      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" },
        formatter: (p) => {
          // For heatmap points, p.value is [lng, lat, val]
          if (Array.isArray(p.value)) return `Responses: <b>${p.value[2]}</b>`;
          return p.name ? `${p.name}` : "";
        }
      },

      // Heat intensity scale
      visualMap: {
        min: 0,
        max: 220,
        calculable: false,
        left: 10,
        bottom: 10,
        text: ["High", "Low"],
        textStyle: { color: muted },
        inRange: {
          // Don’t hardcode exact colors if you want; but “inRange” needs some palette.
          // This palette leans warm and works on dark backgrounds.
          color: ["rgba(97,198,166,.15)", "rgba(233,197,106,.45)", "rgba(240,138,75,.75)"]
        }
      },

      geo: {
        map: MAP_NAME,
        roam: true,
        zoom: 1.1,
        itemStyle: {
          areaColor: "rgba(255,255,255,.05)",
          borderColor: axis
        },
        emphasis: {
          itemStyle: {
            areaColor: "rgba(233,197,106,.18)"
          }
        }
      },

      series: [
        // Heat overlay on top of the geo map
        {
          name: "Responses",
          type: "heatmap",
          coordinateSystem: "geo",
          data: POINTS,
          // blurSize controls how “hotspotty” it feels
          blurSize: 22,
          pointSize: 10
        },

        // Optional: add small dots so users can see where the hotspots are anchored
        {
          name: "Anchors",
          type: "scatter",
          coordinateSystem: "geo",
          data: POINTS.map(p => [p[0], p[1], p[2]]),
          symbolSize: 4,
          itemStyle: { opacity: 0.6 }
        }
      ]
    };
  }

  async function ensureMapRegistered() {
    // Register once per page load
    if (echarts.getMap && echarts.getMap(MAP_NAME)) return;

    const res = await fetch("data/geo/usa.json");
    const usaJson = await res.json();

    // ECharts’ USA example also repositions Alaska/Hawaii/Puerto Rico via special areas. :contentReference[oaicite:3]{index=3}
    echarts.registerMap(MAP_NAME, usaJson, {
      Alaska: { left: -131, top: 25, width: 15 },
      Hawaii: { left: -110, top: 28, width: 5 },
      "Puerto Rico": { left: -76, top: 26, width: 2 }
    });
  }

  async function init({ elementId, registry }) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (registry.has(elementId)) {
      registry.get(elementId).resize();
      return;
    }

    await ensureMapRegistered();

    const chart = echarts.init(el);
    registry.set(elementId, chart);
    chart.setOption(buildOption(), true);
    setTimeout(() => chart.resize(), 0);
  }

  window.signalChartModules = window.signalChartModules || {};
  window.signalChartModules["signals/Overview"] = init;
})();
