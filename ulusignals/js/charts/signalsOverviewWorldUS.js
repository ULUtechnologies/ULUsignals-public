// js/charts/signalsOverviewWorldUS.js
(function () {
  console.log("[signalOS] Overview module LOADED: WORLD+US LINES v3");

  const WORLD = "WORLD";
  const USA_STATES = "USA_STATES";

  const POINTS_US = [
    [-74.0060, 40.7128, 210],
    [-118.2437, 34.0522, 190],
    [-87.6298, 41.8781, 150],
    [-95.3698, 29.7604, 120],
    [-122.3321, 47.6062, 95],
    [-80.1918, 25.7617, 110],
    [-77.0369, 38.9072, 140],
    [-71.0589, 42.3601, 125]
  ];

  async function ensureMapsRegistered() {
    if (!echarts.getMap(WORLD)) {
      const world = await fetch("data/geo/world.json").then(r => r.json());
      echarts.registerMap(WORLD, world);
    }
    if (!echarts.getMap(USA_STATES)) {
      const usa = await fetch("data/geo/USA.json").then(r => r.json());
      // IMPORTANT: no specialAreas for world overlay
      echarts.registerMap(USA_STATES, usa);
    }
  }

  function buildStateBoundaryLines(geoJson) {
    const lines = [];
    const pushRing = (ring) => {
      if (!Array.isArray(ring) || ring.length < 2) return;
      lines.push({ coords: ring });
    };

    for (const f of (geoJson.features || [])) {
      const g = f.geometry;
      if (!g) continue;

      if (g.type === "Polygon") {
        for (const ring of g.coordinates || []) pushRing(ring);
      } else if (g.type === "MultiPolygon") {
        for (const poly of g.coordinates || []) {
          for (const ring of poly || []) pushRing(ring);
        }
      }
    }
    return lines;
  }

  function buildOption(stateLines) {
    const land = "rgba(255,255,255,.04)";
    const worldBorder = "rgba(255,255,255,.18)";
    const stateBorder = "rgba(255,255,255,.90)";
    const muted = "rgba(255,255,255,.55)";

    return {
      backgroundColor: "transparent",tooltip: {
        trigger: "item",
        backgroundColor: "rgba(10,16,32,.92)",
        borderColor: "rgba(255,255,255,.14)",
        borderWidth: 1,
        textStyle: { color: "rgba(255,255,255,.92)" },
        formatter: (p) => Array.isArray(p.value) ? `Responses: <b>${p.value[2]}</b>` : (p.name || "")
      },

     geo: {
  map: WORLD,
  roam: true,

  // ✅ start focused on US so state borders are visible
  center: [-98, 39],
  zoom: 1.65,

  label: { show: false },
  itemStyle: { areaColor: land, borderColor: worldBorder },
  emphasis: { label: { show: false } }
},

    visualMap: {
  min: 0,
  max: 220,
  left: 10,
  bottom: 10,
  text: ["High", "Low"],
  textStyle: { color: muted },
  calculable: false,

  // ✅ apply only to the scatter points series (index 2)
  seriesIndex: 2,

  inRange: {
    color: [
      "rgba(97,198,166,.25)",
      "rgba(233,197,106,.55)",
      "rgba(240,138,75,.85)"
    ]
  }
},

      series: [
        {
          type: "map",
          map: WORLD,
          geoIndex: 0,
          silent: true,
          zlevel: 1,
          z: 1,
          label: { show: false },
          itemStyle: { areaColor: land, borderColor: worldBorder },
          emphasis: { disabled: true }
        },

        // ✅ State boundaries (lines) – FORCE top layer
        {
  name: "US State Boundaries",
  type: "lines",
  coordinateSystem: "geo",
  geoIndex: 0,
  polyline: true,
  silent: true,

  // ✅ ensure it draws on top
  zlevel: 30,
  z: 30,

  data: stateLines,

  lineStyle: {
    // ✅ brighter + thicker so they don’t blend into country borders
    color: "rgba(255,255,255,.95)",
    width: 0.5,
    opacity: 0.5
  }
},

        {
          name: "Responses",
          type: "scatter",
          coordinateSystem: "geo",
          geoIndex: 0,
          zlevel: 1000,
          z: 1000,
          data: POINTS_US,
          symbolSize: v => Math.max(6, Math.min(18, v[2] / 14)),
          itemStyle: { opacity: 0.9 }
        }
      ]
    };
  }

  async function init({ elementId, registry }) {
    console.log("[signalOS] Overview init() running");
    const el = document.getElementById(elementId);
    if (!el) return;

    if (registry.has(elementId)) {
      registry.get(elementId).resize();
      return;
    }

    await ensureMapsRegistered();

    const usaJson = await fetch("data/geo/USA.json").then(r => r.json());
    const stateLines = buildStateBoundaryLines(usaJson);

    console.log("[signalOS] USA features:", (usaJson.features || []).length);
    console.log("[signalOS] state polylines:", stateLines.length);

    const chart = echarts.init(el);
    registry.set(elementId, chart);
    chart.setOption(buildOption(stateLines), true);
    setTimeout(() => chart.resize(), 0);
  }

  window.signalChartModules = window.signalChartModules || {};
  window.signalChartModules["signals/Overview"] = init;
})();
