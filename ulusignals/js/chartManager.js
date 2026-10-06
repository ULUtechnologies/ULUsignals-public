// js/chartManager.js
(function () {
  // One shared registry for ALL charts on the page
  const registry = new Map();

  // Panels -> "trigger element IDs"
  // (These are only used to decide what to init + to find orphan charts to dispose.)
  // Make sure these IDs exist in index.html.
  const PANEL_ELEMENT_IDS = {
    "signals/Dashboard": [
      "chart-signals-human-connection",
      "chart-signals-trust-score",
      "chart-signals-momentum-spark",
      "chart-signals-action-likelihood",
      "chart-signals-behavior-profile",
      "chart-signals-response-breakdown",
      "chart-signals-audience-momentum"
    ],
    "signals/Overview": [
      "chart-signals-overview-world",
      "chart-signals-overview-distribution",
      "chart-signals-overview-momentum"
    ],
    "signals/Real-Time": [
      "chart-signals-realtime-pulse",
      "chart-signals-realtime-flow",
      "chart-signals-realtime-volatility"
    ],
    "signals/Trends": [
      "chart-signals-trends-engagedStrength",
      "chart-signals-trends-responseMix",
      "chart-signals-trends-byChannel"
    ],
    "signals/Alerts": [
    "chart-signals-alerts-volume",
    "chart-signals-alerts-severity",
    "chart-signals-alerts-confidence"
  ],
    "brand/Dashboard": [
      "chart-brand-communication-score",
      "chart-brand-identity-profile",
      "chart-brand-tone-distribution"
    ],
    "brand/Library": [
      "chart-brandlib-spark-tiktok",
      "chart-brandlib-spark-youtube",
      "chart-brandlib-spark-linkedin",
      "chart-brandlib-spark-webcopy"
    ],
    "brand/Patterns": [
    "chart-brand-patterns-sharedThemes",
    "chart-brand-patterns-riskFactors",
    "chart-brand-patterns-styleBreakdown",
    "chart-brand-patterns-messageLength"
  ],

    // Media
    "media/Dashboard": [
      "chart-media-resonance",
      "chart-media-journey",
      "chart-media-alignment",
      "chart-media-content-types"
    ],

    "media/Patterns": [
    "chart-media-patterns-sharedThemes",
    "chart-media-patterns-riskFactors",
    "chart-media-patterns-styleBreakdown",
    "chart-media-patterns-messageLength"
    ],

    "media/Market Intelligence": [
      "chart-media-mi-group",
      "chart-media-mi-a",
      "chart-media-mi-b",
      "chart-media-mi-c",
      "chart-media-mi-d"
    ]
  };

  function isVisible(el) {
    if (!el) return false;
    // element must have layout boxes and not be display:none
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function disposeOrphansForPanel(panelKey) {
    const keepIds = new Set(PANEL_ELEMENT_IDS[panelKey] || []);
    for (const [elementId, chart] of registry.entries()) {
      // Only dispose charts that belong to this panel key’s element list
      // (If elementId isn't in keepIds, it might be from a different panel; don't touch it.)
      if (!keepIds.size) continue;

      if (!keepIds.has(elementId)) continue;

      const el = document.getElementById(elementId);
      // If the element was removed from DOM, dispose chart instance
      if (!el) {
        try { chart.dispose(); } catch (e) {}
        registry.delete(elementId);
      }
    }
  }

  async function initForPanel(panelKey) {
    // Lazy-load panel modules if they weren't included via <script> tags.
    // This prevents panels from going blank when a panel's orchestrator file
    // isn't loaded yet (common when iterating on app.js/index.html).
    async function loadScriptOnce(src) {
      if (!src) return;
      window.__signalOSLoadedScripts = window.__signalOSLoadedScripts || new Set();
      if (window.__signalOSLoadedScripts.has(src)) return;

      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
      }).catch((err) => {
        console.warn('[signalOS] script load failed:', err);
      });

      window.__signalOSLoadedScripts.add(src);
    }

    const lazyMap = {
      'signals/Dashboard': 'js/charts/signalsUnified.js',
      'brand/Dashboard': 'js/charts/brandUnified.js',
      'brand/Library': 'js/charts/brandLibrary.js',
      'brand/Patterns': 'js/charts/brandPatterns.js',
      'media/Dashboard': 'js/charts/mediaUnified.js',
      'media/Patterns': 'js/charts/mediaPatterns.js',
      'media/Market Intelligence': 'js/charts/mediaMarketIntelligence.js'
    };

    let mods = window.signalChartModules || {};
    let initFn = mods[panelKey];
    if (typeof initFn !== 'function' && lazyMap[panelKey]) {
      await loadScriptOnce(lazyMap[panelKey]);
      mods = window.signalChartModules || {};
      initFn = mods[panelKey];
    }

    if (typeof initFn !== "function") {
      console.warn(`[signalOS] module not found for key: "${panelKey}"`);
      return;
    }

    // Clean up any charts whose elements no longer exist
    disposeOrphansForPanel(panelKey);

    // IMPORTANT:
    // Our panel modules (signalsOverview.js, signalsRealTime.js, signalsTrends.js, etc.)
    // should be responsible for initializing ALL charts inside their panel.
    // So we call the panel module ONCE and let it init its child charts.
    await initFn({ registry });

    // Resize after layout settles
    requestAnimationFrame(() => resizeVisible());
    setTimeout(resizeVisible, 60);
  }

  function resizeVisible() {
    for (const [elementId, chart] of registry.entries()) {
      const el = document.getElementById(elementId);
      if (!el || !isVisible(el)) continue;
      try { chart.resize(); } catch (e) {}
    }
  }

  // Expose API used by app.js
  window.signalCharts = {
    registry,
    initForPanel,
    resizeVisible
  };
})();